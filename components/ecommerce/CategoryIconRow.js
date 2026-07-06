"use client";

import Link from "next/link";
import { Table2, ChefHat, Lamp, Archive, Flower2, MoreHorizontal, BedDouble, Tv } from "lucide-react";
import SofaIcon from "@/components/ecommerce/icons/SofaIcon";

// Only "Sofa" uses your exact provided SVG right now. The rest are lucide-react
// placeholders picked to loosely match, not from the same icon set, so they
// won't be pixel-consistent with the Sofa icon's style. Swap the entries below
// with real SVGs from the same source for full visual consistency.
const CATEGORY_ICON_MAP = {
  sofas: SofaIcon,
  "bed-frames": BedDouble,
  "tv-consoles": Tv,
  kitchen: ChefHat,
  tables: Table2,
  lamps: Lamp,
  cupboards: Archive,
  vases: Flower2,
};

export default function CategoryIconRow({ categories = [] }) {
  if (!categories.length) return null;

  const items = categories.slice(0, 7);

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-y-5 gap-x-2">
        {items.map((cat) => {
          const Icon = CATEGORY_ICON_MAP[cat.slug] || MoreHorizontal;
          return (
            <Link key={cat.slug} href={"/collections/" + cat.slug} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <div className="w-14 h-14 rounded-full bg-shop-surface flex items-center justify-center text-shop-text">
                <Icon size={22} strokeWidth={1.6} />
              </div>
              <span className="text-shop-mute text-xs text-center truncate w-full">{cat.name}</span>
            </Link>
          );
        })}
        <Link href="/collections" className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-14 h-14 rounded-full bg-shop-surface flex items-center justify-center text-shop-text">
            <MoreHorizontal size={22} strokeWidth={1.6} />
          </div>
          <span className="text-shop-mute text-xs text-center">Others</span>
        </Link>
      </div>
    </div>
  );
}
