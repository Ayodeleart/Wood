import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { product_id, type } = await req.json();
  if (!product_id || !["view", "inquiry"].includes(type)) {
    return NextResponse.json({ error: "Invalid tracking request." }, { status: 400 });
  }

  const column = type === "view" ? "view_count" : "inquiry_count";
  const sb = supabaseAdmin();

  // Simple read-then-write increment — fine at this traffic scale; not built for
  // high-concurrency correctness, just an honest counter for the admin dashboard.
  const { data: current } = await sb.from("products").select(column).eq("id", product_id).single();
  if (!current) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await sb
    .from("products")
    .update({ [column]: (current[column] || 0) + 1 })
    .eq("id", product_id);

  return NextResponse.json({ ok: true });
}
