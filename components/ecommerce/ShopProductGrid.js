"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageFitClass } from "@/lib/imageFit";
import { getProductDisplayImage } from "@/lib/getProductDisplayImage";
import { useTheme } from "@/lib/ThemeContext";

function ProductCard({ product, night, index }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const displayImage = getProductDisplayImage(product, night);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={`/products/${product.slug}`}
      className="group block active:scale-[0.97] transition-transform duration-150"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        transition: `opacity 420ms cubic-bezier(0.22,1,0.36,1) ${(index % 6) * 60}ms, transform 420ms cubic-bezier(0.22,1,0.36,1) ${(index % 6) * 60}ms`,
      }}
    >
      <div className="relative aspect-square bg-shop-surface rounded-2xl overflow-hidden">
        {displayImage && (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className={`${imageFitClass(displayImage)} transition-transform duration-500 group-hover:scale-[1.05] p-4`}
          />
        )}
      </div>
      <div className="pt-3 px-0.5">
        <h3 className="text-shop-text text-sm leading-snug truncate">{product.name}</h3>
        {product.price && (
          <p className="text-shop-mute text-sm mt-0.5">₦{Number(product.price).toLocaleString()}</p>
        )}
      </div>
    </Link>
  );
}

export default function ShopProductGrid({ category, products }) {
  const { night } = useTheme();
  if (!products?.length) return null;

  return (
    <section id={`cat-${category.slug}`} className="px-4 pt-8 pb-2 scroll-mt-[calc(var(--nav-h,72px)+var(--subnav-h,52px))]">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-shop-text text-lg font-medium">{category.name}</h2>
        <Link href={`/collections/${category.slug}`} className="text-shop-mute text-xs">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.slice(0, 8).map((p, i) => (
          <ProductCard key={p.id} product={p} night={night} index={i} />
        ))}
      </div>
    </section>
  );
}
