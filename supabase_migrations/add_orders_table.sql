-- Run this once in Supabase → SQL Editor.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  amount numeric not null,
  reference text unique not null,
  status text not null default 'pending', -- pending | paid | failed
  created_at timestamptz default now()
);
