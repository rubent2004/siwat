<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconLock from '~icons/lucide/lock'
import { useCase } from '../case/use-case'
import { PinVaultError } from '../case/infrastructure/pin-vault'

const emit = defineEmits<{ opened: [] }>()
const { t } = useI18n()
const { createLocalSpace, openLocalSpace, hasLocalSpace } = useCase()

const dialog = ref<HTMLDialogElement>()
const mode = ref<'create' | 'open'>('create')
const pseudonym = ref('')
const pin = ref('')
/** Message key of the current error, translated when shown. */
const error = ref('')
const busy = ref(false)
const done = ref(false)

const title = computed(() => t(mode.value === 'open' ? 'localSpace.titleOpen' : 'localSpace.titleCreate'))

defineExpose({
  open() {
    mode.value = hasLocalSpace() ? 'open' : 'create'
    pseudonym.value = ''
    pin.value = ''
    error.value = ''
    done.value = false
    dialog.value?.showModal()
  },
})

async function submit() {
  error.value = ''
  busy.value = true
  try {
    if (mode.value === 'open') {
      await openLocalSpace(pseudonym.value, pin.value)
      dialog.value?.close()
      emit('opened')
    } else {
      await createLocalSpace(pseudonym.value, pin.value)
      done.value = true
    }
  } catch (cause) {
    error.value = cause instanceof PinVaultError ? `errors.vault.${cause.code}` : 'localSpace.fallbackError'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <dialog ref="dialog" class="sheet-dialog" aria-labelledby="space-title">
    <h2 id="space-title">{{ title }}</h2>

    <template v-if="done">
      <p>{{ t('localSpace.done') }}</p>
      <form method="dialog">
        <button class="btn btn--primary btn--block" autofocus>{{ t('localSpace.continue') }}</button>
      </form>
    </template>

    <form v-else class="space-form" @submit.prevent="submit">
      <p v-if="mode === 'create'">{{ t('localSpace.createIntro') }}</p>
      <p v-else>{{ t('localSpace.openIntro') }}</p>

      <div class="field">
        <label class="field__label" for="space-pseudonym">{{ t('localSpace.pseudonym') }}</label>
        <input
          id="space-pseudonym"
          v-model="pseudonym"
          class="input"
          required
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          autofocus
        />
      </div>
      <div class="field">
        <label class="field__label" for="space-pin">{{ t('localSpace.pin') }}</label>
        <input
          id="space-pin"
          v-model="pin"
          class="input data"
          type="password"
          inputmode="numeric"
          pattern="\d{4}"
          maxlength="4"
          required
          autocomplete="off"
        />
      </div>
      <p v-if="error" class="error-text" role="alert">
        <IconCircleAlert role="img" :aria-label="t('common.error')" />
        {{ t(error) }}
      </p>
      <button class="btn btn--plum btn--block" :disabled="busy">
        <IconLock aria-hidden="true" />
        {{ busy ? t('localSpace.busy') : mode === 'open' ? t('localSpace.submitOpen') : t('localSpace.submitCreate') }}
      </button>
      <button v-if="mode === 'open'" type="button" class="btn btn--ghost" @click="mode = 'create'">
        {{ t('localSpace.replace') }}
      </button>
      <button type="button" class="btn btn--ghost" @click="dialog?.close()">{{ t('localSpace.cancel') }}</button>
    </form>
  </dialog>
</template>

<style scoped>
.space-form {
  display: grid;
  gap: var(--space-4);
}
</style>
