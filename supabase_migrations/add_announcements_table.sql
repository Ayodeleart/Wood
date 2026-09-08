-- Run this once in Supabase → SQL Editor.
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  url text,
  sent_count integer default 0,
  created_at timestamptz default now()
);
