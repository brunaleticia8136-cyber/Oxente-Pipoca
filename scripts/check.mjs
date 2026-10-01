import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { build, outputRoot, projectRoot } from './build.mjs';

await build();

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => {
    const file = resolve(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  }));
  return groups.flat();
}

let references = 0;
async function checkReference(reference, from) {
  if (!reference || /^(?:[a-z]+:|\/\/)/i.test(reference)) return;
  const pathname = reference.split(/[?#]/)[0];
  if (!pathname) return;
  const file = pathname.startsWith('/')
    ? resolve(outputRoot, '.' + pathname)
    : resolve(dirname(from), pathname);
  assert(file.startsWith(outputRoot + sep), `Caminho fora da saída: ${reference}`);
  await access(file).catch(() => {
    throw new Error(`Referência inexistente em ${from}: ${reference}`);
  });
  references++;
}

const sourceFiles = [
  ...await filesIn(resolve(projectRoot, 'src')),
  ...await filesIn(resolve(projectRoot, 'scripts'))
];
const javascriptFiles = sourceFiles.filter(file => ['.js', '.mjs'].includes(extname(file)));
for (const file of javascriptFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert.equal(result.status, 0, `JavaScript inválido: ${file}\n${result.stderr}`);
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/\b(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
    await access(resolve(dirname(file), match[1]));
  }
}

const htmlFile = resolve(outputRoot, 'index.html');
const html = await readFile(htmlFile, 'utf8');
assert(!/<!--\s*include:/.test(html), 'Include não expandido.');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs HTML duplicados.');
for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const reference = match[1];
  if (reference.startsWith('#')) assert(ids.includes(reference.slice(1)), `Âncora inexistente: ${reference}`);
  else await checkReference(reference, htmlFile);
}

const cssFile = resolve(outputRoot, 'styles/main.css');
const css = await readFile(cssFile, 'utf8');
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  await checkReference(match[1], cssFile);
}

const { PRODUCTS } = await import('../src/data/products.js');
assert.equal(new Set(PRODUCTS.map(product => product.id)).size, PRODUCTS.length, 'IDs de produtos duplicados.');
for (const product of PRODUCTS) {
  await checkReference(product.image, htmlFile);
  assert(Object.values(product.sizes).every(price => Number.isInteger(price) && price > 0), `Preço inválido: ${product.id}`);
}

const config = JSON.parse(await readFile(resolve(projectRoot, 'vercel.json'), 'utf8'));
assert.equal(config.outputDirectory, 'dist');
assert.equal(config.buildCommand, 'npm run build');
console.log(`Verificação concluída: ${javascriptFiles.length} arquivos JS, imports, ${references} referências locais, âncoras, ${PRODUCTS.length} produtos e configuração Vercel.`);
