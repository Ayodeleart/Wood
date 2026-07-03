"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero({ frames }) {
  const [index, setIndex] = useState(0);
  const list = frames?.length ? frames : [];

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(id);
  }, [list.length]);

  const current = list[index];

  return (
    <section className="relative w-full h-[72vh] md:h-[92vh] overflow-hidden bg-paper flex flex-col">
      {/* Top bar: small brand label + slide indicators */}
      <div className="relative z-20 flex items-center justify-between px-6 md:px-14 pt-24 md:pt-28">
        <span className="label text-mute">Handcrafted · Lagos</span>
        {list.length > 1 && (
          <div className="flex items-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-6 bg-ink" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Giant wordmark, sitting behind the product photo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4">
        <span className="font-wordmark font-bold text-ink leading-none tracking-tight text-[22vw] md:text-[16vw] whitespace-nowrap">
          olawood
        </span>
      </div>

      {/* Product photo overlapping the wordmark, crossfading between category frames */}
      <div className="relative flex-1 flex items-center justify-center px-6">
        {list.map((frame, i) => (
          <div
            key={frame.image}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[1400ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-[78%] h-[68%] md:w-[52%] md:h-[74%]">
              <Image src={frame.image} alt={frame.name} fill priority={i === 0} className="object-contain drop-shadow-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom caption bar */}
      <div className="relative z-20 flex items-end justify-between gap-6 px-6 md:px-14 pb-8 md:pb-10">
        <div className="max-w-xs">
          <p className="text-ink text-sm md:text-base leading-snug">
            {current?.tagline || "Furniture designed as objects for contemporary spaces."}
          </p>
        </div>
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
