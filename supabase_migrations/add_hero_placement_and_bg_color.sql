-- Run this once in Supabase → SQL Editor.
-- Extends the existing shop_hero_slides table so it can serve BOTH the landing
-- page hero and the e-commerce hero from one admin screen, instead of building
-- a second parallel system. Existing rows default to placement='shop' so the
-- current e-commerce hero keeps working exactly as before.

alter table shop_hero_slides
  add column if not exists placement text not null default 'shop'
  check (placement in ('landing', 'shop'));

alter table shop_hero_slides
  add column if not exists bg_color text;
-- bg_color: a soft hex color (e.g. #eef3f8) shown behind the product photo on
-- the landing hero — pick something that complements that specific photo
-- (e.g. a pale blue behind a blue sofa) rather than one fixed background for everything.
