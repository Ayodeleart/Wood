"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({ productId, className = "" }) {
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/account/saved")
      .then((r) => (r.ok ? r.json() : { saved: [] }))
      .then((d) => {
        setSaved((d.saved || []).some((s) => s.product_id === productId));
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [productId]);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    const next = !saved;
    setSaved(next); // optimistic
    try {
      const res = await fetch("/api/account/saved", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.status === 401) {
        window.location.href = "/account/login";
        return;
      }
      if (!res.ok) setSaved(!next); // revert on failure
    } catch {
      setSaved(!next);
    } finally {
      setLoading(false);
    }
  }

  if (!checked) return <div className={`w-9 h-9 ${className}`} />;

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from saved" : "Save"}
      className={`flex items-center justify-center w-9 h-9 rounded-full bg-shop-bg/70 backdrop-blur transition-transform active:scale-90 ${className}`}
    >
      <Heart size={18} className={saved ? "fill-red-500 text-red-500" : "text-shop-text"} strokeWidth={1.6} />
    </button>
  );
}
