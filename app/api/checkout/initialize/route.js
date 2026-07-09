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

  // Inline Paystack popup (client-side, using the public key) instead of the
  // redirect flow — the redirect was navigating to Paystack's own domain,
  // which on some PWA setups hands off to the system browser entirely
  // instead of staying inside the installed app. The popup stays in-app.
  return NextResponse.json({
    reference,
    amount: Math.round(total * 100), // kobo
    email,
  });
}
