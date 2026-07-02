import { createClient } from "@supabase/supabase-js";

// Public client — anon key, RLS-protected (read-only on the storefront).
// Hardcoded fallback for the same reason as supabaseAdmin.js: Vercel env vars
// weren't reliably taking effect. The anon key is safe to expose either way —
// it ships in the browser bundle regardless of env var vs hardcoded. Env var
// still wins if it's actually set.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lvjatrpupssmpftutkzt.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amF0cnB1cHNzbXBmdHV0a3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjQ0MTYsImV4cCI6MjA5Njc0MDQxNn0.K_GyXeT1R54M7FFCQgIUx1dPaG2g8vtIzJy0pNeI3kM";

export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
