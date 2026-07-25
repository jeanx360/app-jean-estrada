# 🎯 Regras de Interface - Jean na Estrada App

> **Versão:** 1.04  
> **Última atualização:** 24 de julho de 2026  
> **Status:** Em uso no app oficial

---

## 📋 Sumário

1. [Estrutura do App](#estrutura-do-app)
2. [Componentes Reutilizáveis](#componentes-reutilizáveis)
3. [Navegação](#navegação)
4. [Animações e Transições](#animações-e-transições)
5. [Acessibilidade](#acessibilidade)
6. [Performance](#performance)
7. [Boas Práticas](#boas-práticas)
8. [Checklist de UI](#checklist-de-ui)

---

## 🏗️ Estrutura do App

### Seções Principais

O app é dividido em **9 seções**, cada uma com um propósito específico:

| Seção | ID | Ícone | Descrição |
| :--- | :--- | :--- | :--- |
| **Início** | `inicio` | 🏠 | Últimos vídeos do canal |
| **Notícias** | `noticias` | 📰 | Feed RSS sobre carros elétricos |
| **Tutoriais** | `tutoriais` | 📖 | Guias e desbloqueios |
| **Produtos** | `produtos` | 🛒 | Produtos recomendados (afiliados) |
| **Guia do Iniciante** | `guia` | 📘 | Conteúdo educativo sobre EVs |
| **Calculadora** | `calculadora` | 🧮 | Comparação EV vs Combustão |
| **Parceiros** | `parceiros` | 🤝 | Parceiros oficiais do canal |
| **Contato** | `contato` | 💬 | E-mail e redes sociais |
| **Configurações** | `configuracoes` | ⚙️ | Temas, notificações e cache |

### Hierarquia de Conteúdo
Cabeçalho (header)
├── Logo + nome do app
├── Botão menu (mobile)
└── Ícones sociais (YouTube, Instagram, TikTok)

Menu Lateral (sidebar)
├── Links para todas as seções
├── Versão do app
└── Fechar (mobile)

Conteúdo Principal (main)
├── Seção ativa (apenas uma por vez)
│ ├── Cabeçalho da seção (título + badge)
│ ├── Conteúdo específico
│ └── Rodapé (opcional)
└── ...

Rodapé (footer)
├── Copyright
└── Versão do app

text

---

## 🧩 Componentes Reutilizáveis

### 1. `.section-header`

Cabeçalho padronizado para todas as seções.

```html
<div class="section-header">
    <h2>Título da Seção</h2>
    <span class="badge">Tag</span>
</div>
Regras:

Título: font-size: 20px, font-weight: 700, cor var(--t-text)

Badge: sempre à direita, font-size: 10px, text-transform: uppercase

Espaçamento inferior: 16px

2. .item-list e .item
Usado em Tutoriais, Produtos e Contato.

html
<div class="item-list">
    <div class="item">
        <span class="icon">🔓</span>
        <div class="info">
            <div class="title">Título do item</div>
            <div class="desc">Descrição curta</div>
            <div class="meta">Metadados (ex: duração, preço)</div>
        </div>
        <a href="#" class="action">Ação →</a>
    </div>
</div>
Regras:

icon: font-size: 22px, largura fixa de 30px

info: flex: 1, gap: 2px

title: font-weight: 600, cor var(--t-text)

desc: font-size: 13px, cor var(--t-text-muted)

meta: font-size: 12px, cor var(--t-text-dim)

action: cor var(--t-accent), font-weight: 600

Hover: transform: translateX(4px), borda destacada

3. .video-grid e .video-card
Usado na seção Início para exibir vídeos.

html
<div class="video-grid">
    <div class="video-card">
        <div class="thumbnail">
            <img src="..." alt="...">
            <span class="badge-tag">Tag</span>
            <div class="play-overlay">▶</div>
        </div>
        <div class="content">
            <h3>Título do vídeo</h3>
            <p>Descrição curta</p>
            <div class="meta">📅 Data</div>
        </div>
    </div>
</div>
Regras:

Grid: 1 coluna (mobile), 2 colunas (tablet+)

thumbnail: altura 160px, fundo preto, object-fit: cover

badge-tag: posição absoluta no canto superior esquerdo

play-overlay: centralizado, opacidade 0 (hover → 1)

content: padding: 14px 16px

Hover: translateY(-3px), borda destacada, sombra

4. .video-item (Lista de Vídeos - Fallback)
Usado quando os vídeos são carregados dinamicamente via JavaScript.

html
<div class="video-item">
    <h3>▶️ Título do vídeo</h3>
    <p class="data-publicacao">📅 Data</p>
    <div class="player-wrapper">
        <iframe src="..."></iframe>
    </div>
    <a href="#" class="link-youtube">🔗 Assistir no YouTube</a>
</div>
Regras:

player-wrapper: padding-bottom: 56.25% (proporção 16:9)

iframe: posição absoluta, width: 100%, height: 100%

link-youtube: cor var(--t-accent), hover com efeito de brilho

5. .badge
Usado para tags, categorias e destaques.

css
.badge {
    display: inline-block;
    padding: 2px 12px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: var(--t-accent-dim);
    border: 1px solid var(--t-border-strong);
    color: var(--t-accent);
}
Variações:

.badge-orange → #ff6d00

.badge-teal → #00bcd4

.badge-red → #dc2626

.badge-green → #10b981

6. .banner-link e .banner-img
Usado nas seções Contato e Parceiros.

html
<a href="..." target="_blank" class="banner-link">
    <img src="..." alt="..." class="banner-img">
</a>
Regras:

Tamanho das imagens: 1983x793

Largura: 100%, max-width: 800px

Altura: automática (mantém proporção)

Hover: transform: scale(1.02), sombra destacada

Bordas: border-radius: 16px

7. Toggle Switch (Configurações)
Usado para ativar/desativar funcionalidades.

html
<label class="toggle-switch">
    <input type="checkbox" id="toggle-xxx">
    <span class="slider"></span>
</label>
Regras:

Largura: 44px, altura: 24px

Fundo (desligado): var(--t-border-strong)

Fundo (ligado): var(--t-accent)

Bolinha: 20px, branca, desliza 20px

Transição: 0.3s

8. Botões
Primário
css
.btn-principal {
    padding: 12px 28px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    background: var(--t-accent);
    color: var(--t-accent-fg);
    cursor: pointer;
    transition: all 0.2s;
}
Secundário
css
.btn-secundario {
    padding: 12px 28px;
    border: 1px solid var(--t-border);
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    background: transparent;
    color: var(--t-text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}
Regras:

Hover (primário): opacity: 0.85, translateY(-2px)

Hover (secundário): fundo hover, borda destacada

Largura em mobile: 100%

9. Inputs (Calculadora, Newsletter)
html
<input type="number" id="input-id" value="1500" style="...">
Regras:

Fundo: var(--t-input-bg)

Borda: 1px solid var(--t-border)

Border radius: 10px

Padding: 10px 12px

Foco: borda var(--t-accent)

🧭 Navegação
Menu Lateral (Desktop)
Visível em telas > 768px (classe .aberto)

Links com data-secao para navegação

Item ativo: .ativo (borda esquerda + cor de destaque)

Menu Hambúrguer (Mobile)
Visível em telas < 768px

Abre/fecha com botão ☰ (classe .menu-toggle)

Ícone animado (☰ → ✕)

Fecha ao clicar fora (main) ou no botão ✕

Navegação por URL
Seções carregadas via parâmetro ?secao=

Exemplo: ?secao=noticias

Padrão: inicio

Links Externos
target="_blank" para abrir em nova aba

Ícone indicativo (ex: →, 🔗)

Cor de destaque: var(--t-accent)

🎬 Animações e Transições
Durações Padrão
Elemento	Duração	Easing
Hover (cards, botões)	0.2-0.3s	ease
Menu lateral	0.35s	cubic-bezier(0.4, 0, 0.2, 1)
Toggle switch	0.3s	ease
Tema (cores)	0.3s	ease
Ícone hambúrguer	0.3s	ease
Efeitos de Hover
Elemento	Efeito
Cards	transform: translateY(-3px)
Botões	transform: translateY(-2px) scale(1.02)
Itens de lista	transform: translateX(4px)
Banners	transform: scale(1.02)
Links	text-decoration: underline ou opacity: 0.7
Efeitos de Feedback
Ação	Feedback
Clique em botão	Feedback visual (opacidade, scale)
Ativar toggle	Deslize suave + mudança de cor
Trocar tema	Transição suave de cores
Carregando	Spinner ou texto "Carregando..."
Erro	Mensagem em vermelho (cor #FF2D55)
♿ Acessibilidade
Contraste
Contraste mínimo: 4.5:1 (WCAG AA)

Verificar sempre com ferramentas de contraste

Touch Targets
Mínimo: 44px (botões, links, toggles)

Espaçamento entre elementos: 8px

Textos
Tamanho mínimo: 14px

Altura de linha: 1.6 (textos corridos)

Hierarquia clara (h1, h2, h3)

Navegação por Teclado
Todos os elementos interativos acessíveis via Tab

Enter/Space para ativar

aria-label em botões sem texto visível

Leitores de Tela
Estrutura semântica (header, nav, main, section, footer)

alt em todas as imagens

aria-label em ícones e botões

⚡ Performance
Carregamento de Imagens
loading="lazy" em imagens abaixo da dobra

Timestamp (?t=...) para evitar cache de imagens

CSS
Variáveis CSS para temas (troca rápida)

Media queries para responsividade

Transições suaves com will-change: transform

JavaScript
Código assíncrono (async/await)

Timeout em requisições (10-15s)

Limpeza do DOM antes de recarregar

Cache
Service Worker com versionamento

Cache de arquivos estáticos

Limpeza de cache nas Configurações

📋 Boas Práticas
HTML
Estrutura semântica (header, nav, main, section, footer)

IDs únicos para cada elemento

Classes reutilizáveis

Comentários para organização

CSS
Mobile-first

Variáveis CSS para temas e cores

Responsividade com media queries

Nomenclatura clara (BEM-like)

JavaScript
Funções com nomes descritivos

Tratamento de erros (try/catch)

console.log para debug

localStorage para preferências do usuário

Versionamento
Números de versão semântica (MAJOR.MINOR.PATCH)

APP_VERSION no script.js

Mensagens de commit descritivas

✅ Checklist de UI
Antes de finalizar uma seção, verifique:

□ Os textos são legíveis (contraste ≥ 4.5:1)?
□ Os botões são grandes o suficiente (≥ 44px)?
□ O hover funciona em todos os elementos?
□ O tema (claro/escuro) está consistente?
□ A seção é responsiva (mobile → desktop)?
□ As imagens têm alt e loading="lazy"?
□ Os links externos abrem em nova aba (target="_blank")?
□ O estado de carregamento é informado?
□ Os erros são tratados com mensagens claras?
□ O cache é limpo ao recarregar?
🔄 Histórico de Versões
Versão	Data	Mudanças
1.04	24/07/2026	Adição de novos componentes (banners, calculadora), refinamento de toggles
1.03	23/07/2026	Correção de acessibilidade, ajuste de contraste
1.02	22/07/2026	Implementação do design system, padronização de componentes
1.01	21/07/2026	Primeira versão do UI_RULES
🚐 Jean na Estrada — Tecnologia, carros elétricos e liberdade sobre qualquer rodas.
