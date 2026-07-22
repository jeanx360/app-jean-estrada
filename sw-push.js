// ============================================
// SERVICE WORKER PARA NOTIFICAÇÕES PUSH
// ============================================

self.addEventListener('push', function(event) {
    const data = event.data.json();
    
    const options = {
        body: data.body || 'Nova notícia disponível!',
        icon: 'imagens/icone-192.png',
        badge: 'imagens/icone-192.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        },
        actions: [
            { action: 'open', title: '📰 Abrir' },
            { action: 'close', title: '❌ Fechar' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Jean na Estrada', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
