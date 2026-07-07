"use client";

import ShopBottomNav from "@/components/ecommerce/ShopBottomNav";
import { useShopTheme } from "@/lib/ShopThemeContext";

// Every shop-scoped page should wrap its content in this, instead of each
// page remembering to add the bottom nav and theme class itself.
export default function ShopShell({ children, className = "", hideNav = false }) {
  const { theme } = useShopTheme();

  return (
    <div className={theme === "dark" ? "shop-dark min-h-screen" : "shop-light min-h-screen"}>
      <div className={`${hideNav ? "" : "pb-24 md:pb-0"} ${className}`}>{children}</div>
      {!hideNav && <ShopBottomNav />}
    </div>
  );
}
