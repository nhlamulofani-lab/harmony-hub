import type { Lesson, Level, Instrument } from "@/lib/site-data";

export type QuizQuestion =
  | { id: string; kind: "mc"; prompt: string; options: string[]; correctIndex: number; explanation: string }
  | { id: string; kind: "tf"; prompt: string; correct: boolean; explanation: string }
  | { id: string; kind: "fill"; prompt: string; before: string; after: string; correct: string; explanation: string }
  | { id: string; kind: "match"; prompt: string; pairs: { left: string; right: string }[]; explanation: string };

export type Quiz = {
  lessonId: string;
  passingPct: number;
  questions: QuizQuestion[];
};

/** Build a small quiz per lesson using its content — deterministic per (instrument, level, lesson). */
export function buildQuiz(inst: Instrument, level: Level, lesson: Lesson): Quiz {
  const q: QuizQuestion[] = [];

  // Q1 — MC: objective of this lesson
  const otherObjective =
    lesson.number > 1 ? `Master ${inst.advancedSong} at performance tempo` : `Perform ${inst.advancedSong} live`;
  q.push({
    id: `${lesson.id}-q1`,
    kind: "mc",
    prompt: `What is the main objective of Lesson ${lesson.number}: ${lesson.title}?`,
    options: shuffle([
      lesson.objectives[0],
      otherObjective,
      "Skip technique and go straight to performance",
      "Increase practice room temperature",
    ], lesson.id + "1"),
    correctIndex: -1, // filled below
    explanation: `The stated objective is: ${lesson.objectives[0]}.`,
  });
  // fix correctIndex based on the shuffled options
  const q1 = q[0] as Extract<QuizQuestion, { kind: "mc" }>;
  q1.correctIndex = q1.options.indexOf(lesson.objectives[0]);

  // Q2 — True/False: theory topic
  q.push({
    id: `${lesson.id}-q2`,
    kind: "tf",
    prompt: `True or False: This lesson introduces the theory topic "${lesson.theoryTopic}".`,
    correct: true,
    explanation: `Correct — every lesson in the ${inst.name} course pairs practical work with a theory topic; here it's "${lesson.theoryTopic}".`,
  });

  // Q3 — Multiple choice: common mistake
  q.push({
    id: `${lesson.id}-q3`,
    kind: "mc",
    prompt: `Which of the following is a common mistake in this lesson?`,
    options: shuffle([
      lesson.mistakes[0],
      "Playing scales while singing them",
      "Practising with a metronome",
      "Recording yourself for review",
    ], lesson.id + "3"),
    correctIndex: -1,
    explanation: `A common mistake is: ${lesson.mistakes[0]}.`,
  });
  const q3 = q[2] as Extract<QuizQuestion, { kind: "mc" }>;
  q3.correctIndex = q3.options.indexOf(lesson.mistakes[0]);

  // Q4 — Fill in the blank: practice routine minutes
  const mins = extractMinutes(lesson.practiceRoutine) ?? lesson.durationMin;
  q.push({
    id: `${lesson.id}-q4`,
    kind: "fill",
    prompt: `Complete the recommended practice routine duration.`,
    before: "This lesson's suggested practice routine lasts about",
    after: "minutes.",
    correct: String(mins),
    explanation: `The suggested routine is roughly ${mins} minutes.`,
  });

  // Q5 — Match tips → outcomes (matching pair drag-free UI: two columns, users pick correct pairing)
  q.push({
    id: `${lesson.id}-q5`,
    kind: "match",
    prompt: `Match the tip to what it improves.`,
    pairs: [
      { left: "Record yourself and listen back", right: "Objective self-review" },
      { left: "Practise with a metronome", right: "Steady time" },
      { left: "Slow practice first", right: "Clean technique" },
    ],
    explanation: "Reviewing recordings builds objective judgement; metronomes build time; slow practice builds cleanliness.",
  });

  return {
    lessonId: lesson.id,
    passingPct: 70,
    questions: q,
  };
}

function extractMinutes(text: string): number | null {
  const m = text.match(/(\d{1,3})\s*minutes?/i);
  return m ? parseInt(m[1], 10) : null;
}

// Deterministic Fisher-Yates using a seeded pseudo-random source
function shuffle<T>(arr: T[], seed: string): T[] {
  const rng = mulberry32(hashCode(seed));
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function hashCode(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scoreQuiz(
  quiz: Quiz,
  answers: Record<string, unknown>,
): { correctCount: number; total: number; pct: number; passed: boolean; perQuestion: Record<string, boolean> } {
  let correct = 0;
  const per: Record<string, boolean> = {};
  for (const q of quiz.questions) {
    let ok = false;
    switch (q.kind) {
      case "mc":
        ok = answers[q.id] === q.correctIndex;
        break;
      case "tf":
        ok = answers[q.id] === q.correct;
        break;
      case "fill":
        ok = String(answers[q.id] ?? "").trim().toLowerCase() === q.correct.toLowerCase();
        break;
      case "match": {
        // answers[q.id] === Record<left, right>
        const given = (answers[q.id] as Record<string, string>) ?? {};
        ok = q.pairs.every((p) => given[p.left] === p.right);
        break;
      }
    }
    per[q.id] = ok;
    if (ok) correct++;
  }
  const pct = Math.round((correct / quiz.questions.length) * 100);
  return {
    correctCount: correct,
    total: quiz.questions.length,
    pct,
    passed: pct >= quiz.passingPct,
    perQuestion: per,
  };
}
