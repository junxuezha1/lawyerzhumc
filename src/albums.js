import events from './events.json'
import './albums.css'

const eventById = new Map(events.map(event => [event.id, event]))
let initialized = false

/** Call after static event cards are in the document. Repeated calls are safe. */
export function initAlbums() {
  if (initialized) return
  initialized = true
  const dialog = document.createElement('dialog')
  dialog.className = 'album-dialog'
  dialog.setAttribute('aria-labelledby', 'album-title')
  dialog.setAttribute('aria-describedby', 'album-caption')
  dialog.innerHTML = `<div class="album-shell">
    <header class="album-header"><div><p class="album-eyebrow">活动与资料相册</p><h2 id="album-title"></h2></div><button class="album-close" type="button" aria-label="关闭相册" autofocus>关闭 <span aria-hidden="true">×</span></button></header>
    <div class="album-stage"><img class="album-image" alt=""><p class="album-error" role="status" hidden>照片暂时无法显示，请切换其他照片或稍后重试。</p><button class="album-prev" type="button" aria-label="上一张照片">←</button><button class="album-next" type="button" aria-label="下一张照片">→</button></div>
    <div class="album-caption-row"><p id="album-caption" aria-live="polite" aria-atomic="true"></p><span class="album-position" aria-live="polite" aria-atomic="true"></span></div>
    <div class="album-thumbnails" role="group" aria-label="选择照片"></div>
  </div>`
  document.body.append(dialog)
  const title = dialog.querySelector('#album-title')
  const image = dialog.querySelector('.album-image')
  const caption = dialog.querySelector('#album-caption')
  const position = dialog.querySelector('.album-position')
  const thumbnails = dialog.querySelector('.album-thumbnails')
  const previous = dialog.querySelector('.album-prev')
  const next = dialog.querySelector('.album-next')
  const close = dialog.querySelector('.album-close')
  const error = dialog.querySelector('.album-error')
  let activeEvent = null
  let activeIndex = 0
  let returnFocus = null
  let previousOverflow = ''

  function showPhoto(index) {
    if (!activeEvent) return
    activeIndex = (index + activeEvent.photos.length) % activeEvent.photos.length
    const photo = activeEvent.photos[activeIndex]
    error.hidden = true
    image.hidden = false
    image.alt = photo.alt
    image.src = photo.src
    caption.textContent = photo.caption
    position.textContent = `${activeIndex + 1} / ${activeEvent.photos.length}`
    const onePhoto = activeEvent.photos.length < 2
    previous.hidden = onePhoto
    next.hidden = onePhoto
    thumbnails.hidden = onePhoto
    thumbnails.querySelectorAll('button').forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === activeIndex))
      if (index === activeIndex) button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
    })
  }
  function openAlbum(id, trigger) {
    const event = eventById.get(id)
    if (!event) return
    activeEvent = event
    returnFocus = trigger
    title.textContent = event.title
    thumbnails.replaceChildren()
    event.photos.forEach((photo, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'album-thumbnail'
      button.setAttribute('aria-label', `第 ${index + 1} 张：${photo.caption}`)
      const thumb = document.createElement('img')
      thumb.src = photo.src
      thumb.alt = ''
      thumb.decoding = 'async'
      button.append(thumb)
      button.addEventListener('click', () => showPhoto(index))
      thumbnails.append(button)
    })
    previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    dialog.showModal()
    showPhoto(Math.max(0, event.photos.findIndex(photo => photo.src === event.cover)))
    close.focus({ preventScroll: true })
  }
  function restoreAfterClose() {
    if (!returnFocus) return
    document.documentElement.style.overflow = previousOverflow
    if (returnFocus.isConnected) returnFocus.focus({ preventScroll: true })
    returnFocus = null
    activeEvent = null
  }
  function closeAlbum() {
    if (!dialog.open) return
    dialog.close()
    // Restore synchronously so a second album can open before the queued close event.
    restoreAfterClose()
  }
  dialog.addEventListener('close', () => {
    if (!dialog.open) restoreAfterClose()
  })
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeAlbum() })
  close.addEventListener('click', closeAlbum)
  previous.addEventListener('click', () => showPhoto(activeIndex - 1))
  next.addEventListener('click', () => showPhoto(activeIndex + 1))
  image.addEventListener('error', () => { error.hidden = false; image.hidden = true })
  image.addEventListener('load', () => { error.hidden = true; image.hidden = false })
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeAlbum()
  })
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-album-open]')
    if (trigger && !dialog.open) openAlbum(trigger.dataset.albumOpen, trigger)
  })
  // Capture handled keys so Escape closes the album without also closing its parent column.
  document.addEventListener('keydown', event => {
    if (!dialog.open) return
    if (!['Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    if (event.key === 'Escape') closeAlbum()
    if (event.key === 'ArrowLeft') showPhoto(activeIndex - 1)
    if (event.key === 'ArrowRight') showPhoto(activeIndex + 1)
    if (event.key === 'Home') showPhoto(0)
    if (event.key === 'End') showPhoto(activeEvent.photos.length - 1)
  }, true)
}
