import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { instruments, levels, getLessons, LESSONS_PER_LEVEL, type Level } from "@/lib/site-data";


import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NFS Music Academy" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

type ProgressRow = { instrument_slug: string; level: string; module_id: string; completed_at: string };

function Dashboard() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "musician";
  const [progress, setProgress] = useState<ProgressRow[]>([]);


  const [profileName, setProfileName] = useState<string>(name);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      const [progRes, profRes] = await Promise.all([
        supabase.from("lesson_progress").select("instrument_slug, level, module_id, completed_at").eq("user_id", user.id),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      setProgress((progRes.data ?? []) as ProgressRow[]);
      if (profRes.data?.full_name) setProfileName(profRes.data.full_name);

    };
    load();
    const ch = supabase
      .channel(`dash-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_progress", filter: `user_id=eq.${user.id}` }, () => load())

      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [user]);

  const perInstrument = useMemo(() => instruments.map((inst) => {
    const perLevel = levels.map((l) => {
      const total = LESSONS_PER_LEVEL[l.key];
      const done = progress.filter((r) => r.instrument_slug === inst.slug && r.level === l.key).length;
      return { level: l.key, label: l.label, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    });
    const totalAll = perLevel.reduce((s, l) => s + l.total, 0);
    const doneAll = perLevel.reduce((s, l) => s + l.done, 0);
    const overall = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
    return { inst, perLevel, overall, doneAll, totalAll };
  }), [progress]);

  const lessonsDone = progress.length;
  const totalLessonsAll = instruments.length * (LESSONS_PER_LEVEL.beginner + LESSONS_PER_LEVEL.intermediate + LESSONS_PER_LEVEL.advanced);
  const overallPct = totalLessonsAll ? Math.round((lessonsDone / totalLessonsAll) * 100) : 0;




  // Full-instrument certificate (all 3 levels done)



  // Continue learning — pick the most recently touched incomplete lesson


  // Recent completions


  // Achievements / badges (computed)




  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Hi, {profileName} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everything updates in real time as you complete lessons, pass quizzes and log practice.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full"><Link to="/profile">Profile</Link></Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </div>
      </div>



      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <StatCard icon={CheckCircle2} label="Lessons complete" value={String(lessonsDone)} sub={`of ${totalLessonsAll}`} />
        <StatCard icon={GraduationCap} label="Overall Progress" value={`${overallPct}%`} />
      </div>






    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof GraduationCap | typeof CheckCircle2; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-brand" />
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
