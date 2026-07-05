-- Run in Supabase → SQL Editor.
create table if not exists saved_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

alter table saved_products enable row level security;

drop policy if exists "Users manage their own saved products" on saved_products;
create policy "Users manage their own saved products"
  on saved_products
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: a real (non-fake) rating field, admin-settable per product.
-- Left null by default — the storefront only shows a rating when this is set,
-- never a made-up number.
alter table products add column if not exists rating numeric(2,1);
