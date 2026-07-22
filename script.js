// ============================================
// APP JEAN NA ESTRADA - BUSCA VIA RSS (SEM API)
// ============================================

// CONFIGURAÇÕES DO SEU CANAL
const CHANNEL_ID = 'UCFwFlCooeFKHSLXxkRTA70g';
const MAX_VIDEOS = 10;

// FUNÇÃO PARA BUSCAR OS VÍDEOS VIA RSS
async function buscarVideosRSS() {
    // ⭐ CORREÇÃO: Busca o elemento dentro da seção "inicio-section" ⭐
    const inicioSection = document.getElementById('inicio-section');
    if (!inicioSection) return;

    let lista = document.getElementById('lista-videos');
    if (!lista) {
        // Se a lista não existir, cria ela dentro da seção "inicio"
        lista = document.createElement('div');
        lista.id = 'lista-videos';
        inicioSection.appendChild(lista);
    }
    
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

// FUNÇÃO PARA BUSCAR NOTÍCIAS DOS RSS
async function buscarNoticiasRSS() {
    const lista = document.getElementById('lista-noticias');
    
    if (!lista) return;
    
    lista.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <p style="font-size:18px;">🔄 Carregando notícias...</p>
        </div>
    `;
    
    try {
        const feedsNoticias = [
            { nome: "InsideEVs Brasil", url: "https://insideevs.com/brasil/feed/" },
            { nome: "Tecnologia - UOL", url: "https://rss.uol.com.br/feed/tecnologia.xml" },
            { nome: "Carros Elétricos - Canaltech", url: "https://canaltech.com.br/feed/" }
        ];
        
        let todasNoticias = [];
        
        for (const feed of feedsNoticias) {
            try {
                const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
                const resposta = await fetch(proxyUrl);
                const dados = await resposta.json();
                
                if (dados.status === 'ok' && dados.items) {
                    const noticiasComFonte = dados.items.slice(0, 5).map(item => ({
                        ...item,
                        fonte: feed.nome
                    }));
                    todasNoticias = todasNoticias.concat(noticiasComFonte);
                }
            } catch (erro) {
                console.log(`Erro ao buscar ${feed.nome}:`, erro);
            }
        }
        
        todasNoticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        const noticias = todasNoticias.slice(0, 15);
        
        if (noticias.length === 0) {
            lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>📰 Nenhuma notícia encontrada no momento.</p></div>`;
            return;
        }
        
        lista.innerHTML = '';
        
        noticias.forEach(item => {
            const div = document.createElement('div');
            div.className = 'video-item';
            
            let imagem = '';
            if (item.thumbnail) {
                imagem = `<img src="${item.thumbnail}" alt="${item.title}" style="width:100%;border-radius:10px;margin:10px 0;">`;
            }
            
            const dataPublicacao = new Date(item.pubDate);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            const descricao = item.description ? 
                item.description.replace(/<[^>]*>/g, '').substring(0, 150) : 
                'Sem descrição';
            
            div.innerHTML = `
                <h3 style="font-size:16px;">📰 ${item.title}</h3>
                <p style="font-size:12px;color:#94A3B8;margin:5px 0;">
                    📅 ${dataFormatada} · Fonte: ${item.fonte || 'Desconhecida'}
                </p>
                ${imagem}
                <p style="font-size:14px;color:#94A3B8;margin:10px 0;">${descricao}...</p>
                <a href="${item.link}" target="_blank" class="link-youtube" style="color:#00B8FF;text-decoration:none;font-weight:600;">
                    🔗 Ler notícia completa
                </a>
            `;
            lista.appendChild(div);
        });
        
    } catch (erro) {
        lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>❌ Erro ao carregar notícias: ${erro.message}</p></div>`;
        console.log('Erro ao buscar notícias:', erro);
    }
}

// FUNÇÃO PARA O BOTÃO DE CONTATO
function enviarMensagem() {
    window.open('https://www.youtube.com/@jeannaestrada', '_blank');
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    buscarVideosRSS();
});

// Recarregar ao voltar a ficar online
document.addEventListener('online', function() {
    buscarVideosRSS();
});

// Recarregar a cada 5 minutos
setInterval(buscarVideosRSS, 300000);
