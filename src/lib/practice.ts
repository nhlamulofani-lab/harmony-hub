export type PracticeSession = {
  id: string;
  user_id: string;
  instrument_slug: string;
  level: string;
  lesson_id: string | null;
  minutes: number;
  session_date: string; // YYYY-MM-DD
  created_at: string;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  instrument_slug: string;
  level: string;
  lesson_id: string;
  score_pct: number;
  passed: boolean;
  created_at: string;
};

/** ISO YYYY-MM-DD in UTC. */
export function toDateKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Count consecutive days ending today (inclusive) that have at least one practice session. */
export function computeStreak(sessions: PracticeSession[]): number {
  if (!sessions.length) return 0;
  const set = new Set(sessions.map((s) => s.session_date));
  let streak = 0;
  const d = new Date();
  // Loop back day by day
  for (let i = 0; i < 365; i++) {
    const key = toDateKey(d);
    if (set.has(key)) {
      streak++;
      d.setUTCDate(d.getUTCDate() - 1);
    } else if (i === 0) {
      // Missed today — check yesterday to be lenient
      d.setUTCDate(d.getUTCDate() - 1);
      const yKey = toDateKey(d);
      if (set.has(yKey)) {
        streak++;
        d.setUTCDate(d.getUTCDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return streak;
}

export function minutesInLastNDays(sessions: PracticeSession[], n: number): number {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - (n - 1));
  const cutoffKey = toDateKey(cutoff);
  return sessions
    .filter((s) => s.session_date >= cutoffKey)
    .reduce((sum, s) => sum + s.minutes, 0);
}

/** Group minutes per day for the last N days including today, oldest first. */
export function weeklyActivity(sessions: PracticeSession[], days: number = 7): { date: string; label: string; minutes: number }[] {
  const out: { date: string; label: string; minutes: number }[] = [];
  const map = new Map<string, number>();
  for (const s of sessions) map.set(s.session_date, (map.get(s.session_date) ?? 0) + s.minutes);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = toDateKey(d);
    const label = d.toLocaleDateString(undefined, { weekday: "short" });
    out.push({ date: key, label, minutes: map.get(key) ?? 0 });
  }
  return out;
}
