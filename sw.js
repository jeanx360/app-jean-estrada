// ============================================
// SERVICE WORKER - JEAN NA ESTRADA
// ============================================

// ⭐ TROQUE ESTE NÚMERO PARA FORÇAR ATUALIZAÇÃO ⭐
const CACHE_VERSION = 'v3.0.3';
const CACHE_NAME = `jean-estrada-${CACHE_VERSION}`;

const urlsParaCache = [
    '/app-jean-estrada/',
    '/app-jean-estrada/index.html',
    '/app-jean-estrada/style.css',
    '/app-jean-estrada/script.js',
    '/app-jean-estrada/manifest.json',
    '/app-jean-estrada/imagens/icone-192.png',
    '/app-jean-estrada/imagens/icone-512.png',
    '/app-jean-estrada/imagens/favicon.ico',
    '/app-jean-estrada/imagens/apple-touch-icon.png'
];

// INSTALAÇÃO
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log(`✅ Cache ${CACHE_NAME} aberto`);
                return cache.addAll(urlsParaCache);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// ATIVAÇÃO - Remove caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log(`🗑️ Cache antigo removido: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// BUSCA
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        return new Response('Você está offline. Conecte-se para ver os vídeos.', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});
