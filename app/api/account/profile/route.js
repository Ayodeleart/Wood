import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(req) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { full_name, phone, email, notification_prefs } = await req.json();
  const admin = supabaseAdmin();

  if (full_name !== undefined || phone !== undefined || notification_prefs !== undefined) {
    const { data: current } = await admin.auth.admin.getUserById(user.id);
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...current?.user?.user_metadata,
        ...(full_name !== undefined ? { full_name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(notification_prefs !== undefined ? { notification_prefs } : {}),
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Email goes through the user's own session so Supabase's normal
  // confirm-the-new-address flow applies — not silently swapped by an admin call.
  if (email && email !== user.email) {
    const { error } = await sb.auth.updateUser({ email });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, emailChangePending: true });
  }

  return NextResponse.json({ ok: true });
}
