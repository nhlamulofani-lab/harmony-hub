import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getModules, instruments, levels } from "@/lib/site-data";

export const Route = createFileRoute("/courses")({ component: CoursesPage });

function CoursesPage() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => instruments.flatMap((instrument) => levels.flatMap((level) => getModules(instrument.name, level.key, instrument.slug).filter((lesson) => !normalized || [instrument.name, level.label, lesson.title, lesson.theory, ...lesson.objectives].join(" ").toLowerCase().includes(normalized)).map((lesson, index) => ({ instrument, level, lesson, index })))).slice(0, normalized ? 30 : 0), [normalized]);
  const visibleInstruments = instruments.filter((instrument) => !normalized || [instrument.name, instrument.description, instrument.longDescription].join(" ").toLowerCase().includes(normalized));

  return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <header className="max-w-3xl"><p className="font-medium text-brand">Complete curriculum</p><h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Find your next musical breakthrough</h1><p className="mt-4 leading-relaxed text-muted-foreground">Search 14 instruments and 420 structured instrument lessons, plus a complete Beginner-to-Advanced music theory pathway.</p><label className="relative mt-7 block"><span className="sr-only">Search courses and lessons</span><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input className="h-14 rounded-2xl pl-12 text-base" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search piano chords, sight-reading, rhythm, production…" /></label></header>

    {normalized && <section className="mt-10"><h2 className="font-display text-2xl font-bold">Lesson matches</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{results.length ? results.map(({ instrument, level, lesson, index }) => <Link key={`${instrument.slug}-${level.key}-${lesson.id}`} to="/courses/$instrument/$level" params={{ instrument: instrument.slug, level: level.key }} className="rounded-2xl border bg-card p-5 transition hover:border-brand"><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-brand">{instrument.name} · {level.label}</span><span className="text-xs text-muted-foreground">Lesson {index + 1}</span></div><h3 className="mt-2 font-display text-lg font-bold">{lesson.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{lesson.introduction}</p></Link>) : <p className="text-muted-foreground">No lesson matches found. Try a broader musical term.</p>}</div></section>}

    <section className="mt-12 flex flex-col gap-8">{visibleInstruments.map((instrument) => <article key={instrument.slug} className="overflow-hidden rounded-2xl border bg-card"><div className="grid md:grid-cols-[240px_1fr]"><img src={instrument.image} alt={instrument.name} className="h-52 size-full object-cover md:h-full" /><div className="p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-2xl font-bold">{instrument.name}</h2><p className="mt-2 text-sm text-muted-foreground">{instrument.description}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">30 lessons</span></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{levels.map((level) => { const first = getModules(instrument.name, level.key, instrument.slug)[0]; return <Link key={level.key} to="/courses/$instrument/$level" params={{ instrument: instrument.slug, level: level.key }} className="group rounded-xl border bg-background p-4 transition hover:border-brand"><span className="text-xs font-semibold uppercase tracking-wider text-brand">{level.label} · 10 lessons</span><strong className="mt-2 block">{first.title}</strong><span className="mt-3 inline-flex items-center text-xs text-muted-foreground">Open pathway<ArrowRight className="ml-1 size-4 transition group-hover:translate-x-1" /></span></Link>; })}</div></div></div></article>)}</section>
  </main>;
}
