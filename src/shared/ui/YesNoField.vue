<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import IconCircleAlert from '~icons/lucide/circle-alert'

defineProps<{ legend: string; error?: string }>()
const model = defineModel<boolean | null>({ required: true })
const id = useId()
const { t } = useI18n()
</script>

<template>
  <fieldset class="yesno" :aria-describedby="error ? `${id}-error` : undefined" :data-invalid="!!error || undefined">
    <legend class="field__label">{{ legend }}</legend>
    <div class="yesno__options">
      <label class="yesno__option">
        <input v-model="model" type="radio" :name="id" :value="true" />
        {{ t('common.yes') }}
      </label>
      <label class="yesno__option">
        <input v-model="model" type="radio" :name="id" :value="false" />
        {{ t('common.no') }}
      </label>
    </div>
    <p v-if="error" :id="`${id}-error`" class="error-text">
      <IconCircleAlert role="img" :aria-label="t('common.error')" />
      {{ error }}
    </p>
  </fieldset>
</template>

<style scoped>
.yesno {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  border: 0;
}

.yesno legend {
  padding: 0;
  margin-bottom: var(--space-3);
}

.yesno__options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.yesno__option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--touch);
  padding: var(--space-2) var(--space-4);
  border: 1.5px solid var(--control-edge);
  border-radius: var(--radius-control);
  background: var(--sheet);
  font-weight: 700;
  cursor: pointer;

  & input {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0;
  }

  &:has(:checked) {
    border-color: var(--plum);
    background: var(--plum-50);
  }

  &:has(:focus-visible) {
    outline: 3px solid var(--plum);
    outline-offset: 2px;
  }
}

[data-invalid] .yesno__option:not(:has(:checked)) {
  border-color: var(--red-text);
}
</style>
