// service-worker.js
const CACHE_NAME = 'SeaFishing-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'base.css',
    'layout.css',
    'forms.css',
    'tables.css',
    'charts.css',
    'print.css',
    'responsive.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    '/manifest.json',
    'utils.js',
    'charts.js',
    'print.js',
    'script.js',
    'locais.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});