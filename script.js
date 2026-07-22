// LISTA DOS SEUS VÍDEOS DO YOUTUBE
// (Substitua os IDs pelos seus vídeos)
const videos = [
    { 
        titulo: "Como viajar com pouco dinheiro", 
        id: "dQw4w9WgXcQ"  // ← SUBSTITUA PELO ID DO SEU VÍDEO
    },
    { 
        titulo: "Desbloqueio de mídia passo a passo", 
        id: "dQw4w9WgXcQ"  // ← SUBSTITUA PELO ID DO SEU VÍDEO
    },
    { 
        titulo: "Melhores destinos para 2026", 
        id: "dQw4w9WgXcQ"  // ← SUBSTITUA PELO ID DO SEU VÍDEO
    }
];

// FUNÇÃO QUE MOSTRA OS VÍDEOS NA TELA
function carregarVideos() {
    const lista = document.getElementById('lista-videos');
    
    // Verifica se a lista existe
    if (!lista) {
        console.log('Lista não encontrada');
        return;
    }
    
    // Limpa a lista antes de adicionar
    lista.innerHTML = '';
    
    // Para cada vídeo na lista, cria um elemento HTML
    videos.forEach(video => {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
            <h3>▶️ ${video.titulo}</h3>
            <iframe 
                width="100%" 
                height="200" 
                src="https://www.youtube.com/embed/${video.id}" 
                frameborder="0" 
                allowfullscreen>
            </iframe>
        `;
        lista.appendChild(div);
    });
}

// CARREGAR OS VÍDEOS QUANDO A PÁGINA ABRIR
document.addEventListener('DOMContentLoaded', carregarVideos);
