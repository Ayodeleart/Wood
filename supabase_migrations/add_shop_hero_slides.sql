-- Run this once in Supabase → SQL Editor.
create table if not exists shop_hero_slides (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  wordmark text,
  title text,
  promo_text text,
  cta_label text,
  cta_href text,
  sort_order integer default 0,
  created_at timestamptz default now()
);
