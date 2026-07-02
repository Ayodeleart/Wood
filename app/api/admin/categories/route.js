import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("categories")
    .select("*, category_images(id, url, sort_order)")
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data });
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req) {
  const { name, tagline } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required." }, { status: 400 });

  const sb = supabaseAdmin();
  const { data: existing } = await sb.from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const nextSort = (existing?.[0]?.sort_order ?? 0) + 1;

  const { data, error } = await sb
    .from("categories")
    .insert({ name, slug: slugify(name), tagline: tagline || null, sort_order: nextSort })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}
