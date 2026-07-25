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
// FUNÇÃO PARA BUSCAR VÍDEOS (YouTube) - CORRIGIDA
// ============================================
window.buscarVideosRSS = async function() {
    const lista = document.getElementById('lista-videos');
    if (!lista) return;

    // ⭐ LIMPEZA COMPLETA ANTES DE CARREGAR ⭐
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
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
// PROXY CORS COM FALLBACK
// ============================================

async function fetchFeedWithProxy(feedUrl) {
    // ⭐ MÉTODO 1: rss2json
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

    // ⭐ MÉTODO 2: AllOrigins (get)
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
// FUNÇÃO PARA EXTRAIR IMAGEM DO ITEM RSS (MELHORADA)
// ============================================
function extrairImagem(item) {
    // 1. Tenta obter do <enclosure>
    const enclosure = item.querySelector('enclosure');
    if (enclosure) {
        const url = enclosure.getAttribute('url');
        if (url && url.trim() !== '') return url;
    }
    
    // 2. Tenta obter do <media:content>
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent) {
        const url = mediaContent.getAttribute('url');
        if (url && url.trim() !== '') return url;
    }
    
    // 3. Tenta obter do <media:thumbnail>
    const mediaThumb = item.querySelector('media\\:thumbnail, thumbnail');
    if (mediaThumb) {
        const url = mediaThumb.getAttribute('url');
        if (url && url.trim() !== '') return url;
    }
    
    // 4. Tenta extrair do HTML do <description>
    const description = item.querySelector('description');
    if (description) {
        const html = description.textContent;
        const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1].startsWith('http')) return imgMatch[1];
        const urlMatch = html.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
        if (urlMatch) return urlMatch[0];
    }
    
    // 5. Tenta extrair do <content:encoded>
    const encoded = item.querySelector('content\\:encoded, encoded');
    if (encoded) {
        const html = encoded.textContent;
        const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1].startsWith('http')) return imgMatch[1];
        const urlMatch = html.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
        if (urlMatch) return urlMatch[0];
    }
    
    // 6. Fallback: imagem padrão com o tema do app
    return '';
}

// ============================================
// FILTRO POR PALAVRAS-CHAVE
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
// FUNÇÃO PARA BUSCAR NOTÍCIAS - CORRIGIDA
// ============================================
window.buscarNoticiasRSS = async function() {
    const lista = document.getElementById('lista-noticias');
    if (!lista) return;

    console.log('📰 Iniciando busca de notícias...');
    
    // ⭐ LIMPEZA COMPLETA ANTES DE CARREGAR ⭐
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
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

                if (result.source === 'rss2json') {
                    const dados = result.data;
                    if (dados.items && dados.items.length > 0) {
                        items = dados.items.map(item => {
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
            
            // ⭐ ADICIONA TIMESTAMP PARA EVITAR CACHE DA IMAGEM ⭐
            let imagemHTML = '';
            if (item.imagem) {
                const timestamp = new Date().getTime();
                const urlComCache = `${item.imagem}?t=${timestamp}`;
                imagemHTML = `<img src="${urlComCache}" alt="${item.titulo}" style="width:100%;border-radius:10px;margin:10px 0;max-height:300px;object-fit:cover;" loading="lazy" onerror="this.style.display='none'">`;
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

const TEMAS = [
    { id: 'dark', label: 'Dark', cor: '#1e293b' },
    { id: 'light', label: 'Light', cor: '#f1f5f9' },
    { id: 'red', label: 'Red', cor: '#7f1d1d' },
    { id: 'green', label: 'Green', cor: '#14532d' },
    { id: 'blue', label: 'Blue', cor: '#1e3a5f' },
];

function aplicarTema(temaId) {
    const html = document.documentElement;
    
    html.classList.remove('dark-mode', 'light-mode', 'red-mode', 'green-mode', 'blue-mode');
    
    if (temaId !== 'dark') {
        html.classList.add(`${temaId}-mode`);
    }
    
    localStorage.setItem('tema', temaId);
    
    // ⭐ ATUALIZA OS CÍRCULOS EM AMBOS OS LUGARES ⭐
    atualizarSeletorTema('theme-picker', temaId);
    atualizarSeletorTema('header-theme-dots', temaId);
    
    // ⭐ SINCRONIZA O TOGGLE DARK ⭐
    const toggleDark = document.getElementById('toggle-dark');
    if (toggleDark) {
        toggleDark.checked = (temaId === 'dark');
    }
}

function atualizarSeletorTema(containerId, temaAtivo) {
    const container = document.getElementById(containerId);
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
        botao.style.flexShrink = '0';
        botao.style.boxShadow = tema.id === temaAtivo ? '0 0 0 3px var(--t-accent-dim)' : 'none';
        
        if (tema.id === temaAtivo) {
            botao.innerHTML = '<span style="font-size:14px;color:var(--t-accent-fg);">✓</span>';
        }
        
        botao.onmouseenter = () => { botao.style.transform = 'scale(1.08)'; };
        botao.onmouseleave = () => { botao.style.transform = 'scale(1)'; };
        botao.onclick = () => {
            aplicarTema(tema.id);
        };
        
        container.appendChild(botao);
    });
}

function carregarTemaSalvo() {
    const temaSalvo = localStorage.getItem('tema') || 'dark';
    aplicarTema(temaSalvo);
}

// ============================================
// FUNÇÃO PARA LIMPAR CONTEÚDO (EVITA MISTURA)
// ============================================
function limparConteudo() {
    const listaVideos = document.getElementById('lista-videos');
    if (listaVideos) {
        while (listaVideos.firstChild) {
            listaVideos.removeChild(listaVideos.firstChild);
        }
        listaVideos.innerHTML = `<div style="text-align:center;padding:30px;"><p>🔄 Carregando vídeos...</p></div>`;
    }
    
    const listaNoticias = document.getElementById('lista-noticias');
    if (listaNoticias) {
        while (listaNoticias.firstChild) {
            listaNoticias.removeChild(listaNoticias.firstChild);
        }
        listaNoticias.innerHTML = `<div style="text-align:center;padding:30px;"><p>🔄 Carregando notícias...</p></div>`;
    }
}

// ============================================
// INICIALIZAÇÃO - CARREGA O TEMA E OS VÍDEOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Carrega o tema salvo
    carregarTemaSalvo();
    
    // Carrega os vídeos se estiver na seção "inicio"
    const urlParams = new URLSearchParams(window.location.search);
    const secao = urlParams.get('secao') || 'inicio';
    
    if (secao === 'inicio' && typeof window.buscarVideosRSS === 'function') {
        console.log('📺 Carregando vídeos...');
        window.buscarVideosRSS();
    } else if (secao === 'noticias' && typeof window.buscarNoticiasRSS === 'function') {
        console.log('📰 Carregando notícias...');
        window.buscarNoticiasRSS();
    }
});

// ============================================
// TOGGLE DARK MODE (SINCRONIZADO)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const toggleDark = document.getElementById('toggle-dark');
    if (toggleDark) {
        toggleDark.addEventListener('change', function(e) {
            const tema = e.target.checked ? 'dark' : 'light';
            aplicarTema(tema);
        });
    }
});

// ============================================
// TOGGLE NOTIFICAÇÕES (ONE SIGNAL)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const toggleNotif = document.getElementById('toggle-notificacoes');
    if (toggleNotif) {
        toggleNotif.addEventListener('change', async function(e) {
            const ativar = e.target.checked;
            localStorage.setItem('notificacoes', ativar);
            
            if (ativar) {
                console.log("📡 Ativando notificações...");
                if (typeof OneSignal !== 'undefined' && OneSignal.Notifications) {
                    try {
                        const permission = await OneSignal.Notifications.requestPermission({
                            modalOptions: {
                                title: "🔔 Jean na Estrada",
                                message: "Receba notificações sobre novas notícias e vídeos!",
                                acceptButtonText: "📰 Quero receber",
                                cancelButtonText: "❌ Não, obrigado"
                            }
                        });
                        if (permission) {
                            alert('✅ Notificações ativadas!');
                            console.log("✅ Permissão concedida.");
                        } else {
                            alert('❌ Você negou as notificações.');
                            e.target.checked = false;
                            localStorage.setItem('notificacoes', 'false');
                        }
                    } catch (error) {
                        console.error("❌ Erro ao solicitar permissão:", error);
                        alert('❌ Erro ao ativar notificações. Tente novamente.');
                        e.target.checked = false;
                        localStorage.setItem('notificacoes', 'false');
                    }
                } else {
                    console.error("❌ OneSignal não está disponível.");
                    alert('❌ Serviço de notificações não disponível no momento.');
                    e.target.checked = false;
                    localStorage.setItem('notificacoes', 'false');
                }
            } else {
                console.log("🔕 Desativando notificações.");
                alert('🔕 Notificações desativadas.');
            }
        });
    }
});

// ============================================
// LIMPAR CACHE (FUNÇÃO GLOBAL)
// ============================================
function limparCache() {
    if ('caches' in window) {
        caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key));
            alert('🗑️ Cache limpo com sucesso!');
        });
    } else {
        alert('Seu navegador não suporta limpeza de cache.');
    }
}

// ============================================
// CALCULADORA DE DECISÃO EV x COMBUSTÃO
// ============================================
function calcularDecisao() {
    // 1. PEGAR OS VALORES DOS INPUTS
    const kmMes = parseFloat(document.getElementById('km-mes').value) || 0;
    const anos = parseFloat(document.getElementById('anos-uso').value) || 5;
    
    const consumoGasolina = parseFloat(document.getElementById('consumo-gasolina').value) || 10;
    const precoGasolina = parseFloat(document.getElementById('preco-gasolina').value) || 6.50;
    const manutencaoGasolina = parseFloat(document.getElementById('manutencao-gasolina').value) || 2500;
    
    const consumoEV = parseFloat(document.getElementById('consumo-ev').value) || 6.5;
    const precoEnergia = parseFloat(document.getElementById('preco-energia').value) || 0.85;
    const manutencaoEV = parseFloat(document.getElementById('manutencao-ev').value) || 500;
    
    const precoCombustao = parseFloat(document.getElementById('preco-combustao').value) || 120000;
    const precoEV = parseFloat(document.getElementById('preco-ev').value) || 150000;
    
    // 2. CALCULAR GASTOS MENSAIS
    const gastoGasolina = (kmMes / consumoGasolina) * precoGasolina;
    const gastoEV = (kmMes / consumoEV) * precoEnergia;
    const economiaMensal = gastoGasolina - gastoEV;
    const economiaAnual = economiaMensal * 12;
    
    // 3. CALCULAR MANUTENÇÃO EM 5 ANOS
    const manutencaoGasolina5 = manutencaoGasolina * anos;
    const manutencaoEV5 = manutencaoEV * anos;
    const economiaManutencao = manutencaoGasolina5 - manutencaoEV5;
    
    // 4. CALCULAR ECONOMIA TOTAL EM 5 ANOS
    const economiaTotal5 = (economiaAnual * anos) + economiaManutencao;
    
    // 5. CALCULAR ROI (tempo de retorno)
    const diferencaPreco = precoEV - precoCombustao;
    let roi = '—';
    if (economiaMensal > 0) {
        const meses = diferencaPreco / economiaMensal;
        if (meses < 12) {
            roi = `${Math.round(meses)} meses`;
        } else if (meses < 60) {
            roi = `${(meses / 12).toFixed(1)} anos`;
        } else {
            roi = `> ${Math.round(meses / 12)} anos (não compensa)`;
        }
    } else if (diferencaPreco <= 0) {
        roi = 'Imediato (EV mais barato!)';
    } else {
        roi = 'Não compensa (EV mais caro e não economiza)';
    }
    
    // 6. EXIBIR OS RESULTADOS
    document.getElementById('result-gasto-gasolina').textContent = `R$ ${gastoGasolina.toFixed(0)}`;
    document.getElementById('result-gasto-ev').textContent = `R$ ${gastoEV.toFixed(0)}`;
    document.getElementById('result-economia-mensal').textContent = `R$ ${economiaMensal.toFixed(0)}`;
    document.getElementById('result-economia-anual').textContent = `R$ ${economiaAnual.toFixed(0)}`;
    document.getElementById('result-roi').textContent = roi;
    document.getElementById('result-economia-5anos').textContent = `R$ ${economiaTotal5.toFixed(0)}`;
    document.getElementById('result-manutencao-gasolina-5anos').textContent = `R$ ${manutencaoGasolina5.toFixed(0)}`;
    document.getElementById('result-manutencao-ev-5anos').textContent = `R$ ${manutencaoEV5.toFixed(0)}`;
    
    // 7. VEREDITO FINAL
    const veredito = document.getElementById('result-veredito');
    if (economiaTotal5 > 0) {
        veredito.style.background = 'rgba(16,185,129,0.1)';
        veredito.style.border = '1px solid rgba(16,185,129,0.3)';
        veredito.style.color = '#10b981';
        veredito.innerHTML = `✅ Vale a pena! Você economizaria <strong>R$ ${economiaTotal5.toFixed(0)}</strong> em ${anos} anos. O tempo de retorno é de <strong>${roi}</strong>.`;
    } else if (economiaTotal5 === 0) {
        veredito.style.background = 'rgba(245,158,11,0.1)';
        veredito.style.border = '1px solid rgba(245,158,11,0.3)';
        veredito.style.color = '#f59e0b';
        veredito.innerHTML = `⚖️ Os custos se equivalem. A decisão depende do seu perfil e preferência.`;
    } else {
        veredito.style.background = 'rgba(255,45,85,0.1)';
        veredito.style.border = '1px solid rgba(255,45,85,0.3)';
        veredito.style.color = '#FF2D55';
        veredito.innerHTML = `❌ Neste cenário, o carro elétrico não compensa financeiramente. Você perderia <strong>R$ ${Math.abs(economiaTotal5).toFixed(0)}</strong> em ${anos} anos.`;
    }
    
    // 8. MOSTRAR A SEÇÃO DE RESULTADOS
    document.getElementById('resultado-decisao').style.display = 'block';
    
    // 9. ROLAR PARA OS RESULTADOS (mobile friendly)
    document.getElementById('resultado-decisao').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
