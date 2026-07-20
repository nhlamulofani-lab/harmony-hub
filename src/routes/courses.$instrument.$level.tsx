import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Lock, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getInstrument, getModules, levels, type Level } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$instrument/$level")({
  loader: ({ params }) => {
    const inst = getInstrument(params.instrument);
    const level = levels.find((l) => l.key === params.level);
    if (!inst || !level) throw notFound();
    return { inst, level: level.key as Level, levelLabel: level.label };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Lesson — NFS Music Academy" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.inst.name} · ${loaderData.levelLabel} — NFS Music Academy`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `${loaderData.levelLabel} lessons for ${loaderData.inst.name} at NFS Music Academy.` },
        { property: "og:title", content: t },
        { property: "og:image", content: loaderData.inst.image },
      ],
    };
  },
  component: LessonPage,
  notFoundComponent: () => <div className="p-16 text-center"><h1 className="font-display text-3xl font-bold">Course not found</h1></div>,
});

function LessonPage() {
  const { inst, level, levelLabel } = Route.useLoaderData();
  const { user, loading: authLoading } = useAuth();
  const modules = useMemo(() => getModules(inst.name, level), [inst.name, level]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string>(modules[0].id);
  const [saving, setSaving] = useState(false);

  // Load progress from DB + subscribe to realtime updates
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("lesson_progress")
        .select("module_id")
        .eq("user_id", user.id)
        .eq("instrument_slug", inst.slug)
        .eq("level", level);
      if (cancelled) return;
      setCompleted(new Set((data ?? []).map((r) => r.module_id)));
    };
    load();

    const channel = supabase
      .channel(`progress-${user.id}-${inst.slug}-${level}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lesson_progress", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user, inst.slug, level]);

  const total = modules.length;
  const doneCount = completed.size;
  const percent = Math.round((doneCount / total) * 100);
  const currentIndex = modules.findIndex((m) => m.id === active);

  const isUnlocked = useCallback(
    (idx: number) => {
      if (idx === 0) return true;
      return completed.has(modules[idx - 1].id);
    },
    [completed, modules],
  );

  const markComplete = async (moduleId: string) => {
    if (!user) {
      toast.error("Please sign in to save progress");
      return;
    }
    if (completed.has(moduleId)) return;
    setSaving(true);
    const { error } = await supabase.from("lesson_progress").insert({
      user_id: user.id,
      instrument_slug: inst.slug,
      level,
      module_id: moduleId,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Module complete! 🎉");
    // optimistic — realtime will confirm
    setCompleted((prev) => new Set(prev).add(moduleId));
    const nextIdx = modules.findIndex((m) => m.id === moduleId) + 1;
    if (nextIdx < modules.length) setActive(modules[nextIdx].id);
  };

  const activeModule = modules[currentIndex] ?? modules[0];
  const activeUnlocked = isUnlocked(currentIndex);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/courses" className="hover:text-foreground">Courses</Link>
        <span>/</span>
        <Link to="/instruments/$slug" params={{ slug: inst.slug }} className="hover:text-foreground">{inst.name}</Link>
        <span>/</span>
        <span className="text-foreground">{levelLabel}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">{levelLabel} · {total} modules</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{inst.name} — {levelLabel}</h1>
        </div>
        <div className="flex gap-2">
          {levels.map((l) => (
            <Button key={l.key} asChild size="sm" variant={l.key === level ? "default" : "outline"} className="rounded-full">
              <Link to="/courses/$instrument/$level" params={{ instrument: inst.slug, level: l.key }}>{l.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {!user && !authLoading && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-brand/40 bg-brand-soft/40 p-4 text-sm">
          <span><Sparkles className="mr-1 inline h-4 w-4 text-brand" /> Sign in to track your progress — it starts at 0% and updates in real time.</span>
          <Button asChild size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Link to="/auth" search={{ mode: "signup" }}>Create free account</Link></Button>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* MODULE LIST */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your progress</h3>
              <span className="text-xs text-muted-foreground">{doneCount}/{total}</span>
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{percent}%</div>
            <Progress value={percent} className="mt-3" />
            {percent === 100 && (
              <p className="mt-3 text-xs font-medium text-brand">🎓 Level complete — certificate unlocked!</p>
            )}
          </div>
          <ol className="space-y-2">
            {modules.map((m, idx) => {
              const isDone = completed.has(m.id);
              const unlocked = isUnlocked(idx);
              const isActive = m.id === active;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => unlocked && setActive(m.id)}
                    disabled={!unlocked}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isActive ? "border-brand bg-brand-soft/40" : "border-border bg-card hover:border-brand/60"
                    } ${!unlocked ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      isDone ? "bg-brand text-brand-foreground" : "bg-secondary text-foreground"
                    }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : !unlocked ? <Lock className="h-3.5 w-3.5" /> : idx + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs uppercase tracking-wider text-muted-foreground">Module {idx + 1}</span>
                      <span className="block truncate text-sm font-medium">{m.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* MODULE CONTENT */}
        <div>
          {!activeUnlocked ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-3 font-display text-xl font-semibold">Complete the previous module first</h2>
              <p className="mt-1 text-sm text-muted-foreground">Modules unlock in order so you build skills step by step.</p>
            </div>
          ) : (
            <>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand/30 via-black to-brand/10">
                <img src={inst.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
                <div className="absolute inset-0 grid place-items-center text-white">
                  <div className="text-center">
                    <PlayCircle className="mx-auto h-20 w-20 drop-shadow-lg" />
                    <p className="mt-2 text-sm font-medium opacity-80">Video lesson · Module {currentIndex + 1}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-brand">Module {currentIndex + 1} of {total}</p>
                <h2 className="mt-1 font-display text-2xl font-bold">{activeModule.title}</h2>
                <p className="mt-3 text-muted-foreground">{activeModule.theory}</p>

                {/* Visual theory block */}
                <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr]">
                  <div className="rounded-xl border border-border bg-secondary/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key points</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {activeModule.keyPoints.map((k, i) => (
                        <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {k}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-brand/30 bg-gradient-to-br from-brand-soft to-transparent p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand">Visual theory</p>
                    <div className="mt-3 flex h-32 items-center justify-center rounded-lg border border-dashed border-brand/40 bg-background/50 text-center">
                      <div>
                        <div className="font-display text-lg font-bold text-brand">{activeModule.visual}</div>
                        <div className="mt-1 text-xs text-muted-foreground">Interactive diagram</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Practice exercise</p>
                  <p className="mt-2 text-sm">{activeModule.exercise}</p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {completed.has(activeModule.id) ? "✅ You completed this module." : "Finish the exercise, then mark this module complete."}
                  </div>
                  <div className="flex gap-2">
                    {currentIndex > 0 && (
                      <Button variant="outline" className="rounded-full" onClick={() => setActive(modules[currentIndex - 1].id)}>Previous</Button>
                    )}
                    <Button
                      className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                      disabled={saving || completed.has(activeModule.id)}
                      onClick={() => markComplete(activeModule.id)}
                    >
                      {completed.has(activeModule.id) ? "Completed" : saving ? "Saving…" : "Mark module complete"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
