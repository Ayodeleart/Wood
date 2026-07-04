import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { product_id, name, email, phone } = await req.json();

  if (!product_id || !name || !email) {
    return NextResponse.json({ error: "Name, email, and product are required." }, { status: 400 });
  }

  // Test-mode key, owned by the developer (not the brand) — hardcoded as a fallback
  // per explicit request, matching the same pattern already used in supabaseAdmin.js.
  // Replace with the brand's own live key in Vercel env vars when they're ready.
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Payment is not configured yet." }, { status: 500 });
  }

  const sb = supabaseAdmin();

  const { data: product, error: productError } = await sb
    .from("products")
    .select("id, name, price")
    .eq("id", product_id)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  if (!product.price) {
    return NextResponse.json({ error: "This product has no price set yet — contact us directly." }, { status: 400 });
  }

  const reference = `wood_${crypto.randomUUID().replace(/-/g, "")}`;

  const { error: orderError } = await sb.from("orders").insert({
    product_id: product.id,
    customer_name: name,
    customer_email: email,
    customer_phone: phone || null,
    amount: product.price,
    reference,
    status: "pending",
  });
  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const origin = req.headers.get("origin") || new URL(req.url).origin;

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(Number(product.price) * 100), // kobo
      reference,
      callback_url: `${origin}/checkout/success?reference=${reference}`,
      metadata: { product_id: product.id, product_name: product.name, customer_name: name, customer_phone: phone || "" },
    }),
  });

  const paystackData = await paystackRes.json();

  if (!paystackRes.ok || !paystackData.status) {
    await sb.from("orders").update({ status: "failed" }).eq("reference", reference);
    return NextResponse.json(
      { error: paystackData.message || "Could not start payment. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ authorization_url: paystackData.data.authorization_url });
}
