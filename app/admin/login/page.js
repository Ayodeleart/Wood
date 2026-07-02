"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed.");
    }
  }

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center bg-paper px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <div className="relative w-40 h-16 mx-auto mb-2">
          <Image src="/logo/logo-cutout.png" alt="Ola Wood" fill className="object-contain" priority />
        </div>
        <h1 className="label text-mute text-center mb-2">Admin</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoCapitalize="none"
          autoCorrect="off"
          className="bg-transparent border border-line text-ink px-4 py-3 outline-none focus:border-ink transition-colors"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-transparent border border-line text-ink px-4 py-3 outline-none focus:border-ink transition-colors"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="label bg-ink text-paper py-3 mt-2 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
