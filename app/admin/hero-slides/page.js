"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BLANK_FORM = {
  image: "",
  wordmark: "OLAWOOD",
  promo_text: "",
  cta_label: "",
  cta_href: "",
  placement: "landing",
  bg_color: "#eef3f8",
};

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [removeBg, setRemoveBg] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(BLANK_FORM);

  function load() {
    fetch("/api/admin/hero-slides")
      .then((r) => r.json())
      .then((d) => {
        setSlides(d.slides || []);
        setLoading(false);
      });
  }
  useEffect(load, []);

  async function onFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    if (removeBg) {
      fd.append("removeBg", "true");
      fd.append("transparentOutput", "true");
    } else {
      fd.append("mode", "hero");
    }
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function addSlide(e) {
    e.preventDefault();
    setError("");
    if (!form.image) {
      setError("Upload a photo first.");
      return;
    }
    const res = await fetch("/api/admin/hero-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sort_order: slides.length }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setForm({ ...BLANK_FORM, placement: form.placement });
    load();
  }

  async function deleteSlide(id) {
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    load();
  }

  const landing = slides.filter((s) => s.placement === "landing");
  const shop = slides.filter((s) => !s.placement || s.placement === "shop");

  return (
    <main className="max-w-3xl mx-auto p-6 md:p-10">
      <Link href="/admin" className="label text-mute mb-6 inline-block">
        ← Back to Admin
      </Link>
      <h1 className="font-display text-3xl text-ink mb-2">Hero Slides</h1>
      <p className="text-sm text-mute mb-10">
        <strong>Landing</strong> slides show on the public brand homepage behind the "Olawood Work" wordmark.{" "}
        <strong>Shop</strong> slides show on the e-commerce homepage (after login or PWA install).
      </p>

      <form onSubmit={addSlide} className="bg-paper border border-line p-6 mb-10">
        <label className="label text-mute block mb-2">Which Hero</label>
        <div className="flex gap-2 mb-6">
          {["landing", "shop"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setForm((f) => ({ ...f, placement: p }))}
              className={`label px-4 py-2 border transition-colors ${
                form.placement === p ? "bg-ink text-paper border-ink" : "border-line text-mute"
              }`}
            >
              {p === "landing" ? "Landing Page" : "Shop / E-commerce"}
            </button>
          ))}
        </div>

        <label className="label text-mute block mb-2">
          Product Photo {form.placement === "landing" ? "(background removed / transparent PNG works best)" : "(transparent PNG works best)"}
        </label>
        <label className="flex items-center gap-2 mb-3 text-sm text-ink">
          <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
          Remove background automatically
        </label>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-24 h-24 bg-smoke border border-line shrink-0">
            {uploading && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-mute">Uploading…</div>}
            {form.image && !uploading && <Image src={form.image} alt="" fill className="object-contain" />}
          </div>
          <input type="file" accept="image/*" onChange={onFileSelected} className="text-sm" />
        </div>

        {form.placement === "landing" && (
          <>
            <label className="label text-mute block mb-1">Soft Background Color</label>
            <p className="text-xs text-mute mb-2">Pick a pale tone that complements this specific photo — e.g. a soft blue behind a blue sofa.</p>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="color"
                value={form.bg_color}
                onChange={(e) => setForm((f) => ({ ...f, bg_color: e.target.value }))}
                className="w-12 h-10 border border-line cursor-pointer"
              />
              <input
                value={form.bg_color}
                onChange={(e) => setForm((f) => ({ ...f, bg_color: e.target.value }))}
                className="flex-1 border border-line px-3 py-2.5 outline-none focus:border-ink text-sm"
              />
            </div>
          </>
        )}

        {form.placement === "shop" && (
          <>
            <label className="label text-mute block mb-1">Background Wordmark Text</label>
            <input
              value={form.wordmark}
              onChange={(e) => setForm((f) => ({ ...f, wordmark: e.target.value }))}
              className="w-full border border-line px-3 py-2.5 mb-4 outline-none focus:border-ink"
            />

            <label className="label text-mute block mb-1">Promo Text (optional)</label>
            <input
              value={form.promo_text}
              onChange={(e) => setForm((f) => ({ ...f, promo_text: e.target.value }))}
              placeholder="e.g. 20% off this week"
              className="w-full border border-line px-3 py-2.5 mb-4 outline-none focus:border-ink"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label text-mute block mb-1">Button Label</label>
                <input
                  value={form.cta_label}
                  onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
                  placeholder="Shop Now"
                  className="w-full border border-line px-3 py-2.5 outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="label text-mute block mb-1">Button Link</label>
                <input
                  value={form.cta_href}
                  onChange={(e) => setForm((f) => ({ ...f, cta_href: e.target.value }))}
                  placeholder="/collections/sofas"
                  className="w-full border border-line px-3 py-2.5 outline-none focus:border-ink"
                />
              </div>
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button type="submit" className="label bg-ink text-paper px-6 py-3">
          Add Slide
        </button>
      </form>

      {[{ label: "Landing Page Slides", list: landing }, { label: "Shop Slides", list: shop }].map((group) => (
        <div key={group.label} className="mb-10">
          <h2 className="label text-mute mb-4">{group.label} ({group.list.length})</h2>
          {loading && <p className="text-sm text-mute">Loading…</p>}
          <div className="space-y-3">
            {group.list.map((s) => (
              <div key={s.id} className="flex items-center gap-4 border border-line p-4">
                <div
                  className="relative w-16 h-16 shrink-0"
                  style={{ backgroundColor: s.bg_color || "var(--smoke)" }}
                >
                  <Image src={s.image} alt="" fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-ink text-sm">{s.placement === "landing" ? s.bg_color : s.wordmark}</p>
                  {s.promo_text && <p className="text-xs text-mute">{s.promo_text}</p>}
                </div>
                <button onClick={() => deleteSlide(s.id)} className="label text-red-500 text-xs">
                  Delete
                </button>
              </div>
            ))}
            {!loading && group.list.length === 0 && <p className="text-sm text-mute">None yet.</p>}
          </div>
        </div>
      ))}
    </main>
  );
}
