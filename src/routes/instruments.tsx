import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { instruments } from "@/lib/site-data";

export const Route = createFileRoute("/instruments")({
  head: () => ({
    meta: [
      { title: "Instruments — NFS Music Academy" },
      { name: "description", content: "Learn piano, guitar, violin, drums, keyboard, bass, saxophone and trumpet at NFS Music Academy." },
      { property: "og:title", content: "Instruments — NFS Music Academy" },
      { property: "og:description", content: "Choose from 8 instruments with lessons from beginner to advanced." },
    ],
  }),
  component: InstrumentsPage,
});

function InstrumentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">Instruments</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Choose what you want to play</h1>
        <p className="mt-3 text-muted-foreground">Eight instruments — each with a proven path from your first notes to advanced performance.</p>
      </header>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {instruments.map((i) => (
          <div key={i.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={i.image} alt={i.name} width={900} height={900} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-display text-lg font-semibold">{i.name}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{i.description}</p>
              <Button asChild variant="ghost" className="mt-4 justify-start rounded-full px-0 text-brand hover:bg-transparent hover:text-brand">
                <Link to="/instruments/$slug" params={{ slug: i.slug }}>Learn more <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
