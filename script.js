// ============================================
// VERSÃO DO APP (SEMÂNTICA)
// ============================================
const APP_VERSION = '1.04';
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
// PROXY CORS COM FALLBACK (APENAS MÉTODOS CONFIÁVEIS)
// ============================================

async function fetchFeedWithProxy(feedUrl) {
    // ⭐ MÉTODO 1: rss2json (mais confiável)
    try {
        console.log(`🔄 Tentando rss2json...`);
        const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(rss2jsonUrl, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            console.log(`✅ rss2json funcionou!`);
            return { source: 'rss2json', data: data };
        } else {
            throw new Error('rss2json retornou dados vazios');
        }
    } catch (e) {
        console.log(`⚠️ rss2json falhou: ${e.message}`);
    }

    // ⭐ MÉTODO 2: AllOrigins (get) - fallback
    try {
        console.log(`🔄 Tentando AllOrigins (get)...`);
        const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(allOriginsUrl, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.contents) {
            const contents = data.contents;
            if (contents.trim().startsWith('<?xml') || contents.trim().startsWith('<rss') || contents.trim().startsWith('<feed')) {
                console.log(`✅ AllOrigins (get) funcionou!`);
                return { source: 'xml', data: contents };
            } else {
                throw new Error('Conteúdo não é XML');
            }
        } else {
            throw new Error('Resposta vazia');
        }
    } catch (e) {
        console.log(`⚠️ AllOrigins (get) falhou: ${e.message}`);
    }

    throw new Error('Todos os métodos falharam.');
}

// ============================================
// FUNÇÃO PARA EXTRAIR IMAGEM DO ITEM RSS (TANTO XML QUANTO RSS2JSON)
// ============================================
function extrairImagem(item) {
    // Para dados vindos do rss2json
    if (item.enclosure && item.enclosure.link) {
        return item.enclosure.link;
    }
    if (item.thumbnail) {
        return item.thumbnail;
    }
    if (item.content && item.content.match(/<img[^>]+src="([^">]+)"/)) {
        const match = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (match) return match[1];
    }
    if (item.description && item.description.match(/<img[^>]+src="([^">]+)"/)) {
        const match = item.description.match(/<img[^>]+src="([^">]+)"/);
        if (match) return match[1];
    }
    
    // Para dados vindos do XML (elemento DOM)
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
// FUNÇÃO PARA BUSCAR NOTÍCIAS (VERSÃO OTIMIZADA)
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
                
                const result = await fetchFeedWithProxy(feed.url);
                
                let items = [];

                // Se veio do rss2json, já temos os dados em JSON
                if (result.source === 'rss2json') {
                    const dados = result.data;
                    if (dados.items && dados.items.length > 0) {
                        items = dados.items.map(item => {
                            // ⭐ EXTRAI A IMAGEM DO ITEM RSS2JSON
                            let imagem = '';
                            if (item.enclosure && item.enclosure.link) {
                                imagem = item.enclosure.link;
                            } else if (item.thumbnail) {
                                imagem = item.thumbnail;
                            } else if (item.content && item.content.match(/<img[^>]+src="([^">]+)"/)) {
                                const match = item.content.match(/<img[^>]+src="([^">]+)"/);
                                if (match) imagem = match[1];
                            } else if (item.description && item.description.match(/<img[^>]+src="([^">]+)"/)) {
                                const match = item.description.match(/<img[^>]+src="([^">]+)"/);
                                if (match) imagem = match[1];
                            }
                            
                            return {
                                titulo: item.title,
                                link: item.link,
                                pubDate: item.pubDate,
                                descricao: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 200) : 'Sem descrição',
                                imagem: imagem
                            };
                        });
                        console.log(`📡 ${feed.nome} (rss2json): ${items.length} itens`);
                    } else {
                        console.log(`⚠️ ${feed.nome} não retornou itens via rss2json`);
                        continue;
                    }
                } else {
                    // Veio como XML via AllOrigins
                    const xmlText = result.data;
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
                    
                    let xmlItems = xml.querySelectorAll('item');
                    if (xmlItems.length === 0) {
                        xmlItems = xml.querySelectorAll('entry');
                    }
                    
                    console.log(`📡 ${feed.nome} (XML): ${xmlItems.length} itens`);
                    
                    const itensLimitados = Array.from(xmlItems).slice(0, 15);
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
                        
                        items.push({
                            titulo: title.trim(),
                            link: link,
                            pubDate: pubDate,
                            descricao: descricaoLimpa,
                            imagem: imagem
                        });
                    }
                }

                // Aplica o filtro por palavras-chave
                let itensFiltrados = 0;
                for (const item of items) {
                    if (filtrarNoticia(item.titulo, item.descricao)) {
                        todasNoticias.push({
                            titulo: item.titulo,
                            link: item.link,
                            pubDate: item.pubDate,
                            descricao: item.descricao,
                            imagem: item.imagem,
                            fonte: feed.nome
                        });
                        itensFiltrados++;
                    }
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

// ============================================
// SISTEMA DE TEMAS (5 TEMAS)
// ============================================

// Definição dos temas disponíveis
const TEMAS = [
    { id: 'dark', label: 'Dark', cor: '#1e293b' },
    { id: 'light', label: 'Light', cor: '#f1f5f9' },
    { id: 'red', label: 'Red', cor: '#7f1d1d' },
    { id: 'green', label: 'Green', cor: '#14532d' },
    { id: 'blue', label: 'Blue', cor: '#1e3a5f' },
];

// Função para aplicar o tema
function aplicarTema(temaId) {
    const html = document.documentElement;
    
    // Remove todas as classes de tema
    html.classList.remove('dark-mode', 'light-mode', 'red-mode', 'green-mode', 'blue-mode');
    
    // Adiciona a classe do tema selecionado (se não for o padrão)
    // O padrão é 'dark' — não precisa de classe extra
    if (temaId !== 'dark') {
        html.classList.add(`${temaId}-mode`);
    }
    
    // Salva no localStorage
    localStorage.setItem('tema', temaId);
    
    // Atualiza os círculos (se existirem)
    atualizarSeletorTema(temaId);
    
    // ⭐ Sincroniza o toggle "Modo Escuro" com o tema
    atualizarToggleDark(temaId);
}

// Função para atualizar o seletor de temas (círculos)
function atualizarSeletorTema(temaAtivo) {
    const container = document.getElementById('theme-picker');
    if (!container) return;
    
    container.innerHTML = '';
    
    TEMAS.forEach(tema => {
        const botao = document.createElement('button');
        botao.className = 'theme-dot' + (tema.id === temaAtivo ? ' active' : '');
        botao.dataset.tema = tema.id;
        botao.style.width = '32px';
        botao.style.height = '32px';
        botao.style.borderRadius = '50%';
        botao.style.border = tema.id === temaAtivo ? '2px solid var(--t-accent)' : '2px solid var(--t-border)';
        botao.style.background = tema.cor;
        botao.style.cursor = 'pointer';
        botao.style.transition = 'all 0.2s';
        botao.style.display = 'flex';
        botao.style.alignItems = 'center';
        botao.style.justifyContent = 'center';
        botao.style.boxShadow = tema.id === temaAtivo ? '0 0 0 3px var(--t-accent-dim)' : 'none';
        
        // Se for o tema ativo, mostra um check
        if (tema.id === temaAtivo) {
            botao.innerHTML = '<span style="font-size:14px;color:var(--t-accent-fg);">✓</span>';
        }
        
        // Hover
        botao.onmouseenter = () => {
            botao.style.transform = 'scale(1.05)';
        };
        botao.onmouseleave = () => {
            botao.style.transform = 'scale(1)';
        };
        
        // Clique
        botao.onclick = () => {
            aplicarTema(tema.id);
        };
        
        container.appendChild(botao);
    });
}

// ============================================
// SINCRONIZA TOGGLE "MODO ESCURO" COM OS TEMAS
// ============================================

// Função para atualizar o toggle baseado no tema
function atualizarToggleDark(temaId) {
    const toggle = document.getElementById('toggle-dark');
    if (toggle) {
        toggle.checked = (temaId === 'dark');
    }
}

// Evento do toggle para mudar o tema
document.addEventListener('DOMContentLoaded', function() {
    const toggleDark = document.getElementById('toggle-dark');
    if (toggleDark) {
        toggleDark.addEventListener('change', function(e) {
            if (e.target.checked) {
                aplicarTema('dark');
            } else {
                aplicarTema('light');
            }
        });
    }
});

// ============================================
// CARREGAR O TEMA SALVO AO INICIAR
// ============================================
function carregarTemaSalvo() {
    const temaSalvo = localStorage.getItem('tema') || 'dark';
    aplicarTema(temaSalvo);
}

// Chama a função no carregamento da página
document.addEventListener('DOMContentLoaded', carregarTemaSalvo);
