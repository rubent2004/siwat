import { DEFAULT_LOCALE, isLocale, type Locale } from './locales'

const LOCALE_KEY = 'siwat:locale'

/**
 * The chosen language lives in sessionStorage only: like the case itself,
 * it must not survive closing the tab (nothing may reveal the app was used).
 */
export function readStoredLocale(): Locale {
  try {
    const stored = sessionStorage.getItem(LOCALE_KEY)
    return isLocale(stored) ? stored : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export function storeLocale(locale: Locale): void {
  try {
    sessionStorage.setItem(LOCALE_KEY, locale)
  } catch {
    // Storage blocked: the choice still applies to this page.
  }
}

export function clearStoredLocale(): void {
  try {
    sessionStorage.removeItem(LOCALE_KEY)
  } catch {
    // Nothing stored.
  }
}
