// ============================================
// NOTÍCIAS - RSS DE CARROS ELÉTRICOS E TECNOLOGIA
// ============================================

// Lista de feeds RSS para notícias
const feedsNoticias = [
    {
        nome: "InsideEVs Brasil",
        url: "https://insideevs.com/brasil/feed/"
    },
    {
        nome: "Tecnologia - UOL",
        url: "https://rss.uol.com.br/feed/tecnologia.xml"
    },
    {
        nome: "Carros Elétricos - Canaltech",
        url: "https://canaltech.com.br/feed/"
    }
];

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
        let todasNoticias = [];
        
        // Busca notícias de cada feed
        for (const feed of feedsNoticias) {
            try {
                const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
                const resposta = await fetch(proxyUrl);
                const dados = await resposta.json();
                
                if (dados.status === 'ok' && dados.items) {
                    // Adiciona a fonte a cada notícia
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
        
        // Ordena por data (mais recentes primeiro)
        todasNoticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // Limita a 15 notícias
        const noticias = todasNoticias.slice(0, 15);
        
        if (noticias.length === 0) {
            lista.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <p>📰 Nenhuma notícia encontrada no momento.</p>
                    <p style="font-size:14px;color:#94A3B8;margin-top:10px;">Tente novamente mais tarde.</p>
                </div>
            `;
            return;
        }
        
        // Limpa a lista
        lista.innerHTML = '';
        
        // Cria os cards de notícia
        noticias.forEach(item => {
            const div = document.createElement('div');
            div.className = 'video-item';
            
            // Pega a imagem (se existir)
            let imagem = '';
            if (item.thumbnail) {
                imagem = `<img src="${item.thumbnail}" alt="${item.title}" style="width:100%;border-radius:10px;margin:10px 0;">`;
            } else if (item.enclosure && item.enclosure.link) {
                imagem = `<img src="${item.enclosure.link}" alt="${item.title}" style="width:100%;border-radius:10px;margin:10px 0;">`;
            }
            
            // Formata a data
            const dataPublicacao = new Date(item.pubDate);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            // Remove HTML da descrição
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
        lista.innerHTML = `
            <div style="text-align:center;padding:30px;">
                <p>❌ Erro ao carregar notícias: ${erro.message}</p>
                <button onclick="buscarNoticiasRSS()" style="margin-top:15px;padding:10px 20px;background:#00B8FF;color:white;border:none;border-radius:8px;cursor:pointer;">
                    🔄 Tentar novamente
                </button>
            </div>
        `;
        console.log('Erro ao buscar notícias:', erro);
    }
}
