"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import ShopShell from "@/components/ecommerce/ShopShell";
import { Camera } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = "/account/login?next=/account/edit";
        return;
      }
      setForm({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      });
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    });
  }, []);

  async function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/account/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAvatarUrl(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.emailChangePending) {
        setNotice("Check your new email address to confirm the change.");
      } else {
        router.push("/account");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ShopShell className="pt-24 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-8">Edit Profile</h1>

      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-24 h-24 rounded-full bg-shop-tile overflow-hidden flex items-center justify-center"
        >
          {avatarUrl && <Image src={avatarUrl} alt="Profile photo" fill className="object-cover" />}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {uploading ? (
              <span className="text-white text-[10px]">Uploading…</span>
            ) : (
              <Camera size={20} className="text-white" />
            )}
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
      </div>

      <form onSubmit={save} className="flex flex-col gap-4 max-w-sm mx-auto">
        <div>
          <label className="label text-shop-mute block mb-1">Full Name</label>
          <input
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            className="w-full bg-shop-surface border border-shop-line text-shop-text px-4 py-3 rounded-lg outline-none focus:border-shop-text"
          />
        </div>
        <div>
          <label className="label text-shop-mute block mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full bg-shop-surface border border-shop-line text-shop-text px-4 py-3 rounded-lg outline-none focus:border-shop-text"
          />
        </div>
        <div>
          <label className="label text-shop-mute block mb-1">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full bg-shop-surface border border-shop-line text-shop-text px-4 py-3 rounded-lg outline-none focus:border-shop-text"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {notice && <p className="text-green-600 text-sm">{notice}</p>}

        <button
          type="submit"
          disabled={saving}
          className="label bg-shop-text text-shop-bg py-3.5 rounded-full mt-2 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </ShopShell>
  );
}
