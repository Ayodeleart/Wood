-- Run this once in Supabase → SQL Editor, then come back here.
ALTER TABLE products ADD COLUMN IF NOT EXISTS night_image_url text;
