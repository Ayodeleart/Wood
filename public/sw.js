// Minimal service worker — its only job is to exist, so the browser considers
// the site installable as a PWA. No caching: product/price data must always
// be fresh, and stale offline data would be actively wrong, not just inconvenient.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Pass-through only — no caching.
});
