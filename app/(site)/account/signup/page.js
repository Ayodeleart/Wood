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

  async function signInWithGoogle() {
    const sb = supabaseBrowser();
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex-1 min-h-[70vh] flex items-center justify-center px-6 py-24">
      <form onSubmit={onSubmit} className="max-w-sm w-full">
        <h1 className="font-display text-3xl text-ink mb-8">Create Account</h1>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-ink text-paper py-3 mb-6 label hover:bg-ink/90 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
            <path fill="#fff" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
            <path fill="#fff" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
            <path fill="#fff" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs text-mute">or</span>
          <div className="flex-1 h-px bg-line" />
        </div>

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
