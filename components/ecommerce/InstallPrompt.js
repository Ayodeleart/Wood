"use client";

import { useState } from "react";
import { Share, PlusSquare, MoreVertical } from "lucide-react";
import { useIsInstalledPWA } from "@/lib/useIsInstalledPWA";

function getPlatform() {
  const ua = window.navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

export default function InstallPrompt() {
  const installed = useIsInstalledPWA();
  const [dismissed, setDismissed] = useState(false);

  if (installed !== false || dismissed) return null; // already installed, or user closed it

  const platform = getPlatform();

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 px-4 pb-6 md:pb-4">
      <div className="w-full max-w-sm bg-paper rounded-2xl p-6">
        <h2 className="font-display text-xl text-ink mb-2 text-center">Add Ola Wood to your Home Screen</h2>
        <p className="text-sm text-mute mb-6 text-center">
          Install the app for a faster, full-screen experience — no app store needed.
        </p>

        {platform === "ios" ? (
          <ol className="flex flex-col gap-4 mb-6">
            <li className="flex items-center gap-3 text-sm text-ink">
              <span className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center shrink-0">
                <Share size={16} />
              </span>
              Tap the <strong className="mx-1">Share</strong> button in Safari's toolbar
            </li>
            <li className="flex items-center gap-3 text-sm text-ink">
              <span className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center shrink-0">
                <PlusSquare size={16} />
              </span>
              Scroll down and tap <strong className="mx-1">Add to Home Screen</strong>
            </li>
          </ol>
        ) : platform === "android" ? (
          <ol className="flex flex-col gap-4 mb-6">
            <li className="flex items-center gap-3 text-sm text-ink">
              <span className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center shrink-0">
                <MoreVertical size={16} />
              </span>
              Open the menu (⋮) in the top right of Chrome
            </li>
            <li className="flex items-center gap-3 text-sm text-ink">
              <span className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center shrink-0">
                <PlusSquare size={16} />
              </span>
              Tap <strong className="mx-1">Install app</strong> or <strong className="mx-1">Add to Home screen</strong>
            </li>
          </ol>
        ) : (
          <p className="text-sm text-mute mb-6 text-center">
            Look for an "Install" or "Add to Home Screen" option in your browser's menu.
          </p>
        )}

        <button onClick={() => setDismissed(true)} className="w-full text-sm text-mute py-2">
          Maybe later
        </button>
      </div>
    </div>
  );
}
