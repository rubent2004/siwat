<script setup lang="ts">
import { onBeforeUnmount, ref, watchEffect } from 'vue'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconImagePlus from '~icons/lucide/image-plus'
import IconTrash from '~icons/lucide/trash-2'
import { useCase } from '../case/use-case'
import { MAX_EVIDENCE_FILES } from './domain/evidence'

const { state, addEvidence, removeEvidence, evidenceFile } = useCase()
const error = ref('')
const hashing = ref(false)
const previews = ref<Record<string, string>>({})

watchEffect(() => {
  for (const record of state.evidence) {
    const file = evidenceFile(record)
    if (file && !previews.value[record.sha256]) {
      previews.value = { ...previews.value, [record.sha256]: URL.createObjectURL(file) }
    }
  }
})

onBeforeUnmount(() => Object.values(previews.value).forEach((url) => URL.revokeObjectURL(url)))

async function onFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]
  input.value = ''
  if (!files.length) return
  error.value = ''
  hashing.value = true
  try {
    await addEvidence(files)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'No se pudo procesar la imagen.'
  } finally {
    hashing.value = false
  }
}

function remove(sha256: string) {
  const url = previews.value[sha256]
  if (url) URL.revokeObjectURL(url)
  removeEvidence(sha256)
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
</script>

<template>
  <div class="uploader">
    <span class="field__label" id="evidence-label">Sube captura de pantalla original (Opcional JPG o PNG)</span>
    <p class="field__hint" id="evidence-hint">
      Máximo {{ MAX_EVIDENCE_FILES }} imágenes. Tu navegador calcula su huella digital (SHA-256) y la hora UTC para
      certificar que no cambian. Las imágenes no salen de tu dispositivo.
    </p>

    <ol v-if="state.evidence.length" class="uploader__list">
      <li v-for="(record, index) in state.evidence" :key="record.sha256" class="evidence">
        <img v-if="previews[record.sha256]" :src="previews[record.sha256]" alt="" class="evidence__thumb" />
        <div class="evidence__meta">
          <p class="evidence__name">
            <span class="data">Prueba {{ index + 1 }}</span> · {{ record.name }} · {{ formatSize(record.size) }}
          </p>
          <p class="evidence__hash">
            <span class="evidence__key">SHA-256</span>
            <span class="data">{{ record.sha256 }}</span>
          </p>
          <p class="evidence__hash">
            <span class="evidence__key">Sello UTC</span>
            <span class="data evidence__time">{{ record.hashedAtUtc }}</span>
          </p>
        </div>
        <button
          type="button"
          class="evidence__remove"
          :aria-label="`Quitar prueba ${index + 1}, ${record.name}`"
          @click="remove(record.sha256)"
        >
          <IconTrash aria-hidden="true" />
        </button>
      </li>
    </ol>

    <label v-if="state.evidence.length < MAX_EVIDENCE_FILES" class="btn btn--outline uploader__pick">
      <IconImagePlus aria-hidden="true" />
      {{ hashing ? 'Calculando huella digital…' : state.evidence.length ? 'Agregar otra captura' : 'Elegir capturas' }}
      <input
        type="file"
        accept="image/jpeg,image/png"
        multiple
        class="visually-hidden"
        aria-describedby="evidence-hint"
        :disabled="hashing"
        @change="onFiles"
      />
    </label>

    <p v-if="error" class="error-text" role="alert">
      <IconCircleAlert role="img" aria-label="Error" /> {{ error }}
    </p>
  </div>
</template>

<style scoped>
.uploader {
  display: grid;
  gap: var(--space-3);
}

.uploader__pick {
  justify-self: start;
  cursor: pointer;

  &:has(:focus-visible) {
    outline: 3px solid var(--plum);
    outline-offset: 3px;
  }
}

.uploader__list {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.evidence {
  display: grid;
  grid-template-columns: 4rem 1fr auto;
  gap: var(--space-3);
  align-items: start;
  padding: var(--space-3);
  border: 1px solid var(--edge);
  border-radius: var(--radius-sheet);
  background: var(--paper);
}

.evidence__thumb {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border: 1px solid var(--edge);
  border-radius: 2px;
}

.evidence__meta {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
  font-size: var(--text-sm);
}

.evidence__name {
  font-weight: 700;
  overflow-wrap: anywhere;
}

.evidence__hash {
  display: grid;
  gap: 0.1rem;
  font-size: var(--text-xs);
  overflow-wrap: anywhere;
  color: var(--ink);
}

.evidence__time {
  white-space: nowrap;
  overflow-wrap: normal;
}

.evidence__key {
  color: var(--ink-muted);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.evidence__remove {
  display: grid;
  place-items: center;
  width: var(--touch);
  height: var(--touch);
  border: 0;
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--red-text);

  & svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    background: var(--red-tint);
  }
}
</style>
