"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Bell, User } from "lucide-react";

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/account/saved", icon: Heart, label: "Saved" },
  { href: "/account/notifications", icon: Bell, label: "Alerts" },
  { href: "/account/login", icon: User, label: "Account" },
];

export default function ShopBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-shop-bg/95 backdrop-blur border-t border-shop-line flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 active:opacity-60 transition-opacity"
          >
            <tab.icon size={22} strokeWidth={active ? 2.4 : 1.6} className={active ? "text-shop-text" : "text-shop-mute"} />
          </Link>
        );
      })}
    </nav>
  );
}
