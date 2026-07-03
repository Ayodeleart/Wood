"use client";

import { useEffect, useRef, useState } from "react";

// Persistent category tab bar for the e-commerce catalog. Sticks just below
// the main site header (offset via the --nav-h CSS var Nav.js publishes) so
// users can jump between categories without scrolling back to the top,
// while browsing the CollectionRail sections stacked below it.
export default function CategoryStickyNav({ categories = [] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? null);
  const barRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current;
    const setVar = () => {
      document.documentElement.style.setProperty("--subnav-h", `${el.offsetHeight}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const sections = categories
      .map((c) => document.getElementById(`cat-${c.slug}`))
      .filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick whichever observed section has the most vertical overlap with
        // the viewport band just below the sticky bars — that's the one
        // the user is actually looking at.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const slug = visible[0].target.id.replace("cat-", "");
          setActive(slug);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  if (categories.length === 0) return null;

  function goTo(slug) {
    const el = document.getElementById(`cat-${slug}`);
    if (!el) return;
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "72",
      10
    );
    const subnavH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--subnav-h") || "52",
      10
    );
    const top = el.getBoundingClientRect().top + window.scrollY - navH - subnavH;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div
      ref={barRef}
      className="sticky z-40 bg-paper/95 backdrop-blur border-b border-line"
      style={{ top: "var(--nav-h, 72px)" }}
    >
      <div className="flex items-center gap-2 overflow-x-auto px-6 md:px-14 py-3 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => goTo(c.slug)}
            className={`label whitespace-nowrap px-4 py-2 rounded-full border transition-colors duration-300 shrink-0 ${
              active === c.slug
                ? "bg-accent text-paper border-accent"
                : "bg-transparent text-mute border-line hover:text-ink hover:border-ink/40"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
