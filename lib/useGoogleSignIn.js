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
// and back doesn't reliably resume the same app instance, so in standalone
// mode we open Google's consent screen in a real Safari tab instead.
//
// That tab has to be opened with the real destination URL already known, in
// the same synchronous tick as the click — Safari does not reliably honor
// window.open("", "_blank") followed by setting .location.href on it later,
// even a tick later. So the URL is generated ahead of time, as soon as this
// page loads, and the click just opens it directly.
export function useGoogleSignIn() {
  const router = useRouter();
  const [waiting, setWaiting] = useState(false);
  const [prefetchedUrl, setPrefetchedUrl] = useState(null);
  const standaloneRef = useRef(false);

  useEffect(() => {
    standaloneRef.current = isStandalone();
    if (!standaloneRef.current) return;

    let cancelled = false;
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });
      if (!cancelled && data?.url) setPrefetchedUrl(data.url);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!waiting) return;

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
      document.removeEventListener("visibilitychange", checkSession);
      window.removeEventListener("focus", checkSession);
    };
  }, [waiting, router]);

  function signInWithGoogle() {
    if (standaloneRef.current) {
      if (!prefetchedUrl) return; // not ready yet — button is disabled until it is
      window.open(prefetchedUrl, "_blank", "noopener,noreferrer");
      setWaiting(true);
      return;
    }

    const sb = supabaseBrowser();
    sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  const googleReady = !standaloneRef.current || !!prefetchedUrl;

  return { signInWithGoogle, waiting, googleReady };
}
