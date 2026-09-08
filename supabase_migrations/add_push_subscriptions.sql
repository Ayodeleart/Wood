-- Run this once in Supabase → SQL Editor.
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

create index if not exists push_subscriptions_user_id_idx on push_subscriptions(user_id);
