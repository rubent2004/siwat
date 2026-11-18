<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconFileDown from '~icons/lucide/file-down'
import IconTrash from '~icons/lucide/trash-2'
import { useCase } from '../case/use-case'
import { createBitacoraPdf, downloadBlob } from '../evidence/bitacora-pdf'

const router = useRouter()
const { t, locale } = useI18n()
const { state, result, evidenceFile, clearDevice } = useCase()

const acknowledged = ref(false)
const generating = ref(false)
const downloaded = ref(false)
const error = ref('')
const confirmClear = ref<HTMLDialogElement>()

async function download() {
  generating.value = true
  error.value = ''
  try {
    const blob = await createBitacoraPdf({
      caseCode: state.caseCode,
      generatedAt: new Date(),
      answers: state.answers,
      result: result.value,
      evidence: state.evidence.map((record) => ({ record, file: evidenceFile(record) })),
    })
    downloadBlob(blob, `${state.caseCode}.pdf`)
    downloaded.value = true
  } catch {
    error.value = 'bitacora.error'
  } finally {
    generating.value = false
  }
}

function onConfirmClose() {
  const dialog = confirmClear.value
  if (!dialog || dialog.returnValue !== 'clear') return
  dialog.returnValue = ''
  clearDevice()
  void router.replace({ name: 'welcome' })
}
</script>

<template>
  <section class="bitacora" aria-labelledby="bitacora-title">
    <h2 id="bitacora-title">{{ t('bitacora.title') }}</h2>
    <i18n-t keypath="bitacora.lead" tag="p" class="bitacora__lead" scope="global">
      <template #code><span class="data">{{ state.caseCode }}</span></template>
    </i18n-t>

    <label class="check-row bitacora__ack">
      <input v-model="acknowledged" type="checkbox" />
      <span>{{ t('bitacora.ack') }}</span>
    </label>

    <button type="button" class="btn btn--primary btn--block" :disabled="!acknowledged || generating" @click="download">
      <IconFileDown aria-hidden="true" />
      {{ generating ? t('bitacora.generating') : t('bitacora.download') }}
    </button>
    <!-- The PDF stays in Spanish for Salvadoran institutions; say so in any other language. -->
    <p v-if="locale !== 'es'" class="field__hint">{{ t('bitacora.spanishNote') }}</p>
    <p v-if="downloaded" class="bitacora__done" role="status">{{ t('bitacora.downloaded') }}</p>
    <p v-if="error" class="error-text" role="alert">
      <IconCircleAlert role="img" :aria-label="t('common.error')" /> {{ t(error) }}
    </p>

    <!-- Destructive action kept apart from the download on purpose. -->
    <div class="bitacora__erase">
      <p class="field__hint">{{ t('bitacora.eraseHint') }}</p>
      <button type="button" class="btn btn--danger btn--block" @click="confirmClear?.showModal()">
        <IconTrash aria-hidden="true" />
        {{ t('bitacora.clear') }}
      </button>
    </div>

    <dialog ref="confirmClear" class="sheet-dialog" aria-labelledby="clear-title" @close="onConfirmClose">
      <h2 id="clear-title">{{ t('bitacora.confirmTitle') }}</h2>
      <p>
        {{ t('bitacora.confirmBody') }}
        <strong v-if="!downloaded">{{ t('bitacora.notDownloaded') }}</strong>
      </p>
      <form method="dialog" class="sheet-dialog__actions">
        <button value="keep" class="btn btn--outline btn--block" autofocus>{{ t('bitacora.keep') }}</button>
        <button value="clear" class="btn btn--danger btn--block">{{ t('bitacora.confirmClear') }}</button>
      </form>
    </dialog>
  </section>
</template>

<style scoped>
.bitacora {
  display: grid;
  gap: var(--space-4);

  & h2 {
    font-size: var(--text-lg);
  }
}

.bitacora__lead {
  font-size: var(--text-sm);
}

.bitacora__ack {
  font-size: var(--text-sm);
}

.bitacora__done {
  color: var(--green-text);
  font-weight: 700;
  font-size: var(--text-sm);
}

.bitacora__erase {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-5);
  border-top: 1px dashed var(--edge);
}
</style>
