<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import IconLanguages from '~icons/lucide/languages'
import { setLocale } from '../../i18n'
import { HTML_LANG, isLocale, LOCALE_NAMES, SUPPORTED_LOCALES } from '../../i18n/locales'

/** Native select; every language is listed in its own name so it can be found without reading the current one. */
const { t, locale } = useI18n()
const id = useId()

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (isLocale(value)) void setLocale(value)
}
</script>

<template>
  <div class="locale">
    <label class="locale__label" :for="id">
      <IconLanguages aria-hidden="true" />
      {{ t('language.label') }}
    </label>
    <select :id="id" class="locale__select" :value="locale" @change="onChange">
      <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code" :lang="HTML_LANG[code]">
        {{ LOCALE_NAMES[code] }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.locale {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
}

.locale__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--plum);

  & svg {
    flex-shrink: 0;
    width: 1.15em;
    height: 1.15em;
  }
}

.locale__select {
  min-height: var(--touch);
  padding: var(--space-2) var(--space-3);
  border: 1.5px solid var(--control-edge);
  border-radius: var(--radius-control);
  background: var(--sheet);
  color: var(--ink);
  font: inherit;
  font-weight: 700;

  &:hover {
    border-color: var(--ink-muted);
  }
}
</style>
