import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — NFS Music Academy" },
      { name: "description", content: "About NFS Music Academy and founder Nhlamulo Fani Sibuyi." },
      { property: "og:title", content: "About — NFS Music Academy" },
      { property: "og:description", content: "Meet the founder and story behind NFS Music Academy." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-brand">About</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Music, taught with patience.</h1>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-muted-foreground">
        <p className="text-lg">
          NFS Music Academy was founded by <strong className="text-foreground">Nhlamulo Fani Sibuyi</strong> to make quality music education
          accessible to anyone with the will to learn — regardless of age or background.
        </p>
        <p>
          Every course is structured across three clear levels — Beginner, Intermediate and Advanced — so you always know what comes next.
          Video lessons pair with focused notes and short daily exercises to build real, lasting skill.
        </p>
        <p>
          Whether you're picking up your first instrument or refining performance-ready technique, our lessons meet you where you are and
          take you where you want to go.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { k: "8", v: "Instruments" },
          { k: "3", v: "Levels per instrument" },
          { k: "24+", v: "Structured lessons" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border border-border bg-card p-6">
            <div className="font-display text-3xl font-bold text-brand">{s.k}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
