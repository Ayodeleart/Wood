"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import ShopShell from "@/components/ecommerce/ShopShell";

export default function SavedPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/account/saved")
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/account/login?next=/account/saved";
          return null;
        }
        return r.json();
      })
      .then((d) => d && setItems(d.saved || []))
      .catch(() => setError("Couldn't load your saved items."));
  }, []);

  async function remove(productId) {
    setItems((list) => list.filter((s) => s.product_id !== productId));
    await fetch("/api/account/saved", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
  }

  return (
    <ShopShell className="pt-24 px-4">
      <h1 className="font-display text-3xl text-shop-text mb-8">Saved</h1>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {items === null && !error && <p className="text-shop-mute text-sm">Loading…</p>}

      {items?.length === 0 && (
        <div className="flex flex-col items-center text-center py-24">
          <Heart size={32} className="text-shop-mute mb-4" strokeWidth={1.4} />
          <p className="text-shop-mute">Nothing saved yet — tap the heart on any product to keep it here.</p>
        </div>
      )}

      {items?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map(({ product_id, products: p }) => {
            if (!p) return null;
            const img = p.product_images?.sort((a, b) => a.sort_order - b.sort_order)?.[0]?.url;
            return (
              <div key={product_id} className="flex flex-col">
                <Link href={`/products/${p.slug}`} className="block relative aspect-square bg-shop-tile rounded-2xl overflow-hidden">
                  {img && <Image src={img} alt={p.name} fill className="object-contain p-4" />}
                </Link>
                <div className="flex items-baseline justify-between pt-2">
                  <h3 className="text-shop-text text-sm truncate">{p.name}</h3>
                  <button onClick={() => remove(product_id)} className="text-shop-mute text-xs shrink-0 ml-2">
                    Remove
                  </button>
                </div>
                {p.price && <p className="text-shop-mute text-sm">₦{Number(p.price).toLocaleString()}</p>}
              </div>
            );
          })}
        </div>
      )}
    </ShopShell>
  );
}
