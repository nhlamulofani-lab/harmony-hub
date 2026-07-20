import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { instruments, levels, getModules, type Level } from "@/lib/site-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NFS Music Academy" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

type ProgressRow = { instrument_slug: string; level: string; module_id: string };

function Dashboard() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "musician";
  const [rows, setRows] = useState<ProgressRow[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("lesson_progress")
        .select("instrument_slug, level, module_id")
        .eq("user_id", user.id);
      if (!cancelled) setRows((data ?? []) as ProgressRow[]);
    };
    load();
    const channel = supabase
      .channel(`dash-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_progress", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [user]);

  // Build per-instrument progress
  const perInstrument = instruments.map((inst) => {
    const perLevel = levels.map((l) => {
      const total = getModules(inst.name, l.key).length;
      const done = rows.filter((r) => r.instrument_slug === inst.slug && r.level === l.key).length;
      return { level: l.key, label: l.label, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    });
    const totalAll = perLevel.reduce((s, l) => s + l.total, 0);
    const doneAll = perLevel.reduce((s, l) => s + l.done, 0);
    const overall = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
    return { inst, perLevel, overall, doneAll, totalAll };
  });

  const active = perInstrument.filter((p) => p.doneAll > 0);
  const myCourses = active.length ? active : perInstrument.slice(0, 3);
  const lessonsDone = rows.length;
  const certificates = perInstrument.flatMap((p) => p.perLevel.filter((l) => l.pct === 100).map((l) => ({ inst: p.inst, level: l.label })));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Hi, {name} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your progress updates in real time as you complete modules.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full"><Link to="/profile">Profile</Link></Button>
          <Button variant="outline" className="rounded-full" onClick={() => supabase.auth.signOut().then(() => { window.location.href = "/"; })}>Logout</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Active courses", value: String(active.length) },
          { icon: TrendingUp, label: "Modules done", value: String(lessonsDone) },
          { icon: Award, label: "Certificates", value: String(certificates.length) },
          { icon: GraduationCap, label: "Instruments started", value: String(active.length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <s.icon className="h-5 w-5 text-brand" />
            <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">My courses</h2>
            <Button asChild variant="ghost" className="rounded-full"><Link to="/courses">Browse all</Link></Button>
          </div>
          <div className="mt-4 space-y-4">
            {myCourses.map((c) => {
              // find level with in-progress activity (any done but not 100) else lowest
              const resumeLevel = (c.perLevel.find((l) => l.done > 0 && l.pct < 100)?.level
                ?? c.perLevel.find((l) => l.pct < 100)?.level
                ?? "beginner") as Level;
              return (
                <div key={c.inst.slug} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <img src={c.inst.image} alt={c.inst.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display font-semibold">{c.inst.name}</h3>
                      <span className="text-xs text-muted-foreground">{c.overall}% overall</span>
                    </div>
                    <Progress value={c.overall} className="mt-2" />
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {c.perLevel.map((l) => (
                        <span key={l.level} className="rounded-full bg-secondary px-2 py-0.5">{l.label}: {l.pct}%</span>
                      ))}
                    </div>
                  </div>
                  <Button asChild size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                    <Link to="/courses/$instrument/$level" params={{ instrument: c.inst.slug, level: resumeLevel }}>{c.doneAll ? "Resume" : "Start"}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Certificates</h2>
          {certificates.length ? (
            <div className="mt-4 space-y-3">
              {certificates.map((c, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 text-center">
                  <Award className="mx-auto h-8 w-8 text-brand" />
                  <p className="mt-2 font-medium">{c.inst.name} · {c.level}</p>
                  <p className="text-xs text-muted-foreground">Level complete</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              Complete all 5 modules of any level to earn your first certificate.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
