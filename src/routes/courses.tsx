import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { instruments, levels } from "@/lib/site-data";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — NFS Music Academy" },
      { name: "description", content: "Browse all music courses — beginner, intermediate and advanced — across 8 instruments." },
      { property: "og:title", content: "Courses — NFS Music Academy" },
      { property: "og:description", content: "Structured lessons for every level across 8 instruments." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">Courses</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">A clear path for every player</h1>
        <p className="mt-3 text-muted-foreground">Every instrument follows the same three-level path — start where you are, learn what's next.</p>
      </header>
      <div className="mt-12 space-y-8">
        {instruments.map((i) => (
          <div key={i.slug} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid gap-0 md:grid-cols-[240px_1fr]">
              <div className="relative h-44 md:h-auto">
                <img src={i.image} alt={i.name} width={900} height={900} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h2 className="font-display text-2xl font-semibold">{i.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{i.description}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {levels.map((l) => (
                    <Link key={l.key} to="/courses/$instrument/$level" params={{ instrument: i.slug, level: l.key }} className="group rounded-xl border border-border bg-background p-4 transition hover:border-brand hover:shadow-md">
                      <div className="text-xs font-medium uppercase tracking-wider text-brand">{l.label}</div>
                      <div className="mt-1 font-medium">Lesson 1 · Get started</div>
                      <div className="mt-2 inline-flex items-center text-xs text-muted-foreground">Open <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" /></div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
