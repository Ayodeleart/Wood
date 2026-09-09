"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useIsInstalledPWA } from "@/lib/useIsInstalledPWA";
import { pushSupported, requestNotificationPermission } from "@/lib/pushNotifications";

const DISMISSED_KEY = "notif-prompt-dismissed";

export default function NotificationPrompt() {
  const installed = useIsInstalledPWA();
  const [show, setShow] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (installed !== true) return;
    if (!pushSupported()) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    setShow(true);
  }, [installed]);

  async function enable() {
    setAsking(true);
    setError("");
    try {
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        setError(
          permission === "denied"
            ? "Notifications are blocked — enable them for this site in your browser settings."
            : "Notifications weren't enabled."
        );
        return;
      }
      setShow(false);
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch (err) {
      setError(err.message || "Couldn't enable notifications — try again.");
    } finally {
      setAsking(false);
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 px-4 pb-6 md:pb-4">
      <div className="w-full max-w-sm bg-paper rounded-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-smoke flex items-center justify-center mx-auto mb-4">
          <Bell size={24} className="text-ink" />
        </div>
        <h2 className="font-display text-xl text-ink mb-2">Stay in the loop</h2>
        <p className="text-sm text-mute mb-6">
          Turn on notifications to hear about new arrivals, restocks, and your order updates.
        </p>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <button
          onClick={enable}
          disabled={asking}
          className="w-full bg-ink text-paper py-3 rounded-lg label mb-3 disabled:opacity-50"
        >
          {asking ? "Enabling…" : "Enable Notifications"}
        </button>
        <button onClick={dismiss} className="w-full text-sm text-mute py-2">
          Not now
        </button>
      </div>
    </div>
  );
}
