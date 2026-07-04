-- Run this in Supabase → SQL Editor.
--
-- Likely explanation for "I uploaded a hero photo but nothing shows on the
-- site": the admin upload uses the service-role key, which bypasses RLS
-- entirely, so the insert succeeds. But the live site reads with the PUBLIC
-- (anon) key, which is subject to RLS — if there's no SELECT policy allowing
-- anon reads on this table, Postgres doesn't error, it just silently returns
-- zero rows. No error anywhere, the row just never appears. This adds that
-- policy if it's missing (safe to run even if it already exists).

alter table shop_hero_slides enable row level security;

drop policy if exists "Public read access" on shop_hero_slides;
create policy "Public read access"
  on shop_hero_slides
  for select
  using (true);
