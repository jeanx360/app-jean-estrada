// ============================================
// VERSÃO DO APP (SEMÂNTICA)
// ============================================
const APP_VERSION = '1.03';
console.log(`📱 Jean na Estrada App v${APP_VERSION}`);

// ============================================
// VERSÃO DO APP (TÉCNICA)
// ============================================
window.versaoApp = '20260726-final';
console.log('📦 Script.js carregado! Versão:', window.versaoApp);

// ============================================
// CONFIGURAÇÕES
// ============================================
const CHANNEL_ID = 'UCFwFlCooeFKHSLXxkRTA70g';
const MAX_VIDEOS = 10;

// ============================================
// FUNÇÃO PARA BUSCAR VÍDEOS (YouTube)
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
// PROXY CORS COM FALLBACK (ATUALIZADO - MAIS PROXIES)
// ============================================

const PROXY_LIST = [
    // 1. AllOrigins (mais confiável, mas pode ser lento)
    {
        name: 'AllOrigins (Raw)',
        fetch: async (url) => {
            const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
                signal: AbortSignal.timeout(10000) // 10 segundos
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        }
    },
    // 2. CORSProxy.io (alternativa)
    {
        name: 'CORSProxy.io',
        fetch: async (url) => {
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, {
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        }
    },
    // 3. Proxy.cors.sh (com chave pública temporária)
    {
        name: 'Proxy.cors.sh',
        fetch: async (url) => {
            const response = await fetch(`https://proxy.cors.sh/${encodeURIComponent(url)}`, {
                headers: {
                    'x-cors-api-key': 'temp_7a8b9c0d1e2f3g4h5i6j'
                },
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        }
    },
    // 4. CORS.io (alternativa)
    {
        name: 'CORS.io',
        fetch: async (url) => {
            const response = await fetch(`https://cors.io/?${encodeURIComponent(url)}`, {
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        }
    },
    // 5. CORS Anywhere (Heroku, público)
    {
        name: 'CORS Anywhere',
        fetch: async (url) => {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/${encodeURIComponent(url)}`, {
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        }
    },
    // 6. CORS Proxy (eu.org)
    {
        name: 'CORS Proxy (eu.org)',
        fetch: async (url) => {
            const response = await fetch(`https://corsproxy.eu.org/${encodeURIComponent(url)}`, {
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        }
    }
];

async function fetchFeedWithProxy(feedUrl) {
    let lastError = null;
    for (const proxy of PROXY_LIST) {
        try {
            console.log(`🔄 Tentando proxy: ${proxy.name}`);
            const result = await proxy.fetch(feedUrl);
            // Verifica se o resultado parece XML
            const trimmed = result.trim();
            if (trimmed.startsWith('<?xml') || trimmed.startsWith('<rss') || trimmed.startsWith('<feed')) {
                console.log(`✅ Proxy ${proxy.name} funcionou!`);
                return result;
            } else {
                console.log(`⚠️ Proxy ${proxy.name} retornou conteúdo inválido.`);
                // Se não for XML, tenta o próximo
                continue;
            }
        } catch (e) {
            console.log(`❌ Proxy ${proxy.name} falhou: ${e.message}`);
            lastError = e;
            // Se for 403 ou 404, não espera o timeout, vai para o próximo
            if (e.message.includes('403') || e.message.includes('404')) {
                continue;
            }
        }
    }
    throw new Error(`Todos os proxies falharam. Último erro: ${lastError ? lastError.message : 'Desconhecido'}`);
}

// ============================================
// FUNÇÃO PARA EXTRAIR IMAGEM DO ITEM RSS
// ============================================
function extrairImagem(item) {
    const enclosure = item.querySelector('enclosure');
    if (enclosure) {
        const url = enclosure.getAttribute('url');
        if (url) return url;
    }
    
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent) {
        const url = mediaContent.getAttribute('url');
        if (url) return url;
    }
    
    const mediaThumb = item.querySelector('media\\:thumbnail, thumbnail');
    if (mediaThumb) {
        const url = mediaThumb.getAttribute('url');
        if (url) return url;
    }
    
    const description = item.querySelector('description');
    if (description) {
        const match = description.textContent.match(/<img[^>]+src="([^">]+)"/);
        if (match) return match[1];
    }
    
    const encoded = item.querySelector('content\\:encoded, encoded');
    if (encoded) {
        const match = encoded.textContent.match(/<img[^>]+src="([^">]+)"/);
        if (match) return match[1];
    }
    
    return '';
}

// ============================================
// FILTRO POR PALAVRAS-CHAVE (CARROS ELÉTRICOS E TECNOLOGIA)
// ============================================
const PALAVRAS_CHAVE = [
    'byd', 'tesla', 'volvo', 'bmw', 'mercedes', 'audi', 'porsche', 'volkswagen', 'vw',
    'renault', 'nissan', 'hyundai', 'kia', 'jaguar', 'land rover', 'ford', 'chevrolet',
    'gm', 'fiat', 'peugeot', 'citroën', 'opel', 'mitsubishi', 'subaru', 'honda', 'toyota',
    'lexus', 'mini', 'smart', 'gwm', 'ora', 'geely', 'leapmotor', 'jetour',
    'elétrico', 'eletrico', 'eletrificado', 'hibrido', 'híbrido', 'plugin', 'phev',
    'bev', 'ev', 'evs', 'carro elétrico', 'veículo elétrico', 'mobilidade elétrica',
    'carregamento', 'recarga', 'bateria', 'autonomia', 'motor elétrico', 'eletroposto',
    'tecnologia', 'inovação', 'automação', 'condução autônoma', 'sensor',
    'inteligência artificial', 'carro conectado', 'multimídia', 'painel digital',
    'atualização', 'recarga rápida', 'arquitetura 800v', '800v',
    'lançamento', 'novo modelo', 'pré-venda', 'teste', 'review', 'análise',
    'comparativo', 'preço', 'financiamento', 'vendas', 'mercado'
];

function filtrarNoticia(titulo, descricao) {
    const texto = (titulo + ' ' + descricao).toLowerCase();
    return PALAVRAS_CHAVE.some(palavra => texto.includes(palavra));
}

// ============================================
// FUNÇÃO PARA BUSCAR NOTÍCIAS (COM PROXY CORRIGIDO)
// ============================================
window.buscarNoticiasRSS = async function() {
    const lista = document.getElementById('lista-noticias');
    if (!lista) return;

    console.log('📰 Iniciando busca de notícias...');
    lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>🔄 Carregando notícias especializadas...</p></div>`;
    
    try {
        const feeds = [
            { nome: "InsideEVs Brasil", url: "https://insideevs.uol.com.br/rss/articles/all/" },
            { nome: "Motor1.com", url: "https://motor1.uol.com.br/rss/news/all/" },
            { nome: "Quilowatt", url: "https://quilowatt.com.br/feed/" }
        ];
        
        let todasNoticias = [];
        let feedsCarregados = 0;

        for (const feed of feeds) {
            try {
                console.log(`📡 Buscando ${feed.nome}...`);
                lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>🔄 Carregando ${feed.nome}...</p></div>`;
                
                const xmlText = await fetchFeedWithProxy(feed.url);
                
                // Força a codificação UTF-8
                const blob = new Blob([xmlText], { type: 'text/xml;charset=UTF-8' });
                const urlBlob = URL.createObjectURL(blob);
                const respostaBlob = await fetch(urlBlob);
                const textoCorrigido = await respostaBlob.text();
                URL.revokeObjectURL(urlBlob);
                
                const parser = new DOMParser();
                const xml = parser.parseFromString(textoCorrigido, 'text/xml');
                
                const parseError = xml.querySelector('parsererror');
                if (parseError) {
                    console.log(`⚠️ Erro ao parsear ${feed.nome}`);
                    continue;
                }
                
                let items = xml.querySelectorAll('item');
                if (items.length === 0) {
                    items = xml.querySelectorAll('entry');
                }
                
                console.log(`📡 ${feed.nome}: ${items.length} itens encontrados`);
                
                let itensFiltrados = 0;
                const itensLimitados = Array.from(items).slice(0, 15);
                
                for (const item of itensLimitados) {
                    let title = item.querySelector('title')?.textContent || 'Sem título';
                    let link = item.querySelector('link')?.getAttribute('href') || 
                              item.querySelector('link')?.textContent || '#';
                    let pubDate = item.querySelector('pubDate')?.textContent || 
                                 item.querySelector('published')?.textContent || 
                                 new Date().toUTCString();
                    let description = item.querySelector('description')?.textContent || 
                                     item.querySelector('summary')?.textContent || 
                                     'Sem descrição';
                    
                    if (!filtrarNoticia(title, description)) {
                        continue;
                    }
                    itensFiltrados++;
                    
                    let imagem = extrairImagem(item);
                    
                    const descricaoLimpa = description
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
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
                }
                
                console.log(`📡 ${feed.nome}: ${itensFiltrados} itens relevantes encontrados`);
                feedsCarregados++;
                
            } catch (erro) {
                console.log(`❌ Erro ao buscar ${feed.nome}:`, erro.message);
            }
        }
        
        todasNoticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        const noticias = todasNoticias.slice(0, 20);
        
        if (noticias.length === 0) {
            lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>📰 Nenhuma notícia relevante encontrada.</p><p style="font-size:14px;color:#94A3B8;margin-top:10px;">Tente novamente mais tarde.</p></div>`;
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
            
            let imagemHTML = '';
            if (item.imagem) {
                imagemHTML = `<img src="${item.imagem}" alt="${item.titulo}" style="width:100%;border-radius:10px;margin:10px 0;max-height:300px;object-fit:cover;" loading="lazy" onerror="this.style.display='none'">`;
            }
            
            div.innerHTML = `
                <h3 style="font-size:16px;">📰 ${item.titulo}</h3>
                <p style="font-size:12px;color:#94A3B8;margin:5px 0;">
                    📅 ${dataFormatada} · Fonte: ${item.fonte}
                </p>
                ${imagemHTML}
                <p style="font-size:14px;color:#94A3B8;margin:10px 0;">${item.descricao}...</p>
                <a href="${item.link}" target="_blank" class="link-youtube" style="color:#00B8FF;text-decoration:none;font-weight:600;">
                    🔗 Ler notícia completa
                </a>
            `;
            lista.appendChild(div);
        });
        
        console.log(`✅ Notícias carregadas com sucesso! (${feedsCarregados} fontes carregadas, ${noticias.length} notícias exibidas)`);
        
    } catch (erro) {
        lista.innerHTML = `<p>❌ Erro ao carregar notícias: ${erro.message}</p>`;
        console.log('❌ Erro ao buscar notícias:', erro);
    }
};
