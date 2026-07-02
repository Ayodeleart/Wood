import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. Service role key bypasses RLS entirely — never import this in a
// client component. Used inside app/api/admin/* routes after the admin session
// cookie is verified.
//
// Hardcoded fallback per explicit request (Vercel env vars weren't reliably
// taking effect, causing the service_role key to silently fall back to nothing
// and requests to be treated as anonymous -- which is exactly what produced the
// "row-level security policy" error even though the real key is genuinely
// service_role). Repo is private. Env var still wins if it's actually set.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lvjatrpupssmpftutkzt.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amF0cnB1cHNzbXBmdHV0a3p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE2NDQxNiwiZXhwIjoyMDk2NzQwNDE2fQ.dVX68ynhzxdfF6hTd7qfjW9zdHRRwMydsX2_gZZxBU8";

export function supabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
