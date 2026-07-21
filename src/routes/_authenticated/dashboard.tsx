import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, GraduationCap, TrendingUp, Flame, Clock, CheckCircle2, Trophy, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { instruments, levels, getLessons, LESSONS_PER_LEVEL, type Level } from "@/lib/site-data";
import { computeStreak, minutesInLastNDays, weeklyActivity, type PracticeSession, type QuizAttempt } from "@/lib/practice";
import { generateCertificate, makeCertificateNumber } from "@/lib/certificate";
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
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [quizzes, setQuizzes] = useState<QuizAttempt[]>([]);
  const [profileName, setProfileName] = useState<string>(name);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      const [progRes, sessRes, quizRes, profRes] = await Promise.all([
        supabase.from("lesson_progress").select("instrument_slug, level, module_id, completed_at").eq("user_id", user.id),
        (supabase as unknown as { from: (t: string) => { select: (c: string) => { eq: (...a: unknown[]) => { order: (c: string, o: { ascending: boolean }) => Promise<{ data: PracticeSession[] | null }> } } } })
          .from("practice_sessions").select("*").eq("user_id", user.id).order("session_date", { ascending: false }),
        (supabase as unknown as { from: (t: string) => { select: (c: string) => { eq: (...a: unknown[]) => Promise<{ data: QuizAttempt[] | null }> } } })
          .from("quiz_attempts").select("*").eq("user_id", user.id),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      setProgress((progRes.data ?? []) as ProgressRow[]);
      setSessions((sessRes.data ?? []) as PracticeSession[]);
      setQuizzes((quizRes.data ?? []) as QuizAttempt[]);
      if (profRes.data?.full_name) setProfileName(profRes.data.full_name);
    };
    load();
    const ch = supabase
      .channel(`dash-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_progress", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "practice_sessions", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_attempts", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [user]);

  const perInstrument = useMemo(() => instruments.map((inst) => {
    const perLevel = levels.map((l) => {
      const total = LESSONS_PER_LEVEL;
      const done = progress.filter((r) => r.instrument_slug === inst.slug && r.level === l.key).length;
      return { level: l.key, label: l.label, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    });
    const totalAll = perLevel.reduce((s, l) => s + l.total, 0);
    const doneAll = perLevel.reduce((s, l) => s + l.done, 0);
    const overall = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
    return { inst, perLevel, overall, doneAll, totalAll };
  }), [progress]);

  const active = perInstrument.filter((p) => p.doneAll > 0);
  const myCourses = active.length ? active : perInstrument.slice(0, 3);
  const lessonsDone = progress.length;
  const streak = useMemo(() => computeStreak(sessions), [sessions]);
  const week = useMemo(() => minutesInLastNDays(sessions, 7), [sessions]);
  const month = useMemo(() => minutesInLastNDays(sessions, 30), [sessions]);
  const weekly = useMemo(() => weeklyActivity(sessions, 7), [sessions]);
  const totalMinutes = sessions.reduce((s, x) => s + x.minutes, 0);
  const overallPct = Math.round((lessonsDone / (instruments.length * levels.length * LESSONS_PER_LEVEL)) * 100);
  const quizAvg = quizzes.length ? Math.round(quizzes.reduce((s, q) => s + q.score_pct, 0) / quizzes.length) : 0;

  const certificates = perInstrument.flatMap((p) =>
    p.perLevel.filter((l) => l.pct === 100).map((l) => ({ inst: p.inst, level: l.label, levelKey: l.level }))
  );
  // Full-instrument certificate (all 3 levels done)
  const fullCourseCerts = perInstrument.filter((p) => p.overall === 100).map((p) => ({ inst: p.inst, level: "Complete Course", levelKey: "complete" as string }));
  const allCerts = [...certificates, ...fullCourseCerts];

  // Continue learning — pick the most recently touched incomplete lesson
  const continueLearning = useMemo(() => {
    // Prefer an instrument+level that has activity but is not 100%
    const inProgress = perInstrument
      .flatMap((p) => p.perLevel.map((l) => ({ inst: p.inst, ...l })))
      .filter((l) => l.done > 0 && l.done < l.total)
      .sort((a, b) => b.done - a.done);
    if (inProgress[0]) return inProgress[0];
    // Otherwise the first started instrument's next level
    const first = active[0];
    if (first) {
      const next = first.perLevel.find((l) => l.pct < 100);
      if (next) return { inst: first.inst, ...next };
    }
    return null;
  }, [perInstrument, active]);

  // Recent completions
  const recent = useMemo(() => {
    return [...progress]
      .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""))
      .slice(0, 5)
      .map((r) => {
        const inst = instruments.find((i) => i.slug === r.instrument_slug);
        const level = levels.find((l) => l.key === r.level);
        const lessons = inst ? getLessons(inst, (r.level as Level)) : [];
        const lesson = lessons.find((m) => m.id === r.module_id);
        return { inst, level, lesson, when: r.completed_at };
      })
      .filter((x) => x.inst && x.level);
  }, [progress]);

  // Achievements / badges (computed)
  const achievements = useMemo(() => {
    const list: { key: string; icon: typeof Award; label: string; earned: boolean; detail: string }[] = [
      { key: "first-lesson", icon: CheckCircle2, label: "First lesson complete", earned: lessonsDone >= 1, detail: "Finish any lesson" },
      { key: "streak-3", icon: Flame, label: "3-day streak", earned: streak >= 3, detail: "Practise 3 days in a row" },
      { key: "streak-7", icon: Flame, label: "7-day streak", earned: streak >= 7, detail: "Practise 7 days in a row" },
      { key: "streak-30", icon: Flame, label: "30-day streak", earned: streak >= 30, detail: "Practise 30 days in a row" },
      { key: "quiz-ace", icon: Trophy, label: "Quiz ace", earned: quizzes.some((q) => q.score_pct === 100), detail: "Score 100% on any quiz" },
      { key: "level-clear", icon: Award, label: "Level cleared", earned: allCerts.length >= 1, detail: "Complete any level" },
      { key: "polymath", icon: BookOpen, label: "Polymath", earned: active.length >= 3, detail: "Start 3 different instruments" },
      { key: "10-hours", icon: Clock, label: "10 hours logged", earned: totalMinutes >= 600, detail: "Log 10 hours of practice" },
    ];
    return list;
  }, [lessonsDone, streak, quizzes, allCerts.length, active.length, totalMinutes]);

  const maxDayMinutes = Math.max(1, ...weekly.map((d) => d.minutes));

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

      {/* Continue learning */}
      {continueLearning && (
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-brand/40 bg-gradient-to-br from-brand-soft/60 to-transparent p-5">
          <img src={continueLearning.inst.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
          <div className="flex-1 min-w-[220px]">
            <p className="text-xs font-medium uppercase tracking-wider text-brand"><Sparkles className="mr-1 inline h-4 w-4" /> Continue learning</p>
            <h2 className="mt-0.5 font-display text-lg font-semibold">{continueLearning.inst.name} · {continueLearning.label}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Lesson {continueLearning.done + 1} of {continueLearning.total} — {continueLearning.pct}% complete</p>
            <Progress value={continueLearning.pct} className="mt-2 h-1.5" />
          </div>
          <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/courses/$instrument/$level" params={{ instrument: continueLearning.inst.slug, level: continueLearning.level as Level }}>Resume</Link>
          </Button>
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Flame} label="Practice streak" value={`${streak} day${streak === 1 ? "" : "s"}`} />
        <StatCard icon={Clock} label="This week" value={`${week} min`} sub={`${Math.round(week / 7)} min/day avg`} />
        <StatCard icon={TrendingUp} label="This month" value={`${month} min`} sub={`${Math.floor(totalMinutes / 60)}h total logged`} />
        <StatCard icon={Trophy} label="Quiz average" value={quizzes.length ? `${quizAvg}%` : "—"} sub={`${quizzes.length} attempt${quizzes.length === 1 ? "" : "s"}`} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Active instruments" value={String(active.length)} />
        <StatCard icon={CheckCircle2} label="Lessons complete" value={String(lessonsDone)} sub={`of ${instruments.length * levels.length * LESSONS_PER_LEVEL}`} />
        <StatCard icon={Award} label="Certificates" value={String(allCerts.length)} />
        <StatCard icon={GraduationCap} label="Academy progress" value={`${overallPct}%`} />
      </div>

      {/* Weekly activity chart */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Weekly practice</h2>
          <span className="text-xs text-muted-foreground">Last 7 days · {week} min total</span>
        </div>
        <div className="mt-5 flex h-32 items-end gap-3">
          {weekly.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-md bg-gradient-to-t from-brand to-brand/60"
                style={{ height: `${(d.minutes / maxDayMinutes) * 100}%`, minHeight: d.minutes > 0 ? 6 : 2 }}
                title={`${d.minutes} min`}
              />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.label}</span>
              <span className="text-[10px] text-foreground">{d.minutes}m</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">My courses</h2>
            <Button asChild variant="ghost" className="rounded-full"><Link to="/courses">Browse all</Link></Button>
          </div>
          <div className="mt-4 space-y-4">
            {myCourses.map((c) => {
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

          {/* Recently completed */}
          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold">Recently completed</h2>
            {recent.length ? (
              <ol className="mt-4 space-y-2">
                {recent.map((r, i) => r.inst && r.lesson && r.level ? (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{r.inst.name} · {r.level.label} · {r.lesson.title}</div>
                      <div className="text-xs text-muted-foreground">{r.when ? new Date(r.when).toLocaleDateString() : ""}</div>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="rounded-full">
                      <Link to="/courses/$instrument/$level" params={{ instrument: r.inst.slug, level: r.level.key }}>Open</Link>
                    </Button>
                  </li>
                ) : null)}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No completed lessons yet — your latest wins will show up here.</p>
            )}
          </div>
        </section>

        <section className="space-y-8">
          {/* Certificates */}
          <div>
            <h2 className="font-display text-xl font-semibold">Certificates</h2>
            {allCerts.length ? (
              <div className="mt-4 space-y-3">
                {allCerts.map((c, i) => {
                  const certNumber = makeCertificateNumber(user?.id ?? "anon", c.inst.slug, c.levelKey);
                  return (
                    <div key={i} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-brand" />
                        <div className="min-w-0">
                          <p className="font-medium">{c.inst.name} · {c.level}</p>
                          <p className="text-xs text-muted-foreground">Cert No. {certNumber}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-4 w-full rounded-full"
                        onClick={() => {
                          try {
                            generateCertificate({
                              studentName: profileName,
                              instrument: c.inst.name,
                              level: c.level,
                              completionDate: new Date(),
                              certificateNumber: certNumber,
                            });
                            toast.success("Certificate downloaded");
                          } catch (e) {
                            toast.error("Could not generate certificate");
                            console.error(e);
                          }
                        }}
                      >
                        <Download className="mr-1.5 h-4 w-4" /> Download PDF
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                Complete all {LESSONS_PER_LEVEL} lessons of any level to earn your first certificate.
              </div>
            )}
          </div>

          {/* Achievements */}
          <div>
            <h2 className="font-display text-xl font-semibold">Achievements</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.key}
                  className={`rounded-xl border p-3 text-center ${
                    a.earned ? "border-brand/40 bg-brand-soft/40" : "border-dashed border-border bg-card opacity-60"
                  }`}
                  title={a.detail}
                >
                  <a.icon className={`mx-auto h-5 w-5 ${a.earned ? "text-brand" : "text-muted-foreground"}`} />
                  <p className="mt-1 text-xs font-medium">{a.label}</p>
                  <p className="text-[10px] text-muted-foreground">{a.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof Award; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-brand" />
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
