"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// SS3-style hero: a large wordmark sits behind the product photo, the product
// (ideally a transparent-background cutout) visually breaks the text in front.
// Auto-advances through admin-uploaded promo slides.
export default function ShopHero({ slides = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative h-[70vh] w-full flex items-center justify-center bg-shop-surface">
        <p className="text-shop-mute label">Add hero slides from the admin panel</p>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section className="relative h-[52vh] md:h-[60vh] w-full overflow-hidden bg-shop-bg">
      {/* Big background wordmark — sized to actually fit "OLAWOOD" (7 characters)
          instead of the previous 22vw, which severely overflowed the screen on
          every device. Shares the exact same centered anchor as the product
          image below so they're guaranteed to overlap, not independently
          positioned and hoping they line up. */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="font-display font-semibold text-shop-text/90 leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(2.5rem, 13vw, 7.5rem)" }}
        >
          {slide.wordmark || "OLAWOOD"}
        </span>
      </div>

      {/* Product photo — same centered anchor, higher z-index so it visually
          breaks through the wordmark in front of it */}
      {slide.image && (
        <div key={slide.image} className="absolute inset-0 z-10 flex items-center justify-center animate-[heroFade_0.8s_ease-out]">
          <div className="relative w-[88%] md:w-[58%] aspect-square">
            <Image src={slide.image} alt={slide.title || "Featured product"} fill className="object-contain drop-shadow-2xl" priority />
          </div>
        </div>
      )}

      {/* Promo banner, bottom-left */}
      {(slide.promo_text || slide.cta_label) && (
        <div className="absolute z-20 left-4 bottom-6 bg-shop-surface/95 backdrop-blur px-5 py-4 max-w-xs shadow-lg rounded-2xl">
          {slide.promo_text && <p className="text-shop-text text-sm mb-3">{slide.promo_text}</p>}
          {slide.cta_label && slide.cta_href && (
            <Link href={slide.cta_href} className="label bg-shop-text text-shop-bg px-5 py-2.5 inline-block rounded-full">
              {slide.cta_label}
            </Link>
          )}
        </div>
      )}

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute z-20 bottom-6 right-4 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === i ? "w-6 bg-shop-text" : "w-1.5 bg-shop-text/30"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
