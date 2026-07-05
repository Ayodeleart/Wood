"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero({ slides = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[68vh] md:h-[88vh] overflow-hidden bg-smoke flex items-center justify-center">
        <p className="text-mute text-sm">Upload a landing hero image in Admin → Hero Slides.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[68vh] md:h-[88vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Desktop image — falls back to the mobile image if no desktop image was uploaded */}
          <Image
            src={slide.image || slide.image_mobile}
            alt="Olawood Work"
            fill
            priority={i === 0}
            className="object-cover hidden md:block"
          />
          {/* Mobile image — falls back to the desktop image if no mobile image was uploaded */}
          <Image
            src={slide.image_mobile || slide.image}
            alt="Olawood Work"
            fill
            priority={i === 0}
            className="object-cover md:hidden"
          />
        </div>
      ))}

      {/* Bottom caption bar stays as a real, clickable overlay regardless of
          what's baked into the image */}
      <div className="absolute z-20 bottom-0 left-0 right-0 flex items-end justify-between gap-6 px-6 md:px-14 pb-8 md:pb-10">
        <p className="text-ink text-sm md:text-base leading-snug max-w-xs drop-shadow-sm">
          Furniture designed around how you actually live.
        </p>
        <a
          href="#collections"
          className="shrink-0 label border border-ink bg-paper/80 backdrop-blur px-6 py-3 text-ink hover:bg-ink hover:text-paper transition-colors duration-300 whitespace-nowrap"
        >
          Explore Collections
        </a>
      </div>
    </section>
  );
}
