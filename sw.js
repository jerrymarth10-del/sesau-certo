const CACHE_NAME = "jr-a-prova-pwa-v5-student-copy";
const APP_SHELL = [
   "./especificas.html",
  "./manifest.webmanifest",
  "./icon-144.png",
  "./icon-256.png",
  "./icon-384.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Nunca cacheia autenticação/API.
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) return;

  // Conteúdo externo (YouTube/PDFs externos) segue normal pela rede.
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // A área do aluno é personalizada (sessão/e-mail/conteúdo liberado).
    // Nunca guardar navegação em Cache Storage.
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
