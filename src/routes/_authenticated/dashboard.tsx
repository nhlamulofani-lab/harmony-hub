import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, Clock3, Flame, GraduationCap, Plus } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { calculateStreak, logPractice } from "@/lib/learning-tracker";
import { instruments, levels, getModules, type Level } from "@/lib/site-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });
type ProgressRow = { instrument_slug: string; level: string; module_id: string };
type PracticeRow = { instrument_slug: string; duration_minutes: number; practiced_on: string; notes: string | null };
type AttemptRow = { score: number };

function Dashboard() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "Musician";
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [practice, setPractice] = useState<PracticeRow[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [instrument, setInstrument] = useState("piano");
  const [minutes, setMinutes] = useState(30);
  const [practiceNote, setPracticeNote] = useState("");

  const load = async () => {
    if (!user) return;
    const [progress, sessions, quiz] = await Promise.all([
      supabase.from("lesson_progress").select("instrument_slug,level,module_id").eq("user_id", user.id),
      supabase.from("practice_sessions").select("instrument_slug,duration_minutes,practiced_on,notes").eq("user_id", user.id).order("practiced_on", { ascending: false }),
      supabase.from("quiz_attempts").select("score").eq("user_id", user.id),
    ]);
    setProgressRows((progress.data ?? []) as ProgressRow[]);
    setPractice((sessions.data ?? []) as PracticeRow[]);
    setAttempts((quiz.data ?? []) as AttemptRow[]);
  };
  useEffect(() => { load(); }, [user]);

  const courses = useMemo(() => instruments.map((inst) => {
    const perLevel = levels.map((item) => { const total = getModules(inst.name, item.key, inst.slug).length; const done = progressRows.filter((row) => row.instrument_slug === inst.slug && row.level === item.key).length; return { ...item, total, done, percent: Math.round(done / total * 100) }; });
    const done = perLevel.reduce((sum, item) => sum + item.done, 0);
    return { inst, perLevel, done, percent: Math.round(done / 30 * 100) };
  }), [progressRows]);
  const active = courses.filter((course) => course.done > 0);
  const today = new Date();
  const startWeek = new Date(today); startWeek.setDate(today.getDate() - 6);
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const weekly = practice.filter((item) => new Date(item.practiced_on) >= startWeek).reduce((sum, item) => sum + item.duration_minutes, 0);
  const monthly = practice.filter((item) => new Date(item.practiced_on) >= startMonth).reduce((sum, item) => sum + item.duration_minutes, 0);
  const averageQuiz = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0;
  const certificates = courses.flatMap((course) => course.perLevel.filter((item) => item.percent === 100).map((item) => ({ instrument: course.inst, level: item.label })));

  const downloadCertificate = (instrumentName: string, level: string) => {
    const pdf = new jsPDF({ orientation: "landscape" });
    pdf.setDrawColor(35, 105, 87); pdf.setLineWidth(2); pdf.rect(12, 12, 273, 186);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(28); pdf.text("NFS MUSIC ACADEMY", 148, 50, { align: "center" });
    pdf.setFontSize(18); pdf.text("Certificate of Achievement", 148, 72, { align: "center" });
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(14); pdf.text("This certificate is proudly presented to", 148, 94, { align: "center" });
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(24); pdf.text(name, 148, 114, { align: "center" });
    pdf.setFontSize(15); pdf.text(`for completing ${instrumentName} — ${level}`, 148, 137, { align: "center" });
    pdf.setFont("helvetica", "normal"); pdf.text(new Date().toLocaleDateString(), 148, 162, { align: "center" });
    pdf.save(`${instrumentName}-${level}-certificate.pdf`);
  };

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <header><p className="font-medium text-brand">Welcome back</p><h1 className="font-display text-4xl font-bold">Hi, {name}</h1><p className="mt-2 text-muted-foreground">Keep your learning and practice moving forward.</p></header>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
      { icon: BookOpen, label: "Lessons complete", value: progressRows.length }, { icon: Clock3, label: "Weekly practice", value: `${weekly} min` }, { icon: Flame, label: "Practice streak", value: `${calculateStreak(practice.map((item) => item.practiced_on))} days` }, { icon: GraduationCap, label: "Average quiz", value: `${averageQuiz}%` },
    ].map((stat) => <div className="rounded-2xl border bg-card p-5" key={stat.label}><stat.icon className="size-5 text-brand" /><strong className="mt-3 block text-2xl">{stat.value}</strong><span className="text-sm text-muted-foreground">{stat.label}</span></div>)}</section>

    <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
      <section><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Learning progress</h2><Button asChild variant="outline"><Link to="/courses">Browse courses</Link></Button></div><div className="mt-5 flex flex-col gap-4">{(active.length ? active : courses.slice(0, 3)).map((course) => { const resume = (course.perLevel.find((item) => item.percent < 100)?.key ?? "advanced") as Level; return <article className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center" key={course.inst.slug}><img src={course.inst.image} alt={course.inst.name} className="size-20 rounded-xl object-cover" /><div className="flex-1"><div className="flex justify-between"><h3 className="font-bold">{course.inst.name}</h3><span>{course.percent}% overall</span></div><Progress className="mt-2" value={course.percent} /><div className="mt-2 flex flex-wrap gap-2 text-xs">{course.perLevel.map((item) => <span key={item.key} className="rounded-full bg-secondary px-2 py-1">{item.label}: {item.percent}%</span>)}</div></div><Button asChild><Link to="/courses/$instrument/$level" params={{ instrument: course.inst.slug, level: resume }}>{course.done ? "Resume" : "Start"}</Link></Button></article>; })}</div></section>

      <aside className="flex flex-col gap-6"><section className="rounded-2xl border bg-card p-6"><h2 className="font-display text-xl font-bold">Log practice</h2><div className="mt-4 flex flex-col gap-3"><label className="text-sm font-medium">Instrument<select className="mt-1 h-10 w-full rounded-md border bg-background px-3" value={instrument} onChange={(event) => setInstrument(event.target.value)}>{instruments.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label><label className="text-sm font-medium">Minutes<Input className="mt-1" type="number" min={1} max={1440} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /></label><Textarea placeholder="What did you work on?" value={practiceNote} onChange={(event) => setPracticeNote(event.target.value)} /><Button onClick={async () => { if (!user) return; await logPractice(user.id, instrument, minutes, new Date().toISOString().slice(0, 10), practiceNote); setPracticeNote(""); await load(); toast.success("Practice logged"); }}><Plus data-icon="inline-start" />Add session</Button></div><div className="mt-5 grid grid-cols-2 gap-3 text-center"><div className="rounded-xl bg-secondary p-3"><strong className="block">{weekly}</strong><span className="text-xs">This week</span></div><div className="rounded-xl bg-secondary p-3"><strong className="block">{monthly}</strong><span className="text-xs">This month</span></div></div></section>
      <section className="rounded-2xl border bg-card p-6"><h2 className="font-display text-xl font-bold">Certificates</h2><div className="mt-4 flex flex-col gap-3">{certificates.length ? certificates.map((certificate) => <div key={`${certificate.instrument.slug}-${certificate.level}`} className="rounded-xl border p-4"><Award className="size-6 text-brand" /><p className="mt-2 font-semibold">{certificate.instrument.name} · {certificate.level}</p><Button className="mt-3" size="sm" variant="outline" onClick={() => downloadCertificate(certificate.instrument.name, certificate.level)}>Download PDF</Button></div>) : <p className="text-sm text-muted-foreground">Complete all 10 lessons in a level to unlock a downloadable certificate.</p>}</div></section></aside>
    </div>
  </main>;
}
