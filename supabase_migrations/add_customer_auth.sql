-- Run this once in Supabase → SQL Editor.
create table if not exists customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

alter table customer_profiles enable row level security;

create policy "Users can view own profile"
  on customer_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on customer_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on customer_profiles for insert
  with check (auth.uid() = id);
