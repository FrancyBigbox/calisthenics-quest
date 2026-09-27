const CACHE_NAME = "calisthenics-quest-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("calisthenics-quest-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request)
          .then((networkResponse) => {
            const copy = networkResponse.clone();
            const requestUrl = new URL(event.request.url);

            if (requestUrl.origin === self.location.origin && networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }

            return networkResponse;
          })
          .catch(() => caches.match("./index.html"));
      })
  );
});