"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const sb = supabaseBrowser();

    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    if (data.user) {
      await sb.from("customer_profiles").insert({ id: data.user.id, full_name: name });
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex-1 min-h-[70vh] flex items-center justify-center px-6 py-24">
      <form onSubmit={onSubmit} className="max-w-sm w-full">
        <h1 className="font-display text-3xl text-ink mb-8">Create Account</h1>

        <label className="label text-mute block mb-1">Full Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line px-3 py-2.5 mb-4 outline-none focus:border-ink"
        />

        <label className="label text-mute block mb-1">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line px-3 py-2.5 mb-4 outline-none focus:border-ink"
        />

        <label className="label text-mute block mb-1">Password</label>
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line px-3 py-2.5 mb-4 outline-none focus:border-ink"
        />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="label bg-ink text-paper px-6 py-3 w-full disabled:opacity-50">
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="text-sm text-mute mt-6 text-center">
          Already have an account?{" "}
          <Link href="/account/login" className="text-ink underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
