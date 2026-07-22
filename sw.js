// ============================================
// SERVICE WORKER - JEAN NA ESTRADA
// ============================================

// ⭐ ALTERE ESTE NÚMERO SEMPRE QUE FIZER UMA ATUALIZAÇÃO GRANDE ⭐
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `jean-estrada-${CACHE_VERSION}`;

// Arquivos para cache (com versão para evitar cache antigo)
const urlsParaCache = [
    '/app-jean-estrada/',
    '/app-jean-estrada/index.html?v=2.0',
    '/app-jean-estrada/style.css?v=2.0',
    '/app-jean-estrada/script.js',
    '/app-jean-estrada/manifest.json?v=2.0',
    '/app-jean-estrada/imagens/icone-192.png',
    '/app-jean-estrada/imagens/icone-512.png',
    '/app-jean-estrada/imagens/favicon.ico',
    '/app-jean-estrada/imagens/apple-touch-icon.png'
];

// INSTALAÇÃO - Guarda os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log(`✅ Cache ${CACHE_NAME} aberto`);
                return cache.addAll(urlsParaCache);
            })
            .then(() => {
                // Força o Service Worker a ativar imediatamente
                return self.skipWaiting();
            })
    );
});

// ATIVAÇÃO - Remove caches antigos e toma controle
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
            // Toma controle das abas abertas imediatamente
            return self.clients.claim();
        })
    );
});

// BUSCA - Serve os arquivos do cache quando offline
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
