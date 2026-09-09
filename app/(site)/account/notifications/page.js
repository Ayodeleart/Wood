"use client";

import { useEffect, useState } from "react";
import ShopShell from "@/components/ecommerce/ShopShell";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { pushSupported, requestNotificationPermission, subscribeToPush } from "@/lib/pushNotifications";

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({ order_updates: false, promotions: false });
  const [error, setError] = useState("");

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = "/account/login?next=/account/notifications";
        return;
      }
      if (user.user_metadata?.notification_prefs) {
        setPrefs(user.user_metadata.notification_prefs);
      }
    });
  }, []);

  async function toggle(key) {
    setError("");
    const turningOn = !prefs[key];

    // Turning any of these on is the user's actual signal to enable real
    // push notifications — previously this just saved a preference flag
    // with no connection to the browser's Notification permission or an
    // actual push subscription, which is why announcements had 0 subscribers
    // no matter how many people had these toggled "on".
    if (turningOn && typeof Notification !== "undefined" && Notification.permission !== "granted") {
      if (!pushSupported()) {
        setError("Notifications aren't supported in this browser.");
        return;
      }
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        setError(
          permission === "denied"
            ? "Notifications are blocked — enable them for this site in your browser settings."
            : "Notifications weren't enabled."
        );
        return;
      }
    } else if (turningOn) {
      // Permission already granted from before — still make sure a live
      // subscription actually exists (idempotent if one already does).
      await subscribeToPush();
    }

    const next = { ...prefs, [key]: turningOn };
    setPrefs(next);
    await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notification_prefs: next }),
    });
  }

  const OPTIONS = [
    { key: "order_updates", label: "Order Updates", desc: "Shipping and delivery status for your orders." },
    { key: "promotions", label: "Promotions", desc: "Occasional discounts and new arrivals." },
  ];

  return (
    <ShopShell className="pt-6 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-8">Notifications</h1>
      {error && <p className="text-sm text-red-400 mb-4 max-w-sm">{error}</p>}
      <div className="flex flex-col gap-6 max-w-sm">
        {OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-shop-text text-sm">{opt.label}</p>
              <p className="text-shop-mute text-xs mt-0.5">{opt.desc}</p>
            </div>
            <button
              onClick={() => toggle(opt.key)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                prefs[opt.key] ? "bg-shop-accent" : "bg-shop-line"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  prefs[opt.key] ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </ShopShell>
  );
}
