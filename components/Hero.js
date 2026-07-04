"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Scales text to exactly fill the available width — computed from a real
// measurement, not a guessed constant (a fixed vw guess is what made the
// wordmark render too small last round: guessing a font's character width
// without ever measuring the real, rendered text is inherently unreliable).
//
// Two things make this version actually robust where the last two attempts
// weren't:
// 1. It waits for the real webfont to finish loading (`document.fonts.ready`)
//    AND for a settled layout frame (double requestAnimationFrame) before
//    measuring, so it's never measuring fallback-font metrics by mistake.
// 2. It stays invisible until that measurement completes, then reveals at
//    the correct size in one step — instead of rendering at a wrong size
//    first and visibly resizing afterward (the "moving around" complaint).
function FitText({ text, className, refSize = 100 }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [scale, setScale] = useState(null);
  const [boxHeight, setBoxHeight] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fit() {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const container = containerRef.current;
      const el = textRef.current;
      if (!container || !el || cancelled) return;
      const containerWidth = container.getBoundingClientRect().width;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        const s = containerWidth / rect.width;
        setScale(s);
        // transform:scale() doesn't grow the element's own layout box, so
        // anything below it (Synergy) would sit at the wrong spot / get
        // overlapped by the now-larger visual text unless we explicitly
        // reserve the real, scaled-up height for the container.
        setBoxHeight(rect.height * s);
      }
    }
    fit();
    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", fit);
    };
  }, [text]);

  return (
    <div ref={containerRef} className="w-full" style={{ height: boxHeight ? `${boxHeight}px` : undefined }}>
      <span
        ref={textRef}
        style={{
          fontSize: `${refSize}px`,
          whiteSpace: "nowrap",
          display: "inline-block",
          transform: scale ? `scale(${scale})` : "none",
          transformOrigin: "top left",
          visibility: scale === null ? "hidden" : "visible",
        }}
        className={className}
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
      <div className="absolute top-[12%] md:top-[14%] left-0 right-0 z-0 px-3 md:px-6">
        <FitText
          text="OLAWOOD WORK"
          refSize={100}
          className="font-wordmark font-black text-ink tracking-tight leading-none"
        />
        <span className="block font-ui font-medium text-[5vw] md:text-[1.8vw] text-ink/30 tracking-[0.15em] mt-1 md:mt-2 pl-1 uppercase">
          Synergy
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
