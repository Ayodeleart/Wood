"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton({ product, image, fullWidth = false }) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({ product_id: product.id, name: product.name, price: product.price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`label bg-shop-text text-shop-bg px-6 py-3.5 rounded-full hover:opacity-90 active:scale-[0.97] transition-all ${
        fullWidth ? "w-full text-center" : "mt-4 w-fit"
      }`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
