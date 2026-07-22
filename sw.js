// ============================================
// SERVICE WORKER - APP FUNCIONA OFFLINE
// ============================================

const CACHE_NAME = 'jean-estrada-v2';
const urlsParaCache = [
    '/app-jean-estrada/',
    '/app-jean-estrada/index.html',
    '/app-jean-estrada/style.css',
    '/app-jean-estrada/script.js',
    '/app-jean-estrada/manifest.json'
];

// INSTALAÇÃO - Guarda os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsParaCache);
            })
            .catch(err => console.log('Erro ao cachear:', err))
    );
});

// ATIVAÇÃO - Limpa caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Cache antigo removido:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// BUSCA - Serve os arquivos do cache quando offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se encontrou no cache, retorna
                if (response) {
                    return response;
                }
                // Se não, tenta buscar na rede
                return fetch(event.request)
                    .then(response => {
                        // Se for uma resposta válida, guarda no cache
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
                        // Se offline e não tem no cache, mostra página de erro
                        return new Response('Você está offline. Conecte-se para ver os vídeos.', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});
