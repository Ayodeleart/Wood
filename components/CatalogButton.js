"use client";

import { useState } from "react";

export default function CatalogButton({ categorySlug, categoryName }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/catalog?category=${categorySlug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate catalog.");
      const message = `Hi! Here's our ${categoryName} catalog from Ola Wood: ${data.url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={send}
        disabled={loading}
        className="label border-b border-shop-text/30 pb-2 hover:border-shop-text text-shop-text transition-colors disabled:opacity-50"
      >
        {loading ? "Preparing catalog…" : "Send This Catalog via WhatsApp"}
      </button>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}
