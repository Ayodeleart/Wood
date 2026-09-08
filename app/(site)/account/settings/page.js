"use client";

import ShopShell from "@/components/ecommerce/ShopShell";
import { useShopTheme } from "@/lib/ShopThemeContext";
import { Moon } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useShopTheme();
  const isDark = theme === "dark";

  return (
    <ShopShell className="pt-6 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-8">Settings</h1>

      <div className="flex items-center justify-between bg-shop-surface rounded-2xl p-4">
        <span className="flex items-center gap-3">
          <Moon size={18} strokeWidth={1.6} className="text-shop-mute" />
          <span className="text-shop-text text-sm">Dark Mode</span>
        </span>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={"relative w-11 h-6 rounded-full transition-colors shrink-0 " + (isDark ? "bg-shop-accent" : "bg-shop-line")}
        >
          <span
            className={"absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 " + (isDark ? "translate-x-5" : "translate-x-0.5")}
          />
        </button>
      </div>
    </ShopShell>
  );
}
