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
      <section className="relative h-[80vh] w-full flex items-center justify-center bg-smoke">
        <p className="text-mute label">Add hero slides from the admin panel</p>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-paper">
      {/* Big background wordmark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span className="font-display font-semibold text-ink/90 text-[22vw] leading-none whitespace-nowrap">
          {slide.wordmark || "OLAWOOD"}
        </span>
      </div>

      {/* Product photo in front of the wordmark */}
      {slide.image && (
        <div key={slide.image} className="absolute inset-0 flex items-center justify-center animate-[heroFade_0.8s_ease-out]">
          <div className="relative w-[70%] md:w-[42%] aspect-square">
            <Image src={slide.image} alt={slide.title || "Featured product"} fill className="object-contain drop-shadow-2xl" priority />
          </div>
        </div>
      )}

      {/* Promo banner, bottom-left */}
      {(slide.promo_text || slide.cta_label) && (
        <div className="absolute left-6 md:left-14 bottom-10 md:bottom-14 bg-paper/95 backdrop-blur px-6 py-5 max-w-xs shadow-lg">
          {slide.promo_text && <p className="text-ink text-sm mb-3">{slide.promo_text}</p>}
          {slide.cta_label && slide.cta_href && (
            <Link href={slide.cta_href} className="label bg-ink text-paper px-5 py-2.5 inline-block">
              {slide.cta_label}
            </Link>
          )}
        </div>
      )}

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 md:right-14 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === i ? "w-6 bg-ink" : "w-1.5 bg-ink/30"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
