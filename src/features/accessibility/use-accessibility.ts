import { reactive, watch } from 'vue'
import { createPreferenceStore, DEFAULT_PREFERENCES, type AccessibilityPreferences } from './domain/preferences'
import { stopSpeech } from './speech'

const store = createPreferenceStore(sessionStorage)
const preferences = reactive<AccessibilityPreferences>(store.load())

/** Mirrors the options as classes on <html>, read by accessibility.css. */
function applyToDocument() {
  const root = document.documentElement.classList
  root.toggle('a11y-large-text', preferences.largeText)
  root.toggle('a11y-high-contrast', preferences.highContrast)
}

watch(
  preferences,
  (current) => {
    applyToDocument()
    if (!current.readAloud) stopSpeech()
    // All off is the default: nothing needs to stay in storage.
    if (Object.values(current).some(Boolean)) store.save(current)
    else store.clear()
  },
  { deep: true },
)

/** Applies the options chosen earlier in this tab before the first paint. */
export function restoreAccessibility() {
  applyToDocument()
}

/** «Limpiar datos de este dispositivo»: every option back to off and forgotten. */
export function resetAccessibility() {
  stopSpeech()
  Object.assign(preferences, DEFAULT_PREFERENCES)
  applyToDocument()
  store.clear()
}

let openPanel: (() => void) | undefined

/** The panel registers how to open itself; footer and P01 links call openAccessibilityPanel(). */
export function registerAccessibilityPanel(open: () => void) {
  openPanel = open
}

export function openAccessibilityPanel() {
  openPanel?.()
}

export function useAccessibility() {
  return { preferences }
}
