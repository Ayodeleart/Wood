"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const emptyForm = { id: null, name: "", category_id: "", price: "", description: "", images: [], night_image_url: "" };

export default function AdminDashboard() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("list"); // list | form
  const [form, setForm] = useState(emptyForm);
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroError, setHeroError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  async function loadAll() {
    const [catRes, prodRes] = await Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
    ]);
    setCategories(catRes.categories || []);
    setProducts(prodRes.products || []);
    setInitialLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  function startAdd() {
    setForm(emptyForm);
    setError("");
    setView("form");
  }

  function startEdit(p) {
    setForm({
      id: p.id,
      name: p.name,
      category_id: p.category_id || "",
      price: p.price || "",
      description: p.description || "",
      images: (p.product_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => ({ url: i.url, uploading: false })),
      night_image_url: p.night_image_url || "",
    });
    setError("");
    setView("form");
  }

  const [removeBgEnabled, setRemoveBgEnabled] = useState(false);

  // POP Ceiling & Wall Panel products are room/installation photos, not isolated
  // objects on a backdrop -- background removal doesn't make sense for them, so
  // the toggle is hidden entirely for that category rather than just defaulted off.
  const selectedCategory = categories.find((c) => c.id === form.category_id);
  const bgRemovalAllowed = selectedCategory?.slug !== "pop-ceiling-wall-panel";

  async function onFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const placeholders = files.map(() => ({ url: null, uploading: true }));
    setForm((f) => ({ ...f, images: [...f.images, ...placeholders] }));

    const startIndex = form.images.length;
    const effectiveRemoveBg = bgRemovalAllowed && removeBgEnabled;

    files.forEach(async (file, i) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("removeBg", effectiveRemoveBg ? "true" : "false");
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setForm((f) => {
          const images = [...f.images];
          images[startIndex + i] = { url: data.url, uploading: false };
          return { ...f, images };
        });
      } catch (err) {
        setForm((f) => {
          const images = [...f.images];
          images[startIndex + i] = { url: null, uploading: false, error: err.message };
          return { ...f, images };
        });
      }
    });
  }

  function removeImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  const [nightUploading, setNightUploading] = useState(false);

  async function onNightFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNightUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("removeBg", "false");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f) => ({ ...f, night_image_url: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setNightUploading(false);
    }
  }

  async function uploadHeroImages(catId, files) {
    setHeroUploading(true);
    setHeroError("");
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("mode", "hero");
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        const postRes = await fetch("/api/admin/category-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category_id: catId, url: data.url }),
        });
        if (!postRes.ok) throw new Error("Could not save hero image.");
      }
      await loadAll();
    } catch (err) {
      setHeroError(err.message);
    }
    setHeroUploading(false);
  }

  async function removeHeroImage(imageId) {
    await fetch(`/api/admin/category-images/${imageId}`, { method: "DELETE" });
    loadAll();
  }

  async function addCategory() {
    if (!newCatName.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName.trim() }),
    });
    if (res.ok) {
      setNewCatName("");
      loadAll();
    }
  }

  async function saveProduct(e) {
    e.preventDefault();
    setError("");

    if (form.images.some((i) => i.uploading)) {
      setError("Wait for all photos to finish uploading.");
      return;
    }
    if (!form.category_id) {
      setError("Choose a category.");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      category_id: form.category_id,
      price: form.price ? Number(form.price) : null,
      description: form.description,
      images: form.images.filter((i) => i.url).map((i) => i.url),
      night_image_url: form.night_image_url || null,
    };

    const res = form.id
      ? await fetch(`/api/admin/products/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (res.ok) {
      setView("list");
      loadAll();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save product.");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Delete failed — see console for details.");
      return;
    }
    loadAll();
  }

  return (
    <main className="flex-1 min-h-screen bg-smoke pt-24 pb-16 px-6 md:px-14">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display font-semibold text-3xl text-ink">Admin</h1>
        <div className="flex items-center gap-6">
          <a href="/admin/hero-slides" className="label text-mute hover:text-ink transition-colors">
            Hero Slides
          </a>
          <button onClick={logout} className="label text-mute hover:text-ink transition-colors">
            Log Out
          </button>
        </div>
      </div>

      {view === "list" && (
        <>
          <div className="bg-paper border border-line p-6 mb-8">
            <h2 className="label text-mute mb-1">Categories</h2>
            <p className="text-xs text-mute mb-4">
              Tap a category to set the photo it uses in the homepage hero.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setEditingCatId(editingCatId === c.id ? null : c.id);
                    setHeroError("");
                  }}
                  className={`text-sm px-3 py-1.5 border transition-colors ${
                    editingCatId === c.id
                      ? "bg-ink text-paper border-ink"
                      : "bg-smoke border-line hover:border-ink"
                  }`}
                >
                  {c.name}
                  {c.category_images?.length > 0 && " ✓"}
                </button>
              ))}
            </div>

            {editingCatId && (
              <div className="border border-line p-4 mb-4 bg-smoke">
                {(() => {
                  const cat = categories.find((c) => c.id === editingCatId);
                  if (!cat) return null;
                  const images = (cat.category_images || []).sort((a, b) => a.sort_order - b.sort_order);
                  return (
                    <>
                      <p className="label text-mute mb-3">
                        Hero photos — {cat.name} ({images.length})
                      </p>
                      <p className="text-xs text-mute mb-3">
                        Upload more than one to have the homepage hero cycle through several
                        photos for this category, not just one.
                      </p>
                      {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3 max-w-md">
                          {images.map((img) => (
                            <div key={img.id} className="relative aspect-video bg-paper border border-line">
                              <Image src={img.url} alt={cat.name} fill className="object-cover" />
                              <button
                                onClick={() => removeHeroImage(img.id)}
                                className="absolute top-1 right-1 w-5 h-5 bg-ink text-paper text-xs leading-5"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={heroUploading}
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length) uploadHeroImages(cat.id, files);
                          }}
                          className="text-sm"
                        />
                        {heroUploading && <span className="text-xs text-mute">Uploading…</span>}
                      </div>
                      {heroError && <p className="text-sm text-red-500 mt-2">{heroError}</p>}
                      <p className="text-xs text-mute mt-3">
                        No hero photos will fall back to the first product's photo automatically.
                      </p>
                    </>
                  );
                })()}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New category name"
                className="flex-1 border border-line px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <button onClick={addCategory} className="label bg-ink text-paper px-4 py-2">
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="label text-mute">Products ({products.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAnalytics((v) => !v)}
                className="label border border-line px-5 py-2.5 hover:border-ink transition-colors"
              >
                {showAnalytics ? "Hide Analytics" : "Analytics"}
              </button>
              <button onClick={startAdd} className="label bg-ink text-paper px-5 py-2.5">
                + Add Product
              </button>
            </div>
          </div>

          {showAnalytics && !initialLoading && (
            <div className="bg-paper border border-line p-6 mb-8">
              <p className="text-xs text-mute mb-4">
                Views = product page visits. Inquiries = "Enquire" or "Pay Deposit" clicks.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="label text-mute mb-3">Most Viewed</h3>
                  <div className="space-y-2">
                    {[...products]
                      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                      .slice(0, 5)
                      .map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                          <span className="text-ink truncate">{p.name}</span>
                          <span className="text-mute shrink-0 ml-3">{p.view_count || 0} views</span>
                        </div>
                      ))}
                    {products.every((p) => !p.view_count) && <p className="text-sm text-mute">No views yet.</p>}
                  </div>
                </div>
                <div>
                  <h3 className="label text-mute mb-3">Most Inquired</h3>
                  <div className="space-y-2">
                    {[...products]
                      .sort((a, b) => (b.inquiry_count || 0) - (a.inquiry_count || 0))
                      .slice(0, 5)
                      .map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                          <span className="text-ink truncate">{p.name}</span>
                          <span className="text-mute shrink-0 ml-3">{p.inquiry_count || 0} inquiries</span>
                        </div>
                      ))}
                    {products.every((p) => !p.inquiry_count) && <p className="text-sm text-mute">No inquiries yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-paper border border-line divide-y divide-line">
            {initialLoading && (
              <div className="animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-t border-line">
                    <div className="w-16 h-16 bg-line/60 shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 w-1/3 bg-line/60 mb-2" />
                      <div className="h-3 w-1/5 bg-line/60" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!initialLoading && products.length === 0 && <p className="p-6 text-mute text-sm">No products yet.</p>}
            {(() => {
              const grouped = {};
              for (const p of products) {
                const key = p.categories?.name || "Uncategorized";
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(p);
              }
              const groupNames = Object.keys(grouped).sort((a, b) =>
                a === "Uncategorized" ? 1 : b === "Uncategorized" ? -1 : a.localeCompare(b)
              );
              return groupNames.map((groupName) => (
                <div key={groupName}>
                  <div className="bg-smoke px-4 py-2 text-xs font-semibold uppercase tracking-wide text-mute">
                    {groupName} ({grouped[groupName].length})
                  </div>
                  {grouped[groupName].map((p) => (
                    <div key={p.id} className="flex items-center gap-4 p-4 border-t border-line">
                      <div className="relative w-16 h-16 bg-smoke shrink-0">
                        {p.product_images?.[0]?.url && (
                          <Image src={p.product_images[0].url} alt={p.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-mute">{p.categories?.name || "Uncategorized"}</p>
                      </div>
                      <button onClick={() => startEdit(p)} className="label text-mute hover:text-ink transition-colors">
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="label text-red-500 hover:text-red-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
        </>
      )}

      {view === "form" && (
        <form onSubmit={saveProduct} className="bg-paper border border-line p-6 md:p-10 max-w-2xl">
          <h2 className="font-display text-2xl mb-6">{form.id ? "Edit Product" : "Add Product"}</h2>

          <label className="label text-mute block mb-2">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-line px-3 py-2.5 mb-5 outline-none focus:border-ink"
          />

          <label className="label text-mute block mb-2">Category</label>
          <select
            required
            value={form.category_id}
            onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
            className="w-full border border-line px-3 py-2.5 mb-5 outline-none focus:border-ink"
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="label text-mute block mb-2">Price (₦, optional)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full border border-line px-3 py-2.5 mb-5 outline-none focus:border-ink"
          />

          <label className="label text-mute block mb-2">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border border-line px-3 py-2.5 mb-5 outline-none focus:border-ink"
          />

          <label className="label text-mute block mb-2">
            Photos — upload at least 8 angles, or just one. Photos are optional.
          </label>
          {bgRemovalAllowed && (
            <label className="flex items-center gap-2 mb-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={removeBgEnabled}
                onChange={(e) => setRemoveBgEnabled(e.target.checked)}
              />
              Remove background automatically (replace with white)
            </label>
          )}
          <input type="file" accept="image/*" multiple onChange={onFilesSelected} className="mb-4 text-sm" />

          <div className="grid grid-cols-4 gap-3 mb-6">
            {form.images.map((img, i) => (
              <div key={i} className="relative aspect-square bg-smoke border border-line">
                {img.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-mute">
                    Removing bg…
                  </div>
                )}
                {img.error && (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-red-500 text-center p-1 leading-tight overflow-hidden">
                    {img.error}
                  </div>
                )}
                {img.url && <Image src={img.url} alt="" fill className="object-cover" />}
                {!img.uploading && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-ink text-paper text-xs leading-5"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <label className="label text-mute block mb-2">
            Night / lit version (optional) — shown when a customer toggles "See it by night" on this
            product's page. Best for lamps, lights, or anything with a glow effect.
          </label>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-24 h-24 bg-[#0c1024] border border-line shrink-0 overflow-hidden">
              {nightUploading && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/70 text-center p-1">
                  Uploading…
                </div>
              )}
              {form.night_image_url && !nightUploading && (
                <Image src={form.night_image_url} alt="Night version" fill className="object-contain" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input type="file" accept="image/*" onChange={onNightFileSelected} className="text-sm" />
              {form.night_image_url && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, night_image_url: "" }))}
                  className="label text-red-500 text-xs w-fit"
                >
                  Remove night photo
                </button>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="label bg-ink text-paper px-6 py-3 disabled:opacity-50">
              {saving ? "Saving…" : "Save Product"}
            </button>
            <button type="button" onClick={() => setView("list")} className="label text-mute px-6 py-3">
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
