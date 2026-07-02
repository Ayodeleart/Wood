import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lvjatrpupssmpftutkzt.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amF0cnB1cHNzbXBmdHV0a3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjQ0MTYsImV4cCI6MjA5Njc0MDQxNn0.K_GyXeT1R54M7FFCQgIUx1dPaG2g8vtIzJy0pNeI3kM";

// Server-side Supabase client that reads/writes the auth session via cookies —
// used in Server Components and Route Handlers to know who's logged in.
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component that can't set cookies — safe to ignore,
          // middleware/route handlers cover the actual session refresh.
        }
      },
    },
  });
}
