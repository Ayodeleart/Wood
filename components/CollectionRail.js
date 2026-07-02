"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageFitClass } from "@/lib/imageFit";
import { getProductDisplayImage } from "@/lib/getProductDisplayImage";
import { useTheme } from "@/lib/ThemeContext";

const GAP_PX = 24; // matches gap-6

export default function CollectionRail({ category, products }) {
  const { night } = useTheme();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollBudget, setScrollBudget] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cardPitch, setCardPitch] = useState(0);
  const snapTimeout = useRef(null);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      setScrollBudget(Math.max(trackWidth - viewportWidth, 0));
      const firstCard = trackRef.current.children[0];
      if (firstCard) setCardPitch(firstCard.getBoundingClientRect().width + GAP_PX);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [products.length]);

  useEffect(() => {
    let raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const section = sectionRef.current;
        if (!section || scrollBudget <= 0) return;
        const rect = section.getBoundingClientRect();
        const raw = -rect.top / scrollBudget;
        setProgress(Math.min(Math.max(raw, 0), 1));
      });

      clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(() => {
        const section = sectionRef.current;
        if (!section || scrollBudget <= 0 || cardPitch <= 0) return;
        const rect = section.getBoundingClientRect();
        const currentDistance = Math.min(Math.max(-rect.top, 0), scrollBudget);
        if (currentDistance <= 0 || currentDistance >= scrollBudget) return;

        const nearestIndex = Math.round(currentDistance / cardPitch);
        const targetDistance = Math.min(nearestIndex * cardPitch, scrollBudget);
        const delta = targetDistance - currentDistance;
        if (Math.abs(delta) > 1) {
          window.scrollTo({ top: window.scrollY + delta, behavior: "smooth" });
        }
      }, 140);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(snapTimeout.current);
    };
  }, [scrollBudget, cardPitch]);

  const sectionHeight = scrollBudget > 0
    ? `calc(100vh + ${scrollBudget}px)`
    : "auto";

  return (
    <section ref={sectionRef} style={{ height: sectionHeight }} className="relative bg-paper">
      <div className={`${scrollBudget > 0 ? "sticky top-0 h-screen" : ""} overflow-hidden flex flex-col`}>
        <div className="px-6 md:px-14 pt-20 pb-8 shrink-0 flex items-baseline justify-between gap-4">
          <div>
            <span className="label text-mute">{category.tagline}</span>
            <h2 className="font-display font-semibold text-ink text-[clamp(36px,6vw,72px)] leading-[0.92] mt-2">
              {category.name}
            </h2>
          </div>
          <span
            className={`label text-mute whitespace-nowrap transition-opacity duration-500 hidden sm:inline ${
              progress < 0.04 ? "opacity-100" : "opacity-0"
            }`}
          >
            Scroll to explore →
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="absolute top-0 left-0 h-full flex items-center gap-6 px-6 md:px-14 will-change-transform"
            style={{ transform: `translateX(-${progress * scrollBudget}px)` }}
          >
            {products.map((p) => {
              const displayImage = getProductDisplayImage(p, night);
              return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group shrink-0 w-[280px] md:w-[340px] flex flex-col"
              >
                <div className="relative aspect-[4/5] bg-smoke overflow-hidden">
                  {displayImage && (
                    <Image
                      src={displayImage}
                      alt={p.name}
                      fill
                      className={`${category.slug === "sofas" ? "object-contain" : imageFitClass(displayImage)} transition-transform duration-500 group-hover:scale-[1.04]`}
                    />
                  )}
                </div>
                <div className="pt-4 flex items-baseline justify-between">
                  <h3 className="font-display text-lg text-ink">{p.name}</h3>
                  {p.price && (
                    <span className="text-sm text-mute">
                      ₦{Number(p.price).toLocaleString()}
                    </span>
                  )}
                </div>
              </Link>
              );
            })}

            <Link
              href={`/collections/${category.slug}`}
              className="group shrink-0 w-[280px] md:w-[340px] aspect-[4/5] flex flex-col items-center justify-center bg-ink text-paper"
            >
              <span className="label">See Full Collection</span>
              <span className="font-display text-3xl mt-3 transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>

          <span
            className={`sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 label text-mute transition-opacity duration-500 ${
              progress < 0.04 ? "opacity-100" : "opacity-0"
            }`}
          >
            Swipe to explore →
          </span>
        </div>

        <div className="px-6 md:px-14 py-6 shrink-0">
          <div className="h-[2px] w-full bg-line relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-ink"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
