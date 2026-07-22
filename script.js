// ============================================
// VERSÃO DO APP - FORÇA ATUALIZAÇÃO
// ============================================
window.versaoApp = '20260725-final';
console.log('📦 Script.js carregado! Versão:', window.versaoApp);

// ============================================
// APP JEAN NA ESTRADA - BUSCA VIA RSS (SEM API)
// ============================================

// CONFIGURAÇÕES DO SEU CANAL
const CHANNEL_ID = 'UCFwFlCooeFKHSLXxkRTA70g';
const MAX_VIDEOS = 10;

// ============================================
// FUNÇÃO PARA BUSCAR OS VÍDEOS VIA RSS
// ============================================
window.buscarVideosRSS = async function() {
    const lista = document.getElementById('lista-videos');
    if (!lista) return;

    lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>🔄 Carregando vídeos...</p></div>`;
    
    try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        const resposta = await fetch(proxyUrl);
        const dados = await resposta.json();
        
        if (dados.status !== 'ok' || !dados.items || dados.items.length === 0) {
            lista.innerHTML = '<p>📹 Nenhum vídeo encontrado.</p>';
            return;
        }
        
        lista.innerHTML = '';
        const videos = dados.items.slice(0, MAX_VIDEOS);
        
        videos.forEach(item => {
            const videoId = item.link.split('v=')[1] || item.link.split('/').pop();
            const dataFormatada = new Date(item.pubDate).toLocaleDateString('pt-BR');
            const div = document.createElement('div');
            div.className = 'video-item';
            div.innerHTML = `
                <h3>▶️ ${item.title}</h3>
                <p class="data-publicacao">📅 ${dataFormatada}</p>
                <div class="player-wrapper">
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen loading="lazy"></iframe>
                </div>
                <a href="${item.link}" target="_blank" class="link-youtube">🔗 Assistir no YouTube</a>
            `;
            lista.appendChild(div);
        });
        
    } catch (erro) {
        lista.innerHTML = `<p>❌ Erro ao carregar vídeos: ${erro.message}</p>`;
        console.log('Erro ao buscar vídeos:', erro);
    }
};

// ============================================
// FUNÇÃO PARA BUSCAR NOTÍCIAS COM DOMPARSER
// ============================================
window.buscarNoticiasRSS = async function() {
    const lista = document.getElementById('lista-noticias');
    if (!lista) return;

    lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>🔄 Carregando notícias...</p></div>`;
    
    try {
        // ⭐ FEEDS COM SUPORTE CONFIRMADO
        const feeds = [
            { nome: "UOL Tecnologia", url: "https://rss.uol.com.br/feed/tecnologia.xml" },
            { nome: "InsideEVs Brasil", url: "https://insideevs.com/brasil/feed/" },
            { nome: "Canaltech", url: "https://canaltech.com.br/feed/" }
        ];
        
        let todasNoticias = [];

        for (const feed of feeds) {
            try {
                console.log(`📡 Buscando ${feed.nome}...`);
                const resposta = await fetch(feed.url, {
                    headers: {
                        'Accept': 'application/xml, text/xml, */*'
                    }
                });
                
                if (!resposta.ok) {
                    console.log(`⚠️ ${feed.nome} retornou status ${resposta.status}`);
                    continue;
                }
                
                // ⭐ LÊ O TEXTO BRUTO E FORÇA UTF-8
                let texto = await resposta.text();
                
                // Remove BOM se existir
                if (texto.charCodeAt(0) === 0xFEFF) {
                    texto = texto.slice(1);
                }
                
                // ⭐ FORÇA A CODIFICAÇÃO UTF-8
                const blob = new Blob([texto], { type: 'text/xml;charset=UTF-8' });
                const urlBlob = URL.createObjectURL(blob);
                const respostaBlob = await fetch(urlBlob);
                const textoCorrigido = await respostaBlob.text();
                URL.revokeObjectURL(urlBlob);
                
                // Parseia o XML
                const parser = new DOMParser();
                const xml = parser.parseFromString(textoCorrigido, 'text/xml');
                
                // Verifica erro de parsing
                const parseError = xml.querySelector('parsererror');
                if (parseError) {
                    console.log(`⚠️ Erro ao parsear ${feed.nome}`);
                    continue;
                }
                
                // Extrai os itens (trata diferentes estruturas)
                let items = xml.querySelectorAll('item');
                if (items.length === 0) {
                    // Tenta com 'entry' (Atom)
                    items = xml.querySelectorAll('entry');
                }
                
                console.log(`📡 ${feed.nome}: ${items.length} itens encontrados`);
                
                const itensLimitados = Array.from(items).slice(0, 5);
                
                itensLimitados.forEach(item => {
                    // Tenta diferentes formas de obter título
                    let title = item.querySelector('title')?.textContent || 
                               item.querySelector('title')?.textContent;
                    
                    // Link
                    let link = item.querySelector('link')?.getAttribute('href') || 
                              item.querySelector('link')?.textContent || '#';
                    
                    // Data
                    let pubDate = item.querySelector('pubDate')?.textContent || 
                                 item.querySelector('published')?.textContent || 
                                 new Date().toUTCString();
                    
                    // Descrição
                    let description = item.querySelector('description')?.textContent || 
                                     item.querySelector('summary')?.textContent || 
                                     'Sem descrição';
                    
                    // Imagem
                    let imagem = '';
                    const enclosure = item.querySelector('enclosure');
                    if (enclosure) {
                        imagem = enclosure.getAttribute('url') || '';
                    }
                    if (!imagem) {
                        const content = item.querySelector('content') || item.querySelector('encoded');
                        if (content) {
                            const match = content.textContent.match(/<img[^>]+src="([^">]+)"/);
                            if (match) imagem = match[1];
                        }
                    }
                    
                    // ⭐ LIMPA A DESCRIÇÃO (REMOVE HTML E DECODIFICA ENTIDADES)
                    const descricaoLimpa = description
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .trim()
                        .substring(0, 200);
                    
                    todasNoticias.push({
                        titulo: title.trim(),
                        link: link,
                        pubDate: pubDate,
                        descricao: descricaoLimpa,
                        imagem: imagem,
                        fonte: feed.nome
                    });
                });
                
            } catch (erro) {
                console.log(`❌ Erro ao buscar ${feed.nome}:`, erro);
            }
        }
        
        // Ordena por data
        todasNoticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        const noticias = todasNoticias.slice(0, 15);
        
        if (noticias.length === 0) {
            lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>📰 Nenhuma notícia encontrada.</p></div>`;
            return;
        }
        
        lista.innerHTML = '';
        
        noticias.forEach(item => {
            const div = document.createElement('div');
            div.className = 'video-item';
            
            const dataFormatada = new Date(item.pubDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            let imagem = '';
            if (item.imagem) {
                imagem = `<img src="${item.imagem}" alt="${item.titulo}" style="width:100%;border-radius:10px;margin:10px 0;" loading="lazy">`;
            }
            
            div.innerHTML = `
                <h3 style="font-size:16px;">📰 ${item.titulo}</h3>
                <p style="font-size:12px;color:#94A3B8;margin:5px 0;">
                    📅 ${dataFormatada} · Fonte: ${item.fonte}
                </p>
                ${imagem}
                <p style="font-size:14px;color:#94A3B8;margin:10px 0;">${item.descricao}...</p>
                <a href="${item.link}" target="_blank" class="link-youtube" style="color:#00B8FF;text-decoration:none;font-weight:600;">
                    🔗 Ler notícia completa
                </a>
            `;
            lista.appendChild(div);
        });
        
        console.log('✅ Notícias carregadas com sucesso!');
        
    } catch (erro) {
        lista.innerHTML = `<p>❌ Erro ao carregar notícias: ${erro.message}</p>`;
        console.log('❌ Erro ao buscar notícias:', erro);
    }
};
