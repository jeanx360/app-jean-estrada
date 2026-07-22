// ============================================
// APP JEAN NA ESTRADA - BUSCA VIA RSS (SEM API)
// ============================================

// CONFIGURAÇÕES DO SEU CANAL
const CHANNEL_ID = 'UCFwFlCooeFKHSLXxkRTA70g';  // ✅ ID do seu canal
const MAX_VIDEOS = 10;  // Quantos vídeos mostrar

// FUNÇÃO PARA BUSCAR OS VÍDEOS VIA RSS
async function buscarVideosRSS() {
    const lista = document.getElementById('lista-videos');
    
    // Mostra mensagem de carregamento
    lista.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <p style="font-size:18px;">🔄 Carregando vídeos...</p>
            <p style="font-size:14px;color:#888;margin-top:10px;">Buscando os últimos vídeos do Jean na Estrada</p>
        </div>
    `;
    
    try {
        // O RSS do YouTube
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        
        // Usamos um serviço de proxy para resolver o problema de CORS
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const resposta = await fetch(proxyUrl);
        const dados = await resposta.json();
        
        // Verifica se deu erro
        if (dados.status !== 'ok') {
            lista.innerHTML = `
                <div style="text-align:center;padding:30px;color:#ff6b00;">
                    <p>❌ Erro ao carregar vídeos</p>
                    <p style="font-size:14px;color:#888;">O servidor de RSS está temporariamente indisponível.</p>
                    <button onclick="buscarVideosRSS()" style="margin-top:15px;padding:10px 20px;background:#ff6b00;color:white;border:none;border-radius:8px;cursor:pointer;">
                        🔄 Tentar novamente
                    </button>
                </div>
            `;
            console.log('Erro no RSS:', dados);
            return;
        }
        
        // Verifica se tem vídeos
        if (!dados.items || dados.items.length === 0) {
            lista.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <p>📹 Nenhum vídeo encontrado no canal</p>
                    <p style="font-size:14px;color:#888;">Verifique se o canal está correto.</p>
                </div>
            `;
            return;
        }
        
        // Limpa a lista
        lista.innerHTML = '';
        
        // Pega só os últimos MAX_VIDEOS
        const videos = dados.items.slice(0, MAX_VIDEOS);
        
        // Para cada vídeo, cria um card
        videos.forEach(item => {
            // Extrai o ID do vídeo do link do YouTube
            const videoUrl = item.link;
            const videoId = videoUrl.split('v=')[1] || videoUrl.split('/').pop();
            
            // Extrai a thumbnail do YouTube
            const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            
            // Formata a data
            const dataPublicacao = new Date(item.pubDate);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            // Limpa a descrição (remove HTML se houver)
            const descricao = item.description ? 
                item.description.replace(/<[^>]*>/g, '').substring(0, 200) : 
                'Sem descrição';
            
            // Verifica se é modo escuro
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Cria o card do vídeo
            const div = document.createElement('div');
            div.className = 'video-item';
            
            div.innerHTML = `
                <h3>▶️ ${item.title}</h3>
                <p class="data-publicacao">📅 ${dataFormatada}</p>
                <img src="${thumbnail}" alt="${item.title}" loading="lazy">
                <p class="descricao">${descricao}${item.description && item.description.length > 200 ? '...' : ''}</p>
                <iframe 
                    width="100%" 
                    height="250" 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy">
                </iframe>
                <a href="${item.link}" target="_blank" class="link-youtube">
                    🔗 Assistir no YouTube
                </a>
            `;
            lista.appendChild(div);
        });
        
        // Adiciona contador de vídeos
        const contador = document.createElement('div');
        contador.style.textAlign = 'center';
        contador.style.marginTop = '20px';
        contador.style.padding = '15px';
        contador.style.background = '#f0f7ff';
        contador.style.borderRadius = '10px';
        contador.style.fontSize = '14px';
        contador.style.color = '#555';
        contador.innerHTML = `📊 Mostrando ${videos.length} vídeos do canal Jean na Estrada`;
        
        // Ajusta a cor no modo escuro
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            contador.style.background = '#2a3a4a';
            contador.style.color = '#aaa';
        }
        
        lista.appendChild(contador);
        
    } catch (erro) {
        lista.innerHTML = `
            <div style="text-align:center;padding:30px;color:#ff6b00;">
                <p>❌ Ocorreu um erro ao carregar os vídeos</p>
                <p style="font-size:14px;color:#888;margin-top:8px;">${erro.message}</p>
                <button onclick="buscarVideosRSS()" style="margin-top:15px;padding:10px 20px;background:#ff6b00;color:white;border:none;border-radius:8px;cursor:pointer;">
                    🔄 Tentar novamente
                </button>
            </div>
        `;
        console.log('Erro completo:', erro);
    }
}

// FUNÇÃO PARA O BOTÃO DE CONTATO
function enviarMensagem() {
    // Abre o YouTube Studio ou um link para contato
    window.open('https://www.youtube.com/@jeannaestrada', '_blank');
    
    // Opção: se quiser um formulário mais elaborado, pode substituir por:
    // window.open('mailto:seuemail@gmail.com?subject=Sugestão para o canal', '_blank');
}

// ============================================
// INICIALIZAÇÃO - Roda quando a página abre
// ============================================
document.addEventListener('DOMContentLoaded', buscarVideosRSS);

// Recarrega quando perder a conexão e voltar
document.addEventListener('online', buscarVideosRSS);

// Recarrega a cada 5 minutos (para manter atualizado)
setInterval(buscarVideosRSS, 300000);
