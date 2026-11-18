import { HTML_LANG, type Locale } from '../../../i18n/locales'

/** What a speech voice must expose to be chosen (a subset of SpeechSynthesisVoice). */
export interface VoiceLike {
  lang: string
  name: string
}

/** Language tag of the speech for each interface language: es-SV, en, zh-CN, de. */
export const speechLang = (locale: Locale): string => HTML_LANG[locale]

const normalize = (lang: string) => lang.replace('_', '-').toLowerCase()

/**
 * The best installed voice for the locale: the exact regional voice first (es-SV, zh-CN),
 * then any voice of the same language. Undefined lets the browser use its default.
 */
export function pickVoice<V extends VoiceLike>(voices: readonly V[], locale: Locale): V | undefined {
  const exact = normalize(speechLang(locale))
  const language = exact.split('-')[0]
  return (
    voices.find((voice) => normalize(voice.lang) === exact) ??
    voices.find((voice) => normalize(voice.lang).split('-')[0] === language)
  )
}

/**
 * Splits the screen text into short utterances: one per line, and long lines at sentence ends.
 * Some browsers stop reading a single long utterance after about 15 seconds.
 */
export function splitForSpeech(text: string, maxLength = 220): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      if (line.length <= maxLength) return [line]
      const sentences = line.match(/[^.!?。！？]+[.!?。！？]*/g) ?? [line]
      const chunks: string[] = []
      for (const sentence of sentences.map((part) => part.trim()).filter(Boolean)) {
        const last = chunks.at(-1)
        if (last && last.length + sentence.length + 1 <= maxLength) chunks[chunks.length - 1] = `${last} ${sentence}`
        else chunks.push(sentence)
      }
      return chunks
    })
}
