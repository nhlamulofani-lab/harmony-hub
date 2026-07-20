import { supabase } from "@/integrations/supabase/client";
import type { Level } from "@/lib/site-data";

export async function saveLessonNote(userId: string, instrumentSlug: string, level: Level, moduleId: string, content: string) {
  const { error } = await supabase.from("lesson_notes").upsert({ user_id: userId, instrument_slug: instrumentSlug, level, module_id: moduleId, content, updated_at: new Date().toISOString() }, { onConflict: "user_id,instrument_slug,level,module_id" });
  if (error) throw error;
}

export async function saveQuizAttempt(userId: string, instrumentSlug: string, level: Level, moduleId: string, score: number, answers: Record<string, unknown>, attemptNumber: number) {
  const { error } = await supabase.from("quiz_attempts").insert({ user_id: userId, instrument_slug: instrumentSlug, level, module_id: moduleId, score, answers, attempt_number: attemptNumber });
  if (error) throw error;
}

export async function logPractice(userId: string, instrumentSlug: string, durationMinutes: number, practicedOn: string, notes?: string) {
  const { error } = await supabase.from("practice_sessions").insert({ user_id: userId, instrument_slug: instrumentSlug, duration_minutes: durationMinutes, practiced_on: practicedOn, notes: notes || null });
  if (error) throw error;
}

export function calculateStreak(dates: string[]) {
  const days = new Set(dates);
  const cursor = new Date();
  let streak = 0;
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
