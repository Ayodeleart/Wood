"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import SofaIcon from "@/components/ecommerce/icons/SofaIcon";
import ChairIcon from "@/components/ecommerce/icons/ChairIcon";
import KitchenIcon from "@/components/ecommerce/icons/KitchenIcon";
import WardrobeIcon from "@/components/ecommerce/icons/WardrobeIcon";
import VaseIcon from "@/components/ecommerce/icons/VaseIcon";
import LampIcon from "@/components/ecommerce/icons/LampIcon";
import CurtainIcon from "@/components/ecommerce/icons/CurtainIcon";

const KEYWORD_ICONS = [
  { keywords: ["sofa", "couch", "seating"], Icon: SofaIcon },
  { keywords: ["chair"], Icon: ChairIcon },
  { keywords: ["kitchen", "cabinet"], Icon: KitchenIcon },
  { keywords: ["wardrobe", "closet"], Icon: WardrobeIcon },
  { keywords: ["vase"], Icon: VaseIcon },
  { keywords: ["lamp", "light"], Icon: LampIcon },
  { keywords: ["curtain"], Icon: CurtainIcon },
];

function iconFor(category) {
  const haystack = (category.slug + " " + category.name).toLowerCase();
  const match = KEYWORD_ICONS.find((k) => k.keywords.some((kw) => haystack.includes(kw)));
  return match ? match.Icon : MoreHorizontal;
}

export default function CategoryIconRow({ categories = [] }) {
  if (!categories.length) return null;

  const items = categories.slice(0, 7);

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-y-5 gap-x-2">
        {items.map((cat) => {
          const Icon = iconFor(cat);
          return (
            <Link key={cat.slug} href={"/collections/" + cat.slug} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <div className="w-14 h-14 rounded-full bg-shop-surface flex items-center justify-center text-shop-text">
                <Icon size={22} />
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
