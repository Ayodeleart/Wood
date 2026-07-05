-- Run in Supabase -> SQL Editor.
alter table shop_hero_slides drop constraint if exists shop_hero_slides_placement_check;
alter table shop_hero_slides
  add constraint shop_hero_slides_placement_check
  check (placement in ('landing', 'shop', 'intro'));
