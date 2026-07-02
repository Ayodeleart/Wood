# Ola Wood

Real furniture catalog site. Next.js + Supabase (database, storage, the actual backend) + remove.bg
(automatic white-background product photos). No localStorage tricks — every product, image, and
admin action lives in a real database, visible to every visitor, from any device.

## 1. Create the backend (Supabase — free tier is enough to start)

1. Go to supabase.com → New Project. Pick any name/region, set a database password (save it
   somewhere, you won't need it day-to-day but you'll need it if you ever connect directly to Postgres).
2. Once the project is ready: **SQL Editor** → paste the entire contents of `supabase/schema.sql` →
   Run. This creates the categories/products/images tables, sets read permissions, and seeds your
   four starting categories (Sofas, Bed Frames, TV Consoles, Kitchen Cabinets) — edit/add more later
   from the admin panel.
3. **Storage** → Create a new bucket named exactly `products` → toggle **Public bucket** on.
   This is where every processed (white-background) product photo lands.
4. **Project Settings → API** — copy three values, you'll need them in step 3 below:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (treat this one like a master password —
     it bypasses all security rules. It's only ever used inside server-side admin API routes, never
     sent to the browser.)

## 2. Get a remove.bg API key

Go to remove.bg/api → sign up → dashboard → copy your API key. Free tier gives a limited number of
full-resolution images per month; paid tiers are cheap per image. This key powers the "upload a
photo, get it back on a white background" step in the admin panel.

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in every value:

```
NEXT_PUBLIC_SUPABASE_URL=          # from step 1.4
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # from step 1.4
SUPABASE_SERVICE_ROLE_KEY=         # from step 1.4 — keep secret
REMOVE_BG_API_KEY=                 # from step 2
ADMIN_USERNAME=                    # plain username, not an email
ADMIN_PASSWORD=                    # pick a real password, not "admin123"
ADMIN_SESSION_SECRET=              # generate with the command below
```

Generate the session secret:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Run it locally

```
npm install
npm run dev
```

Visit `localhost:3000`. It'll show "Collection Coming" until you add your first product — that's
correct, not a bug. Go to `localhost:3000/admin`, log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`,
add a category if you need a new one, then add a product with at least 8 photos from different
angles. Each photo gets background-removed and flattened onto white automatically on upload.

## 5. Deploy (Vercel)

1. Push this repo to GitHub (already done if you're reading this from there).
2. vercel.com → New Project → import the repo.
3. In the project's **Settings → Environment Variables**, paste in every value from your
   `.env.local` (same six keys + the four Supabase ones — ten total).
4. Deploy. Every product you add from `/admin` on the live site is now visible to every visitor,
   on every device, immediately — because it's a real database now, not your browser's local storage.

## How the storefront is built

- **Hero**: logo shows alone first, then auto-cycles through your categories (pulled live from
  the database — add a category with products and it joins the rotation automatically).
- **Collection rails**: each category gets a horizontal rail of up to 8 products. Scrolling the
  page vertically drives the rail horizontally until it reaches the last card ("See Full
  Collection"), then normal vertical scrolling resumes — this is a scroll-distance mapping, not a
  hijacked wheel event, so it works the same on trackpad, mouse wheel, and touch.
- **Product pages**: full multi-angle gallery, click any thumbnail to swap the main image.
- **Admin**: real login (server-checked, signed cookie — not a password sitting in readable
  JavaScript like the old build), category management, product CRUD, multi-photo upload with
  automatic background removal.

## Known follow-ups, not yet done

- The `/admin` login is a single hardcoded admin account via env vars — fine for one person running
  the business. If you ever need multiple admin users with different permissions, that's a real
  auth system (Supabase Auth) swap, not a small patch.
- No image optimization pipeline beyond Next.js's built-in `next/image` — for very large source
  photos, consider resizing before upload to keep the admin upload step fast.
