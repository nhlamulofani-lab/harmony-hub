create table if not exists public.lesson_notes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  instrument_slug text not null, level text not null check (level in ('beginner','intermediate','advanced')),
  module_id text not null, content text not null default '', updated_at timestamptz not null default now(),
  unique(user_id, instrument_slug, level, module_id)
);
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  instrument_slug text not null, level text not null check (level in ('beginner','intermediate','advanced')),
  module_id text not null, score integer not null check (score between 0 and 100), answers jsonb not null default '{}'::jsonb,
  attempt_number integer not null default 1 check (attempt_number > 0), created_at timestamptz not null default now()
);
create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  instrument_slug text not null, duration_minutes integer not null check (duration_minutes between 1 and 1440),
  practiced_on date not null default current_date, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.practice_goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  weekly_minutes integer not null default 120 check (weekly_minutes between 1 and 10080),
  monthly_minutes integer not null default 480 check (monthly_minutes between 1 and 44640), updated_at timestamptz not null default now()
);
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  instrument_slug text not null, level text, certificate_type text not null check (certificate_type in ('level','course')),
  awarded_at timestamptz not null default now(),
  unique(user_id, instrument_slug, level, certificate_type),
  check ((certificate_type = 'level' and level in ('beginner','intermediate','advanced')) or (certificate_type = 'course' and level is null))
);

create index if not exists quiz_attempts_user_lesson_idx on public.quiz_attempts(user_id, instrument_slug, level, module_id);
create index if not exists practice_sessions_user_date_idx on public.practice_sessions(user_id, practiced_on desc);
create index if not exists certificates_user_idx on public.certificates(user_id);

alter table public.lesson_notes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.practice_goals enable row level security;
alter table public.certificates enable row level security;

create policy "Users manage own lesson notes" on public.lesson_notes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own quiz attempts" on public.quiz_attempts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own practice sessions" on public.practice_sessions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own practice goals" on public.practice_goals for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own certificates" on public.certificates for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.lesson_notes, public.quiz_attempts, public.practice_sessions, public.practice_goals, public.certificates to authenticated;
