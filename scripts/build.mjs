import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const outputRoot = resolve(projectRoot, 'dist');

// A ordem mantém a cascata CSS do HTML original, incluindo media queries por último.
const styles = [
  'global.css',
  'components/header.css',
  'components/hero.css',
  'components/statement.css',
  'components/catalog.css',
  'components/sections.css',
  'components/cart.css',
  'responsive.css'
];

async function renderTemplate() {
  const template = await readFile(resolve(projectRoot, 'index.html'), 'utf8');
  const includePattern = /^[\t ]*<!--\s*include:\s*([^>]+?)\s*-->[\t ]*$/gm;
  let html = '';
  let cursor = 0;

  for (const include of template.matchAll(includePattern)) {
    const source = resolve(projectRoot, include[1].trim());
    if (!source.startsWith(projectRoot + sep)) {
      throw new Error(`Include fora do projeto: ${include[1]}`);
    }
    html += template.slice(cursor, include.index);
    html += await readFile(source, 'utf8');
    cursor = include.index + include[0].length;
  }
  return html + template.slice(cursor);
}

export async function build() {
  // Leia todas as fontes antes de substituir a saída anterior.
  const html = await renderTemplate();
  const css = (await Promise.all(styles.map(style =>
    readFile(resolve(projectRoot, 'src/styles', style), 'utf8')
  ))).join('\n');

  // O único diretório removido é dist, dentro desta workspace.
  if (outputRoot !== resolve(projectRoot, 'dist') || !outputRoot.startsWith(projectRoot + sep)) {
    throw new Error('Diretório de saída inválido.');
  }
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(resolve(outputRoot, 'styles'), { recursive: true });
  await cp(resolve(projectRoot, 'public'), outputRoot, { recursive: true });
  for (const directory of ['scripts', 'data', 'config']) {
    await cp(resolve(projectRoot, 'src', directory), resolve(outputRoot, directory), { recursive: true });
  }
  await writeFile(resolve(outputRoot, 'index.html'), html, 'utf8');
  await writeFile(resolve(outputRoot, 'styles/main.css'), css, 'utf8');
  console.log('Build concluído: dist/index.html, estilos, módulos e assets.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await build();
}
