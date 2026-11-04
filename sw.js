// Freseate · service worker
const CACHE = 'freseate-v3';
const ASSETS = [
  './', 'index.html', 'styles.css', 'config.js', 'app.js', 'manifest.webmanifest',
  'img/logo.webp', 'img/cut-chocolate.webp', 'img/cut-arequipe.webp', 'img/cut-bowl.webp', 'img/cut-oblea.webp',
  'img/foto-chocolate.webp', 'img/foto-arequipe.webp', 'img/foto-bowl.webp', 'img/foto-oblea.webp',
  'img/foto-toppings.webp', 'img/foto-flyer.webp', 'img/icon-192.png'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // HTML, JS y CSS: primero la red (para que los cambios lleguen solos), si no hay señal, la copia guardada
  if (req.mode === 'navigate' || /\.(js|css|html)$/.test(new URL(req.url).pathname)) {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  // Imágenes: primero la copia guardada
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })));
});
