-- Run this in Supabase → SQL Editor.
-- Adds a separate mobile image so landing hero slides can be pre-designed
-- flat images (brand name baked in) with different crops/compositions for
-- desktop vs mobile, instead of one live-composited image + CSS text overlay.

alter table shop_hero_slides
  add column if not exists image_mobile text;
-- If left empty, the site falls back to using the main `image` column on
-- mobile too — so this is optional per slide.
