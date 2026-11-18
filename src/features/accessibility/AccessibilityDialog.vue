<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconX from '~icons/lucide/x'
import { speechSupported } from './speech'
import { registerAccessibilityPanel, useAccessibility } from './use-accessibility'

/**
 * «Opciones de accesibilidad»: larger text, high contrast and read aloud.
 * Screen readers (TalkBack, VoiceOver) need none of these; SIWAT never detects them.
 */
const { t } = useI18n()
const { preferences } = useAccessibility()
const dialog = ref<HTMLDialogElement>()
const readAloudSwitch = ref<HTMLInputElement>()
const confirmButton = ref<HTMLButtonElement>()
/** Turning read aloud on first shows the headphones warning and waits for confirmation. */
const confirming = ref(false)

onMounted(() =>
  registerAccessibilityPanel(() => {
    confirming.value = false
    dialog.value?.showModal()
  }),
)

async function onReadAloudChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.checked) {
    preferences.readAloud = false
    confirming.value = false
    return
  }
  // Stays off until she confirms the warning.
  input.checked = false
  confirming.value = true
  await nextTick()
  confirmButton.value?.focus()
}

async function settleReadAloud(enable: boolean) {
  preferences.readAloud = enable
  confirming.value = false
  await nextTick()
  readAloudSwitch.value?.focus()
}
</script>

<template>
  <dialog ref="dialog" class="sheet-dialog a11y-panel" aria-labelledby="a11y-title" closedby="any">
    <div class="a11y-panel__head">
      <h2 id="a11y-title">{{ t('accessibility.title') }}</h2>
      <form method="dialog">
        <button class="btn btn--ghost a11y-panel__close">
          <IconX aria-hidden="true" />
          {{ t('accessibility.close') }}
        </button>
      </form>
    </div>

    <p class="a11y-panel__note">{{ t('accessibility.screenReaderNote') }}</p>

    <div class="a11y-panel__options">
      <label class="check-row">
        <input
          v-model="preferences.largeText"
          type="checkbox"
          role="switch"
          aria-describedby="a11y-large-text-hint"
        />
        <span>
          <strong>{{ t('accessibility.largeText') }}</strong>
          <span id="a11y-large-text-hint" class="a11y-panel__hint">{{ t('accessibility.largeTextHint') }}</span>
        </span>
      </label>

      <label class="check-row">
        <input
          v-model="preferences.highContrast"
          type="checkbox"
          role="switch"
          aria-describedby="a11y-contrast-hint"
        />
        <span>
          <strong>{{ t('accessibility.highContrast') }}</strong>
          <span id="a11y-contrast-hint" class="a11y-panel__hint">{{ t('accessibility.highContrastHint') }}</span>
        </span>
      </label>

      <template v-if="speechSupported">
        <label class="check-row">
          <input
            ref="readAloudSwitch"
            type="checkbox"
            role="switch"
            :checked="preferences.readAloud"
            aria-describedby="a11y-read-hint"
            @change="onReadAloudChange"
          />
          <span>
            <strong>{{ t('accessibility.readAloud') }}</strong>
            <span id="a11y-read-hint" class="a11y-panel__hint">{{ t('accessibility.readAloudHint') }}</span>
          </span>
        </label>

        <div v-if="confirming" class="notice notice--warning a11y-panel__confirm">
          <div>
            <p id="a11y-read-warning"><strong>{{ t('accessibility.readAloudWarning') }}</strong></p>
            <div class="a11y-panel__confirm-actions">
              <button
                ref="confirmButton"
                type="button"
                class="btn btn--plum"
                aria-describedby="a11y-read-warning"
                @click="settleReadAloud(true)"
              >
                {{ t('accessibility.readAloudConfirm') }}
              </button>
              <button type="button" class="btn btn--outline" @click="settleReadAloud(false)">
                {{ t('accessibility.readAloudCancel') }}
              </button>
            </div>
          </div>
        </div>
        <p v-else-if="preferences.readAloud" class="a11y-panel__hint">{{ t('accessibility.readAloudWarning') }}</p>
      </template>
      <p v-else class="a11y-panel__hint">{{ t('accessibility.readAloudUnsupported') }}</p>
    </div>

    <p class="a11y-panel__hint">{{ t('accessibility.privacyNote') }}</p>
  </dialog>
</template>

<style scoped>
.a11y-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.a11y-panel__head h2 {
  min-width: 0;
}

.a11y-panel__close {
  flex-shrink: 0;
  white-space: nowrap;
  overflow-wrap: normal;
  padding-inline: var(--space-2);
  margin-top: calc(var(--space-2) * -1);
}

.a11y-panel__note {
  font-size: var(--text-sm);
}

.a11y-panel__options {
  display: grid;
  border-block: 1px solid var(--edge);
}

.a11y-panel__options > .check-row + .check-row {
  border-top: 1px solid var(--edge);
}

.a11y-panel__hint {
  display: block;
  font-size: var(--text-sm);
  color: var(--ink-muted);
}

.a11y-panel__confirm {
  margin-block: var(--space-2) var(--space-3);
}

.a11y-panel__confirm-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
</style>
