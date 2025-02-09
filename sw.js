const CACHE_NAME = 'asap-help-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/site-config.json',
  '/styles.css',
  '/sw.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// 注册Service Worker实现离线缓存
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker 注册成功');
            });
    });
} 