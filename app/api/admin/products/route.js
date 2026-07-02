import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .select("*, categories(name, slug), product_images(id, url, sort_order)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req) {
  const body = await req.json();
  const { name, category_id, price, description, images, night_image_url } = body;

  if (!name || !category_id) {
    return NextResponse.json({ error: "Name and category are required." }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;

  const { data: product, error: prodError } = await sb
    .from("products")
    .insert({
      name,
      slug,
      category_id,
      price: price || null,
      description: description || null,
      night_image_url: night_image_url || null,
    })
    .select()
    .single();

  if (prodError) return NextResponse.json({ error: prodError.message }, { status: 500 });

  if (Array.isArray(images) && images.length) {
    const rows = images.map((url, i) => ({ product_id: product.id, url, sort_order: i }));
    const { error: imgError } = await sb.from("product_images").insert(rows);
    if (imgError) return NextResponse.json({ error: imgError.message }, { status: 500 });
  }

  return NextResponse.json({ product });
}
