"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BLANK_FORM = {
  image: "",
  image_mobile: "",
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
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
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

  // Landing slides are now pre-designed flat images (brand name baked in by
  // whoever designs them) rather than live-composited text + cutout photo —
  // so they upload as-is, no processing at all. Shop slides still use the
  // wordmark-behind-product compositing system, so background removal still
  // applies there.
  async function uploadFile(file, setUploading, targetField) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    if (form.placement === "landing") {
      fd.append("mode", "hero");
    } else if (removeBg) {
      fd.append("removeBg", "true");
      fd.append("transparentOutput", "true");
    } else {
      fd.append("mode", "hero");
    }
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, [targetField]: data.url }));
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
      setError(form.placement === "landing" ? "Upload a desktop image first." : "Upload a photo first.");
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
        <strong>Landing</strong> slides are full, pre-designed images (brand name and layout already built into
        the image itself — upload one for desktop and one for mobile). <strong>Shop</strong> slides use the
        live wordmark-behind-product system on the e-commerce homepage.
      </p>

      <form onSubmit={addSlide} className="bg-paper border border-line p-6 mb-10">
        <label className="label text-mute block mb-2">Which Hero</label>
        <div className="flex gap-2 mb-6">
          {["landing", "shop"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setForm((f) => ({ ...BLANK_FORM, placement: p }))}
              className={`label px-4 py-2 border transition-colors ${
                form.placement === p ? "bg-ink text-paper border-ink" : "border-line text-mute"
              }`}
            >
              {p === "landing" ? "Landing Page" : "Shop / E-commerce"}
            </button>
          ))}
        </div>

        {form.placement === "landing" ? (
          <>
            <label className="label text-mute block mb-2">Desktop Image (full hero design, brand name included)</label>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-32 h-20 bg-smoke border border-line shrink-0">
                {uploadingDesktop && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-mute">Uploading…</div>}
                {form.image && !uploadingDesktop && <Image src={form.image} alt="" fill className="object-cover" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], setUploadingDesktop, "image")}
                className="text-sm"
              />
            </div>

            <label className="label text-mute block mb-2">Mobile Image (same design, cropped/laid out for a tall phone screen)</label>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-20 bg-smoke border border-line shrink-0">
                {uploadingMobile && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-mute">Uploading…</div>}
                {form.image_mobile && !uploadingMobile && <Image src={form.image_mobile} alt="" fill className="object-cover" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], setUploadingMobile, "image_mobile")}
                className="text-sm"
              />
            </div>
            <p className="text-xs text-mute mb-4">Optional — if you skip this, the desktop image is used on mobile too.</p>
          </>
        ) : (
          <>
            <label className="label text-mute block mb-2">Product Photo (transparent PNG works best)</label>
            <label className="flex items-center gap-2 mb-3 text-sm text-ink">
              <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
              Remove background automatically
            </label>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-24 h-24 bg-smoke border border-line shrink-0">
                {uploadingDesktop && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-mute">Uploading…</div>}
                {form.image && !uploadingDesktop && <Image src={form.image} alt="" fill className="object-contain" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], setUploadingDesktop, "image")}
                className="text-sm"
              />
            </div>

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
                <div className="relative w-16 h-16 shrink-0 bg-smoke">
                  <Image src={s.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-ink text-sm">{s.placement === "landing" ? "Landing slide" : s.wordmark}</p>
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
