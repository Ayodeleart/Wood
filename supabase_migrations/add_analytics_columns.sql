-- Run this once in Supabase → SQL Editor.
ALTER TABLE products ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS inquiry_count integer NOT NULL DEFAULT 0;
