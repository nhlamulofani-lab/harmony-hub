import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { instruments } from "@/lib/site-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NFS Music Academy" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "musician";
  const myCourses = instruments.slice(0, 3).map((i, idx) => ({ ...i, progress: [65, 30, 10][idx] }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Hi, {name} 👋</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full"><Link to="/profile">Profile</Link></Button>
          <Button variant="outline" className="rounded-full" onClick={() => supabase.auth.signOut()}>Logout</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Active courses", value: "3" },
          { icon: TrendingUp, label: "Weekly practice", value: "4h 20m" },
          { icon: Award, label: "Certificates", value: "1" },
          { icon: GraduationCap, label: "Lessons done", value: "12" },
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
            {myCourses.map((c) => (
              <div key={c.slug} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <img src={c.image} alt={c.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display font-semibold">{c.name}</h3>
                    <span className="text-xs text-muted-foreground">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="mt-2" />
                </div>
                <Button asChild size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                  <Link to="/courses/$instrument/$level" params={{ instrument: c.slug, level: "beginner" }}>Resume</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Certificates</h2>
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-6 text-center">
            <Award className="mx-auto h-8 w-8 text-brand" />
            <p className="mt-3 font-medium">Piano · Beginner</p>
            <p className="text-xs text-muted-foreground">Earned this week</p>
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-6 text-sm text-muted-foreground">
            Complete more lessons to unlock new certificates.
          </div>
        </section>
      </div>
    </div>
  );
}
