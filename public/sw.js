const CACHE_NAME = 'meus-ingressos-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/ingresso.html',
  '/admin.html',
  '/home.css',
  '/style.css',
  '/admin.css',
  '/script.js',
  '/admin.js',
  '/manifest.json',
  '/assets/icon-16.png',
  '/assets/icon-32.png',
  '/assets/icon-72.png',
  '/assets/icon-144.png',
  '/assets/icon-152.png',
  '/assets/icon-192.png',
  '/assets/icon-384.png',
  '/assets/icon-512.png',
  '/assets/quentro.png',
  '/assets/djavan.png',
  '/assets/ticketmaster.png',
  '/assets/qr1.png',
  '/assets/qr2.png',
  '/assets/qr3.png',
  '/assets/qr4.png',
  '/assets/qr5.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => caches.match('./index.html'))
  );
});