import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. Service role key bypasses RLS entirely — never import this in a
// client component. Used inside app/api/admin/* routes after the admin session
// cookie is verified.
//
// Hardcoded directly, no env var fallback chain. Previously this deferred to
// process.env.SUPABASE_SERVICE_ROLE_KEY first — but if Vercel has ANY value
// set there (even a wrong one, like the anon key pasted into the wrong slot),
// it silently wins over the correct key below, and every admin insert fails
// with "violates row-level security policy" because the request gets treated
// as anonymous. Repo is private, so hardcoding here removes that failure mode
// entirely instead of hoping the Vercel dashboard is configured correctly.
const SUPABASE_URL = "https://lvjatrpupssmpftutkzt.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amF0cnB1cHNzbXBmdHV0a3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE2NDQxNiwiZXhwIjoyMDk2NzQwNDE2fQ.dVX68ynhzxdfF6hTd7qfjW9zdHRRwMydsX2_gZZxBU8";

export function supabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
