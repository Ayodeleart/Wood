"use client";

import Image from "next/image";

// SS1-style hero: one wide, calm photo banner with a headline sitting over it —
// not a dark split panel. The photo is the room, the text is minimal.
export default function Hero({ frames }) {
  const heroImage = frames?.[0]?.image;

  return (
    <section className="relative w-full h-[62vh] md:h-[78vh] overflow-hidden bg-smoke">
      {heroImage && (
        <Image src={heroImage} alt="Ola Wood" fill priority className="object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/5" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display font-medium text-paper text-[clamp(32px,6vw,58px)] leading-[1.1] drop-shadow-sm">
          Global Designs,
          <br />
          Local Comfort
        </h1>
      </div>
    </section>
  );
}
