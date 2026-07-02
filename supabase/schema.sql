-- Run this in the Supabase SQL editor once, on a fresh project.

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  hero_image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_id uuid references categories(id) on delete cascade,
  price numeric,
  description text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table category_images (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index on category_images (category_id);

-- Public read access (storefront), writes only via service role (admin API routes)
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read product_images" on product_images for select using (true);

alter table category_images enable row level security;
create policy "Public read category_images" on category_images for select using (true);
create policy "Allow insert category_images" on category_images for insert with check (true);
create policy "Allow update category_images" on category_images for update using (true) with check (true);
create policy "Allow delete category_images" on category_images for delete using (true);

-- Seed starting categories — edit/add more from the admin later.
-- Covers the full scope of the business (architecture/construction/interior design),
-- not just the furniture lines. Photos under a service category work the same way as
-- product photos — they're just past project shots instead of catalog items.
insert into categories (slug, name, tagline, sort_order) values
  ('architectural-design', 'Architectural Design', 'From concept to blueprint.', 1),
  ('building-construction', 'Building Construction', 'From foundation to finishing.', 2),
  ('interior-design', 'Interior Design & Decoration', 'Beautiful spaces, tailored to you.', 3),
  ('project-management', 'Project Management', 'Concept to completion, handled.', 4),
  ('sofas', 'Sofas', 'Eleganza e relax, in ogni angolo della casa.', 5),
  ('bed-frames', 'Bed Frames', 'Rest, built to last.', 6),
  ('tv-consoles', 'TV Consoles', 'The centerpiece of the room.', 7),
  ('kitchen-cabinets', 'Kitchen Cabinets', 'Where the home gathers.', 8),
  ('wardrobes-closets', 'Wardrobes & Closets', 'Storage, designed in.', 9),
  ('pop-ceiling-wall-panel', 'POP Ceiling & Wall Panel', 'Detail from floor to ceiling.', 10),
  ('electrical-plumbing', 'Electrical & Plumbing Works', 'Built right, built to last.', 11),
  ('painting-finishing', 'Painting & Finishing', 'The final layer of craft.', 12),
  ('renovation-remodeling', 'Renovation & Remodeling', 'New life for old spaces.', 13);

-- Storage bucket for product photos — you're already using "octopusfur-media",
-- set as SUPABASE_STORAGE_BUCKET in your env vars. Just make sure it's public.

-- IMPORTANT: a public bucket only grants *read* access. Uploads (insert/update/
-- delete) still need their own RLS policies on storage.objects, same as the
-- tables above. Run this too, once, after creating the bucket:

create policy "Allow public read media" on storage.objects
  for select using (bucket_id = 'octopusfur-media');

create policy "Allow upload media" on storage.objects
  for insert with check (bucket_id = 'octopusfur-media');

create policy "Allow update media" on storage.objects
  for update using (bucket_id = 'octopusfur-media');

create policy "Allow delete media" on storage.objects
  for delete using (bucket_id = 'octopusfur-media');
