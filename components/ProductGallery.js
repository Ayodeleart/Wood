"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { imageFitClass } from "@/lib/imageFit";
import { useTheme } from "@/lib/ThemeContext";

export default function ProductGallery({ images, name, nightImage, forceContain }) {
  const { night: globalNight } = useTheme();
  const [active, setActive] = useState(0);
  const [isNight, setIsNight] = useState(globalNight);
  const userTouched = useRef(false);

  // Follow the global day/night setting until the user manually flips this
  // gallery's own toggle -- same pattern as the collection grid page.
  useEffect(() => {
    if (!userTouched.current) setIsNight(globalNight);
  }, [globalNight]);

  function handleToggle() {
    userTouched.current = true;
    setIsNight((v) => !v);
  }

  if (!images.length) {
    return <div className="aspect-square bg-smoke flex items-center justify-center text-mute">No photos yet</div>;
  }

  const showingNight = isNight && !!nightImage;
  const mainSrc = showingNight ? nightImage : images[active];

  return (
    <div>
      <div
        className={`relative aspect-square overflow-hidden transition-colors duration-700 ${
          showingNight ? "bg-[#0c1024]" : "bg-smoke"
        }`}
      >
        {showingNight && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-amber-300/15 blur-3xl" />
          </div>
        )}
        <Image
          key={mainSrc}
          src={mainSrc}
          alt={name}
          fill
          className={`${forceContain ? "object-contain" : imageFitClass(mainSrc)} transition-opacity duration-700`}
          priority
        />
      </div>

      {nightImage && (
        <button
          type="button"
          onClick={handleToggle}
          className={`mt-4 flex items-center gap-3 px-4 py-2 border transition-colors duration-500 ${
            showingNight ? "bg-[#0c1024] border-[#0c1024] text-white" : "bg-paper border-line text-ink"
          }`}
        >
          <span className="label text-xs">See it by day</span>
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-500 ${
              showingNight ? "bg-amber-400/80" : "bg-line"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-500 ${
                showingNight ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
          <span className="label text-xs">See it by night</span>
        </button>
      )}

      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {images.slice(0, 8).map((url, i) => {
            const isLastVisible = i === 7 && images.length > 8;
            return (
              <button
                key={url + i}
                onClick={() => {
                  setActive(i);
                  userTouched.current = true;
                  setIsNight(false);
                }}
                className={`relative shrink-0 w-16 h-16 bg-smoke overflow-hidden border transition-colors ${
                  active === i && !showingNight ? "border-ink" : "border-line"
                }`}
              >
                <Image src={url} alt={`${name} angle ${i + 1}`} fill className="object-cover" />
                {isLastVisible && (
                  <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                    <span className="text-paper text-xs font-medium">+{images.length - 8}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
