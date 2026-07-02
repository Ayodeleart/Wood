import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(req, { params }) {
  const { id } = await params;
  const { name, tagline, hero_image } = await req.json();

  const sb = supabaseAdmin();
  const { error } = await sb
    .from("categories")
    .update({
      ...(name !== undefined && { name }),
      ...(tagline !== undefined && { tagline }),
      ...(hero_image !== undefined && { hero_image }),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
