import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  const admin = supabaseAdmin();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "octopusfur-media";

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `avatars/${user.id}-${Date.now()}.jpg`;

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: true });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrlData } = admin.storage.from(bucket).getPublicUrl(path);
  const avatarUrl = publicUrlData.publicUrl;

  const { data: current } = await admin.auth.admin.getUserById(user.id);
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...current?.user?.user_metadata, avatar_url: avatarUrl },
  });
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ url: avatarUrl });
}
