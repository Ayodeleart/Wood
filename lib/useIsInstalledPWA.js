"use client";

import { useEffect, useState } from "react";

// True if the site is running as an installed PWA (Add to Home Screen),
// not just a regular browser tab. This is the second trigger — alongside
// being logged in — for skipping the landing page straight to e-commerce.
export function useIsInstalledPWA() {
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true; // iOS Safari's older flag
    setInstalled(standalone);
  }, []);

  return installed;
}
