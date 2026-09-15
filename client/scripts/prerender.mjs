/**
 * Inyecta el HTML prerenderizado dentro de dist/index.html.
 *
 * Se ejecuta después de los dos builds de Vite (cliente y servidor). El cliente
 * sigue montando la aplicación con createRoot: el marcado inyectado es para los
 * rastreadores y para que se vea contenido antes de que arranque el JavaScript.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const template = readFileSync(resolve(root, 'dist/index.html'), 'utf-8');

const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);
const html = render('/');

const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error('No se encontró el contenedor #root en dist/index.html');
}

writeFileSync(
  resolve(root, 'dist/index.html'),
  template.replace(marker, `<div id="root">${html}</div>`),
  'utf-8'
);

// El build de servidor es un artefacto intermedio.
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });

const texto = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log(`[prerender] ${texto.length} caracteres de texto inyectados en dist/index.html`);
