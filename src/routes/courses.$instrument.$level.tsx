import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getInstrument, lessonContent, levels, type Level } from "@/lib/site-data";
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
  notFoundComponent: () => <div className="p-16 text-center"><h1 className="font-display text-3xl font-bold">Lesson not found</h1></div>,
});

function LessonPage() {
  const { inst, level, levelLabel } = Route.useLoaderData();
  const content = lessonContent(inst.name, level);
  const [progress, setProgress] = useState(20);
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/courses" className="hover:text-foreground">Courses</Link>
        <span>/</span>
        <Link to="/instruments/$slug" params={{ slug: inst.slug }} className="hover:text-foreground">{inst.name}</Link>
        <span>/</span>
        <span className="text-foreground">{levelLabel}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">{levelLabel} · Lesson 1</p>
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

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
            <img src={inst.image} alt="" className="h-full w-full object-cover opacity-50" />
            <button className="absolute inset-0 grid place-items-center text-white transition hover:bg-black/20">
              <PlayCircle className="h-20 w-20 drop-shadow-lg" />
            </button>
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Lesson notes</h2>
            <ul className="mt-4 space-y-3">
              {content.notes.map((n, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{idx + 1}</span>
                  <span className="text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Practice exercises</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {content.exercises.map((e, idx) => (
                <li key={idx} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" /> {e}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your progress</h3>
            <div className="mt-3 font-display text-3xl font-bold">{progress}%</div>
            <Progress value={progress} className="mt-3" />
            <Button
              className="mt-5 w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
              disabled={done}
              onClick={() => { setProgress(100); setDone(true); toast.success("Lesson complete! 🎉"); }}
            >
              {done ? "Lesson complete" : "Complete lesson"}
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/50 p-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Tip</p>
            <p className="mt-1">Practice a little every day. Short, focused sessions beat long, tired ones.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
