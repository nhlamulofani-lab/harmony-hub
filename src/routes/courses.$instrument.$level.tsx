import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2, Lock, PlayCircle, Sparkles, Timer, ChevronLeft, ChevronRight,
  Target, BookOpen, Wrench, ListChecks, Home as HomeIcon, Lightbulb, AlertTriangle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getInstrument, getLessons, levels, LESSONS_PER_LEVEL, type Level, type Lesson } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { LessonQuiz } from "@/components/lesson-quiz";
import type { QuizAttempt } from "@/lib/practice";

export const Route = createFileRoute("/courses/$instrument/$level")({
  loader: ({ params }) => {
    const inst = getInstrument(params.instrument);
    const level = levels.find((l) => l.key === params.level);
    if (!inst || !level) throw notFound();
    return { inst, level: level.key as Level, levelLabel: level.label };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Lesson — NFS Music Academy" }, { name: "robots", content: "noindex" }] };
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
  notFoundComponent: () => (
    <div className="p-16 text-center">
      <h1 className="font-display text-3xl font-bold">Course not found</h1>
    </div>
  ),
});

const DIFF_LABELS: Record<number, string> = { 1: "Very easy", 2: "Easy", 3: "Moderate", 4: "Challenging", 5: "Advanced" };

function LessonPage() {
  const { inst, level, levelLabel } = Route.useLoaderData();
  const { user, loading: authLoading } = useAuth();
  const lessons: Lesson[] = useMemo(() => getLessons(inst, level), [inst, level]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [passedQuiz, setPassedQuiz] = useState<Set<string>>(new Set());
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [activeId, setActiveId] = useState<string>(lessons[0].id);
  const [saving, setSaving] = useState(false);
  const [practiceMinutes, setPracticeMinutes] = useState(0);
  const [logging, setLogging] = useState(false);
  const timerStart = useRef<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [_tick, setTick] = useState(0);

  // Load progress from DB + subscribe to realtime updates
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      const [{ data: prog }, { data: quiz }] = await Promise.all([
        supabase
          .from("lesson_progress")
          .select("module_id")
          .eq("user_id", user.id)
          .eq("instrument_slug", inst.slug)
          .eq("level", level),
        (supabase as unknown as { from: (t: string) => { select: (c: string) => { eq: (...a: unknown[]) => { eq: (...a: unknown[]) => { eq: (...a: unknown[]) => Promise<{ data: QuizAttempt[] | null }> } } } } })
          .from("quiz_attempts")
          .select("lesson_id, score_pct, passed")
          .eq("user_id", user.id)
          .eq("instrument_slug", inst.slug)
          .eq("level", level),
      ]);
      if (cancelled) return;
      setCompleted(new Set((prog ?? []).map((r) => r.module_id)));
      const passed = new Set<string>();
      const best: Record<string, number> = {};
      for (const a of (quiz ?? []) as unknown as QuizAttempt[]) {
        if (a.passed) passed.add(a.lesson_id);
        best[a.lesson_id] = Math.max(best[a.lesson_id] ?? 0, a.score_pct);
      }
      setPassedQuiz(passed);
      setBestScores(best);
    };
    load();

    const ch1 = supabase
      .channel(`progress-${user.id}-${inst.slug}-${level}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_progress", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_attempts", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch1);
    };
  }, [user, inst.slug, level]);

  // Practice timer live-update
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  const total = lessons.length;
  const doneCount = completed.size;
  const percent = Math.round((doneCount / total) * 100);
  const activeIndex = Math.max(0, lessons.findIndex((m) => m.id === activeId));

  const isUnlocked = useCallback(
    (idx: number) => {
      if (idx === 0) return true;
      const prev = lessons[idx - 1];
      // A lesson unlocks when the previous is marked complete AND its quiz was passed
      return completed.has(prev.id) && passedQuiz.has(prev.id);
    },
    [completed, passedQuiz, lessons],
  );

  const startTimer = () => {
    timerStart.current = Date.now();
    setTimerRunning(true);
  };
  const stopAndLog = async () => {
    if (!timerStart.current) return;
    const elapsedMin = Math.max(1, Math.round((Date.now() - timerStart.current) / 60000));
    setPracticeMinutes((m) => m + elapsedMin);
    setTimerRunning(false);
    timerStart.current = null;
    if (!user) {
      toast.info("Sign in to save this practice session");
      return;
    }
    setLogging(true);
    const { error } = await (supabase as unknown as { from: (t: string) => { insert: (row: unknown) => Promise<{ error: unknown }> } })
      .from("practice_sessions")
      .insert({
        user_id: user.id,
        instrument_slug: inst.slug,
        level,
        lesson_id: activeLesson.id,
        minutes: elapsedMin,
      });
    setLogging(false);
    if (error) return toast.error("Could not save session");
    toast.success(`Logged ${elapsedMin} min of practice`);
  };

  const markComplete = async (lessonId: string) => {
    if (!user) {
      toast.error("Please sign in to save progress");
      return;
    }
    if (!passedQuiz.has(lessonId)) {
      toast.error("Pass the lesson quiz first");
      return;
    }
    if (completed.has(lessonId)) return;
    setSaving(true);
    const { error } = await supabase.from("lesson_progress").insert({
      user_id: user.id,
      instrument_slug: inst.slug,
      level,
      module_id: lessonId,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Lesson complete! 🎉");
    setCompleted((prev) => new Set(prev).add(lessonId));
    const nextIdx = lessons.findIndex((m) => m.id === lessonId) + 1;
    if (nextIdx < lessons.length) setActiveId(lessons[nextIdx].id);
  };

  const onQuizPassed = async (lessonId: string, scorePct: number) => {
    setPassedQuiz((prev) => new Set(prev).add(lessonId));
    setBestScores((prev) => ({ ...prev, [lessonId]: Math.max(prev[lessonId] ?? 0, scorePct) }));
    if (!user) return;
    await (supabase as unknown as { from: (t: string) => { insert: (row: unknown) => Promise<{ error: unknown }> } })
      .from("quiz_attempts")
      .insert({
        user_id: user.id,
        instrument_slug: inst.slug,
        level,
        lesson_id: lessonId,
        score_pct: scorePct,
        passed: true,
      });
  };

  const activeLesson = lessons[activeIndex] ?? lessons[0];
  const activeUnlocked = isUnlocked(activeIndex);
  const goPrev = () => {
    if (activeIndex > 0) setActiveId(lessons[activeIndex - 1].id);
  };
  const goNext = () => {
    if (activeIndex < lessons.length - 1 && isUnlocked(activeIndex + 1)) {
      setActiveId(lessons[activeIndex + 1].id);
    }
  };

  const elapsedSec = timerRunning && timerStart.current ? Math.round((Date.now() - timerStart.current) / 1000) : 0;
  const elapsedMinLabel = `${Math.floor(elapsedSec / 60)}:${String(elapsedSec % 60).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/courses" className="hover:text-foreground">Courses</Link>
        <span>/</span>
        <Link to="/instruments/$slug" params={{ slug: inst.slug }} className="hover:text-foreground">{inst.name}</Link>
        <span>/</span>
        <span className="text-foreground">{levelLabel}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">{levelLabel} · {total} lessons</p>
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

      {!user && !authLoading && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-brand/40 bg-brand-soft/40 p-4 text-sm">
          <span>
            <Sparkles className="mr-1 inline h-4 w-4 text-brand" /> Sign in to track your progress, save quiz scores and log practice time.
          </span>
          <Button asChild size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/auth" search={{ mode: "signup" }}>Create free account</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* LESSON LIST */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your progress</h3>
              <span className="text-xs text-muted-foreground">{doneCount}/{total}</span>
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{percent}%</div>
            <Progress value={percent} className="mt-3" />
            {percent === 100 && (
              <>
                <p className="mt-3 text-xs font-medium text-brand">Congratulations! You have completed this level.</p>
                {level === "advanced" && (
                  <div className="mt-6 rounded-2xl border border-brand bg-brand-soft/40 p-5 text-center">
                    <p className="font-display text-xl font-bold text-brand">🎵 Continue Learning With Me</p>
                    <p className="mt-2 text-sm text-muted-foreground">Congratulations on completing these introductory lessons.</p>
                    <p className="mt-1 text-sm text-muted-foreground">If you would like to continue with personalised online music lessons, coaching, practical exercises and live classes, I would love to help you.</p>
                    <p className="mt-4 text-sm font-medium">Email: nhlamulofani@gmail.com</p>
                    <p className="text-sm font-medium">Phone / WhatsApp: 060 841 4467</p>
                    <Button asChild className="mt-4 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                      <a href="mailto:nhlamulofani@gmail.com?subject=Inquiry about online music lessons">Contact for Online Lessons</a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Practice timer */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Practice timer</h3>
              <Timer className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{timerRunning ? elapsedMinLabel : `${practiceMinutes}m`}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {timerRunning ? "Practising now — stop when done to log the session." : "Time your practice and log it to your streak."}
            </p>
            <div className="mt-3 flex gap-2">
              {!timerRunning ? (
                <Button size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90" onClick={startTimer}>
                  Start practice
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="rounded-full" onClick={stopAndLog} disabled={logging}>
                  Stop & log
                </Button>
              )}
            </div>
          </div>

          <ol className="space-y-2">
            {lessons.map((m, idx) => {
              const isDone = completed.has(m.id);
              const unlocked = isUnlocked(idx);
              const isActive = m.id === activeId;
              const quizPassed = passedQuiz.has(m.id);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => unlocked && setActiveId(m.id)}
                    disabled={!unlocked}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isActive ? "border-brand bg-brand-soft/40" : "border-border bg-card hover:border-brand/60"
                    } ${!unlocked ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      isDone ? "bg-brand text-brand-foreground" : "bg-secondary text-foreground"
                    }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : !unlocked ? <Lock className="h-3.5 w-3.5" /> : idx + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs uppercase tracking-wider text-muted-foreground">Lesson {idx + 1} · {m.durationMin} min</span>
                      <span className="block truncate text-sm font-medium">{m.title}</span>
                      <span className="mt-1 flex flex-wrap gap-1 text-[10px] uppercase tracking-wider">
                        {quizPassed && <span className="rounded bg-brand-soft px-1.5 py-0.5 text-brand">Quiz {bestScores[m.id] ?? "OK"}%</span>}
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">Diff {m.difficulty}/5</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* LESSON CONTENT */}
        <div>
          {!activeUnlocked ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-3 font-display text-xl font-semibold">Complete and pass the previous lesson quiz first</h2>
              <p className="mt-1 text-sm text-muted-foreground">Lessons unlock in order so you build skills step by step.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Video hero */}
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand/30 via-black to-brand/10">
                <img src={inst.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
                <div className="absolute inset-0 grid place-items-center text-white">
                  <div className="text-center">
                    <PlayCircle className="mx-auto h-20 w-20 drop-shadow-lg" />
                    <p className="mt-2 text-sm font-medium opacity-80">Video lesson · Lesson {activeIndex + 1}</p>
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-brand">
                    Lesson {activeIndex + 1} of {total} · Theory: {activeLesson.theoryTopic}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {activeLesson.durationMin} min</span>
                    <span className="inline-flex items-center gap-1">Difficulty {activeLesson.difficulty}/5 · {DIFF_LABELS[activeLesson.difficulty]}</span>
                  </div>
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold">{activeLesson.title}</h2>

                {/* Objectives */}
                <Section icon={<Target className="h-4 w-4" />} title="Learning objectives">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {activeLesson.objectives.map((o, i) => (
                      <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {o}</li>
                    ))}
                  </ul>
                </Section>

                {/* Theory */}
                <Section icon={<BookOpen className="h-4 w-4" />} title={`Music theory: ${activeLesson.theoryTopic}`}>
                  <p className="text-sm leading-relaxed text-muted-foreground">{activeLesson.theory}</p>
                  <div className="mt-4 rounded-xl border border-brand/30 bg-gradient-to-br from-brand-soft to-transparent p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand">Visual theory reference</p>
                    <div className="mt-2 flex h-24 items-center justify-center rounded-lg border border-dashed border-brand/40 bg-background/50 text-center">
                      <div className="font-display text-lg font-bold text-brand">{activeLesson.visual}</div>
                    </div>
                  </div>
                </Section>

                {/* Steps */}
                <Section icon={<ListChecks className="h-4 w-4" />} title="Step-by-step instructions">
                  <ol className="space-y-2 text-sm">
                    {activeLesson.steps.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{i + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </Section>

                {/* Technique exercises */}
                <Section icon={<Wrench className="h-4 w-4" />} title="Technique exercises">
                  <ul className="grid gap-2 sm:grid-cols-2 text-sm">
                    {activeLesson.techniqueExercises.map((e, i) => (
                      <li key={i} className="rounded-lg border border-border bg-background p-3">{e}</li>
                    ))}
                  </ul>
                </Section>

                {/* Practice routine */}
                <Section icon={<Timer className="h-4 w-4" />} title="Daily practice routine">
                  <p className="text-sm">{activeLesson.practiceRoutine}</p>
                </Section>

                {/* Homework */}
                <Section icon={<HomeIcon className="h-4 w-4" />} title="Homework">
                  <p className="text-sm">{activeLesson.homework}</p>
                </Section>

                {/* Tips + mistakes */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
                      <Lightbulb className="h-4 w-4" /> Tips for improvement
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {activeLesson.tips.map((t, i) => (
                        <li key={i} className="flex gap-2"><span className="text-brand">•</span> {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
                      <AlertTriangle className="h-4 w-4" /> Common mistakes
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {activeLesson.mistakes.map((t, i) => (
                        <li key={i} className="flex gap-2"><span className="text-destructive">•</span> {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <Button variant="outline" className="rounded-full" onClick={goPrev} disabled={activeIndex === 0}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous lesson
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    {completed.has(activeLesson.id)
                      ? "✅ You completed this lesson."
                      : passedQuiz.has(activeLesson.id)
                      ? "Quiz passed — mark complete when you've done the homework."
                      : "Pass the quiz below to unlock 'Mark lesson complete'."}
                  </div>
                  <Button
                    className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                    disabled={saving || completed.has(activeLesson.id) || !passedQuiz.has(activeLesson.id)}
                    onClick={() => markComplete(activeLesson.id)}
                  >
                    {completed.has(activeLesson.id) ? "Completed" : saving ? "Saving…" : "Mark lesson complete"}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={goNext}
                    disabled={activeIndex >= lessons.length - 1 || !isUnlocked(activeIndex + 1)}
                  >
                    Next lesson <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quiz */}
              <LessonQuiz
                inst={inst}
                level={level}
                lesson={activeLesson}
                bestScore={bestScores[activeLesson.id] ?? null}
                onPassed={(pct) => onQuizPassed(activeLesson.id, pct)}
              />

              <div className="rounded-2xl border border-brand/30 bg-brand-soft/40 p-6 text-center">
                <h3 className="font-display text-lg font-semibold">Want more personalised lessons?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reach out to Nhlamulo Fani Sibuyi for private 1-on-1 lessons that go beyond this course.
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
                  <a href="tel:+27608414467" className="font-medium text-brand hover:underline">060 841 4467</a>
                  <span className="text-muted-foreground">·</span>
                  <a href="mailto:nhlamulofani@gmail.com" className="font-medium text-brand hover:underline">nhlamulofani@gmail.com</a>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                {LESSONS_PER_LEVEL[level as Level]} lessons in this level · sequential unlock · progress saved to your account.
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
        {icon} {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
