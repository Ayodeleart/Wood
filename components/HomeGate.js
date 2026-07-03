"use client";

import { useIsInstalledPWA } from "@/lib/useIsInstalledPWA";

// Decides landing vs e-commerce on the client (for the PWA-install check,
// which only the browser can answer) while trusting the server's login
// check passed in as a prop. Shows nothing for a beat rather than flashing
// the wrong zone while the PWA check resolves.
export default function HomeGate({ loggedIn, forcePreview, landing, ecommerce }) {
  const installed = useIsInstalledPWA();

  if (forcePreview || loggedIn || installed) return ecommerce;
  return landing;
}
