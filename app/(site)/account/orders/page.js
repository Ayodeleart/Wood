import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ShopShell from "@/components/ecommerce/ShopShell";

export const revalidate = 0;

export default async function OrderHistoryPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/account/login?next=/account/orders");

  const admin = supabaseAdmin();
  const { data: orders } = await admin
    .from("orders")
    .select("reference, amount, status, created_at, products(name)")
    .eq("customer_email", user.email)
    .order("created_at", { ascending: false });

  // Group by reference — a cart checkout creates one order row per item sharing one reference.
  const grouped = {};
  for (const o of orders || []) {
    if (!grouped[o.reference]) grouped[o.reference] = { ...o, items: [], total: 0 };
    grouped[o.reference].items.push(o.products?.name || "Item");
    grouped[o.reference].total += Number(o.amount || 0);
  }
  const list = Object.values(grouped);

  return (
    <ShopShell className="pt-24 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-8">Order History</h1>

      {list.length === 0 ? (
        <p className="text-shop-mute">No orders yet — anything you buy will show up here.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((o) => (
            <div key={o.reference} className="border border-shop-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-shop-text text-sm">{o.items.join(", ")}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    o.status === "paid" ? "bg-green-100 text-green-700" : "bg-shop-tile text-shop-mute"
                  }`}
                >
                  {o.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-shop-mute text-xs">
                <span>{new Date(o.created_at).toLocaleDateString()}</span>
                <span>₦{o.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ShopShell>
  );
}
