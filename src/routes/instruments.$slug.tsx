import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Music2, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInstrument, getModules, levels } from "@/lib/site-data";

export const Route = createFileRoute("/instruments/$slug")({
  loader: ({ params }) => {
    const inst = getInstrument(params.slug);
    if (!inst) throw notFound();
    return { inst };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Instrument — NFS Music Academy" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.inst.name} lessons — NFS Music Academy`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.inst.description },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.inst.description },
        { property: "og:image", content: loaderData.inst.image },
      ],
    };
  },
  component: InstrumentPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl p-16 text-center">
      <h1 className="font-display text-3xl font-bold">Instrument not found</h1>
      <p className="mt-2 text-muted-foreground">Try a different instrument from the list.</p>
      <Button asChild className="mt-6 rounded-full"><Link to="/instruments">All instruments</Link></Button>
    </div>
  ),
});

function InstrumentPage() {
  const { inst } = Route.useLoaderData();
  const beginnerPreview = getModules(inst.name, "beginner");

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-border bg-noise">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-brand">Instrument</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">{inst.name}</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">{inst.longDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to="/courses/$instrument/$level" params={{ instrument: inst.slug, level: "beginner" }}>Start Beginner <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full"><Link to="/instruments">All instruments</Link></Button>
            </div>
          </div>
          <img src={inst.image} alt={inst.name} width={900} height={900} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
        </div>
      </section>

      {/* WHAT YOU LEARN */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-brand"><Sparkles className="mr-1 inline h-4 w-4" /> What you'll learn</p>
            <h2 className="mt-2 font-display text-3xl font-bold">A complete path on the {inst.name.toLowerCase()}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {inst.whatYouLearn.map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><Check className="h-3 w-3" /></span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-medium text-brand"><BookOpen className="mr-1 inline h-4 w-4" /> A short history</p>
            <h3 className="mt-2 font-display text-xl font-semibold">Where the {inst.name.toLowerCase()} comes from</h3>
            <p className="mt-3 text-sm text-muted-foreground">{inst.history}</p>
          </div>
        </div>
      </section>

      {/* LEVELS */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold">Choose your level</h2>
          <p className="mt-2 text-sm text-muted-foreground">Every level has 5 ordered modules. Complete each one to unlock the next.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {levels.map((l) => (
              <Link key={l.key} to="/courses/$instrument/$level" params={{ instrument: inst.slug, level: l.key }} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand hover:shadow-xl">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-soft text-brand"><Check className="h-3.5 w-3.5" /></span>
                  {l.label}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">{inst.name} · {l.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l.blurb}</p>
                <p className="mt-4 inline-flex items-center text-sm font-medium text-brand">Start lessons <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" /></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand"><Music2 className="mr-1 inline h-4 w-4" /> Beginner curriculum</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Your first 5 modules</h2>
          </div>
          <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/courses/$instrument/$level" params={{ instrument: inst.slug, level: "beginner" }}>Start Module 1 <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {beginnerPreview.map((m, idx) => (
            <li key={m.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand">Module {idx + 1}</div>
              <div className="mt-1 font-display font-semibold">{m.title}</div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{m.theory}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
