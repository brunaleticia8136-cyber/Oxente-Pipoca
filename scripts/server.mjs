import { createReadStream, watch } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { build, outputRoot, projectRoot } from './build.mjs';

await build();
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg'
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(outputRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(outputRoot + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(file)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store'
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).on('error', () => response.destroy()).pipe(response);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Site disponível em http://127.0.0.1:${port}`);
});

const watchers = [];
if (process.argv.includes('--watch')) {
  let timer;
  let pending = Promise.resolve();
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      pending = pending.then(build).catch(error => console.error(error.message));
    }, 150);
  };
  for (const directory of ['src', 'public']) {
    watchers.push(watch(resolve(projectRoot, directory), { recursive: true }, rebuild));
  }
  watchers.push(watch(resolve(projectRoot, 'index.html'), rebuild));
  console.log('Acompanhando alterações. Atualize a página após o build.');
}

function close() {
  watchers.forEach(watcher => watcher.close());
  server.close(() => process.exit(0));
}
process.on('SIGINT', close);
process.on('SIGTERM', close);
