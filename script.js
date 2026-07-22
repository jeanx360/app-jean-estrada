// LISTA DOS SEUS VÍDEOS DO YOUTUBE
// (Substitua os IDs pelos seus vídeos)
const videos = [
    { 
        titulo: "Desbloqueei o PRIMEIRO Geely EX2 do canal! Veja como ficou", 
        id: "MK0Kzi_jw8"  // ← SUBSTITUA PELO ID DO SEU VÍDEO
    },
    { 
        titulo: "Ele largou o Uber? Descubra como fatura R$100 por hora no BlaBlaCar!", 
        id: "8dqOxo15bwI"  // ← SUBSTITUA PELO ID DO SEU VÍDEO
    },
    { 
        titulo: "O BYD Dolphin chegou aos 300 MIL KM! Como está o carro?", 
        id: "tlTpTLeQGKA"  // ← SUBSTITUA PELO ID DO SEU VÍDEO
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
