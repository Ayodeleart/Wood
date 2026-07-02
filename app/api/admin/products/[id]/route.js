import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { name, category_id, price, description, featured, images, night_image_url } = body;

  const sb = supabaseAdmin();

  const { error: updateError } = await sb
    .from("products")
    .update({
      ...(name !== undefined && { name }),
      ...(category_id !== undefined && { category_id }),
      ...(price !== undefined && { price }),
      ...(description !== undefined && { description }),
      ...(featured !== undefined && { featured }),
      ...(night_image_url !== undefined && { night_image_url: night_image_url || null }),
    })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  if (Array.isArray(images)) {
    // Replace the full image set for this product (simplest correct behavior for a reorder/add/remove UI)
    const { error: delError } = await sb.from("product_images").delete().eq("product_id", id);
    if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });

    if (images.length) {
      const rows = images.map((url, i) => ({ product_id: id, url, sort_order: i }));
      const { error: insError } = await sb.from("product_images").insert(rows);
      if (insError) return NextResponse.json({ error: insError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const sb = supabaseAdmin();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
