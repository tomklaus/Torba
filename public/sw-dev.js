// Development Service Worker - minimal version for testing
console.log('[DEV SW] Loading...');

self.addEventListener('install', (event) => {
  console.log('[DEV SW] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[DEV SW] Activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests in dev mode
  event.respondWith(fetch(event.request));
});
