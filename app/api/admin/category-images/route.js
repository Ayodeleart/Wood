import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { category_id, url } = await req.json();
  if (!category_id || !url) {
    return NextResponse.json({ error: "category_id and url are required." }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data: existing } = await sb
    .from("category_images")
    .select("sort_order")
    .eq("category_id", category_id)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextSort = (existing?.[0]?.sort_order ?? -1) + 1;

  const { data, error } = await sb
    .from("category_images")
    .insert({ category_id, url, sort_order: nextSort })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ image: data });
}
