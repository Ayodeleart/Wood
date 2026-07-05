"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, ShoppingBag, User } from "lucide-react";
import { getCart } from "@/lib/cart";

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
    { href: "/", icon: Home, label: "Home" },
    { href: "/account/saved", icon: Heart, label: "Saved" },
    { href: "/cart", icon: ShoppingBag, label: "Cart", badge: cartCount },
    { href: "/account", icon: User, label: "Account" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-shop-bg/95 backdrop-blur border-t border-shop-line flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3 active:opacity-60 transition-opacity"
          >
            <tab.icon size={22} strokeWidth={active ? 2.4 : 1.6} className={active ? "text-shop-text" : "text-shop-mute"} />
            {!!tab.badge && (
              <span className="absolute top-1.5 right-[calc(50%-16px)] w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
