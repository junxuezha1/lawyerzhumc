import { readFile, writeFile } from 'node:fs/promises';
import { renderEvents } from './render-events.mjs';
await renderEvents();
const root = new URL('../', import.meta.url);
let html = await readFile(new URL('index.html', root), 'utf8');
for (const category of ['academic','social','cooperation','honors']) {
  const content = (await readFile(new URL(`generated/${category}.html`, root),'utf8')).trim();
  const start = `<!-- events:${category} -->`;
  const end = `<!-- /events:${category} -->`;
  const from = html.indexOf(start), to = html.indexOf(end);
  if (from < 0 || to < from) throw new Error(`Missing event slot ${category}`);
  html = html.slice(0,from) + start + '\n' + content + '\n' + html.slice(to);
}
await writeFile(new URL('index.html',root),html);
