<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import IconSquare from '~icons/lucide/square'
import IconVolume from '~icons/lucide/volume-2'
import { DEFAULT_LOCALE, isLocale } from '../../i18n/locales'
import { speak, speaking, stopSpeech } from './speech'

/** «Leer esta pantalla»: reads the content of <main>, except this button, in the active language. */
const { t, locale } = useI18n()
const route = useRoute()

function screenText(): string {
  const main = document.getElementById('main')
  if (!main) return ''
  return [...main.children]
    .filter((element) => !element.hasAttribute('data-speech-skip'))
    .map((element) => (element as HTMLElement).innerText)
    .join('\n')
}

function toggle() {
  if (speaking.value) stopSpeech()
  else speak(screenText(), isLocale(locale.value) ? locale.value : DEFAULT_LOCALE)
}

// Reading belongs to one screen: changing screen or language silences it.
watch([() => route.fullPath, locale], stopSpeech)
onBeforeUnmount(stopSpeech)
</script>

<template>
  <div class="read-aloud" data-speech-skip>
    <button type="button" class="btn btn--outline" @click="toggle">
      <IconSquare v-if="speaking" aria-hidden="true" />
      <IconVolume v-else aria-hidden="true" />
      {{ speaking ? t('accessibility.stopReading') : t('accessibility.readScreen') }}
    </button>
  </div>
</template>

<style scoped>
.read-aloud {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}
</style>
