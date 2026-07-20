import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle, Sparkles, GraduationCap, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { instruments } from "@/lib/site-data";
import hero from "@/assets/hero-instruments.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-noise">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28 lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> New: 8 instruments · 3 levels each
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Learn Musical Instruments <span className="text-brand">with Confidence</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Start your musical journey today. Learn step by step from beginner to advanced with easy-to-follow lessons.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to="/courses">Start Learning <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/auth" search={{ mode: "signup" }}>Create Free Account</Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 text-sm">
              <div><dt className="text-muted-foreground">Instruments</dt><dd className="mt-1 font-display text-2xl font-bold">8</dd></div>
              <div><dt className="text-muted-foreground">Levels</dt><dd className="mt-1 font-display text-2xl font-bold">3</dd></div>
              <div><dt className="text-muted-foreground">Lessons</dt><dd className="mt-1 font-display text-2xl font-bold">24+</dd></div>
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-brand/30 via-transparent to-brand/10 blur-2xl" />
            <img src={hero} alt="Musical instruments arrangement" width={1200} height={1400} className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      {/* INSTRUMENTS TEASER */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Pick your instrument</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">Eight instruments to start with today — each with a full beginner, intermediate and advanced path.</p>
          </div>
          <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex">
            <Link to="/instruments">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instruments.slice(0, 4).map((i) => (
            <Link key={i.slug} to="/instruments/$slug" params={{ slug: i.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={i.image} alt={i.name} width={900} height={900} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold">{i.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{i.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: Music2, title: "Choose an instrument", body: "From piano to trumpet — pick what you've always wanted to play." },
            { icon: PlayCircle, title: "Follow the lessons", body: "Video lessons, notes and exercises for every level." },
            { icon: GraduationCap, title: "Track your progress", body: "See your progress and earn certificates as you level up." },
          ].map((s, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-background p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand"><s.icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary p-10 text-primary-foreground sm:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold sm:text-4xl">Ready to make your first sound?</h2>
          <p className="relative mt-3 max-w-xl text-primary-foreground/80">Create a free account and begin lesson one today. No credit card required.</p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Link to="/auth" search={{ mode: "signup" }}>Create Free Account</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"><Link to="/courses">Browse courses</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
