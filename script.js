// ============================================
// APP JEAN NA ESTRADA - BUSCA VIA RSS (SEM API)
// ============================================

// CONFIGURAÇÕES DO SEU CANAL
const CHANNEL_ID = 'UCFwFlCooeFKHSLXxkRTA70g';
const MAX_VIDEOS = 10;

// FUNÇÃO PARA BUSCAR OS VÍDEOS VIA RSS
async function buscarVideosRSS() {
    const lista = document.getElementById('lista-videos');
    
    lista.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <p style="font-size:18px;">🔄 Carregando vídeos...</p>
        </div>
    `;
    
    try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const resposta = await fetch(proxyUrl);
        const dados = await resposta.json();
        
        if (dados.status !== 'ok') {
            lista.innerHTML = `<p>❌ Erro ao carregar vídeos. Tente novamente.</p>`;
            return;
        }
        
        if (!dados.items || dados.items.length === 0) {
            lista.innerHTML = '<p>📹 Nenhum vídeo encontrado.</p>';
            return;
        }
        
        lista.innerHTML = '';
        const videos = dados.items.slice(0, MAX_VIDEOS);
        
        videos.forEach(item => {
            const videoUrl = item.link;
            const videoId = videoUrl.split('v=')[1] || videoUrl.split('/').pop();
            const dataPublicacao = new Date(item.pubDate);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            const div = document.createElement('div');
            div.className = 'video-item';
            
            // ⭐ NOVO LAYOUT: SÓ O PLAYER + TÍTULO + DATA
            div.innerHTML = `
                <h3>▶️ ${item.title}</h3>
                <p class="data-publicacao">📅 ${dataFormatada}</p>
                <div class="player-wrapper">
                    <iframe 
                        width="100%" 
                        height="200" 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allowfullscreen
                        loading="lazy">
                    </iframe>
                </div>
                <a href="${item.link}" target="_blank" class="link-youtube">
                    🔗 Assistir no YouTube
                </a>
            `;
            lista.appendChild(div);
        });
        
    } catch (erro) {
        lista.innerHTML = `<p>❌ Erro: ${erro.message}</p>`;
    }
}

// FUNÇÃO PARA O BOTÃO DE CONTATO
function enviarMensagem() {
    window.open('https://www.youtube.com/@jeannaestrada', '_blank');
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', buscarVideosRSS);
document.addEventListener('online', buscarVideosRSS);
setInterval(buscarVideosRSS, 300000);
