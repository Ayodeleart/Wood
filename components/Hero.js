"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Scales "Olawood Work" to fill the available width edge-to-edge on any
// screen size. Re-measures on mount, on resize, AND once the wordmark's own
// web font finishes loading — skipping that last part was the actual bug
// last round: the very first measurement happened while the browser was
// still rendering with a fallback system font, so the fit was calculated
// against the wrong letterforms and never corrected itself afterward.
function FitText({ text, className, baseSize = 100 }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(baseSize * 0.4);

  useEffect(() => {
    function fit() {
      const container = containerRef.current;
      const el = textRef.current;
      if (!container || !el) return;
      el.style.fontSize = `${baseSize}px`;
      const naturalWidth = el.getBoundingClientRect().width;
      const availableWidth = container.getBoundingClientRect().width;
      if (naturalWidth > 0) setFontSize((availableWidth / naturalWidth) * baseSize);
    }
    fit();
    window.addEventListener("resize", fit);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }
    return () => window.removeEventListener("resize", fit);
  }, [text, baseSize]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <span
        ref={textRef}
        style={{ fontSize: `${fontSize}px`, whiteSpace: "nowrap" }}
        className={`inline-block ${className}`}
      >
        {text}
      </span>
    </div>
  );
}

const DEFAULT_BG = "#eef3f8";

export default function Hero({ slides = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[index];
  const bg = current?.bg_color || DEFAULT_BG;

  return (
    <section
      className="relative w-full h-[68vh] md:h-[88vh] overflow-hidden transition-colors duration-[1600ms] ease-in-out"
      style={{ backgroundColor: bg }}
    >
      {/* Wordmark layer — sits toward the top, BEHIND the product photo */}
      <div className="absolute top-[12%] md:top-[14%] left-0 right-0 z-0 px-4 md:px-10">
        <FitText
          text="Olawood Work"
          baseSize={140}
          className="font-wordmark font-black text-ink tracking-tight leading-none"
        />
        {/* Synergy sits directly under the wordmark, not off on its own */}
        <span className="block font-ui font-medium text-[5vw] md:text-[1.8vw] text-ink/30 tracking-[0.15em] mt-1 md:mt-2 pl-1">
          SYNERGY
        </span>
      </div>

      {/* Product photo layer — overlaps the lower portion of the wordmark, same
          coordinate space, crossfading only, no slide motion, no dots */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pb-24 md:pb-28 pointer-events-none">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 flex items-end justify-center pb-24 md:pb-28 transition-opacity duration-[1400ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-[68%] h-[58%] md:w-[36%] md:h-[68%]">
              <Image src={slide.image} alt="Featured piece" fill priority={i === 0} className="object-contain drop-shadow-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom caption bar */}
      <div className="absolute z-20 bottom-0 left-0 right-0 flex items-end justify-between gap-6 px-6 md:px-14 pb-8 md:pb-10">
        <p className="text-ink text-sm md:text-base leading-snug max-w-xs">
          Furniture designed around how you actually live.
        </p>
        <a
          href="#collections"
          className="shrink-0 label border border-ink px-6 py-3 text-ink hover:bg-ink hover:text-paper transition-colors duration-300 whitespace-nowrap"
        >
          Explore Collections
        </a>
      </div>
    </section>
  );
}
