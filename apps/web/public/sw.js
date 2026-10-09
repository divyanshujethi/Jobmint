const CACHE_NAME = "rolenest-cache-v3-bust";
const OFFLINE_URL = "/offline";

// Only precache offline fallback and essential static assets - NEVER dynamic HTML routes
const PRECACHE_ASSETS = [
  "/offline",
  "/manifest.json",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // Unconditionally delete all old/stale caches to purge stale HTML
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Don't intercept API routes, Auth requests, or Next.js internals
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) return;

  // For HTML navigations: ALWAYS go network-first so users never receive stale cached pages
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const offlinePage = await caches.match(OFFLINE_URL);
        if (offlinePage) {
          return offlinePage;
        }
        return new Response("You are currently offline. Please check your internet connection.", {
          headers: { "Content-Type": "text/plain" }
        });
      })
    );
    return;
  }

  // For static icons and offline fallback: check cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});