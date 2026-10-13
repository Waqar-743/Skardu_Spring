import http from 'node:http';
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';

const root = path.resolve('.pages-build/out');
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '/Skardu_Spring';
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.txt': 'text/plain', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(prefix + '/')) { response.writeHead(404).end(); return; }
    let file = path.resolve(root, '.' + pathname.slice(prefix.length));
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(301, { Location: pathname + '/' }).end(); return; }
      file = path.join(file, 'index.html');
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(response);
  } catch { response.writeHead(404).end(); }
}).listen(3006, '127.0.0.1', () => console.log(`Pages test server: http://127.0.0.1:3006${prefix}/`));
