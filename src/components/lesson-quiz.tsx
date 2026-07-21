import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { buildQuiz, scoreQuiz, type Quiz, type QuizQuestion } from "@/lib/quiz";
import type { Instrument, Lesson, Level } from "@/lib/site-data";

type Props = {
  inst: Instrument;
  level: Level;
  lesson: Lesson;
  onPassed?: (scorePct: number) => void;
  bestScore?: number | null;
};

export function LessonQuiz({ inst, level, lesson, onPassed, bestScore }: Props) {
  const quiz: Quiz = useMemo(() => buildQuiz(inst, level, lesson), [inst, level, lesson]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreQuiz> | null>(null);

  const setAnswer = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }));

  const submit = () => {
    const r = scoreQuiz(quiz, answers);
    setResult(r);
    setSubmitted(true);
    if (r.passed) onPassed?.(r.pct);
  };
  const reset = () => {
    setAnswers({});
    setResult(null);
    setSubmitted(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Lesson quiz</p>
          <h3 className="mt-1 font-display text-xl font-semibold">Test what you learned</h3>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Pass at {quiz.passingPct}%</div>
          {bestScore != null && <div>Best: {bestScore}%</div>}
        </div>
      </div>

      <ol className="mt-6 space-y-6">
        {quiz.questions.map((q, i) => (
          <li key={q.id}>
            <QuestionView
              index={i}
              q={q}
              value={answers[q.id]}
              onChange={(v) => setAnswer(q.id, v)}
              locked={submitted}
              correct={result?.perQuestion[q.id] ?? null}
            />
          </li>
        ))}
      </ol>

      {result && (
        <div
          className={`mt-6 rounded-xl border p-4 ${
            result.passed
              ? "border-brand/40 bg-brand-soft/40"
              : "border-destructive/40 bg-destructive/10"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {result.passed ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-brand" /> You passed with {result.pct}% ({result.correctCount}/{result.total})
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" /> {result.pct}% — need {quiz.passingPct}% to unlock the next lesson
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.passed
              ? "Great work! You can now move on."
              : "Review the lesson and try again — you have unlimited attempts."}
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        {submitted && (
          <Button variant="outline" className="rounded-full" onClick={reset}>
            <RefreshCw className="mr-1.5 h-4 w-4" /> Retry
          </Button>
        )}
        {!submitted && (
          <Button
            className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={submit}
          >
            <Sparkles className="mr-1.5 h-4 w-4" /> Submit quiz
          </Button>
        )}
      </div>
    </div>
  );
}

function QuestionView({
  index,
  q,
  value,
  onChange,
  locked,
  correct,
}: {
  index: number;
  q: QuizQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
  locked: boolean;
  correct: boolean | null;
}) {
  const badge = correct == null ? null : correct ? (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">
      <CheckCircle2 className="h-3.5 w-3.5" /> Correct
    </span>
  ) : (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
      <XCircle className="h-3.5 w-3.5" /> Try again
    </span>
  );

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">
          <span className="text-brand">Q{index + 1}.</span> {q.prompt} {badge}
        </p>
        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {q.kind === "mc" ? "Multiple choice" : q.kind === "tf" ? "True / False" : q.kind === "fill" ? "Fill in" : "Match"}
        </span>
      </div>
      <div className="mt-3">
        {q.kind === "mc" && (
          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              const selected = value === i;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={locked}
                  onClick={() => onChange(i)}
                  className={`rounded-lg border p-2.5 text-left text-sm transition ${
                    selected
                      ? "border-brand bg-brand-soft/40"
                      : "border-border bg-card hover:border-brand/60"
                  } ${locked ? "cursor-not-allowed" : ""}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
        {q.kind === "tf" && (
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <Button
                key={String(v)}
                type="button"
                variant={value === v ? "default" : "outline"}
                className="rounded-full"
                disabled={locked}
                onClick={() => onChange(v)}
              >
                {v ? "True" : "False"}
              </Button>
            ))}
          </div>
        )}
        {q.kind === "fill" && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span>{q.before}</span>
            <Input
              className="w-24"
              disabled={locked}
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="?"
            />
            <span>{q.after}</span>
          </div>
        )}
        {q.kind === "match" && (
          <MatchQuestion q={q} value={value as Record<string, string> | undefined} onChange={onChange} locked={locked} />
        )}
      </div>
      {locked && (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium">Explanation:</span> {q.explanation}
        </p>
      )}
    </div>
  );
}

function MatchQuestion({
  q,
  value,
  onChange,
  locked,
}: {
  q: Extract<QuizQuestion, { kind: "match" }>;
  value: Record<string, string> | undefined;
  onChange: (v: Record<string, string>) => void;
  locked: boolean;
}) {
  const rights = q.pairs.map((p) => p.right);
  return (
    <div className="grid gap-2">
      {q.pairs.map((p) => (
        <div key={p.left} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-border bg-card p-2">
          <span className="text-sm">{p.left}</span>
          <select
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            disabled={locked}
            value={value?.[p.left] ?? ""}
            onChange={(e) => onChange({ ...(value ?? {}), [p.left]: e.target.value })}
          >
            <option value="">Choose…</option>
            {rights.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export function QuizProgressHint({ passed }: { passed: boolean }) {
  return (
    <Progress value={passed ? 100 : 0} className="mt-3" />
  );
}
