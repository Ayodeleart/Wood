"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Scales "Olawood Work" to fill the available width edge-to-edge on any
// screen size, measured directly rather than guessed with fixed vw values —
// so it holds up whether the brand text is short or long.
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
      className="relative w-full h-[68vh] md:h-[88vh] overflow-hidden flex flex-col transition-colors duration-[1600ms] ease-in-out"
      style={{ backgroundColor: bg }}
    >
      {/* Wordmark, positioned toward the top rather than centered */}
      <div className="relative z-10 px-4 md:px-10 pt-24 md:pt-28">
        <FitText
          text="Olawood Work"
          baseSize={140}
          className="font-wordmark font-black text-ink tracking-tight leading-none"
        />
        <div className="w-full flex justify-end pr-2 md:pr-6">
          <span className="font-ui font-medium text-[6vw] md:text-[2.4vw] text-ink/30 tracking-wide -mt-1 md:-mt-2">
            Synergy
          </span>
        </div>
      </div>

      {/* Product photo, crossfading only — no slide motion, no dots */}
      <div className="relative flex-1">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 flex items-end justify-center pb-4 transition-opacity duration-[1400ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-[70%] h-[90%] md:w-[38%] md:h-[95%]">
              <Image src={slide.image} alt="Featured piece" fill priority={i === 0} className="object-contain drop-shadow-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom caption bar */}
      <div className="relative z-20 flex items-end justify-between gap-6 px-6 md:px-14 pb-8 md:pb-10">
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
