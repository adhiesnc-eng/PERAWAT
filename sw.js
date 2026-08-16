const CACHE_NAME = 'absensi_ugd-v1.5.0'; 
const ASSETS = [
  "./", 
  "./manifest.json", 
  "./icon-512.png", 
  "./logo.png", 
  "./sw.js", 
  "./db.js",
  "./index.html",
  "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
  "https://unpkg.com/html5-qrcode",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
]; 

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
}); 

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
}); 

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // ⚡ PENTING: Lewati Cache (Network-Only) untuk Firebase, Google Script, & Gateway WA Fonnte
  if (
    url.includes('firebase') || 
    url.includes('googleapis.com') || 
    url.includes('fonnte.com') || 
    url.includes('script.google.com')
  ) {
    return e.respondWith(fetch(e.request));
  }

  // Aset statis: Cache First, fallback ke Network
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
