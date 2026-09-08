import { headers } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

// Use in Server Components that need the full user object (email,
// user_metadata) for an already-authenticated route. Middleware verified
// the session for this exact request via a network call; this just reads
// the resulting session locally (no second network round-trip).
export async function getVerifiedUser() {
  const h = await headers();
  if (!h.get("x-verified-user-id")) return null;

  const sb = await supabaseServer();
  const {
    data: { session },
  } = await sb.auth.getSession();
  return session?.user || null;
}
