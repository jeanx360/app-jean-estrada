# 🚐 Jean na Estrada - App Oficial

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://jeanx360.github.io/app-jean-estrada/)
[![PWA](https://img.shields.io/badge/PWA-Instalável-brightgreen?logo=pwa)](https://jneapp.app)
[![Licença](https://img.shields.io/badge/Licença-Todos%20os%20direitos%20reservados-red)](LICENSE)
[![Versão](https://img.shields.io/badge/Versão-1.04-blue)](https://github.com/jeanx360/app-jean-estrada)

---

## 📱 Sobre o Projeto

O **Jean na Estrada App** é um **Progressive Web App (PWA)** desenvolvido para o canal de mesmo nome, focado em **carros elétricos, tecnologia automotiva e desbloqueios de multimídia**.

O app serve como uma plataforma central para:
- 📺 Acompanhar os vídeos mais recentes do canal
- 📰 Ler notícias sobre carros elétricos e tecnologia
- 📖 Acessar tutoriais e guias de desbloqueio
- 🧮 Calcular a viabilidade financeira de migrar para um carro elétrico
- 🤝 Conhecer parceiros oficiais do canal
- 🔔 Receber notificações sobre novos conteúdos

---

## 🎯 Filosofia do Projeto

> *"Pretty, not flashy"*

O app foi projetado com uma abordagem **minimalista e refinada**, inspirada em interfaces como o Kinex (launcher para BYD). A ideia é ser:
- **Limpo e intuitivo** — grandes alvos de toque e hierarquia visual clara
- **Legível à primeira vista** — essencial para uso dentro de um carro
- **Elegante e moderno** — tipografia polida e espaçamentos generosos
- **Respeitoso com o usuário** — sem excesso de cores ou animações desnecessárias

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
| :--- | :--- |
| **HTML5** | Estrutura do app |
| **CSS3** | Estilização e temas (Dark/Light/Red/Green/Blue) |
| **JavaScript (Vanilla)** | Funcionalidades, API e interações |
| **PWA (manifest.json)** | Instalação no celular como app nativo |
| **Service Worker** | Funcionamento offline e cache |
| **OneSignal** | Notificações push |
| **GitHub Pages** | Hospedagem gratuita |
| **Cloudflare** | Domínio `jneapp.app` e HTTPS |

---

## 📁 Estrutura do Projeto
app-jean-estrada/
├── imagens/ # Imagens, ícones e banners
│ ├── banner.png # Banner do cabeçalho
│ ├── logo_definitivo_do_canal.png
│ ├── icone-192.png
│ ├── icone-512.png
│ ├── favicon.ico
│ ├── apple-touch-icon.png
│ ├── banner-evolk.png # Parceiro: EVOLK Eletropostos
│ ├── banner-xtreme.png # Parceiro: Xtreme Motorsports
│ ├── banner-dudyscar.png # Parceiro: Dudyscar Pintura
│ ├── banner-email.png # Contato: E-mail
│ ├── banner-youtube.png # Contato: YouTube
│ ├── banner-tiktok.png # Contato: TikTok
│ └── banner-instagram.png # Contato: Instagram
│
├── arquivos/ # PDFs e arquivos para download
│ └── guia-desbloqueio-geely-ex2.pdf
│
├── docs/ # Documentação do projeto
│ ├── README.md
│ ├── BRAND_GUIDE.md
│ ├── UI_RULES.md
│ ├── API_REFERENCE.md
│ └── USER_GUIDE.md
│
├── index.html # Página principal
├── style.css # Estilos completos
├── script.js # Funcionalidades JavaScript
├── manifest.json # Configuração do PWA
├── sw.js # Service Worker (principal)
├── sw-push.js # Service Worker (notificações)
├── OneSignalSDKWorker.js # OneSignal (notificações)
├── CNAME # Domínio personalizado (jneapp.app)
└── .gitignore # Arquivos ignorados pelo Git

text

---

## 🚀 Funcionalidades

### 📺 Início — Últimos Vídeos do Canal
- Busca automática via RSS do YouTube
- Exibe título, data e player incorporado
- Link direto para assistir no YouTube

### 📰 Notícias — Carros Elétricos e Tecnologia
- Feeds RSS: **InsideEVs Brasil**, **Motor1.com**, **Quilowatt**
- Sistema de proxy com fallback (rss2json + AllOrigins)
- Filtro por palavras-chave (BYD, Tesla, elétrico, bateria, etc.)
- Extração automática de imagens do RSS

### 📖 Tutoriais — Guias e Desbloqueios
- **Geely EX2 — Desbloqueio Completo**
  - ▶️ Vídeo no YouTube (passo a passo)
  - 📄 PDF com o guia passo a passo
  - ☁️ Arquivos no Google Drive (apps e ferramentas)

### 🛒 Produtos — Recomendados pelo Jean
- Links de afiliado para produtos testados e aprovados
- Carregadores, suportes, kits de ferramentas e acessórios

### 📘 Guia do Iniciante — Conteúdo Educativo
- Como funciona um carro elétrico
- Tipos de carregamento
- Custo de recarga
- Economia na manutenção

### 🧮 Calculadora de Decisão EV x Combustão
- Comparação completa de custos entre EV e carro a combustão
- Campos: km/mês, consumo (km/L), preços, manutenção
- Resultados: gasto mensal, economia, ROI, veredito final

### 🤝 Parceiros — Apoiadores do Canal
- **EVOLK Eletropostos** → Site oficial
- **Xtreme Motorsports** → WhatsApp
- **Dudyscar Pintura Automotiva** → WhatsApp
- Banners clicáveis com redirecionamento

### 💬 Contato — Fale com Jean
- E-mail: contato.jeannaestrada@gmail.com
- YouTube: @jeannaestrada
- TikTok: @jeannaestrada
- Instagram: @jeannaestradaoficial
- Banners clicáveis com redirecionamento

### ⚙️ Configurações — Personalização
- **🎨 Tema:** 5 opções (Dark, Light, Red, Green, Blue)
- **🌙 Modo Escuro:** Ativação manual
- **🔔 Notificações:** Push via OneSignal
- **🗑️ Limpar Cache:** Remover dados temporários

---

## 🎨 Design System

### Cores (Tema Dark — padrão)

| Uso | Cor | Código |
| :--- | :--- | :--- |
| Fundo primário | Dark Blue | `#070b16` |
| Fundo de superfície | Dark Gray | `#0d1220` |
| Cards | Card Dark | `#111827` |
| Destaque | Neon Blue | `#2979ff` |
| Texto principal | Light Gray | `#e2e8f0` |
| Texto secundário | Muted Gray | `#64748b` |

### Cores (Tema Light)

| Uso | Cor | Código |
| :--- | :--- | :--- |
| Fundo primário | Light Gray | `#f1f5f9` |
| Cards | White | `#ffffff` |
| Destaque | Blue | `#1d4ed8` |
| Texto principal | Dark Blue | `#0f172a` |
| Texto secundário | Muted Dark | `#334155` |

### Temas Extras
- **Red** — Tons de vermelho (#dc2626)
- **Green** — Tons de verde (#10b981)
- **Blue** — Tons de azul claro (#38bdf8)

### Tipografia
- **Fonte:** Outfit (Google Fonts)
- **Títulos:** 700, 800, 900
- **Textos:** 400, 500, 600
- **Botões:** 600

---

## 📱 PWA — Instalação no Celular

O app é um **PWA (Progressive Web App)**, o que significa que pode ser instalado no celular como um aplicativo nativo.

### Android (Chrome)
1. Acesse `https://jneapp.app`
2. Toque nos três pontinhos (⋮) → **"Instalar aplicativo"**
3. Toque em **"Instalar"**
4. O ícone vai aparecer na tela inicial

### iPhone (Safari)
1. Acesse `https://jneapp.app`
2. Toque no ícone de compartilhar (□ com seta)
3. Selecione **"Adicionar à Tela de Início"**
4. Toque em **"Adicionar"**

---

## 🌐 Hospedagem e Domínio

| Serviço | Uso |
| :--- | :--- |
| **GitHub Pages** | Hospedagem do app |
| **Cloudflare** | DNS e HTTPS |
| **Domínio** | `jneapp.app` |

**CNAME:** `jeanx360.github.io`

---

## 📦 Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/jeanx360/app-jean-estrada.git
Abra o arquivo index.html no navegador (ou use uma extensão como Live Server no VS Code).

Pronto! O app vai funcionar localmente.

🔔 Notificações Push (OneSignal)
O app utiliza o OneSignal para enviar notificações push.

App ID: 3fa220d7-df93-4004-83bf-809a8ff59a0e

Service Worker: /OneSignalSDKWorker.js

Para enviar notificações:

Acesse o painel do OneSignal: app.onesignal.com

Vá em Messages → New Push

Configure o título, mensagem e URL

Selecione o público (ex: "All Subscribers")

Envie!

📊 Feeds RSS
Fonte	URL
YouTube	https://www.youtube.com/feeds/videos.xml?channel_id=UCFwFlCooeFKHSLXxkRTA70g
InsideEVs Brasil	https://insideevs.uol.com.br/rss/articles/all/
Motor1.com	https://motor1.uol.com.br/rss/news/all/
Quilowatt	https://quilowatt.com.br/feed/
🐛 Correções Recentes (v1.04)
Bug	Solução
Mistura de conteúdo (vídeos ↔ notícias)	Limpeza profunda do DOM com while(lista.firstChild)
Imagens repetidas nas notícias	Extração de imagens de múltiplas fontes + timestamp
Logo gigante no celular	CSS responsivo com max-height
Menu sem botão no PC	Botão hambúrguer sempre visível
Seletor de temas não aparecia	Script inline para gerar os círculos
📋 Roadmap (Próximas Melhorias)
□ Busca por palavras-chave nas notícias e vídeos
□ Compartilhamento de conteúdo (WhatsApp, Twitter, etc.)
□ Área de membros (integração com YouTube)
□ Comparador de modelos EV (tabela de dados)
□ Mapa de eletropostos (OpenChargeMap API)
□ Automação de notificações (novos vídeos)
□ Modo de leitura (skeleton loading)
🤝 Como Contribuir
Faça um fork do projeto.

Crie uma branch para sua funcionalidade:

bash
git checkout -b minha-feature
Commit suas alterações:

bash
git commit -m 'Minha nova funcionalidade'
Push para a branch:

bash
git push origin minha-feature
Abra um Pull Request.

📝 Licença
Este projeto é de uso exclusivo do canal Jean na Estrada. Todos os direitos reservados.

📞 Contato
E-mail: contato.jeannaestrada@gmail.com

YouTube: @jeannaestrada

TikTok: @jeannaestrada

Instagram: @jeannaestradaoficial

🚐 Jean na Estrada — Tecnologia, carros elétricos e liberdade sobre qualquer rodas.
