// ============================================
// APP JEAN NA ESTRADA - BUSCA AUTOMÁTICA DE VÍDEOS
// ============================================

// SUAS CONFIGURAÇÕES (já preenchidas!)
const API_KEY = 'AIzaSyAYUcYcEIIiGPfiaNNAe2jfk2xHCyJtM-s';
const NOME_CANAL = 'jeannaestrada';  // Seu canal sem o @
const MAX_VIDEOS = 10;  // Quantos vídeos mostrar

// FUNÇÃO PRINCIPAL - Busca os vídeos do canal
async function buscarVideos() {
    const lista = document.getElementById('lista-videos');
    
    // Mostra mensagem de carregamento
    lista.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <p>🔄 Carregando vídeos do Jean na Estrada...</p>
        </div>
    `;
    
    try {
        // Primeiro, precisamos descobrir o ID do canal (YouTube usa ID numérico)
        const urlCanal = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${NOME_CANAL}&key=${API_KEY}`;
        const respostaCanal = await fetch(urlCanal);
        const dadosCanal = await respostaCanal.json();
        
        // Verifica se o canal foi encontrado
        if (dadosCanal.error) {
            lista.innerHTML = `<p>❌ Erro: ${dadosCanal.error.message}</p>`;
            console.log('Erro ao buscar canal:', dadosCanal);
            return;
        }
        
        if (!dadosCanal.items || dadosCanal.items.length === 0) {
            lista.innerHTML = `<p>❌ Canal "${NOME_CANAL}" não encontrado</p>`;
            return;
        }
        
        // Pega o ID do canal
        const channelId = dadosCanal.items[0].id;
        console.log('ID do canal:', channelId);
        
        // Agora busca os vídeos do canal
        const urlVideos = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=${MAX_VIDEOS}&type=video&key=${API_KEY}`;
        const respostaVideos = await fetch(urlVideos);
        const dadosVideos = await respostaVideos.json();
        
        // Verifica se deu erro nos vídeos
        if (dadosVideos.error) {
            lista.innerHTML = `<p>❌ Erro ao buscar vídeos: ${dadosVideos.error.message}</p>`;
            console.log('Erro na busca de vídeos:', dadosVideos);
            return;
        }
        
        // Verifica se tem vídeos
        if (!dadosVideos.items || dadosVideos.items.length === 0) {
            lista.innerHTML = '<p>📹 Nenhum vídeo encontrado no canal</p>';
            return;
        }
        
        // Limpa a lista
        lista.innerHTML = '';
        
        // Para cada vídeo encontrado, cria um card
        dadosVideos.items.forEach((item, index) => {
            const videoId = item.id.videoId;
            const titulo = item.snippet.title;
            const descricao = item.snippet.description || 'Sem descrição';
            const thumbnail = item.snippet.thumbnails.medium.url;
            const dataPublicacao = new Date(item.snippet.publishedAt);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR');
            
            // Cria o card do vídeo
            const div = document.createElement('div');
            div.className = 'video-item';
            div.style.marginBottom = '30px';
            div.style.padding = '20px';
            div.style.background = '#f9f9f9';
            div.style.borderRadius = '12px';
            div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            // Se for modo escuro, ajusta a cor
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                div.style.background = '#2a2a2a';
                div.style.color = '#e0e0e0';
            }
            
            div.innerHTML = `
                <h3 style="margin-bottom:10px;color:#ff6b00;">▶️ ${titulo}</h3>
                <p style="font-size:14px;color:#888;margin-bottom:8px;">📅 ${dataFormatada}</p>
                <img src="${thumbnail}" alt="${titulo}" style="width:100%;border-radius:8px;margin:10px 0;">
                <p style="font-size:14px;color:#666;margin-bottom:15px;">${descricao.substring(0, 200)}${descricao.length > 200 ? '...' : ''}</p>
                <iframe 
                    width="100%" 
                    height="250" 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allowfullscreen
                    style="border-radius:8px;">
                </iframe>
                <div style="margin-top:10px;text-align:right;">
                    <a href="https://youtu.be/${videoId}" target="_blank" style="color:#ff6b00;text-decoration:none;font-weight:bold;">
                        🔗 Assistir no YouTube
                    </a>
                </div>
            `;
            lista.appendChild(div);
        });
        
        // Adiciona contador de vídeos
        const contador = document.createElement('p');
        contador.style.textAlign = 'center';
        contador.style.marginTop = '20px';
        contador.style.color = '#888';
        contador.style.fontSize = '14px';
        contador.innerHTML = `📊 Mostrando ${dadosVideos.items.length} vídeos do canal Jean na Estrada`;
        lista.appendChild(contador);
        
    } catch (erro) {
        lista.innerHTML = `
            <div style="text-align:center;padding:30px;color:#ff6b00;">
                <p>❌ Ocorreu um erro ao carregar os vídeos</p>
                <p style="font-size:14px;color:#888;">${erro.message}</p>
                <button onclick="buscarVideos()" style="margin-top:15px;padding:10px 20px;background:#ff6b00;color:white;border:none;border-radius:8px;cursor:pointer;">
                    🔄 Tentar novamente
                </button>
            </div>
        `;
        console.log('Erro completo:', erro);
    }
}

// ============================================
// INICIALIZAÇÃO - Roda quando a página abre
// ============================================
document.addEventListener('DOMContentLoaded', buscarVideos);

// Também busca quando clicar no botão de "Tentar novamente"
if (document.getElementById('botao-recarregar')) {
    document.getElementById('botao-recarregar').addEventListener('click', buscarVideos);
}
