
CREATE TABLE public.practice_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  instrument_slug text NOT NULL,
  level text NOT NULL,
  lesson_id text,
  minutes integer NOT NULL CHECK (minutes >= 0 AND minutes <= 600),
  session_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_sessions TO authenticated;
GRANT ALL ON public.practice_sessions TO service_role;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own practice select" ON public.practice_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own practice insert" ON public.practice_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own practice update" ON public.practice_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own practice delete" ON public.practice_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX practice_sessions_user_date_idx ON public.practice_sessions (user_id, session_date DESC);

CREATE TABLE public.quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  instrument_slug text NOT NULL,
  level text NOT NULL,
  lesson_id text NOT NULL,
  score_pct integer NOT NULL CHECK (score_pct >= 0 AND score_pct <= 100),
  passed boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quiz select" ON public.quiz_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own quiz insert" ON public.quiz_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own quiz update" ON public.quiz_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own quiz delete" ON public.quiz_attempts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX quiz_attempts_user_lesson_idx ON public.quiz_attempts (user_id, instrument_slug, level, lesson_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.practice_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_attempts;
