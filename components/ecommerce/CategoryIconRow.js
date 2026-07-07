"use client";

import Link from "next/link";
import { MoreHorizontal, BedDouble, Tv } from "lucide-react";
import SofaIcon from "@/components/ecommerce/icons/SofaIcon";
import ChairIcon from "@/components/ecommerce/icons/ChairIcon";
import KitchenIcon from "@/components/ecommerce/icons/KitchenIcon";
import WardrobeIcon from "@/components/ecommerce/icons/WardrobeIcon";
import VaseIcon from "@/components/ecommerce/icons/VaseIcon";
import LampIcon from "@/components/ecommerce/icons/LampIcon";
import CurtainIcon from "@/components/ecommerce/icons/CurtainIcon";
import PaintingIcon from "@/components/ecommerce/icons/PaintingIcon";
import ArchitecturalIcon from "@/components/ecommerce/icons/ArchitecturalIcon";
import ElectricalIcon from "@/components/ecommerce/icons/ElectricalIcon";
import InteriorDesignIcon from "@/components/ecommerce/icons/InteriorDesignIcon";

// Real provided SVGs first. Bed Frames and TV Consoles never had a matching
// SVG from you, so they fall back to lucide placeholders (same as before) —
// not removed, just not yet upgraded. Categories with no entry here at all
// (and no lucide fallback) show "..." (MoreHorizontal) until they have one.
const KEYWORD_ICONS = [
  { keywords: ["sofa", "couch", "seating"], Icon: SofaIcon },
  { keywords: ["chair"], Icon: ChairIcon },
  { keywords: ["kitchen", "cabinet"], Icon: KitchenIcon },
  { keywords: ["wardrobe", "closet"], Icon: WardrobeIcon },
  { keywords: ["vase"], Icon: VaseIcon },
  { keywords: ["lamp", "light"], Icon: LampIcon },
  { keywords: ["curtain"], Icon: CurtainIcon },
  { keywords: ["paint", "finish"], Icon: PaintingIcon },
  { keywords: ["architect"], Icon: ArchitecturalIcon },
  { keywords: ["electric", "plumb"], Icon: ElectricalIcon },
  { keywords: ["interior", "decor"], Icon: InteriorDesignIcon },
  { keywords: ["bed", "frame"], Icon: BedDouble },
  { keywords: ["tv", "console"], Icon: Tv },
];

// Categories excluded from this row entirely (not just shown with dots) —
// currently just POP Ceiling, per explicit request, since it's not just
// missing an icon, it shouldn't be featured here at all right now.
const EXCLUDED_KEYWORDS = ["pop"];

function iconFor(category) {
  const haystack = (category.slug + " " + category.name).toLowerCase();
  const match = KEYWORD_ICONS.find((k) => k.keywords.some((kw) => haystack.includes(kw)));
  return match ? match.Icon : MoreHorizontal;
}

export default function CategoryIconRow({ categories = [] }) {
  const visible = categories.filter((cat) => {
    const haystack = (cat.slug + " " + cat.name).toLowerCase();
    return !EXCLUDED_KEYWORDS.some((kw) => haystack.includes(kw));
  });

  if (!visible.length) return null;

  const items = visible.slice(0, 7);

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-y-5 gap-x-2">
        {items.map((cat) => {
          const Icon = iconFor(cat);
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
