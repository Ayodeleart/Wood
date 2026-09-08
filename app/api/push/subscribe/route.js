import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const sub = await req.json().catch(() => null);
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 400 });
  }

  // Best-effort — a subscription isn't tied to being signed in, so don't
  // fail the request just because there's no user.
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  const admin = supabaseAdmin();
  const { error } = await admin.from("push_subscriptions").upsert(
    {
      user_id: user?.id || null,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
