/** Spanish is the source language and always the default: the app never guesses from the browser. */
export const SUPPORTED_LOCALES = ['es', 'en', 'zh-CN', 'de'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)

/** Value of `<html lang>` and of date formatting for each locale. */
export const HTML_LANG: Record<Locale, string> = {
  es: 'es-SV',
  en: 'en',
  'zh-CN': 'zh-CN',
  de: 'de',
}

/** Each language is offered in its own name, so it can be found without reading the current one. */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  'zh-CN': '简体中文',
  de: 'Deutsch',
}
