"use client";

import { useEffect, useRef, useState } from "react";

// Implements the restrained SS1 animation spec: elements fade + translateY(24px)->0
// once, triggered at ~20% visibility, ~600ms duration, cubic-bezier(0.22,1,0.36,1).
// `delay` (ms) is used to stagger siblings — pass index * 90 for a cascade.
//
// Mobile-only by design: always runs the exact same observer/state logic on
// every screen size (no branching on a client-only "is this mobile" check —
// that caused a real bug where the initial SSR render, the first client render,
// and the post-effect render disagreed with each other, producing a visible
// flash instead of a clean animation). Desktop is forced fully visible purely
// via a `md:` CSS override with !important, which reliably wins over the
// inline style without any JS timing involved.
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${className} md:!opacity-100 md:!transform-none md:!transition-none`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 620ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 620ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
