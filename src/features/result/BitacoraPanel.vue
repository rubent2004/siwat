<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconFileDown from '~icons/lucide/file-down'
import IconTrash from '~icons/lucide/trash-2'
import { useCase } from '../case/use-case'
import { createBitacoraPdf, downloadBlob } from '../evidence/bitacora-pdf'

const router = useRouter()
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
    error.value = 'No se pudo crear el PDF. Intenta de nuevo; si persiste, quita las capturas y vuelve a subirlas.'
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
    <h2 id="bitacora-title">Bitácora de Evidencia</h2>
    <p class="bitacora__lead">
      Un PDF con código <span class="data">{{ state.caseCode }}</span>, fecha y hora UTC, huella SHA-256 de cada
      captura, enlace y marco legal. Guárdalo junto a tus archivos originales sin editar.
    </p>

    <label class="check-row bitacora__ack">
      <input v-model="acknowledged" type="checkbox" />
      <span>
        Este documento es una bitácora personal de respaldo. SIWAT no interpone denuncias por ti ni sustituye los
        procesos legales ante la FGR o el TSE.
      </span>
    </label>

    <button type="button" class="btn btn--primary btn--block" :disabled="!acknowledged || generating" @click="download">
      <IconFileDown aria-hidden="true" />
      {{ generating ? 'Creando PDF…' : 'Descargar Bitácora de Evidencia (PDF)' }}
    </button>
    <p v-if="downloaded" class="bitacora__done" role="status">
      Bitácora descargada. Revisa tu carpeta de descargas.
    </p>
    <p v-if="error" class="error-text" role="alert"><IconCircleAlert role="img" aria-label="Error" /> {{ error }}</p>

    <!-- Destructive action kept apart from the download on purpose. -->
    <div class="bitacora__erase">
      <p class="field__hint">
        Cuando termines, borra todo lo que SIWAT guardó en este dispositivo: respuestas, enlaces, capturas y espacio
        local.
      </p>
      <button type="button" class="btn btn--danger btn--block" @click="confirmClear?.showModal()">
        <IconTrash aria-hidden="true" />
        Limpiar datos de este dispositivo
      </button>
    </div>

    <dialog ref="confirmClear" class="sheet-dialog" aria-labelledby="clear-title" @close="onConfirmClose">
      <h2 id="clear-title">¿Borrar todo de este dispositivo?</h2>
      <p>
        Se borran tus respuestas, enlaces, capturas y el espacio local con PIN. No se puede deshacer.
        <strong v-if="!downloaded">Aún no descargaste tu bitácora.</strong>
      </p>
      <form method="dialog" class="sheet-dialog__actions">
        <button value="keep" class="btn btn--outline btn--block" autofocus>Conservar mis datos</button>
        <button value="clear" class="btn btn--danger btn--block">Sí, borrar todo</button>
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
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--edge);
  border-radius: var(--radius-control);
  background: var(--paper);
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
