import { NextResponse } from "next/server";
import sharp from "sharp";
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

  // Whatever format actually comes off the device (iPhones often hand over HEIC
  // even from a plain "choose photo" picker) gets re-encoded to a real JPEG here
  // — the raw bytes were previously uploaded as-is under a hardcoded ".jpg" name,
  // so a HEIC file would get stored with a JPEG extension it isn't, and browsers
  // can't render it: exactly the broken-image icon that was showing up.
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const avatarBuffer = await sharp(inputBuffer)
    .rotate()
    .resize(512, 512, { fit: "cover" })
    .jpeg({ quality: 90 })
    .toBuffer();

  const path = `avatars/${user.id}-${Date.now()}.jpg`;

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(path, avatarBuffer, { contentType: "image/jpeg", upsert: true });
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
