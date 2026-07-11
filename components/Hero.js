"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDeviceType } from "@/lib/useDeviceType";

// Desktop and mobile are fully independent rotations — a slide only enters
// the desktop carousel if it has a desktop image, only enters the mobile
// carousel if it has a mobile image. No fallback between them.
//
// Which one shows is decided by actual device type (mouse+hover vs touch),
// not raw viewport width — a phone rotated to landscape can easily exceed
// 768px wide but is still a phone, and showing it a desktop-shaped photo
// forced into a short landscape strip is what caused the "zoomed in" crop.
function ViewportCarousel({ slides, field }) {
  const eligible = slides.filter((s) => s[field]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (eligible.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % eligible.length), 6500);
    return () => clearInterval(id);
  }, [eligible.length]);

  if (eligible.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {eligible.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={slide[field]} alt="Olawood Work" fill priority={i === 0} className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function Hero({ slides = [] }) {
  const isDesktop = useDeviceType();
  const hasAny = slides.some((s) => s.image || s.image_mobile);

  if (!hasAny) {
    return (
      <section className="relative w-full h-[68vh] md:h-[88vh] overflow-hidden bg-smoke flex items-center justify-center">
        <p className="text-mute text-sm">Upload a landing hero image in Admin → Hero Slides.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[68vh] md:h-[88vh] overflow-hidden bg-smoke">
      {/* isDesktop is null on first paint (before the browser confirms pointer
          type) — render nothing rather than guessing, to avoid a flash of the
          wrong carousel. It resolves within a frame or two. */}
      {isDesktop === true && <ViewportCarousel slides={slides} field="image" />}
      {isDesktop === false && <ViewportCarousel slides={slides} field="image_mobile" />}

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
