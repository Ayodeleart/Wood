"use client";

import { useEffect, useState } from "react";

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", body: "", url: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load() {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((d) => {
        setAnnouncements(d.announcements || []);
        setLoading(false);
      });
  }
  useEffect(load, []);

  async function send(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setSending(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed.");
      setNotice(`Sent to ${data.sent} of ${data.total} subscribed device${data.total === 1 ? "" : "s"}.`);
      setForm({ title: "", body: "", url: "" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex-1 min-h-screen bg-smoke pt-24 pb-16 px-6 md:px-14">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display font-semibold text-3xl text-ink">Announcements</h1>
        <a href="/admin" className="label text-mute hover:text-ink transition-colors">
          ← Back to Admin
        </a>
      </div>

      <div className="bg-paper border border-line p-6 mb-8 max-w-xl">
        <h2 className="label text-mute mb-4">Send a push notification</h2>
        <form onSubmit={send} className="flex flex-col gap-4">
          <div>
            <label className="label text-mute block mb-1">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-line px-3 py-2.5 outline-none focus:border-ink"
              placeholder="New arrivals this week"
            />
          </div>
          <div>
            <label className="label text-mute block mb-1">Message</label>
            <textarea
              required
              rows={3}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full border border-line px-3 py-2.5 outline-none focus:border-ink resize-none"
              placeholder="Fresh sofas and bed frames just landed in the showroom."
            />
          </div>
          <div>
            <label className="label text-mute block mb-1">Link (optional)</label>
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="w-full border border-line px-3 py-2.5 outline-none focus:border-ink"
              placeholder="/collections/sofas"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {notice && <p className="text-sm text-green-600">{notice}</p>}

          <button
            type="submit"
            disabled={sending}
            className="label bg-ink text-paper px-6 py-3 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send to everyone"}
          </button>
        </form>
      </div>

      <div className="bg-paper border border-line p-6 max-w-xl">
        <h2 className="label text-mute mb-4">History</h2>
        {loading ? (
          <p className="text-sm text-mute">Loading…</p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-mute">No announcements sent yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {announcements.map((a) => (
              <li key={a.id} className="border-b border-line pb-4 last:border-none last:pb-0">
                <p className="font-medium text-ink">{a.title}</p>
                <p className="text-sm text-mute">{a.body}</p>
                <p className="text-xs text-mute mt-1">
                  Sent to {a.sent_count} · {new Date(a.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
