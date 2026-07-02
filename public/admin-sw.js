// Minimal service worker — its only job here is to exist, so the browser considers
// /admin installable as a PWA. Network requests pass straight through; nothing is
// cached, since admin data must always be fresh (stale product/category data in an
// offline cache would be actively wrong, not just inconvenient).
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Pass-through only — no caching.
});
