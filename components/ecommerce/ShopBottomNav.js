"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCart } from "@/lib/cart";
import NavHomeIcon from "@/components/ecommerce/icons/NavHomeIcon";
import NavCartIcon from "@/components/ecommerce/icons/NavCartIcon";
import NavHeartIcon from "@/components/ecommerce/icons/NavHeartIcon";
import NavProfileIcon from "@/components/ecommerce/icons/NavProfileIcon";

export default function ShopBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((n, i) => n + i.quantity, 0));
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  const TABS = [
    { href: "/", Icon: NavHomeIcon, label: "Home" },
    { href: "/cart", Icon: NavCartIcon, label: "Cart", badge: cartCount },
    { href: "/account/saved", Icon: NavHeartIcon, label: "Saved" },
    { href: "/account", Icon: NavProfileIcon, label: "Account" },
  ];

  return (
    <nav className="md:hidden fixed bottom-5 left-4 right-4 z-40">
      <div className="flex items-stretch justify-between bg-white/60 backdrop-blur-2xl border border-white/40 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-2 py-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const isHeart = tab.label === "Saved";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex-1 flex items-center justify-center py-2.5 active:scale-90 transition-transform"
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  active ? "bg-black text-white" : "text-black/50"
                }`}
              >
                {isHeart ? <tab.Icon size={19} filled={active} /> : <tab.Icon size={19} />}
              </span>
              {!!tab.badge && (
                <span className="absolute top-0 right-[calc(50%-20px)] w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium">
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
