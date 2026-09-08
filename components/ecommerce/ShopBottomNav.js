"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCart } from "@/lib/cart";
import { useShopTheme } from "@/lib/ShopThemeContext";
import NavHomeIcon from "@/components/ecommerce/icons/NavHomeIcon";
import NavCartIcon from "@/components/ecommerce/icons/NavCartIcon";
import NavHeartIcon from "@/components/ecommerce/icons/NavHeartIcon";
import NavProfileIcon from "@/components/ecommerce/icons/NavProfileIcon";

export default function ShopBottomNav() {
  const pathname = usePathname();
  const { theme } = useShopTheme();
  const isDark = theme === "dark";
  const [cartCount, setCartCount] = useState(0);
  const containerRef = useRef(null);
  const iconRefs = useRef([]);
  const [pill, setPill] = useState(null);

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

  const activeIndex = TABS.findIndex((tab) => tab.href === pathname);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const el = iconRefs.current[activeIndex];
      if (!container || !el) {
        setPill(null);
        return;
      }
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPill({
        left: elRect.left - containerRect.left,
        top: elRect.top - containerRect.top,
        size: elRect.width,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-fit">
      <div
        ref={containerRef}
        className={`relative flex items-stretch gap-1 backdrop-blur-2xl border rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.25)] px-1.5 py-1.5 ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/60 border-white/40"
        }`}
      >
        {pill && (
          <span
            aria-hidden
            className={`absolute rounded-full pointer-events-none transition-[left,top,width,height] duration-[420ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isDark ? "bg-white" : "bg-black"
            }`}
            style={{ left: pill.left, top: pill.top, width: pill.size, height: pill.size }}
          />
        )}

        {TABS.map((tab, i) => {
          const active = pathname === tab.href;
          const isHeart = tab.label === "Saved";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex items-center justify-center px-3 py-2 active:scale-90 transition-transform"
            >
              <span
                ref={(el) => (iconRefs.current[i] = el)}
                className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 ${
                  active ? (isDark ? "text-black" : "text-white") : isDark ? "text-white/50" : "text-black/50"
                }`}
              >
                {isHeart ? <tab.Icon size={18} filled={active} /> : <tab.Icon size={18} />}
              </span>
              {!!tab.badge && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium z-20">
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
