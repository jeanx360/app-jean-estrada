// Service Worker - Faz o app funcionar offline
const CACHE_NAME = 'jean-estrada-v1';
const urlsParaCache = [
    '/app-jean-estrada/',
    '/app-jean-estrada/index.html',
    '/app-jean-estrada/style.css',
    '/app-jean-estrada/script.js',
    '/app-jean-estrada/manifest.json'
];

// Instala o service worker e guarda os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsParaCache);
            })
    );
});

// Busca os arquivos do cache quando offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
