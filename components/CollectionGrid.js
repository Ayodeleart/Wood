"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageFitClass } from "@/lib/imageFit";
import { getProductDisplayImage } from "@/lib/getProductDisplayImage";
import CatalogButton from "@/components/CatalogButton";
import FavoriteButton from "@/components/ecommerce/FavoriteButton";
import { Star } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function CollectionGrid({ category, products, forceContain }) {
  const { night: globalNight } = useTheme();
  const [isNight, setIsNight] = useState(globalNight);
  const userTouched = useRef(false);

  // Follow the global preference until the user manually flips this page's own toggle —
  // after that, this page is independent and won't be overwritten by the global setting.
  useEffect(() => {
    if (!userTouched.current) setIsNight(globalNight);
  }, [globalNight]);

  function handleToggle() {
    userTouched.current = true;
    setIsNight((v) => !v);
  }
  const hasAnyNightImage = products.some((p) => p.night_image_url);

  return (
    <div className="shop-dark min-h-screen transition-colors duration-700">
      <div className="px-4 md:px-14 pt-32 pb-24">
        <span className="label text-shop-mute">{category.tagline}</span>
        <h1 className="font-display font-semibold text-shop-text text-[clamp(36px,7vw,96px)] leading-[0.9] mt-3 mb-8">
          {category.name}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mb-14">
          {products.length > 0 && <CatalogButton categorySlug={category.slug} categoryName={category.name} />}

          {hasAnyNightImage && (
            <button
              type="button"
              onClick={handleToggle}
              className="flex items-center gap-3 px-4 py-2 rounded-full border border-shop-line bg-shop-surface text-shop-text transition-colors duration-500"
            >
              <span className="label text-xs">Day</span>
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-500 ${
                  isNight ? "bg-amber-400/80" : "bg-shop-line"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-500 ${
                    isNight ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="label text-xs">Night</span>
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <p className="text-shop-mute">No products in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((p) => {
              const src = getProductDisplayImage(p, isNight);
              return (
                <Link key={p.id} href={`/products/${p.slug}`} className="group flex flex-col active:scale-[0.97] transition-transform duration-150">
                  <div className="relative aspect-square bg-shop-tile rounded-2xl overflow-hidden">
                    {src && (
                      <Image
                        src={src}
                        alt={p.name}
                        fill
                        className={`${forceContain ? "object-contain p-4" : imageFitClass(src)} transition-transform duration-500 group-hover:scale-[1.04]`}
                      />
                    )}
                    <FavoriteButton productId={p.id} className="absolute top-2 right-2" />
                  </div>
                  <div className="pt-3 flex items-baseline justify-between">
                    <h3 className="font-display text-base md:text-lg text-shop-text">{p.name}</h3>
                    <div className="flex items-center gap-2">
                      {p.rating && (
                        <span className="flex items-center gap-1 text-xs text-shop-mute">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          {Number(p.rating).toFixed(1)}
                        </span>
                      )}
                      {p.price && (
                        <span className="text-sm text-shop-mute">₦{Number(p.price).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
