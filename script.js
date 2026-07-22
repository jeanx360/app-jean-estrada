// ============================================
// VERSÃO DO APP - FORÇA ATUALIZAÇÃO
// ============================================
window.versaoApp = '20260725-fix';
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
    if (!lista) {
        console.log('❌ Elemento #lista-videos não encontrado');
        return;
    }

    console.log('🔄 Buscando vídeos...');
    lista.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <p style="font-size:18px;">🔄 Carregando vídeos...</p>
        </div>
    `;
    
    try {
        // Usar o rss2json para vídeos (funciona bem)
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
        
        console.log('✅ Vídeos carregados com sucesso!');
        
    } catch (erro) {
        lista.innerHTML = `<p>❌ Erro ao carregar vídeos: ${erro.message}</p>`;
        console.log('Erro ao buscar vídeos:', erro);
    }
};

// ============================================
// FUNÇÃO PARA BUSCAR NOTÍCIAS (COM DOMPARSER E UTF-8)
// ============================================
window.buscarNoticiasRSS = async function() {
    console.log('🔍 buscarNoticiasRSS() chamada');
    const lista = document.getElementById('lista-noticias');
    if (!lista) {
        console.log('❌ Elemento #lista-noticias não encontrado');
        return;
    }
    console.log('✅ Elemento #lista-noticias encontrado');

    // Limpa e mostra carregando
    lista.innerHTML = '';
    lista.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <p style="font-size:18px;">🔄 Carregando notícias...</p>
        </div>
    `;
    
    try {
        const feedsNoticias = [
            { nome: "InsideEVs Brasil", url: "https://insideevs.com/brasil/feed/" },
            { nome: "Tecnologia - UOL", url: "https://rss.uol.com.br/feed/tecnologia.xml" },
            { nome: "Canaltech", url: "https://canaltech.com.br/feed/" }
        ];
        
        let todasNoticias = [];
        console.log('📡 Buscando notícias de', feedsNoticias.length, 'fontes');
        
        for (const feed of feedsNoticias) {
            try {
                console.log(`📡 Buscando ${feed.nome}:`, feed.url);
                const resposta = await fetch(feed.url);
                const texto = await resposta.text(); // Pega o texto bruto do XML
                
                // ⭐ CORREÇÃO: Força a codificação UTF-8
                const blob = new Blob([texto], { type: 'text/xml;charset=UTF-8' });
                const urlBlob = URL.createObjectURL(blob);
                const respostaBlob = await fetch(urlBlob);
                const textoCorrigido = await respostaBlob.text();
                URL.revokeObjectURL(urlBlob);
                
                // Parseia o XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(textoCorrigido, 'text/xml');
                
                // Verifica se há erro de parsing
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    console.log(`⚠️ Erro ao parsear ${feed.nome}:`, parseError.textContent);
                    continue;
                }
                
                // Extrai os itens
                const items = xmlDoc.querySelectorAll('item');
                console.log(`📡 ${feed.nome}: ${items.length} itens encontrados`);
                
                // Pega os 5 primeiros itens
                const itensLimitados = Array.from(items).slice(0, 5);
                
                itensLimitados.forEach(item => {
                    const title = item.querySelector('title')?.textContent || 'Sem título';
                    const link = item.querySelector('link')?.textContent || '#';
                    const pubDate = item.querySelector('pubDate')?.textContent || new Date().toUTCString();
                    const description = item.querySelector('description')?.textContent || 'Sem descrição';
                    
                    // Extrai a imagem do conteúdo ou do enclosure
                    let imagem = '';
                    const enclosure = item.querySelector('enclosure');
                    if (enclosure) {
                        imagem = enclosure.getAttribute('url') || '';
                    }
                    if (!imagem) {
                        const content = item.querySelector('content') || item.querySelector('encoded');
                        if (content) {
                            const imgMatch = content.textContent.match(/<img[^>]+src="([^">]+)"/);
                            if (imgMatch) imagem = imgMatch[1];
                        }
                    }
                    
                    // Limpa a descrição (remove HTML)
                    const descricaoLimpa = description.replace(/<[^>]*>/g, '').substring(0, 200);
                    
                    todasNoticias.push({
                        titulo: title,
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
        console.log(`📰 Total de notícias: ${noticias.length}`);
        
        if (noticias.length === 0) {
            lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>📰 Nenhuma notícia encontrada.</p></div>`;
            return;
        }
        
        // Limpa e renderiza
        lista.innerHTML = '';
        
        noticias.forEach(item => {
            const div = document.createElement('div');
            div.className = 'video-item';
            
            const titulo = item.titulo || 'Sem título';
            const descricao = item.descricao || 'Sem descrição';
            const dataPublicacao = new Date(item.pubDate);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            let imagem = '';
            if (item.imagem) {
                imagem = `<img src="${item.imagem}" alt="${titulo}" style="width:100%;border-radius:10px;margin:10px 0;" loading="lazy">`;
            }
            
            div.innerHTML = `
                <h3 style="font-size:16px;">📰 ${titulo}</h3>
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
        
        console.log('✅ Notícias carregadas com sucesso!');
        
    } catch (erro) {
        lista.innerHTML = `<div style="text-align:center;padding:30px;"><p>❌ Erro ao carregar notícias: ${erro.message}</p></div>`;
        console.log('❌ Erro ao buscar notícias:', erro);
    }
};
