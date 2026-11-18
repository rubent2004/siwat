import { ref } from 'vue'
import type { Locale } from '../../i18n/locales'
import { pickVoice, speechLang, splitForSpeech } from './domain/voice'

/** Adapter over the browser's speechSynthesis. Everything is spoken on the device; nothing is sent. */

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

// Some browsers load their voice list lazily: ask early so it is ready for the first reading.
if (speechSupported) window.speechSynthesis.getVoices()

/** Whether SIWAT is reading the screen aloud right now. */
export const speaking = ref(false)

/** Each reading gets a new id, so events from a cancelled reading are ignored. */
let reading = 0

export function speak(text: string, locale: Locale): void {
  if (!speechSupported) return
  stopSpeech()
  const chunks = splitForSpeech(text)
  if (!chunks.length) return
  const id = ++reading
  const voice = pickVoice(window.speechSynthesis.getVoices(), locale)
  speaking.value = true
  chunks.forEach((chunk, index) => {
    const utterance = new SpeechSynthesisUtterance(chunk)
    utterance.lang = voice?.lang ?? speechLang(locale)
    if (voice) utterance.voice = voice
    const finish = () => {
      if (id === reading) speaking.value = false
    }
    if (index === chunks.length - 1) utterance.onend = finish
    utterance.onerror = finish
    window.speechSynthesis.speak(utterance)
  })
}

/** Silences any reading at once. Also called by SALIR RÁPIDO and Esc-Esc. */
export function stopSpeech(): void {
  reading++
  speaking.value = false
  if (speechSupported) window.speechSynthesis.cancel()
}
