# Oxente Pipoca Gourmet

Cardápio em HTML, CSS e JavaScript puro, organizado por responsabilidade. O build usa apenas as APIs do Node.js: não há framework, bibliotecas ou dependências de produção.

## Executar localmente

Com Node.js 24 instalado, execute na pasta deste README:

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:4173`. O servidor acompanha alterações em `index.html`, `src/` e `public/`, refaz o build e permite conferir a mudança ao atualizar a página. `PORT` pode definir outra porta.

```sh
npm run check    # Build, sintaxe JavaScript, imports, assets, âncoras e dados
npm run build    # Gera o site completo em dist/
npm run preview  # Gera e serve o site sem acompanhar alterações
```

O `index.html` da raiz é um template de montagem. Os comentários `include` são resolvidos durante o build; abra o site pelo servidor local para ver todas as seções. O `dist/index.html` é o HTML completo para publicação. Não edite `dist/`, pois ele é regenerado.

## Onde alterar

| Parte | Arquivos principais |
| --- | --- |
| Estrutura, metadados e ordem das seções | `index.html` |
| Cabeçalho | `src/components/header.html`, `src/styles/components/header.css` |
| Hero | `src/components/hero.html`, `src/styles/components/hero.css` |
| Apresentação da marca | `src/components/statement.html`, `src/styles/components/statement.css` |
| Cardápio e recheadas | `src/components/menu.html`, `filled-menu.html`, `src/scripts/catalog.js`, `src/styles/components/catalog.css` |
| Produtos, descrições, imagens e preços | `src/data/products.js` |
| Eventos, instruções, chamada final e rodapé | Componentes correspondentes em `src/components/`, `src/styles/components/sections.css` |
| Carrinho | `src/components/cart.html`, `src/scripts/cart.js`, `src/styles/components/cart.css` |
| Estado compartilhado e moeda | `src/scripts/state.js` |
| WhatsApp e mensagem do pedido | `src/scripts/whatsapp.js`, `src/config/store.js` |
| Toast e animações de entrada | `src/scripts/ui.js`, `src/styles/components/cart.css` |
| Eventos e inicialização | `src/scripts/main.js` |
| Integração opcional WebMCP | `src/scripts/webmcp.js` |
| Cores, fontes e estilos comuns | `src/styles/global.css` |
| Responsividade e movimento reduzido | `src/styles/responsive.css` |
| Imagens e ícones | `public/images/`, `public/icons/` |
| Build, verificação e servidor | `scripts/` |

Os preços continuam em centavos: `1000` representa R$ 10,00. Os IDs dos produtos e a chave `oxente-cart` conectam o catálogo ao carrinho salvo.

WhatsApp e Instagram também aparecem em links HTML existentes (`hero.html` e `footer.html`). Se alterar esses destinos no futuro, confira tanto a configuração quanto esses links. Essa duplicação foi mantida nesta refatoração para preservar a implementação atual.

## Como o build funciona

`scripts/build.mjs` expande os includes HTML, reúne os estilos na ordem original e copia `public/`, módulos, dados e configuração para `dist/`. As partes HTML são reunidas no build, sem requisições adicionais no navegador. O sprite SVG é inserido no HTML para manter as referências `#i-cart` e demais ícones existentes.

Os arquivos em `public/` ficam na raiz do site publicado: `public/images/logo.jpg` torna-se `dist/images/logo.jpg`. O JavaScript usa módulos ES nativos, com imports relativos. A aplicação permanece inteiramente no navegador, sem backend ou variáveis de ambiente.

## Vercel

O `vercel.json` define somente:

- Comando de build: `npm run build`.
- Diretório publicado: `dist`.

Na futura importação, use esta pasta como raiz do projeto e o preset **Other**. O `package.json` define Node.js `24.x`, versão suportada pela plataforma. Não são necessárias funções, rewrites ou rotas de SPA: o site tem uma página e navegação por âncoras.

Referências: [configuração do projeto](https://vercel.com/docs/project-configuration), [Node.js suportado](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

A pasta atual é o repositório de trabalho, na branch `main`, conectado ao GitHub de `Oxente-Pipoca`. A pasta `Oxente-Pipoca/` é a cópia clonada anteriormente: ela foi preservada e não entra no build nem no versionamento da pasta atual. A refatoração permanece local até que seu commit e push sejam autorizados.

Veja o inventário, as validações e os pontos de atenção em [docs/refatoracao.md](docs/refatoracao.md).

A revisão para preparar o versionamento está registrada em [docs/revisao-git.md](docs/revisao-git.md).
