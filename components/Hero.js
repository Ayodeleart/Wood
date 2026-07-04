"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Scales text to exactly fill the available width — computed from a real
// measurement, not a guessed constant.
//
// Reports its own final rendered geometry via onFit so the parent (Hero) can
// position the product photo relative to where the wordmark ACTUALLY ends up
// on screen, instead of guessing a percentage of the section's height. Two
// independent percentage guesses (wordmark position vs product position)
// is exactly what produced a good overlap on desktop and a large dead gap
// on mobile last round — they were never actually connected to each other.
function FitText({ text, className, refSize = 100, onFit }) {
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
      el.style.transform = "none";
      const containerWidth = container.getBoundingClientRect().width;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        const s = containerWidth / rect.width;
        setScale(s);
        setBoxHeight(rect.height * s);
        // Let the parent know a new size landed, one more frame after this
        // paints, so it can measure the real final position (not this one,
        // which is still mid-update).
        requestAnimationFrame(() => requestAnimationFrame(() => onFit?.()));
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
// How far up into the wordmark's own height the product starts overlapping —
// 0.4 means the product's top edge lands 40% of the way up from the
// wordmark block's bottom, tuned to roughly match the reference's overlap.
const OVERLAP_FRACTION = 0.4;

export default function Hero({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const [productTop, setProductTop] = useState(null);
  const sectionRef = useRef(null);
  const wordmarkWrapRef = useRef(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [slides.length]);

  function measureOverlap() {
    const section = sectionRef.current;
    const wrap = wordmarkWrapRef.current;
    if (!section || !wrap) return;
    const sectionRect = section.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const wrapHeight = wrapRect.height;
    const wrapBottom = wrapRect.bottom - sectionRect.top;
    setProductTop(wrapBottom - wrapHeight * OVERLAP_FRACTION);
  }

  useEffect(() => {
    window.addEventListener("resize", measureOverlap);
    return () => window.removeEventListener("resize", measureOverlap);
  }, []);

  const current = slides[index];
  const bg = current?.bg_color || DEFAULT_BG;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[68vh] md:h-[88vh] overflow-hidden transition-colors duration-[1600ms] ease-in-out"
      style={{ backgroundColor: bg }}
    >
      {/* Wordmark layer — sits toward the top, BEHIND the product photo */}
      <div ref={wordmarkWrapRef} className="absolute top-[12%] md:top-[14%] left-0 right-0 z-0 px-3 md:px-6">
        <FitText
          text="OLAWOOD WORK"
          refSize={100}
          className="font-wordmark font-black text-ink tracking-tight leading-none"
          onFit={measureOverlap}
        />
        <span className="block font-ui font-medium text-[5vw] md:text-[1.8vw] text-ink/30 tracking-[0.15em] mt-1 md:mt-2 pl-1 uppercase">
          Synergy
        </span>
      </div>

      {/* Product photo layer — positioned using the wordmark's REAL measured
          position (via measureOverlap), not a second independent percentage
          guess. Hidden until that measurement lands, so it never flashes at
          the wrong spot first. */}
      <div
        className="absolute left-0 right-0 z-10 flex items-start justify-center pointer-events-none"
        style={{
          top: productTop !== null ? `${productTop}px` : undefined,
          bottom: "16%",
          visibility: productTop === null ? "hidden" : "visible",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 flex items-start justify-center transition-opacity duration-[1400ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-[74%] h-[85%] md:w-[40%] md:h-[88%]">
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
