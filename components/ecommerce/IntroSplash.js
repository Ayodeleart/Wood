"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sofa, ArrowRight } from "lucide-react";
import { useIsInstalledPWA } from "@/lib/useIsInstalledPWA";

export default function IntroSplash({ slides = [] }) {
  const installed = useIsInstalledPWA();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || slides.length === 0) return;
    const alreadyShown = sessionStorage.getItem("introShown");
    if (!alreadyShown) setDismissed(false);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || dismissed) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length, dismissed]);

  function dismiss() {
    sessionStorage.setItem("introShown", "1");
    setDismissed(true);
  }

  function openSofas() {
    dismiss();
    router.push("/collections/sofas");
  }

  function explore() {
    dismiss();
    router.push("/");
  }

  if (!installed || dismissed || slides.length === 0) return null;

  const slide = slides[index];

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {slides.map((s, i) => (
        <div key={s.id} className={i === index ? "absolute inset-0 transition-opacity duration-1000 opacity-100" : "absolute inset-0 transition-opacity duration-1000 opacity-0"}>
          <Image src={s.image} alt={s.wordmark || "Introduction"} fill priority={i === 0} className="object-cover" />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/70 to-transparent backdrop-blur-[2px]" />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 pt-16">
        <h1 className="font-display font-bold text-white text-4xl leading-[1.05] mb-3">
          {slide.wordmark || "Live in Comfort"}
        </h1>
        {slide.promo_text && <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xs">{slide.promo_text}</p>}

        <div className="flex items-center gap-3">
          <button
            onClick={openSofas}
            aria-label="Browse sofas"
            className="w-14 h-14 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shrink-0"
          >
            <Sofa size={22} className="text-white" strokeWidth={1.6} />
          </button>
          <button
            onClick={explore}
            className="flex-1 h-14 rounded-full bg-white text-black flex items-center justify-center gap-2 label"
          >
            {slide.cta_label || "Get Started"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
