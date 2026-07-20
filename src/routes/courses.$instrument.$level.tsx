import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, Lock, NotebookPen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getInstrument, getModules, levels, type Level } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { saveLessonNote, saveQuizAttempt } from "@/lib/learning-tracker";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$instrument/$level")({
  loader: ({ params }) => {
    const inst = getInstrument(params.instrument);
    const found = levels.find((item) => item.key === params.level);
    if (!inst || !found) throw notFound();
    return { inst, level: found.key as Level, levelLabel: found.label };
  },
  component: LessonPage,
});

function LessonPage() {
  const { inst, level, levelLabel } = Route.useLoaderData();
  const { user } = useAuth();
  const lessons = useMemo(() => getModules(inst.name, level, inst.slug), [inst.name, inst.slug, level]);
  const [completed, setCompleted] = useState(new Set<string>());
  const [active, setActive] = useState(0);
  const [note, setNote] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const lesson = lessons[active];

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("lesson_progress").select("module_id").eq("user_id", user.id).eq("instrument_slug", inst.slug).eq("level", level),
      supabase.from("lesson_notes").select("content").eq("user_id", user.id).eq("instrument_slug", inst.slug).eq("level", level).eq("module_id", lesson.id).maybeSingle(),
      supabase.from("quiz_attempts").select("score").eq("user_id", user.id).eq("instrument_slug", inst.slug).eq("level", level).eq("module_id", lesson.id).order("score", { ascending: false }).limit(1),
    ]).then(([progress, notes, attempts]) => {
      setCompleted(new Set((progress.data ?? []).map((row) => row.module_id)));
      setNote(notes.data?.content ?? "");
      setBestScore(attempts.data?.[0]?.score ?? null);
      setQuizAnswers([]);
    });
  }, [user, inst.slug, level, lesson.id]);

  const unlocked = active === 0 || completed.has(lessons[active - 1].id);
  const percent = Math.round((completed.size / lessons.length) * 100);

  const submitQuiz = async () => {
    if (!user || quizAnswers.length !== lesson.quiz.length) return toast.error("Answer every question first");
    const correct = lesson.quiz.filter((question, index) => question.correct === quizAnswers[index]).length;
    const score = Math.round((correct / lesson.quiz.length) * 100);
    await saveQuizAttempt(user.id, inst.slug, level, lesson.id, score, { selected: quizAnswers }, bestScore === null ? 1 : 2);
    setBestScore((current) => Math.max(current ?? 0, score));
    toast.success(score >= 70 ? `Quiz passed: ${score}%` : `Score: ${score}%. Review and try again.`);
  };

  const markComplete = async () => {
    if (!user) return toast.error("Sign in to save progress");
    if ((bestScore ?? 0) < 70) return toast.error("Pass the lesson quiz with 70% first");
    const { error } = await supabase.from("lesson_progress").upsert({ user_id: user.id, instrument_slug: inst.slug, level, module_id: lesson.id }, { onConflict: "user_id,instrument_slug,level,module_id" });
    if (error) return toast.error(error.message);
    setCompleted((current) => new Set(current).add(lesson.id));
    toast.success("Lesson complete");
    if (active < lessons.length - 1) setActive(active + 1);
  };

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link to="/courses">Courses</Link><span>/</span><span>{inst.name}</span><span>/</span><span className="text-foreground">{levelLabel}</span></nav>
    <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
      <div><p className="font-medium text-brand">{levelLabel} pathway · 10 lessons</p><h1 className="font-display text-4xl font-bold">{inst.name} curriculum</h1></div>
      <div className="flex gap-2">{levels.map((item) => <Button key={item.key} asChild size="sm" variant={item.key === level ? "default" : "outline"}><Link to="/courses/$instrument/$level" params={{ instrument: inst.slug, level: item.key }}>{item.label}</Link></Button>)}</div>
    </header>
    <section className="mt-6 rounded-2xl border bg-card p-5"><div className="flex items-center justify-between"><span className="font-semibold">Level progress</span><span>{completed.size}/10 · {percent}%</span></div><Progress className="mt-3" value={percent} /></section>

    <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside><ol className="flex flex-col gap-2">{lessons.map((item, index) => { const canOpen = index === 0 || completed.has(lessons[index - 1].id); return <li key={item.id}><button className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${active === index ? "border-brand bg-brand-soft/40" : "bg-card"} ${!canOpen ? "opacity-55" : ""}`} disabled={!canOpen} onClick={() => setActive(index)}><span className="grid size-8 place-items-center rounded-full bg-secondary">{completed.has(item.id) ? <CheckCircle2 className="size-4 text-brand" /> : canOpen ? index + 1 : <Lock className="size-4" />}</span><span><span className="block text-xs text-muted-foreground">Lesson {index + 1}</span><span className="font-medium">{item.title}</span></span></button></li>; })}</ol></aside>

      <article className="flex flex-col gap-6">
        {!unlocked ? <section className="rounded-2xl border bg-card p-10 text-center"><Lock className="mx-auto size-8" /><h2 className="mt-3 text-xl font-bold">Complete the previous lesson</h2></section> : <>
          <section className="overflow-hidden rounded-2xl border bg-card"><div className="relative aspect-[16/7]"><img src={inst.image} alt={`${inst.name} lesson`} className="size-full object-cover" /><div className="absolute inset-0 flex items-end bg-foreground/45 p-6 text-background"><div><p className="text-sm">Lesson {active + 1} of 10</p><h2 className="font-display text-3xl font-bold">{lesson.title}</h2></div></div></div><div className="p-6"><div className="flex flex-wrap gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Clock3 className="size-4" />{lesson.duration} minutes</span><span className="flex items-center gap-2"><Target className="size-4" />Practical + theory</span></div><p className="mt-4 leading-relaxed">{lesson.introduction}</p></div></section>
          <section className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border bg-card p-6"><h3 className="font-display text-xl font-bold">Learning objectives</h3><ul className="mt-4 flex flex-col gap-3">{lesson.objectives.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0 text-brand" />{item}</li>)}</ul></div><div className="rounded-2xl border bg-card p-6"><h3 className="font-display text-xl font-bold">Theory focus</h3><p className="mt-4 leading-relaxed text-muted-foreground">{lesson.theory}</p></div></section>
          <section className="rounded-2xl border bg-card p-6"><h3 className="font-display text-xl font-bold">Step-by-step practice</h3><ol className="mt-4 flex flex-col gap-3">{lesson.steps.map((step, index) => <li key={step} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">{index + 1}</span><span>{step}</span></li>)}</ol><div className="mt-6 rounded-xl bg-secondary p-4"><strong>Homework:</strong> {lesson.homework}</div></section>
          <section className="rounded-2xl border bg-card p-6"><h3 className="flex items-center gap-2 font-display text-xl font-bold"><NotebookPen className="size-5" />Lesson notes</h3><Textarea className="mt-4 min-h-32" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write observations, questions and teacher feedback…" /><Button className="mt-3" variant="outline" onClick={async () => { if (!user) return toast.error("Sign in to save notes"); await saveLessonNote(user.id, inst.slug, level, lesson.id, note); toast.success("Notes saved"); }}>Save notes</Button></section>
          <section className="rounded-2xl border bg-card p-6"><div className="flex items-center justify-between"><h3 className="font-display text-xl font-bold">Lesson quiz</h3>{bestScore !== null && <span className="font-semibold text-brand">Best: {bestScore}%</span>}</div><div className="mt-5 flex flex-col gap-6">{lesson.quiz.map((question, questionIndex) => <fieldset key={question.prompt}><legend className="font-semibold">{questionIndex + 1}. {question.prompt}</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <label key={option} className={`cursor-pointer rounded-xl border p-3 ${quizAnswers[questionIndex] === optionIndex ? "border-brand bg-brand-soft/40" : ""}`}><input className="mr-2" type="radio" name={`question-${questionIndex}`} checked={quizAnswers[questionIndex] === optionIndex} onChange={() => setQuizAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} />{option}</label>)}</div></fieldset>)}</div><Button className="mt-5" onClick={submitQuiz}>Submit quiz</Button></section>
          <footer className="flex flex-wrap items-center justify-between gap-3"><Button variant="outline" disabled={active === 0} onClick={() => setActive(active - 1)}><ChevronLeft data-icon="inline-start" />Previous</Button><Button onClick={markComplete}>{completed.has(lesson.id) ? "Completed" : "Complete lesson"}</Button><Button variant="outline" disabled={active === lessons.length - 1 || !completed.has(lesson.id)} onClick={() => setActive(active + 1)}>Next<ChevronRight data-icon="inline-end" /></Button></footer>
        </>}
      </article>
    </div>
  </main>;
}
