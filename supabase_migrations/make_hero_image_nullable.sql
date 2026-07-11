-- Run this once in Supabase → SQL Editor.
-- A hero slide can now legitimately have only a desktop image, only a mobile
-- image, or both — they must never fall back to each other.
alter table shop_hero_slides alter column image drop not null;
