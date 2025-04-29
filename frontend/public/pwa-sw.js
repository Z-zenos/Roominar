// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = 'pwabuilder-offline-page';

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.add('/offline');
    }),
  );
});

// If any fetch fails, it will show the offline page.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(async function () {
      const cache = await caches.open(CACHE);
      return await cache.match('/offline');
    }),
  );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
