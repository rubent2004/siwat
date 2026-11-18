<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import IconArrowLeft from '~icons/lucide/arrow-left'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconTriangleAlert from '~icons/lucide/triangle-alert'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import StepIndicator from '../../shared/ui/StepIndicator.vue'
import YesNoField from '../../shared/ui/YesNoField.vue'
import { useCase } from '../case/use-case'
import EvidenceUploader from '../evidence/EvidenceUploader.vue'
import { NARRATIVE_MAX_LENGTH } from './domain/types'

const router = useRouter()
const { state } = useCase()
const answers = state.answers
const submitted = ref(false)

const errors = computed(() => ({
  threat: answers.physicalThreat === null ? 'Elige Sí o No.' : '',
  exposure: answers.privateDataExposed === null ? 'Elige Sí o No.' : '',
}))

async function showResult(event: Event) {
  submitted.value = true
  const form = event.target as HTMLFormElement
  const firstInvalid = (['threat', 'exposure'] as const).find((key) => errors.value[key])
  if (!firstInvalid && form.checkValidity()) {
    void router.push({ name: 'result' })
    return
  }
  await nextTick()
  if (firstInvalid) document.querySelector<HTMLInputElement>(`[data-group="${firstInvalid}"] input`)?.focus()
  else form.reportValidity()
}
</script>

<template>
  <StepIndicator :step="2" label="Paso 2 de 2: Nivel de urgencia y evidencia" />

  <form class="risk" novalidate @submit.prevent="showResult">
    <FolioSheet folio="03" caption="Urgencia y evidencia" :case-code="state.caseCode">
      <h1 tabindex="-1" class="step-title">Termómetro de riesgo y respaldo de prueba</h1>

      <div data-group="threat">
        <YesNoField
          v-model="answers.physicalThreat"
          legend="¿Recibiste amenazas de daño físico, sexual o contra tu familia?"
          :error="submitted ? errors.threat : ''"
        />
      </div>
      <div data-group="exposure">
        <YesNoField
          v-model="answers.privateDataExposed"
          legend="¿Expusieron tu dirección exacta, lugar de trabajo, teléfono personal o imágenes íntimas sin permiso?"
          :error="submitted ? errors.exposure : ''"
        />
      </div>

      <div class="notice notice--warning">
        <IconTriangleAlert aria-hidden="true" />
        <p>
          <strong>¡Importante!</strong> Antes de bloquear a quien te agrede, guarda la captura original y el enlace. Si
          bloqueas primero, perderás el acceso a la prueba.
        </p>
      </div>

      <div class="field">
        <label class="field__label" for="evidence-url">Enlace (URL) de la publicación o perfil agresor (Opcional)</label>
        <span id="evidence-url-hint" class="field__hint">Copia el enlace desde los 3 puntos de la publicación.</span>
        <input
          id="evidence-url"
          v-model.trim="answers.evidenceUrl"
          class="input"
          type="url"
          inputmode="url"
          placeholder="https://"
          autocomplete="off"
          aria-describedby="evidence-url-hint"
        />
      </div>

      <EvidenceUploader />

      <div class="field">
        <label class="field__label" for="narrative">Describe brevemente qué pasó (Opcional)</label>
        <textarea
          id="narrative"
          v-model="answers.narrative"
          class="input"
          :maxlength="NARRATIVE_MAX_LENGTH"
          aria-describedby="narrative-count"
        />
        <span id="narrative-count" class="field__hint data counter">
          {{ answers.narrative.length }}/{{ NARRATIVE_MAX_LENGTH }} caracteres
        </span>
      </div>
    </FolioSheet>

    <div class="risk__actions">
      <button class="btn btn--primary btn--block">
        Ver mi resultado del Semáforo
        <IconArrowRight aria-hidden="true" />
      </button>
      <button type="button" class="btn btn--outline btn--block" @click="router.push({ name: 'identify' })">
        <IconArrowLeft aria-hidden="true" />
        Atrás
      </button>
    </div>
  </form>
</template>

<style scoped>
.risk {
  display: grid;
  gap: var(--space-5);
  margin-top: var(--space-4);
}

.step-title {
  font-size: var(--text-xl);
  outline: none;
}

.counter {
  justify-self: end;
}

.risk__actions {
  display: grid;
  gap: var(--space-3);
}
</style>
