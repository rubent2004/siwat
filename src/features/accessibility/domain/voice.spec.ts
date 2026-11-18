import { describe, expect, it } from 'vitest'
import { pickVoice, speechLang, splitForSpeech } from './voice'

const voice = (lang: string, name = lang) => ({ lang, name })

describe('speechLang', () => {
  it('reads Spanish as Salvadoran Spanish and the rest in their own language', () => {
    expect(speechLang('es')).toBe('es-SV')
    expect(speechLang('en')).toBe('en')
    expect(speechLang('zh-CN')).toBe('zh-CN')
    expect(speechLang('de')).toBe('de')
  })
})

describe('pickVoice', () => {
  it('prefers a Salvadoran Spanish voice, then any Spanish voice', () => {
    expect(pickVoice([voice('en-US'), voice('es-ES'), voice('es-SV')], 'es')?.lang).toBe('es-SV')
    expect(pickVoice([voice('en-US'), voice('es_MX')], 'es')?.lang).toBe('es_MX')
  })

  it('prefers a mainland Chinese voice over other Chinese voices', () => {
    expect(pickVoice([voice('zh-HK'), voice('zh-CN')], 'zh-CN')?.lang).toBe('zh-CN')
    expect(pickVoice([voice('zh-TW')], 'zh-CN')?.lang).toBe('zh-TW')
  })

  it('matches German and English by language whatever the region', () => {
    expect(pickVoice([voice('de-AT')], 'de')?.lang).toBe('de-AT')
    expect(pickVoice([voice('en-GB')], 'en')?.lang).toBe('en-GB')
  })

  it('returns undefined when no voice speaks the language, so the browser default is used', () => {
    expect(pickVoice([voice('fr-FR')], 'de')).toBeUndefined()
    expect(pickVoice([], 'es')).toBeUndefined()
  })
})

describe('splitForSpeech', () => {
  it('splits the screen into its lines and drops empty ones', () => {
    expect(splitForSpeech('Título\n\n  Primer párrafo.  \nSegundo')).toEqual(['Título', 'Primer párrafo.', 'Segundo'])
  })

  it('cuts very long lines at sentence ends so the browser does not stop midway', () => {
    const long = `${'a'.repeat(150)}. ${'b'.repeat(150)}.`

    expect(splitForSpeech(long, 200)).toEqual([`${'a'.repeat(150)}.`, `${'b'.repeat(150)}.`])
  })
})
