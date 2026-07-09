"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { openPaystackPopup } from "@/lib/paystack";

export default function BuyButton({ productId, price, fullWidth = false }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill from the logged-in profile so returning customers never have to
  // retype their own name/email/phone at checkout.
  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setForm((f) => ({
        name: f.name || user.user_metadata?.full_name || "",
        email: f.email || user.email || "",
        phone: f.phone || user.user_metadata?.phone || "",
      }));
    });
  }, []);

  if (!price) return null;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, type: "inquiry" }),
      keepalive: true,
    }).catch(() => {});
    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment.");

      openPaystackPopup({
        email: form.email,
        amount: data.amount,
        reference: data.reference,
        onSuccess: async (reference) => {
          await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference }),
          });
          router.push(`/checkout/success?reference=${reference}`);
        },
        onClose: () => setLoading(false),
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`label bg-shop-text text-shop-bg px-6 py-3.5 rounded-full hover:opacity-90 active:scale-[0.97] transition-all ${
          fullWidth ? "w-full text-center" : "mt-4 w-fit"
        }`}
      >
        {fullWidth ? "Add to Cart" : "Buy Now"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 px-0 md:px-6" onClick={() => setOpen(false)}>
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/80 backdrop-blur-2xl border border-white/40 p-8 max-w-sm w-full rounded-t-3xl md:rounded-3xl"
          >
            <h2 className="font-display text-2xl text-shop-text mb-1">Complete Your Order</h2>
            <p className="text-sm text-shop-mute mb-6">₦{Number(price).toLocaleString()} · Secure payment via Paystack</p>

            <label className="label text-shop-mute block mb-1">Full Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-white/60 border border-shop-line text-shop-text px-3 py-2.5 mb-4 outline-none focus:border-shop-text rounded-lg"
            />

            <label className="label text-shop-mute block mb-1">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-white/60 border border-shop-line text-shop-text px-3 py-2.5 mb-4 outline-none focus:border-shop-text rounded-lg"
            />

            <label className="label text-shop-mute block mb-1">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full bg-white/60 border border-shop-line text-shop-text px-3 py-2.5 mb-4 outline-none focus:border-shop-text rounded-lg"
            />

            {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={loading} className="label bg-shop-text text-shop-bg px-6 py-3 rounded-full disabled:opacity-50">
                {loading ? "Opening payment…" : "Continue to Payment"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="label text-shop-mute px-6 py-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
