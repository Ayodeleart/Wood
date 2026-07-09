import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { data, error } = await sb
    .from("saved_products")
    .select("product_id, products(id, slug, name, price, product_images(url, sort_order))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recommendations so the page is never a dead end when nothing's saved yet —
  // just the most-viewed products, excluding anything already saved.
  const savedIds = (data || []).map((s) => s.product_id);
  let recQuery = sb
    .from("products")
    .select("id, slug, name, price, product_images(url, sort_order)")
    .order("view_count", { ascending: false })
    .limit(8);
  if (savedIds.length) recQuery = recQuery.not("id", "in", `(${savedIds.join(",")})`);
  const { data: recommendations } = await recQuery;

  return NextResponse.json({ saved: data || [], recommendations: recommendations || [] });
}

export async function POST(req) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { product_id } = await req.json();
  const { error } = await sb.from("saved_products").insert({ user_id: user.id, product_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { product_id } = await req.json();
  const { error } = await sb.from("saved_products").delete().eq("user_id", user.id).eq("product_id", product_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
