import { describe, expect, it } from 'vitest'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import zhCN from './locales/zh-CN.json'

type Messages = { [key: string]: string | Messages }

const LOCALES: Record<string, Messages> = { es, en, 'zh-CN': zhCN, de }

/** Flattens a message tree into `path -> text`. */
function flatten(messages: Messages, prefix = ''): Map<string, string> {
  const entries = new Map<string, string>()
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') entries.set(path, value)
    else for (const [nested, text] of flatten(value, path)) entries.set(nested, text)
  }
  return entries
}

describe('locale messages', () => {
  const spanishKeys = [...flatten(es).keys()].sort()

  it.each(Object.keys(LOCALES))('%s has exactly the same message keys as es', (locale) => {
    expect([...flatten(LOCALES[locale]!).keys()].sort()).toEqual(spanishKeys)
  })

  it.each(Object.keys(LOCALES))('%s has no empty messages', (locale) => {
    const empty = [...flatten(LOCALES[locale]!)].filter(([, text]) => !text.trim()).map(([key]) => key)

    expect(empty).toEqual([])
  })

  it.each(Object.keys(LOCALES))('%s camouflage messages never mention SIWAT', (locale) => {
    const weather = LOCALES[locale]!.weather as Messages
    const texts = [...flatten(weather).values()]

    expect(texts.length).toBeGreaterThan(0)
    expect(texts.filter((text) => /siwat/i.test(text))).toEqual([])
  })
})
