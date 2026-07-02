"use client";

import Image from "next/image";
import Link from "next/link";
import { imageFitClass } from "@/lib/imageFit";
import { getProductDisplayImage } from "@/lib/getProductDisplayImage";
import { useTheme } from "@/lib/ThemeContext";

export default function FeaturedProducts({ products }) {
  const { night } = useTheme();
  if (!products?.length) return null;

  return (
    <section className="hidden md:block px-14 py-28 border-t border-line">
      <div className="flex items-end justify-between mb-14">
        <div>
          <span className="label text-mute">Featured</span>
          <h2 className="font-display font-semibold text-ink text-[clamp(28px,4vw,52px)] leading-[1.05] mt-2">
            Our Most Loved Pieces
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {products.map((p) => {
          const displayImage = getProductDisplayImage(p, night);
          return (
          <Link key={p.id} href={`/products/${p.slug}`} className="group flex flex-col">
            <div className="relative aspect-square bg-smoke overflow-hidden">
              {displayImage && (
                <Image
                  src={displayImage}
                  alt={p.name}
                  fill
                  className={`${imageFitClass(displayImage)} transition-transform duration-500 group-hover:scale-[1.04]`}
                />
              )}
            </div>
            <div className="pt-4 flex items-baseline justify-between">
              <div>
                <p className="text-xs text-mute mb-1">{p.categoryName}</p>
                <h3 className="text-ink text-sm leading-snug">{p.name}</h3>
              </div>
              {p.price && (
                <span className="text-sm text-mute shrink-0 ml-3">₦{Number(p.price).toLocaleString()}</span>
              )}
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
