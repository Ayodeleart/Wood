"use client";

import { useEffect, useState } from "react";
import ShopShell from "@/components/ecommerce/ShopShell";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({ order_updates: true, promotions: true });

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
    const next = { ...prefs, [key]: !prefs[key] };
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
    <ShopShell className="pt-24 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-8">Notifications</h1>
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
                prefs[opt.key] ? "bg-shop-text" : "bg-shop-line"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-shop-bg transition-transform ${
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
