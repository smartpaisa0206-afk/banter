// Banter service worker — kept intentionally minimal so it never interferes
// with API/auth traffic. Its only jobs: make the PWA installable and survive
// a reload when offline by serving the cached shell.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through for everything (API, auth, streaming). We intentionally do NOT
// cache /api/* so sessions and live generations always hit the network.
self.addEventListener('fetch', (event) => {
  // Let the browser handle it normally.
});
