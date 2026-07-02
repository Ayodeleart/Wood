import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_54c95966ab7ffb91aead4a6f3ee8c5b8438049d0";

  const sb = supabaseAdmin();

  const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const paystackData = await paystackRes.json();

  const paid = paystackRes.ok && paystackData.status && paystackData.data?.status === "success";

  const { data: order } = await sb
    .from("orders")
    .update({ status: paid ? "paid" : "failed" })
    .eq("reference", reference)
    .select("*, products(name)")
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found for this reference." }, { status: 404 });
  }

  return NextResponse.json({
    paid,
    order: {
      product_name: order.products?.name,
      amount: order.amount,
      customer_name: order.customer_name,
      reference: order.reference,
    },
  });
}
