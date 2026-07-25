# 🎨 Guia de Identidade Visual - Jean na Estrada

> **Versão:** 1.04  
> **Última atualização:** 24 de julho de 2026  
> **Status:** Em uso no app oficial

---

## 📋 Sumário

1. [Sobre a Marca](#sobre-a-marca)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Componentes Visuais](#componentes-visuais)
5. [Ícones](#ícones)
6. [Imagens e Banners](#imagens-e-banners)
7. [Espaçamentos e Grid](#espaçamentos-e-grid)
8. [Responsividade](#responsividade)
9. [Temas](#temas)
10. [Diretrizes de Uso](#diretrizes-de-uso)

---

## 🚐 Sobre a Marca

### O que é Jean na Estrada?

Jean na Estrada é um canal e comunidade focada em:

- **Carros elétricos** — BYD, GWM, Tesla, Geely, etc.
- **Tecnologia automotiva** — CAN Bus, Orange Pi, Arduino, Raspberry Pi
- **Projetos DIY** — Desbloqueios de multimídia, automação
- **Mobilidade** — Uber, viagens, eletropostos
- **Tutoriais e Reviews** — Análises honestas e guias práticos

### Sentimento da Marca

| Sentimento | Como aplicar |
| :--- | :--- |
| **Tecnologia** | Elementos modernos, tipografia limpa, cores frias |
| **Aventura** | Imagens de estrada, movimento, liberdade |
| **Futuro** | Tons de azul e cinza, design minimalista |
| **Confiabilidade** | Hierarquia clara, contraste adequado |
| **Qualidade** | Acabamento polido, espaçamentos generosos |

### Inspiração Visual

A identidade visual é inspirada em marcas de referência:

| Marca | O que inspira |
| :--- | :--- |
| **Tesla** | Minimalismo, tecnologia, elegância |
| **Rivian** | Aventura, robustez, natureza |
| **Porsche** | Performance, design refinado, esportividade |
| **DJI** | Inovação, precisão, modernidade |
| **Kinex** | "Pretty, not flashy" — limpo e intuitivo |

---

## 🎨 Paleta de Cores

### Tema Dark (Padrão)

A paleta escura é o padrão do app, criando uma atmosfera tecnológica e sofisticada.

| Nome | Uso | Código HEX | Visual |
| :--- | :--- | :--- | :--- |
| **Dark Blue** | Fundo principal | `#070b16` | 🔵 |
| **Dark Gray** | Fundo de superfícies | `#0d1220` | ⚫ |
| **Card Dark** | Fundo de cards | `#111827` | ⚪ |
| **Card Hover** | Hover de cards | `#151f30` | ⚪ |
| **Neon Blue** | Destaque, links, botões | `#2979ff` | 💙 |
| **Neon Blue Dim** | Fundo de destaque | `rgba(41, 121, 255, 0.12)` | 💙 |
| **Text Light** | Texto principal | `#e2e8f0` | ⬜ |
| **Text Muted** | Texto secundário | `#64748b` | ⬜ |
| **Text Dim** | Texto terciário | `#94a3b8` | ⬜ |

**Exemplo de uso no CSS:**
```css
body {
    background: #070b16;
    color: #e2e8f0;
}

.card {
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.07);
}

.accent {
    color: #2979ff;
}
Tema Light
A versão clara do app, para uso em ambientes com muita luz.

Nome	Uso	Código HEX	Visual
Light Gray	Fundo principal	#f1f5f9	⬜
White	Cards e superfícies	#ffffff	⬜
Card Hover Light	Hover de cards	#f8fafc	⬜
Blue	Destaque, links, botões	#1d4ed8	💙
Blue Dim	Fundo de destaque	rgba(29, 78, 216, 0.08)	💙
Text Dark	Texto principal	#0f172a	⬛
Text Muted Dark	Texto secundário	#334155	⬛
Text Dim Dark	Texto terciário	#64748b	⬛
Temas Extras
Além do Dark e Light, o app oferece 3 temas adicionais para personalização.

Tema Red 🟥
Elemento	Cor
Fundo	#0c0506
Superfície	#130709
Cards	#1a0a0c
Destaque	#dc2626
Tema Green 🟩
Elemento	Cor
Fundo	#030d07
Superfície	#061410
Cards	#091a14
Destaque	#10b981
Tema Blue 🟦
Elemento	Cor
Fundo	#020c1b
Superfície	#061527
Cards	#0a1e35
Destaque	#38bdf8
Cores Fixas (Não variam com o tema)
Uso	Cor	Código HEX
Laranja	Destaques secundários	#ff6d00
Teal	Destaques terciários	#00bcd4
Vermelho	Badges, alertas	#dc2626
Verde	Resultados positivos	#10b981
Rosa	Hover de botões	#FF2D55
📝 Tipografia
Fonte Principal: Outfit
O app utiliza a fonte Outfit do Google Fonts, uma tipografia moderna, limpa e altamente legível.

Carregamento:

css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
Pesos e Uso
Peso	Uso	Exemplo
300	Textos muito leves (raramente usado)	—
400	Textos corridos, parágrafos	font-weight: 400;
500	Textos de ênfase média	font-weight: 500;
600	Botões, subtítulos, links	font-weight: 600;
700	Títulos de seção	font-weight: 700;
800	Títulos principais	font-weight: 800;
900	Destaques especiais	font-weight: 900;
Hierarquia Tipográfica
Elemento	Tamanho	Peso	Cor
Título do app (header)	22px	800	Gradiente (accent → teal)
Título de seção (h2)	20px	700	var(--t-text)
Título de card (h3)	17px	700	var(--t-text)
Subtítulo de card	15px	600	var(--t-text)
Texto de parágrafo	14px	400	var(--t-text-muted)
Texto pequeno (meta)	12px	400	var(--t-text-dim)
Badge	10px	600	var(--t-accent)
Botão	15px	600	var(--t-accent-fg)
Legibilidade
Contraste mínimo: 4.5:1 (WCAG AA)

Tamanho mínimo de texto: 14px

Altura de linha: 1.6 para textos, 1.3 para títulos

Espaçamento entre letras: 0.3–0.5px para títulos

🧩 Componentes Visuais
Badges
Badges são usados para tags, categorias e destaques.

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
Variações de cor:

.badge-orange — #ff6d00

.badge-teal — #00bcd4

.badge-red — #dc2626

.badge-green — #10b981

Cards
Cards são usados para vídeos, notícias, tutoriais, produtos e contatos.

css
.card {
    background: var(--t-card);
    border: 1px solid var(--t-border);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.25s ease;
}

.card:hover {
    transform: translateY(-3px);
    border-color: var(--t-accent);
    box-shadow: 0 8px 30px rgba(41, 121, 255, 0.08);
}
Botões
Botão Primário
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

.btn-principal:hover {
    opacity: 0.85;
    transform: translateY(-2px);
}
Botão Secundário
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

.btn-secundario:hover {
    background: var(--t-surface-hover);
    border-color: var(--t-accent);
    transform: translateY(-2px);
}
Toggles (Interruptores)
Usados nas configurações para ativar/desativar funcionalidades.

css
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
    cursor: pointer;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-switch .slider {
    position: absolute;
    inset: 0;
    background: var(--t-border-strong);
    border-radius: 24px;
    transition: background 0.3s;
}

.toggle-switch .slider::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: transform 0.3s;
}

.toggle-switch input:checked + .slider {
    background: var(--t-accent);
}

.toggle-switch input:checked + .slider::after {
    transform: translateX(20px);
}
Lista de Itens (item-list)
Usada em Tutoriais, Produtos e Contato.

html
<div class="item-list">
    <div class="item">
        <span class="icon">🔓</span>
        <div class="info">
            <div class="title">Título</div>
            <div class="desc">Descrição</div>
            <div class="meta">Metadados</div>
        </div>
        <a href="#" class="action">Ação →</a>
    </div>
</div>
Grid de Vídeos (video-grid)
Usada na seção Início para exibir os vídeos do canal.

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
            <div class="meta">Data</div>
        </div>
    </div>
</div>
Banners (Contato e Parceiros)
Banners são usados para exibir links de contato e parceiros de forma visual.

html
<a href="..." target="_blank" class="banner-link">
    <img src="..." alt="..." class="banner-img">
</a>
Regras:

Tamanho: 1983x793

Bordas arredondadas: 16px

Efeito hover: escala 1.02 + sombra

Responsivo: 100% da largura, max-width 800px

🖼️ Ícones
Fonte de Ícones
O app utiliza emojis e Lucide Icons (via CDN).

Carregamento:

html
<script src="https://unpkg.com/lucide@latest"></script>
Tamanhos Recomendados
Contexto	Tamanho
Menu lateral	20px
Botões	20px
Cards de vídeo	24px
Cabeçalho (redes sociais)	16px
Ícones decorativos	28-32px
Cores
Contexto	Cor
Ícones de texto	var(--t-text)
Ícones de destaque	var(--t-accent)
Ícones de ação	var(--t-accent)
📐 Espaçamentos e Grid
Espaçamentos Base
Uso	Valor
Padding de seção (mobile)	16px
Padding de seção (desktop)	24-28px
Gap entre cards	16px
Gap entre itens de lista	10px
Padding interno de cards	16-20px
Border radius (cards)	16px
Border radius (botões)	10px
Larguras Máximas
Elemento	Largura
Conteúdo principal	1000px
Cards de vídeo	2 colunas (600px+)
Banners	800px (máx)
Formulários	600px (máx)
📱 Responsividade
Breakpoints
Nome	Largura	Comportamento
Mobile	< 600px	Coluna única, fontes menores
Tablet	600-1024px	Grid 2 colunas, layout adaptativo
Desktop	> 1024px	Grid 3 colunas, layout completo
Mobile First
O app foi desenvolvido com a abordagem mobile-first, priorizando a experiência em dispositivos móveis.

css
/* Mobile (padrão) */
.grid {
    grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 600px) {
    .grid {
        grid-template-columns: 1fr 1fr;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .grid {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
🌗 Temas
O app oferece 5 temas que podem ser alternados pelo usuário nas Configurações.

Tema	Classe CSS	Descrição
Dark	(padrão)	Fundo escuro, destaque azul neon
Light	.light-mode	Fundo claro, destaque azul refinado
Red	.red-mode	Fundo escuro, destaque vermelho
Green	.green-mode	Fundo escuro, destaque verde
Blue	.blue-mode	Fundo escuro, destaque azul claro
Como Aplicar
javascript
// Aplicar tema
function aplicarTema(temaId) {
    const html = document.documentElement;
    html.classList.remove('light-mode', 'red-mode', 'green-mode', 'blue-mode');
    if (temaId !== 'dark') {
        html.classList.add(temaId + '-mode');
    }
    localStorage.setItem('tema', temaId);
}
🚫 Diretrizes de Uso
Coisas para Fazer ✅
Usar a paleta de cores definida

Manter espaçamentos generosos

Priorizar legibilidade

Usar Outfit como fonte principal

Manter consistência visual entre seções

Adaptar todos os componentes ao tema atual

Coisas para Evitar ❌
Não usar cores fora da paleta

Não misturar fontes diferentes

Não criar elementos com contraste baixo

Não usar animações exageradas

Não poluir a interface com elementos desnecessários

Não ignorar a responsividade

📝 Exemplos Práticos
Exemplo 1: Seção de Vídeos
html
<div class="video-grid">
    <div class="video-card">
        <div class="thumbnail">
            <img src="https://img.youtube.com/vi/ID/hqdefault.jpg" alt="Título">
            <span class="badge-tag badge">Destaque</span>
            <div class="play-overlay">▶</div>
        </div>
        <div class="content">
            <h3>Como viajar com pouco dinheiro</h3>
            <p>Dicas e truques para economizar na estrada</p>
            <div class="meta">📅 20 Jul 2026</div>
        </div>
    </div>
</div>
Exemplo 2: Seção de Tutoriais
html
<div class="item-list">
    <div class="item">
        <span class="icon">🔓</span>
        <div class="info">
            <div class="title">Geely EX2 — Desbloqueio Completo</div>
            <div class="desc">Instale apps e libere funções ocultas</div>
            <div class="meta">Intermediário · 30 min</div>
        </div>
        <a href="#" class="action">▶</a>
    </div>
</div>
📚 Referências
Google Fonts — Outfit: fonts.google.com/specimen/Outfit

Lucide Icons: lucide.dev

Kinex (inspiração): kinex.lexwah.com

Tesla Design: tesla.com

🔄 Histórico de Versões
Versão	Data	Mudanças
1.04	24/07/2026	Adição de temas Red, Green, Blue; novos banners; calculadora completa
1.03	23/07/2026	Refinamento do tema Light; correção de contraste
1.02	22/07/2026	Implementação do design system baseado no Figma
1.01	21/07/2026	Primeira versão do BRAND_GUIDE
🚐 Jean na Estrada — Tecnologia, carros elétricos e liberdade sobre qualquer rodas.
