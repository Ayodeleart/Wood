"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// A top-level redirect from an installed iOS Home Screen app out to Google
// and back doesn't reliably resume the same app instance — the user often
// ends up staring at the same login screen after "signing in". So in
// standalone mode only, open Google's consent screen in a real Safari tab
// (window.open) instead of navigating the app itself away, and pick up the
// new session — which shares storage with the standalone app — once the
// user switches back here.
export function useGoogleSignIn() {
  const router = useRouter();
  const [waiting, setWaiting] = useState(false);
  const waitingRef = useRef(false);

  useEffect(() => {
    if (!waiting) return;
    waitingRef.current = true;

    async function checkSession() {
      if (document.visibilityState !== "visible") return;
      const sb = supabaseBrowser();
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (user) {
        setWaiting(false);
        router.push("/");
        router.refresh();
      }
    }

    document.addEventListener("visibilitychange", checkSession);
    window.addEventListener("focus", checkSession);
    return () => {
      waitingRef.current = false;
      document.removeEventListener("visibilitychange", checkSession);
      window.removeEventListener("focus", checkSession);
    };
  }, [waiting, router]);

  async function signInWithGoogle() {
    const sb = supabaseBrowser();
    const standalone = isStandalone();

    if (standalone) {
      // Must open synchronously, in direct response to the click — Safari
      // silently blocks window.open() once it happens after an await, even
      // by a tick, because it's no longer inside the user-gesture window.
      const newTab = window.open("", "_blank", "noopener,noreferrer");

      const { data, error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data?.url) {
        newTab?.close();
        return;
      }

      if (newTab) {
        newTab.location.href = data.url;
        setWaiting(true);
      } else {
        // Popup got blocked anyway (e.g. user has popups disabled) — fall
        // back to a normal in-place redirect rather than doing nothing.
        window.location.href = data.url;
      }
      return;
    }

    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return { signInWithGoogle, waiting };
}
