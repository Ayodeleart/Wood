"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

function TileImage({ frames, name, delayOffset }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (frames.length <= 1 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), 3800);
    return () => clearInterval(id);
  }, [frames.length, paused]);

  return (
    <div
      className="relative aspect-[4/3] bg-smoke overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {frames.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={name}
          fill
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out group-hover:scale-[1.04] ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: i === index ? `${delayOffset}ms` : "0ms" }}
        />
      ))}
    </div>
  );
}

export default function CategoryTiles({ categories }) {
  if (!categories?.length) return null;

  return (
    <section id="collections" className="px-6 md:px-14 py-20 md:py-28 border-t border-line scroll-mt-[var(--nav-h,72px)]">
      <span className="label text-mute">Explore Our Collections</span>
      <h2 className="font-display font-medium text-ink text-[clamp(28px,4vw,44px)] leading-[1.1] mt-3 mb-14">
        Crafted For Every Space
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {categories.slice(0, 6).map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 90}>
            <Link href={`/collections/${cat.slug}`} className="group flex flex-col">
              <TileImage frames={cat.tileFrames?.length ? cat.tileFrames : cat.heroImages} name={cat.name} delayOffset={i * 120} />
              <h3 className="label text-ink mt-3">{cat.name}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
