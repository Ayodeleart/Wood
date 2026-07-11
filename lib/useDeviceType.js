"use client";

import { useEffect, useState } from "react";

// Real desktops have a mouse (fine pointer + hover support). Phones and
// tablets stay touch devices (coarse pointer) no matter how wide they get in
// landscape — so this correctly tells a landscape phone apart from an actual
// desktop browser, unlike a raw viewport-width check which gets fooled the
// moment a phone rotates past 768px.
export function useDeviceType() {
  const [isDesktop, setIsDesktop] = useState(null); // null = not yet known (SSR/first paint)

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    setIsDesktop(mq.matches);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
