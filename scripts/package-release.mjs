import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
const mime = { '.jpg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml' };
const used = new Set();
function inlineImages(text) {
  return text.replace(/\/assets\/[\w.-]+\.(?:jpg|png|webp|svg)/g, file => {
    used.add(file);
    return `data:${mime[extname(file)]};base64,${readFileSync(resolve(dist, file.slice(1))).toString('base64')}`;
  });
}
let html = readFileSync(resolve(dist, 'index.html'), 'utf8');
html = html.replace(/<link\b[^>]*rel="preload"[^>]*>/g, '');
html = html.replace(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, file) => {
  const js = inlineImages(readFileSync(resolve(dist, file.replace(/^\//,'')), 'utf8'));
  return `<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`;
});
html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_,file) => `<style>${inlineImages(readFileSync(resolve(dist,file.replace(/^\//,'')),'utf8'))}</style>`);
html = inlineImages(html);
if (/\/assets\//.test(html)) throw new Error('Unbundled asset in release');
if (html.includes('noindex') || html.includes('本地审阅稿')) throw new Error('Draft metadata in release');
const release = resolve(root, 'release');
mkdirSync(release, {recursive:true});
writeFileSync(resolve(release,'index.html'),html);
const manifest = {builtAt:new Date().toISOString(),variant:'five-panel-with-event-albums',uniqueImages:used.size,bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex')};
writeFileSync(resolve(root,'release-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest,null,2));
