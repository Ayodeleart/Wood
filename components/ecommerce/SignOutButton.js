"use client";

export default function SignOutButton() {
  async function signOut() {
    await fetch("/api/account/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button onClick={signOut} className="label text-red-400 border-b border-red-400/40 pb-1">
      Sign Out
    </button>
  );
}
