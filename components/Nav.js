"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { useIsShopMode } from "@/lib/useIsShopMode";

export default function Nav({ categories = [] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const shop = useIsShopMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the header's real rendered height as a CSS var so other sticky
  // elements (e.g. the e-commerce category sub-nav) can offset below it
  // without hardcoding a pixel value that drifts when this header's padding changes.
  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const setVar = () => {
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrolled, open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Split categories into two columns for the mega menu
  const mid = Math.ceil(categories.length / 2);
  const col1 = categories.slice(0, mid);
  const col2 = categories.slice(mid);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 border-b transition-all duration-300 ${
          shop ? "bg-shop-bg border-shop-line" : "bg-paper"
        } ${scrolled || open ? "py-3 shadow-sm" : "py-4"} ${!shop ? (scrolled || open ? "border-line" : "border-line/60") : ""}`}
      >
        {/* Logo */}
        <Link href="/" className="relative h-9 w-[150px]" onClick={() => setOpen(false)}>
          <Image
            src="/logo/logo-cutout.png"
            alt="Ola Wood"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Desktop nav links — hidden on mobile, and hidden entirely in shop mode
            since Services/Contact are landing-page anchors that don't apply here */}
        {!shop && (
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-ink hover:text-mute transition-colors">Home</Link>
            <Link href="/#services" className="text-sm text-ink hover:text-mute transition-colors">Services</Link>
            <Link href="/#contact" className="text-sm text-ink hover:text-mute transition-colors">Contact</Link>
            <div className="relative group">
              <button className="text-sm text-ink hover:text-mute transition-colors">
                Collections ↓
              </button>
              {/* Mega dropdown */}
              <div className="absolute top-full right-0 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="bg-paper border border-line p-6 w-[400px] grid grid-cols-2 gap-x-8 gap-y-2 shadow-lg">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/collections/${c.slug}`}
                      className="text-sm text-ink hover:text-mute transition-colors py-1 truncate"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            aria-label="Account"
            className={`flex items-center justify-center w-9 h-9 border rounded-full transition-colors shrink-0 ${
              shop ? "border-shop-line text-shop-text hover:border-shop-text" : "border-line text-ink hover:border-ink"
            }`}
          >
            <User size={15} strokeWidth={1.5} />
          </Link>

          {/* Hamburger — mobile only, hidden in shop mode (bottom nav covers navigation there) */}
          {!shop && (
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden flex flex-col gap-[5px] w-8 h-8 items-end justify-center"
            >
              <span className={`block h-[1.5px] bg-ink transition-all duration-300 ${open ? "w-7 rotate-45 translate-y-[3.5px]" : "w-7"}`} />
              <span className={`block h-[1.5px] bg-ink transition-all duration-300 ${open ? "w-7 -rotate-45 -translate-y-[3.5px]" : "w-5"}`} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 bg-paper transition-opacity duration-400 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="h-full flex flex-col px-10 pt-28 pb-12 overflow-y-auto">
          {/* Primary links */}
          <div className="flex flex-col gap-1 mb-8">
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/#services" },
              { label: "Contact", href: "/#contact" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-mute hover:text-ink transition-colors leading-tight"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-line mb-8" />

          {/* Collections in 2 columns */}
          <p className="label text-mute mb-4">Collections</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {col1.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                onClick={() => setOpen(false)}
                className="text-ink text-base hover:text-mute transition-colors leading-snug"
              >
                {c.name}
              </Link>
            ))}
            {col2.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                onClick={() => setOpen(false)}
                className="text-ink text-base hover:text-mute transition-colors leading-snug"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
