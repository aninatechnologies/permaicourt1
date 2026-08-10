const CACHE_NAME = 'permai-court-cache-v1';
const ASSETS = [
  '/permaicourt1/',
  '/permaicourt1/index.html',
  '/permaicourt1/manifest.json',
  '/permaicourt1/icon-192.png',
  '/permaicourt1/icon-512.png',
  '/permaicourt1/icon-maskable-512.png'
];

// Menyimpan fail semasa proses install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan cache.addAll untuk menyimpan semua aset kritikal
      return cache.addAll(ASSETS);
    })
  );
});

// Mengambil fail dari cache jika offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
