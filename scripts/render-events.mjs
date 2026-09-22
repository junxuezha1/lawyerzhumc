import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const categories = ['professional', 'academic', 'social', 'cooperation', 'honors']
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))

export function validateEvents(events) {
  if (!Array.isArray(events)) throw new Error('Events must be an array')
  const ids = new Set()
  const usedPhotos = new Set()
  for (const event of events) {
    if (!/^[a-z][a-z0-9-]+$/.test(event.id) || ids.has(event.id)) throw new Error(`Invalid or duplicated event id: ${event.id}`)
    ids.add(event.id)
    if (!categories.includes(event.category)) throw new Error(`Invalid category: ${event.id}`)
    for (const field of ['title', 'summary', 'cover']) if (typeof event[field] !== 'string' || !event[field].trim()) throw new Error(`Missing ${field}: ${event.id}`)
    if (!Array.isArray(event.photos) || !event.photos.length) throw new Error(`Missing photos: ${event.id}`)
    if (event.date && (!/^\d{4}-\d{2}-\d{2}$/.test(event.date) || Number.isNaN(Date.parse(event.date)))) throw new Error(`Invalid date: ${event.id}`)
    if (event.tags && (!Array.isArray(event.tags) || event.tags.some(tag => typeof tag !== 'string'))) throw new Error(`Invalid tags: ${event.id}`)
    if (event.source && (!/^https:\/\//.test(event.source.url) || !event.source.label)) throw new Error(`Invalid source: ${event.id}`)
    for (const photo of event.photos) {
      if (!/^\/assets\/[a-zA-Z0-9_.-]+$/.test(photo.src) || !photo.alt || !photo.caption) throw new Error(`Invalid photo: ${event.id}`)
      if (usedPhotos.has(photo.src)) throw new Error(`Photo belongs to multiple entries: ${photo.src}`)
      usedPhotos.add(photo.src)
    }
    if (!event.photos.some(photo => photo.src === event.cover)) throw new Error(`Cover is not in album: ${event.id}`)
  }
  return events
}

export function renderEventCard(event) {
  const e = escapeHTML
  const cover = event.photos.find(photo => photo.src === event.cover)
  const count = event.photos.length
  const date = event.date ? `<time datetime="${e(event.date)}">${e(event.date.replaceAll('-', '.'))}</time>` : ''
  const source = event.source ? `<a class="event-source" href="${e(event.source.url)}" target="_blank" rel="noopener noreferrer">${e(event.source.label)} <span aria-hidden="true">↗</span></a>` : ''
  return `<article class="event-card" id="event-${e(event.id)}" data-event-category="${e(event.category)}">
  <button class="event-cover" type="button" data-album-open="${e(event.id)}" aria-haspopup="dialog" aria-label="查看${e(event.title)}相册，共${count}张照片">
    <img src="${e(cover.src)}" alt="${e(cover.alt)}" loading="lazy" decoding="async">
    <span class="event-photo-count">查看 ${count} 张照片 <span aria-hidden="true">↗</span></span>
  </button>
  <div class="event-copy"><p class="event-meta">${e((event.tags || []).join(' / '))}${date ? ` ${date}` : ''}</p><h3>${e(event.title)}</h3><p class="event-summary">${e(event.summary)}</p>${source}</div>
</article>`
}

export async function renderEvents(outputDirectory = path.join(root, 'generated')) {
  const events = validateEvents(JSON.parse(await readFile(path.join(root, 'src/events.json'), 'utf8')))
  for (const event of events) for (const photo of event.photos) await access(path.join(root, 'public', photo.src))
  await mkdir(outputDirectory, { recursive: true })
  for (const category of categories) {
    const entries = events.filter(event => event.category === category)
    const html = entries.length ? `<div class="event-grid">\n${entries.map(renderEventCard).join('\n')}\n</div>\n` : ''
    await writeFile(path.join(outputDirectory, `${category}.html`), html)
  }
  return { events: events.length, photos: events.reduce((sum, event) => sum + event.photos.length, 0), outputDirectory }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(JSON.stringify(await renderEvents(process.argv[2] ? path.resolve(process.argv[2]) : undefined)))
}
