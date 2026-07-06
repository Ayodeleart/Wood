"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { getCart, removeFromCart, setQuantity } from "@/lib/cart";
import ShopShell from "@/components/ecommerce/ShopShell";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(getCart());
    const onUpdate = () => setCart(getCart());
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  const total = cart?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  async function checkout(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment.");
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (cart === null) {
    return <ShopShell className="pt-6 px-4" />;
  }

  return (
    <ShopShell className="pt-6 px-4">
      <h1 className="font-display text-3xl text-shop-text mb-8">Cart</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center text-center py-24">
          <ShoppingBag size={32} className="text-shop-mute mb-4" strokeWidth={1.4} />
          <p className="text-shop-mute mb-6">Your cart is empty.</p>
          <Link href="/#collections" className="label border border-shop-text px-6 py-3 rounded-full text-shop-text">
            Browse Collections
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-10">
            {cart.map((item) => (
              <div key={item.product_id} className="flex gap-4 items-center border-b border-shop-line pb-4">
                <div className="relative w-20 h-20 bg-shop-tile rounded-xl overflow-hidden shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-2" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-shop-text text-sm truncate">{item.name}</h3>
                  <p className="text-shop-mute text-sm">₦{Number(item.price).toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center border border-shop-line rounded-full text-shop-text"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-shop-text text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-shop-line rounded-full text-shop-text"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.product_id)} className="text-shop-mute shrink-0">
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="text-shop-text font-medium">Total</span>
            <span className="text-shop-text text-xl font-medium">₦{total.toLocaleString()}</span>
          </div>

          <form onSubmit={checkout} className="flex flex-col gap-3">
            <input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-shop-surface border border-shop-line text-shop-text px-4 py-3 rounded-lg outline-none focus:border-shop-text"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="bg-shop-surface border border-shop-line text-shop-text px-4 py-3 rounded-lg outline-none focus:border-shop-text"
            />
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="bg-shop-surface border border-shop-line text-shop-text px-4 py-3 rounded-lg outline-none focus:border-shop-text"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="label bg-shop-text text-shop-bg py-4 rounded-full mt-2 disabled:opacity-50"
            >
              {loading ? "Redirecting…" : `Checkout · ₦${total.toLocaleString()}`}
            </button>
          </form>
        </>
      )}
    </ShopShell>
  );
}
