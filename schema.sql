create extension if not exists "pgcrypto";

create table if not exists public.screams (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(trim(nickname)) between 2 and 20),
  score integer not null check (score >= 0 and score <= 100),
  duration numeric not null check (duration >= 0),
  scream_type text not null,
  caption text,
  gif_url text,
  created_at timestamp with time zone not null default now()
);

alter table public.screams enable row level security;

drop policy if exists "public can insert scream scores" on public.screams;
create policy "public can insert scream scores"
on public.screams
for insert
to anon
with check (
  char_length(trim(nickname)) between 2 and 20
  and score >= 0
  and score <= 100
  and duration >= 0
);

drop policy if exists "public can read scream leaderboard" on public.screams;
create policy "public can read scream leaderboard"
on public.screams
for select
to anon
using (true);
