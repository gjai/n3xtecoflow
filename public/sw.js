self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/** Réseau d’abord pour les pages (résultats 21h). Cache court pour les icônes. */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/brands/euromillions/icon-")) {
    event.respondWith(
      caches.open("em-icons-v1").then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(
        () =>
          new Response("Hors ligne — ouvrez euromillions-resultats.fr.", {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          }),
      ),
    );
  }
});
