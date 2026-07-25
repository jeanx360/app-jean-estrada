# 📚 Referência Técnica - Jean na Estrada App

> **Versão:** 1.04  
> **Última atualização:** 24 de julho de 2026  
> **Status:** Em uso no app oficial

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Código](#arquitetura-do-código)
3. [Principais Funções](#principais-funções)
4. [Variáveis e Constantes](#variáveis-e-constantes)
5. [Feeds RSS e Endpoints](#feeds-rss-e-endpoints)
6. [Sistema de Temas](#sistema-de-temas)
7. [Service Worker](#service-worker)
8. [Notificações Push (OneSignal)](#notificações-push-onesignal)
9. [Estrutura de Dados](#estrutura-de-dados)
10. [Tratamento de Erros](#tratamento-de-erros)
11. [Performance e Cache](#performance-e-cache)
12. [Compatibilidade](#compatibilidade)

---

## 🏗️ Visão Geral

O **Jean na Estrada App** é um Progressive Web App (PWA) construído com **HTML5, CSS3 e JavaScript Vanilla**. O app consome feeds RSS de múltiplas fontes, utiliza um sistema de proxy para contornar restrições de CORS e mantém um sistema de temas persistente via `localStorage`.

### Fluxo de Dados
Usuário → Interface (HTML/CSS) → JavaScript → Feeds RSS/APIs → Exibição
↓
localStorage (temas, preferências)
↓
Service Worker (cache offline)

text

### Tecnologias Principais

| Tecnologia | Versão | Uso |
| :--- | :--- | :--- |
| **HTML5** | — | Estrutura do app |
| **CSS3** | — | Estilização e temas |
| **JavaScript (Vanilla)** | ES2020 | Funcionalidades e API |
| **PWA** | — | Instalação no celular |
| **Service Worker** | — | Cache offline |
| **OneSignal** | v16 | Notificações push |

---

## 📁 Arquitetura do Código

### Estrutura de Arquivos
app-jean-estrada/
├── index.html # Estrutura principal do app
├── style.css # Estilos e design system
├── script.js # Funcionalidades principais
├── manifest.json # Configuração PWA
├── sw.js # Service Worker (cache)
├── sw-push.js # Service Worker (notificações)
├── OneSignalSDKWorker.js # OneSignal (notificações)
├── CNAME # Domínio personalizado
└── .gitignore # Arquivos ignorados

text

### Dependências Externas

| Biblioteca | CDN | Uso |
| :--- | :--- | :--- |
| **Outfit (Google Fonts)** | `fonts.googleapis.com` | Tipografia principal |
| **Lucide Icons** | `unpkg.com/lucide` | Ícones opcionais |
| **OneSignal** | `cdn.onesignal.com` | Notificações push |

---

## ⚙️ Principais Funções

### `window.buscarVideosRSS()`

Busca os vídeos mais recentes do canal via YouTube RSS.

**Endpoint:** `https://api.rss2json.com/v1/api.json?rss_url=...`

**Parâmetros:**
| Parâmetro | Valor | Descrição |
| :--- | :--- | :--- |
| `CHANNEL_ID` | `UCFwFlCooeFKHSLXxkRTA70g` | ID do canal no YouTube |
| `MAX_VIDEOS` | `10` | Número máximo de vídeos a exibir |

**Fluxo:**
1. Limpa o conteúdo atual da lista
2. Faz requisição para `rss2json`
3. Extrai título, data e ID do vídeo
4. Cria cards com player incorporado
5. Adiciona link para o YouTube

**Exemplo de retorno (rss2json):**
```json
{
  "status": "ok",
  "items": [
    {
      "title": "Título do vídeo",
      "link": "https://www.youtube.com/watch?v=ID",
      "pubDate": "2026-07-24 10:00:00"
    }
  ]
}
window.buscarNoticiasRSS()
Busca notícias de múltiplos feeds RSS com sistema de proxy e fallback.

Feeds:

Fonte	URL
InsideEVs Brasil	https://insideevs.uol.com.br/rss/articles/all/
Motor1.com	https://motor1.uol.com.br/rss/news/all/
Quilowatt	https://quilowatt.com.br/feed/
Proxy (Método 1 - rss2json):

text
https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}
Proxy (Método 2 - AllOrigins):

text
https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}
Fluxo:

Limpa o conteúdo atual

Para cada feed, tenta rss2json primeiro

Fallback para AllOrigins se falhar

Aplica filtro por palavras-chave

Extrai imagens de múltiplas fontes

Ordena por data (mais recentes primeiro)

Exibe até 20 notícias

Timeout:

rss2json: 10s

AllOrigins: 15s

fetchFeedWithProxy(feedUrl)
Sistema de proxy com fallback para buscar feeds RSS.

Métodos (em ordem de tentativa):

rss2json — Converte RSS para JSON

AllOrigins (get) — Retorna conteúdo em base64

Retorno:

javascript
{
  source: 'rss2json' | 'xml',
  data: Object | String
}
Tratamento de Erros:

Verifica se o retorno é XML/JSON válido

Timeout configurado para cada método

Logs detalhados no console

extrairImagem(item)
Extrai imagem de um item RSS de múltiplas fontes.

Fontes (em ordem de prioridade):

<enclosure url="...">

<media:content url="...">

<media:thumbnail url="...">

HTML do <description>

HTML do <content:encoded>

Retorno: String (URL da imagem) ou '' (vazio)

Exemplo:

javascript
// Extrai do enclosure
const enclosure = item.querySelector('enclosure');
if (enclosure) {
    const url = enclosure.getAttribute('url');
    if (url) return url;
}
filtrarNoticia(titulo, descricao)
Filtra notícias por palavras-chave relacionadas a carros elétricos e tecnologia.

Palavras-chave:

Marcas: byd, tesla, volvo, bmw, volkswagen, vw, renault, nissan, hyundai, kia, gwm, ora, geely, leapmotor, jetour

Termos: elétrico, eletrico, hibrido, híbrido, plugin, phev, bev, ev, carro elétrico, veículo elétrico, mobilidade elétrica

Tecnologia: carregamento, recarga, bateria, autonomia, motor elétrico, eletroposto, tecnologia, inovação, automação

Eventos: lançamento, novo modelo, pré-venda, teste, review, análise

Retorno: Boolean

aplicarTema(temaId)
Aplica um dos 5 temas disponíveis.

Parâmetros:

ID	Descrição
'dark'	Tema escuro (padrão)
'light'	Tema claro
'red'	Tema vermelho
'green'	Tema verde
'blue'	Tema azul claro
Fluxo:

Remove todas as classes de tema

Adiciona a classe do tema selecionado

Salva no localStorage ('tema')

Atualiza os círculos nos dois lugares

Sincroniza o toggle "Modo Escuro"

Classes CSS:

.light-mode

.red-mode

.green-mode

.blue-mode

calcularDecisao()
Calcula a comparação entre EV e carro a combustão.

Inputs:

Campo	ID	Valor padrão	Unidade
Km rodados por mês	km-mes	1500	km
Anos de uso	anos-uso	5	anos
Consumo gasolina	consumo-gasolina	10	km/L
Preço gasolina	preco-gasolina	6.50	R$/L
Manutenção gasolina	manutencao-gasolina	2500	R$/ano
Consumo EV	consumo-ev	6.5	km/kWh
Preço energia	preco-energia	0.85	R$/kWh
Manutenção EV	manutencao-ev	500	R$/ano
Preço combustão	preco-combustao	120000	R$
Preço EV	preco-ev	150000	R$
Outputs:

Resultado	ID	Descrição
Gasto combustão/mês	result-gasto-gasolina	Custo mensal do carro a combustão
Gasto elétrico/mês	result-gasto-ev	Custo mensal do carro elétrico
Economia mensal	result-economia-mensal	Diferença entre os dois
Economia anual	result-economia-anual	Economia mensal × 12
ROI	result-roi	Tempo de retorno do investimento
Economia em 5 anos	result-economia-5anos	Economia total com manutenção
Manutenção combustão/5 anos	result-manutencao-gasolina-5anos	Custo de manutenção do combustão
Manutenção EV/5 anos	result-manutencao-ev-5anos	Custo de manutenção do EV
Veredito	result-veredito	"Vale a pena" ou "Não compensa"
Fórmulas:

javascript
gastoGasolina = (kmMes / consumoGasolina) * precoGasolina;
gastoEV = (kmMes / consumoEV) * precoEnergia;
economiaMensal = gastoGasolina - gastoEV;
economiaAnual = economiaMensal * 12;
economiaTotal5 = (economiaAnual * anos) + (manutencaoGasolina - manutencaoEV) * anos;
roi = (precoEV - precoCombustao) / economiaMensal; // em meses
limparConteudo()
Limpa os elementos #lista-videos e #lista-noticias antes de recarregar.

Método: Remove todos os childNodes com while (lista.firstChild) e recria o HTML de carregamento.

Uso: Chamada antes de buscarVideosRSS() e buscarNoticiasRSS().

limparCache()
Função exposta globalmente para limpar o cache do Service Worker.

Fluxo:

Verifica suporte a caches no navegador

Obtém todas as chaves de cache

Remove cada uma

Exibe alerta de sucesso

📦 Variáveis e Constantes
Variáveis Globais
Nome	Valor	Descrição
APP_VERSION	'1.04'	Versão semântica do app
window.versaoApp	'20260726-final'	Versão técnica (timestamp)
CHANNEL_ID	'UCFwFlCooeFKHSLXxkRTA70g'	ID do canal no YouTube
MAX_VIDEOS	10	Número máximo de vídeos
TEMAS	[...]	Array de temas disponíveis
Variáveis CSS (Temas)
Variável	Descrição	Exemplo (dark)
--t-bg	Fundo da página	#070b16
--t-surface	Fundo de superfícies	#0d1220
--t-card	Fundo de cards	#111827
--t-border	Cor das bordas	rgba(255,255,255,0.07)
--t-border-strong	Cor das bordas fortes	rgba(255,255,255,0.12)
--t-accent	Cor de destaque	#2979ff
--t-accent-dim	Fundo de destaque	rgba(41,121,255,0.12)
--t-accent-fg	Texto sobre destaque	#ffffff
--t-text	Texto principal	#e2e8f0
--t-text-muted	Texto secundário	#64748b
--t-text-dim	Texto terciário	#94a3b8
--t-header-bg	Fundo do cabeçalho	rgba(7,11,22,0.95)
--t-input-bg	Fundo de inputs	rgba(15,21,32,0.8)
📡 Feeds RSS e Endpoints
YouTube
text
https://www.youtube.com/feeds/videos.xml?channel_id=UCFwFlCooeFKHSLXxkRTA70g
Proxy: https://api.rss2json.com/v1/api.json?rss_url=...

InsideEVs Brasil
text
https://insideevs.uol.com.br/rss/articles/all/
Motor1.com
text
https://motor1.uol.com.br/rss/news/all/
Quilowatt
text
https://quilowatt.com.br/feed/
Proxies CORS
Proxy	Uso	Timeout
rss2json	Primário	10s
AllOrigins (get)	Fallback	15s
AllOrigins (raw)	Fallback (depreciado)	10s
🎨 Sistema de Temas
Estrutura
javascript
const TEMAS = [
    { id: 'dark', label: 'Dark', cor: '#1e293b' },
    { id: 'light', label: 'Light', cor: '#f1f5f9' },
    { id: 'red', label: 'Red', cor: '#7f1d1d' },
    { id: 'green', label: 'Green', cor: '#14532d' },
    { id: 'blue', label: 'Blue', cor: '#1e3a5f' },
];
Armazenamento
Chave: 'tema'

Valores: 'dark', 'light', 'red', 'green', 'blue'

Padrão: 'dark'

Aplicação
javascript
function aplicarTema(temaId) {
    const html = document.documentElement;
    html.classList.remove('dark-mode', 'light-mode', 'red-mode', 'green-mode', 'blue-mode');
    if (temaId !== 'dark') {
        html.classList.add(`${temaId}-mode`);
    }
    localStorage.setItem('tema', temaId);
}
🔧 Service Worker
Arquivos
Arquivo	Uso	Versão atual
sw.js	Cache offline principal	v4.0.1
sw-push.js	Notificações push	—
OneSignalSDKWorker.js	OneSignal	—
Cache (sw.js)
Arquivos cacheados:

javascript
const urlsParaCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/imagens/icone-192.png',
    '/imagens/icone-512.png',
    '/imagens/favicon.ico',
    '/imagens/apple-touch-icon.png'
];
Estratégia: Cache-first com fallback para rede.

Atualização: Mude CACHE_VERSION para forçar recarga.

🔔 Notificações Push (OneSignal)
Configuração
App ID: 3fa220d7-df93-4004-83bf-809a8ff59a0e

Service Worker: /OneSignalSDKWorker.js

Inicialização:

javascript
await OneSignal.init({
    appId: "3fa220d7-df93-4004-83bf-809a8ff59a0e",
    serviceWorkerPath: "/OneSignalSDKWorker.js",
    serviceWorkerParam: { scope: "/" }
});
Permissão
javascript
const permission = await OneSignal.Notifications.requestPermission({
    modalOptions: {
        title: "🔔 Jean na Estrada",
        message: "Receba notificações sobre novas notícias e vídeos!",
        acceptButtonText: "📰 Quero receber",
        cancelButtonText: "❌ Não, obrigado"
    }
});
📊 Estrutura de Dados
Vídeo (YouTube RSS)
javascript
{
    title: String,          // Título do vídeo
    link: String,           // URL do vídeo
    pubDate: String,        // Data de publicação
    videoId: String,        // ID do vídeo (extraído do link)
    dataFormatada: String   // Data formatada (pt-BR)
}
Notícia (RSS)
javascript
{
    titulo: String,         // Título da notícia
    link: String,           // URL da notícia
    pubDate: String,        // Data de publicação
    descricao: String,      // Descrição (200 caracteres)
    imagem: String,         // URL da imagem (ou vazio)
    fonte: String           // Nome do feed (InsideEVs, Motor1, Quilowatt)
}
Tema
javascript
{
    id: 'dark' | 'light' | 'red' | 'green' | 'blue',
    label: String,
    cor: String,            // Cor do círculo
    vars: {                 // Variáveis CSS
        '--t-bg': String,
        '--t-surface': String,
        // ...
    }
}
Produto
javascript
{
    name: String,           // Nome do produto
    price: String,          // Preço (ex: "R$ 890")
    rating: Number,         // Avaliação (0-5)
    icon: String,           // Emoji ou ícone
    tag: String             // Tag (ex: "Mais Vendido")
}
Tutorial
javascript
{
    title: String,          // Título do tutorial
    desc: String,           // Descrição
    duracao: String,        // Duração (ex: "25 min")
    nivel: String,          // Nível (Iniciante, Intermediário, Avançado)
    icon: String            // Emoji
}
🐛 Tratamento de Erros
Estratégia
Tipo de erro	Tratamento
Rede (fetch)	Timeout + fallback para proxy alternativo
Parsing (XML)	Verificação de parsererror no DOMParser
CORS	Sistema de proxy com múltiplos métodos
Cache	Limpeza manual via Configurações
Notificações	Bloco try/catch com fallback para erro
Mensagens de Erro
Erro	Mensagem exibida
Falha no RSS	"📰 Nenhuma notícia relevante encontrada."
Erro de rede	"❌ Erro ao carregar notícias: {mensagem}"
Timeout	"⚠️ rss2json falhou: signal timed out"
Cache não suportado	"Seu navegador não suporta limpeza de cache."
Notificações indisponíveis	"❌ Serviço de notificações não disponível no momento."
⚡ Performance e Cache
Estratégia de Cache
Tipo de arquivo	Estratégia	TTL
HTML	Cache-first (Service Worker)	Indefinido (SW versionado)
CSS/JS	Cache-first (Service Worker)	Indefinido (SW versionado)
Imagens	Cache-first (Service Worker)	Indefinido
RSS/Notícias	Network-first (fetch)	Cada requisição
Dados do usuário	localStorage	Permanente
Otimizações
Técnica	Onde aplicar
loading="lazy"	Imagens de notícias e vídeos
Timestamp nas imagens	?t=${timestamp} para evitar cache
Timeout em requisições	10-15s para feeds
Debounce	(Futuro) Para busca em tempo real
Skeleton loading	(Futuro) Para melhor UX
📱 Compatibilidade
Navegadores Suportados
Navegador	Versão mínima
Google Chrome	90+
Safari	14+
Firefox	88+
Edge	90+
Opera	76+
Samsung Internet	14+
Recursos Necessários
Recurso	Uso
fetch()	Requisições de rede
DOMParser	Parsing de XML
localStorage	Preferências do usuário
Service Worker	Funcionamento offline
Push API	Notificações
CSS Custom Properties	Temas
🔄 Histórico de Versões
Versão	Data	Mudanças
1.04	24/07/2026	Adição da calculadora de decisão, novos campos de input, função calcularDecisao()
1.03	23/07/2026	Melhoria na extração de imagens, timestamps, função extrairImagem() aprimorada
1.02	22/07/2026	Implementação do sistema de temas, aplicarTema(), atualizarSeletorTema()
1.01	21/07/2026	Correção de bugs, limparConteudo(), buscarVideosRSS() aprimorada
1.00	20/07/2026	Primeira versão do app
📚 Referências
MDN Web Docs: developer.mozilla.org

YouTube Data API: developers.google.com/youtube/v3

OneSignal Documentation: documentation.onesignal.com

Google Fonts — Outfit: fonts.google.com/specimen/Outfit

🚐 Jean na Estrada — Tecnologia, carros elétricos e liberdade sobre qualquer rodas.
