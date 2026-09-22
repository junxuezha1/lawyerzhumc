import './style.css'
import './overview.css'
import { initAlbums } from './albums.js'

initAlbums()

const header = document.querySelector('[data-header]')
const folds = [...document.querySelectorAll('[data-open]')]
const panels = [...document.querySelectorAll('.detail-panel')]
const overview = document.querySelector('#overview')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const behavior = () => reduceMotion.matches ? 'instant' : 'smooth'
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 30)
window.addEventListener('scroll', updateHeader, { passive: true })
updateHeader()

function showPanel(id, { focus = true, scroll = true } = {}) {
  const panel = panels.find(item => item.id === id)
  panels.forEach(item => { item.hidden = item !== panel })
  folds.forEach(button => button.setAttribute('aria-expanded', String(button.dataset.open === id)))
  if (panel) {
    if (focus) panel.querySelector('h2').focus({ preventScroll: true })
    if (scroll) panel.scrollIntoView({ behavior: behavior(), block: 'start' })
  }
  return Boolean(panel)
}
function closePanel(id) {
  showPanel(null, { focus: false, scroll: false })
  history.pushState(null, '', '#overview')
  const trigger = folds.find(button => button.dataset.open === id)
  trigger?.focus({ preventScroll: true })
  overview.scrollIntoView({ behavior: behavior(), block: 'start' })
}
folds.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-expanded') === 'true') return closePanel(button.dataset.open)
    history.pushState(null, '', `#${button.dataset.open}`)
    showPanel(button.dataset.open)
  })
  button.addEventListener('keydown', event => {
    let next
    if (event.key === 'ArrowRight') next = (index + 1) % folds.length
    if (event.key === 'ArrowLeft') next = (index - 1 + folds.length) % folds.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = folds.length - 1
    if (next !== undefined) { event.preventDefault(); folds[next].focus() }
  })
})
document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => closePanel(button.dataset.close))
})
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return
  const openPanel = panels.find(panel => !panel.hidden)
  if (openPanel) closePanel(openPanel.id)
})
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href^="#"]')
  if (!anchor) return
  const id = anchor.hash.slice(1)
  if (!panels.some(panel => panel.id === id)) return
  event.preventDefault()
  history.pushState(null, '', `#${id}`)
  showPanel(id)
})
function restoreLocation() {
  const id = location.hash.slice(1)
  const opened = showPanel(id, { focus: false, scroll: false })
  // Wait for hidden state/layout to settle before restoring a direct detail link.
  if (opened) requestAnimationFrame(() => document.getElementById(id).scrollIntoView({ behavior: 'instant' }))
}
window.addEventListener('popstate', restoreLocation)
window.addEventListener('hashchange', restoreLocation)
restoreLocation()
