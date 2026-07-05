"use client";

import { usePathname } from "next/navigation";
import { useIsInstalledPWA } from "@/lib/useIsInstalledPWA";

// Products and collections pages are ALWAYS the dark shop experience.
// The homepage ("/") only shows it once logged in or installed as a PWA —
// mirrored here client-side (cookie presence is a fast approximation of
// "logged in"; the server-side HomeGate check is still the source of truth
// for which content actually renders, this just keeps the header in sync).
export function useIsShopMode() {
  const pathname = usePathname();
  const installed = useIsInstalledPWA();

  const alwaysShop = pathname?.startsWith("/products") || pathname?.startsWith("/collections");
  const hasSupabaseCookie =
    typeof document !== "undefined" && document.cookie.split("; ").some((c) => c.startsWith("sb-") && c.includes("-auth-token"));

  if (alwaysShop) return true;
  if (pathname === "/") return installed || hasSupabaseCookie;
  return false;
}
