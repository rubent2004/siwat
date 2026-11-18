import type { RouteLocationRaw, Router } from 'vue-router'
import { i18n } from '../../i18n'
import { stopSpeech } from '../accessibility/speech'

const DOUBLE_ESC_WINDOW_MS = 800
const CAMOUFLAGE_ICON = './weather.svg'

let router: Router | undefined
let returnTo: RouteLocationRaw = { name: 'welcome' }
let appIdentity = { title: document.title, icon: '' }

function iconLink() {
  return document.querySelector<HTMLLinkElement>('#app-icon')
}

function closeOpenDialogs() {
  document.querySelectorAll('dialog[open]').forEach((dialog) => (dialog as HTMLDialogElement).close())
}

/** «SALIR RÁPIDO»: hide the session behind a neutral weather screen. */
export function quickExit() {
  // Silence any reading aloud first, before anything else happens.
  stopSpeech()
  if (!router || router.currentRoute.value.meta.camouflage) return
  returnTo = router.currentRoute.value.fullPath
  appIdentity = { title: document.title, icon: iconLink()?.href ?? '' }
  closeOpenDialogs()
  document.title = i18n.global.t('weather.documentTitle')
  iconLink()?.setAttribute('href', CAMOUFLAGE_ICON)
  void router.replace({ name: 'weather' })
}

/** Leaves the camouflage screen and restores the session where she left it. */
export function returnFromCamouflage() {
  if (!router) return
  document.title = appIdentity.title
  if (appIdentity.icon) iconLink()?.setAttribute('href', appIdentity.icon)
  void router.replace(returnTo)
}

/** Esc pressed twice in a row sends her to the camouflage screen from anywhere. */
export function installQuickExit(appRouter: Router) {
  router = appRouter
  let lastEscape = 0
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    const now = event.timeStamp
    if (now - lastEscape < DOUBLE_ESC_WINDOW_MS) {
      lastEscape = 0
      quickExit()
    } else {
      lastEscape = now
    }
  })
}
