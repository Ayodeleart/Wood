"use client";

import { useEffect, useRef, useState } from "react";

// Implements the restrained SS1 animation spec: elements fade + translateY(24px)->0
// once, triggered at ~20% visibility, ~600ms duration, cubic-bezier(0.22,1,0.36,1).
// `delay` (ms) is used to stagger siblings — pass index * 90 for a cascade.
// Mobile-only: desktop/TV browsers render fully visible immediately, no animation.
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
    const onChange = (e) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mobile) {
      setShown(true);
      return;
    }
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
  }, [mobile]);

  if (!mobile) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={className}
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
