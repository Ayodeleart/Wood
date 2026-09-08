"use client";

import Image from "next/image";
import Link from "next/link";
import { imageFitClass } from "@/lib/imageFit";
import { getProductDisplayImage } from "@/lib/getProductDisplayImage";
import { useTheme } from "@/lib/ThemeContext";
import Reveal from "@/components/Reveal";

export default function FeaturedProducts({ products, dark = false }) {
  const { night } = useTheme();
  if (!products?.length) return null;

  return (
    <section className={`px-6 md:px-14 py-16 md:py-28 border-t ${dark ? "border-shop-line" : "border-line"}`}>
      <div className="flex items-end justify-between mb-8 md:mb-14">
        <div>
          <span className={`label ${dark ? "text-shop-mute" : "text-mute"}`}>Featured</span>
          <h2 className={`font-display font-semibold text-[clamp(24px,4vw,52px)] leading-[1.05] mt-2 ${dark ? "text-shop-text" : "text-ink"}`}>
            Our Most Loved Pieces
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p, i) => {
          const displayImage = getProductDisplayImage(p, night);
          return (
          <Reveal key={p.id} delay={i * 90}>
          <Link href={`/products/${p.slug}`} className="group flex flex-col">
            <div className={`relative aspect-square overflow-hidden ${dark ? "bg-shop-tile rounded-2xl" : "bg-smoke"}`}>
              {displayImage && (
                <Image
                  src={displayImage}
                  alt={p.name}
                  fill
                  className={`${imageFitClass(displayImage)} transition-transform duration-500 group-hover:scale-[1.04] ${dark ? "p-4" : ""}`}
                />
              )}
            </div>
            <div className="pt-4 flex items-baseline justify-between">
              <div>
                <p className={`text-xs mb-1 ${dark ? "text-shop-mute" : "text-mute"}`}>{p.categoryName}</p>
                <h3 className={`text-sm leading-snug ${dark ? "text-shop-text" : "text-ink"}`}>{p.name}</h3>
              </div>
              {p.price && (
                <span className={`text-sm shrink-0 ml-3 ${dark ? "text-shop-mute" : "text-mute"}`}>₦{Number(p.price).toLocaleString()}</span>
              )}
            </div>
          </Link>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}
