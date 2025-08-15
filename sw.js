/* Service worker for FP3 Study App v4 */
const CACHE_NAME = 'fp3-study-v4-cache-v1';
const ASSETS = [
  './',
  './fp3_study_app_v4.html',
  './sw.js',
  './manifest.webmanifest'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).then(networkResp => {
        const copy = networkResp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return networkResp;
      }).catch(()=> caches.match('./fp3_study_app_v4.html'));
    })
  );
});