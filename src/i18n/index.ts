import { createI18n } from 'vue-i18n'
import { clearStoredLocale, readStoredLocale, storeLocale } from './locale-storage'
import { DEFAULT_LOCALE, HTML_LANG, type Locale } from './locales'
import es from './locales/es.json'

export type MessageSchema = typeof es

/**
 * Spanish is bundled; the other languages are loaded on demand.
 * vue-i18n v11 compiles messages just in time to an AST and interprets them,
 * so it never needs `eval` and works under the production CSP.
 */
export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { es } as Record<Locale, MessageSchema>,
})

const loaders: Record<Exclude<Locale, 'es'>, () => Promise<{ default: MessageSchema }>> = {
  en: () => import('./locales/en.json'),
  'zh-CN': () => import('./locales/zh-CN.json'),
  de: () => import('./locales/de.json'),
}

function apply(locale: Locale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = HTML_LANG[locale]
}

/** Switches the interface language, loading its messages first if needed. */
export async function setLocale(locale: Locale): Promise<void> {
  if (locale !== 'es' && !i18n.global.availableLocales.includes(locale)) {
    const messages = await loaders[locale]()
    i18n.global.setLocaleMessage(locale, messages.default)
  }
  apply(locale)
  storeLocale(locale)
}

/** Restores the language chosen earlier in this tab; Spanish otherwise. */
export async function restoreLocale(): Promise<void> {
  const stored = readStoredLocale()
  if (stored === DEFAULT_LOCALE) return
  try {
    await setLocale(stored)
  } catch {
    apply(DEFAULT_LOCALE)
  }
}

/** Back to Spanish and forget the choice («Limpiar datos de este dispositivo»). */
export function resetLocale(): void {
  apply(DEFAULT_LOCALE)
  clearStoredLocale()
}

/**
 * Spanish text regardless of the active language. The Bitácora PDF is presented
 * to Salvadoran institutions, so it is always generated in Spanish.
 */
export const spanish = (key: string, named: Record<string, unknown> = {}): string =>
  i18n.global.t(key, named, { locale: 'es' })
