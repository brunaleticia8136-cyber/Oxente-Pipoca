# Relatório de refatoração estrutural

## Base e decisão de arquitetura

A base escolhida foi o `index.html` da pasta atual, aberto no IDE. A cópia em `Oxente-Pipoca/index.html` tinha o mesmo conteúdo, com diferença apenas entre LF e CRLF, e foi preservada.

Antes da alteração, toda a aplicação estava em um HTML de 1.125.451 bytes e 706 linhas: estrutura, 249 linhas de CSS, 275 linhas de JavaScript, configuração da loja, catálogo, carrinho e imagens embutidas. Não havia framework, dependências, testes, scripts de build, backend, variáveis de ambiente ou formulários.

Foi mantido HTML/CSS/JavaScript puro. Um build com Node nativo permite editar cada seção em um arquivo próprio e publicar um HTML completo, sem framework nem montagem de componentes no navegador. A saída é estática e compatível com a configuração de build da Vercel.

## Estrutura anterior

```text
Teste-Vercel/
├── index.html                   # Aplicação inteira
└── Oxente-Pipoca/               # Clone independente
    ├── .git/
    └── index.html
```

## Estrutura atual

```text
Teste-Vercel/
├── index.html                   # Template: head, body e includes
├── package.json
├── package-lock.json
├── vercel.json
├── .gitignore
├── README.md
├── docs/refatoracao.md
├── public/
│   ├── images/                  # 12 imagens originais
│   └── icons/                   # Favicon e sprite SVG
├── src/
│   ├── components/              # 10 seções HTML existentes
│   ├── config/store.js
│   ├── data/products.js
│   ├── scripts/                 # 7 módulos de comportamento
│   └── styles/                  # 8 arquivos CSS
├── scripts/
│   ├── build.mjs
│   ├── check.mjs
│   └── server.mjs
├── dist/                        # Saída gerada, ignorada pelo Git
└── Oxente-Pipoca/               # Clone preservado
```

## Inventário de alterações

**Modificado:** `index.html`, agora um template de 1.238 bytes. Foram mantidos metadados, idioma, estrutura geral, âncoras e ordem das seções; CSS e JS foram substituídos por referências externas e as seções por includes de build.

**Criados — HTML:** `src/components/header.html`, `hero.html`, `statement.html`, `menu.html`, `filled-menu.html`, `events.html`, `how-to-order.html`, `final-cta.html`, `footer.html` e `cart.html`.

**Criados — CSS:** `src/styles/global.css`, `responsive.css` e `src/styles/components/header.css`, `hero.css`, `statement.css`, `catalog.css`, `sections.css`, `cart.css`. A concatenação segue exatamente a ordem do bloco original; todas as regras, valores e media queries foram mantidos.

**Criados — JS e dados:** `src/config/store.js`, `src/data/products.js` e `src/scripts/state.js`, `catalog.js`, `cart.js`, `whatsapp.js`, `ui.js`, `webmcp.js`, `main.js`. Os módulos usam imports e exports nativos, sem ciclos; o objeto de estado continua compartilhado.

**Criados — imagens:** `public/images/logo.jpg`, `hero.webp`, `chocolate-meio-amargo.webp`, `nesquik.webp`, `ninho.webp`, `ovomaltine.webp`, `morango-cravejado.webp`, `maracuja.webp`, `agridoce-ruffles.webp`, `agridoce-doritos.webp`, `recheada-nutella.webp` e `recheada-ninho.webp`. Foram extraídos os bytes originais, sem recompressão. A marca, embutida três vezes, passou a usar um único arquivo. Os 12 arquivos totalizam 663.493 bytes.

**Criados — ícones:** `public/icons/favicon.svg` e `sprite.svg`. O sprite continua inline no HTML gerado, preservando seus sete símbolos e as referências por fragmento.

**Criados — ferramentas e documentação:** `package.json`, `package-lock.json`, `vercel.json`, `.gitignore`, `scripts/build.mjs`, `check.mjs`, `server.mjs`, `README.md` e este relatório. Não há dependências de produção ou desenvolvimento no package.json.

**Removidos:** nenhum arquivo e nenhuma funcionalidade. Código condicional, inclusive consulta de produtos indisponíveis e WebMCP, foi mantido.

## Funcionalidades preservadas

- Dez produtos: oito tradicionais e dois recheados, com os mesmos nomes, descrições, categorias, imagens, preços e tamanhos de 250g/500g.
- Seleção de tamanho, quantidade de 1 a 20 nos cards, adição e agregação por produto/tamanho.
- Carrinho persistido em `localStorage['oxente-cart']`, ajuste de quantidade, remoção, subtotais e total em BRL.
- Painel do carrinho, fundo, fechamento por botões/Escape, foco e botão flutuante.
- Checkout e consultas pelo WhatsApp, encomendas para eventos e link do Instagram.
- Filtros existentes e navegação por âncoras.
- Toast, animações de entrada, animação do carrinho, breakpoints de 620/860/1120px e preferência por movimento reduzido.
- Ferramentas opcionais WebMCP `read_popcorn_menu`, `add_items_to_order`, `review_order`.
- Fontes do sistema Arial/Helvetica e Georgia/Times New Roman; cores, textos, espaçamentos e estilos existentes.

## Validações estruturais executadas

- Leitura integral dos dois HTML e confirmação de conteúdo igual após normalizar fins de linha.
- Reconstrução do HTML original em memória, restaurando blocos extraídos e data URIs: igualdade exata com o baseline.
- CSS recomposto com igualdade exata ao bloco original na validação inicial. Na preparação do commit, foram normalizados apenas finais de arquivo dos fragmentos CSS; as regras continuam idênticas e a saída difere somente nos dois espaços que antecediam a antiga tag de fechamento do style.
- SHA-256 das 12 imagens extraídas igual aos bytes embutidos originais.
- Comparação das 17 funções e dos eventos/inicialização com o baseline: iguais após normalizar apenas export e indentação.
- `npm ci --ignore-scripts`: instalação a partir do lockfile aprovada, sem dependências externas.
- `npm run check`: build, sintaxe dos 12 arquivos JavaScript de aplicação/ferramentas, imports, 17 referências locais, IDs/âncoras, imagens/preços dos 10 produtos e configuração Vercel aprovados.
- `npm run build`: comando de produção executado diretamente, concluído com código de saída 0.
- Não havia testes, lint ou typecheck anteriores. O projeto permanece em JavaScript sem TypeScript.

O build gerou `dist/index.html` completo com 10.752 bytes. O CSS original tinha 20.415 bytes; após normalizar os espaços finais na preparação do commit, `dist/styles/main.css` tem 20.413 bytes, sem alteração de regras. Assets, dados e módulos estão fora do HTML. A validação foi local; não foi criado deployment na Vercel.

## Comparação no navegador

Chrome headless foi usado com agent-browser para a checagem inicial e Playwright para a comparação automatizada. As ferramentas de teste foram instaladas somente em uma pasta temporária, sem dependências adicionadas ao projeto.

**Visual e responsividade:** dez pares antes/depois, nas larguras 390, 620, 860, 1120 e 1440px, com movimento normal e `prefers-reduced-motion: reduce`. Em todos os pares houve igualdade do DOM renderizado, textos, dimensões das imagens, retângulos e estilos calculados, incluindo pseudo-elementos. Foram comparados 380 elementos e aproximadamente 490 propriedades CSS por elemento em cada cenário.

Seis capturas completas foram idênticas pixel a pixel na primeira rodada. Quatro apresentaram pequenas diferenças na rasterização das imagens com GPU; repetidos com renderização por software, os quatro casos também tiveram zero pixels diferentes. Os pixels decodificados das 14 imagens da página produziram hashes SHA-256 iguais antes/depois. Não foi identificada regressão de layout ou imagem.

Três mensagens `ERR_UNKNOWN_URL_SCHEME` observadas durante a inspeção foram produzidas pelo placeholder de imagem usado no clone do teste. Uma verificação isolada confirmou zero erros no carregamento da aplicação e reproduziu as mensagens somente ao normalizar o clone. O teste foi ajustado para usar um placeholder válido, sem mudanças na aplicação.

**Fluxo funcional:** 167 verificações aprovadas no original e as mesmas 167 aprovadas no refatorado, com resultados equivalentes e sem erros de execução no fluxo normal. Cobertura:

- Renderização, adição e remoção dos 10 produtos; 20 seleções de tamanho; limites de 1 a 20 nos cards.
- Agregação da mesma variante, separação de tamanhos, quantidades, remoção por decremento a zero, subtotais e totais.
- Persistência após recarregar, contadores, estado vazio e botão flutuante.
- Abertura pelo cabeçalho/chamada final/botão flutuante/WebMCP, foco após abrir, fechamento pelo botão, fundo, continuar e Escape.
- Toast, navegação ao cardápio, mensagem completa de checkout, eventos e links estáticos.
- Consulta de produto indisponível em cenário controlado em memória.
- WebMCP: leitura, adição, mescla, revisão, entradas inválidas, API ausente e falhas síncronas/assíncronas de registro.
- Cinco casos de armazenamento inválido e o lote WebMCP parcialmente inválido: comportamento anterior reproduzido igualmente.

As chamadas de WhatsApp e os links externos foram interceptados ou inspecionados; nenhuma mensagem foi enviada. A integração real do WebMCP foi simulada para validar seus contratos, sem exigir suporte nativo do navegador. Não foi testado atendimento real pelo WhatsApp nem deployment remoto.

Evidências técnicas e capturas da execução ficaram na pasta temporária local usada na validação, em `evidence/`. O resumo visual é `visual-summary.json`; o funcional é `functional-extended/report.json`. Essa pasta temporária não faz parte do repositório nem do site publicado.

Os navegadores e servidores usados nos testes foram encerrados. As portas locais 4173 e 4174 ficaram livres.

## Pontos anteriores que merecem atenção futura

- JSON inválido no carrinho salvo interrompe a inicialização. Objetos/null e produtos inexistentes também provocam erros; tamanho inexistente pode resultar em `R$ NaN`. Os cinco cenários foram reproduzidos igualmente nas duas versões.
- O filtro aplica `hidden` aos cards, mas o CSS `display: flex` mantém os produtos renderizados. Confirmado no filtro Doces: dois cards agridoces ficam com `hidden` e continuam visíveis nas duas versões.
- Em viewport de 620px, as duas versões apresentam conteúdo com largura de 687px, evidenciando overflow horizontal anterior.
- O carrinho foca o botão de fechar ao abrir, mas não implementa contenção nem restauração do foco.
- A integração WebMCP valida e altera itens um por um. Um item inválido posterior deixa alterações parciais em memória sem persistir; uma adição seguinte pode persistir também o item anterior. Esse comportamento foi reproduzido nas duas versões.
- A observação das animações é chamada duas vezes na inicialização.
- WhatsApp/Instagram aparecem tanto na configuração quanto em links HTML estáticos. `instagramUrl` permanece configurado, embora o código atual use a URL do rodapé.

Esses pontos foram preservados nesta etapa para não misturar mudanças funcionais com a reorganização. Não houve deploy, commit ou push. O clone não foi atualizado; publicar/sincronizar a estrutura atual é uma etapa posterior.

Para trabalhar localmente é necessário Node.js 24. Neste ambiente, Node/npm não estavam no PATH; a validação usa um runtime oficial portátil em uma pasta temporária, sem instalação global. Consulte o README para os comandos usuais.
