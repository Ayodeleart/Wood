import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { product_id, items, name, email, phone } = await req.json();

  // Two shapes: a single product_id (existing product-page "Buy Now" flow),
  // or an `items` array of { product_id, quantity } from the cart page.
  const cartItems = items?.length ? items : product_id ? [{ product_id, quantity: 1 }] : null;

  if (!cartItems || !name || !email) {
    return NextResponse.json({ error: "Name, email, and at least one item are required." }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Payment is not configured yet." }, { status: 500 });
  }

  const sb = supabaseAdmin();

  const ids = cartItems.map((i) => i.product_id);
  const { data: products, error: productError } = await sb
    .from("products")
    .select("id, name, price")
    .in("id", ids);

  if (productError || !products?.length) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  let total = 0;
  const orderRows = [];
  for (const item of cartItems) {
    const product = byId[item.product_id];
    if (!product || !product.price) {
      return NextResponse.json({ error: `"${product?.name || "One item"}" has no price set — contact us directly.` }, { status: 400 });
    }
    const qty = Math.max(1, Number(item.quantity) || 1);
    const lineTotal = Number(product.price) * qty;
    total += lineTotal;
    orderRows.push({ product_id: product.id, amount: lineTotal, quantity: qty });
  }

  const reference = `wood_${crypto.randomUUID().replace(/-/g, "")}`;

  const { error: orderError } = await sb.from("orders").insert(
    orderRows.map((row) => ({
      product_id: row.product_id,
      customer_name: name,
      customer_email: email,
      customer_phone: phone || null,
      amount: row.amount,
      reference,
      status: "pending",
    }))
  );
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
      amount: Math.round(total * 100), // kobo
      reference,
      callback_url: `${origin}/checkout/success?reference=${reference}`,
      metadata: {
        product_ids: orderRows.map((r) => r.product_id),
        customer_name: name,
        customer_phone: phone || "",
      },
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
