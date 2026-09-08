import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) {
      const dest = new URL(next, origin);
      dest.searchParams.set("welcome", "1");
      return NextResponse.redirect(dest.toString());
    }
  }

  return NextResponse.redirect(`${origin}/account/login?error=auth`);
}
