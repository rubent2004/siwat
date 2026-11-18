<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()
const { state } = useCase()
const answers = state.answers
const submitted = ref(false)

const errors = computed(() => ({
  threat: answers.physicalThreat === null ? t('common.chooseYesNo') : '',
  exposure: answers.privateDataExposed === null ? t('common.chooseYesNo') : '',
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
  <StepIndicator :step="2" :label="t('risk.stepLabel')" />

  <form class="risk" novalidate @submit.prevent="showResult">
    <FolioSheet folio="03" :case-code="state.caseCode">
      <h1 tabindex="-1" class="step-title">{{ t('risk.title') }}</h1>

      <div data-group="threat">
        <YesNoField
          v-model="answers.physicalThreat"
          :legend="t('risk.threat')"
          :error="submitted ? errors.threat : ''"
        />
      </div>
      <div data-group="exposure">
        <YesNoField
          v-model="answers.privateDataExposed"
          :legend="t('risk.exposure')"
          :error="submitted ? errors.exposure : ''"
        />
      </div>

      <div class="notice notice--warning">
        <IconTriangleAlert aria-hidden="true" />
        <p>
          <strong>{{ t('risk.importantTitle') }}</strong> {{ t('risk.importantBody') }}
        </p>
      </div>

      <div class="field">
        <label class="field__label" for="evidence-url">{{ t('risk.url') }}</label>
        <span id="evidence-url-hint" class="field__hint">{{ t('risk.urlHint') }}</span>
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
        <label class="field__label" for="narrative">{{ t('risk.narrative') }}</label>
        <textarea
          id="narrative"
          v-model="answers.narrative"
          class="input"
          :maxlength="NARRATIVE_MAX_LENGTH"
          aria-describedby="narrative-count"
        />
        <span id="narrative-count" class="field__hint data counter">
          {{ t('risk.counter', { count: answers.narrative.length, max: NARRATIVE_MAX_LENGTH }) }}
        </span>
      </div>
    </FolioSheet>

    <div class="risk__actions">
      <button class="btn btn--primary btn--block">
        {{ t('risk.submit') }}
        <IconArrowRight aria-hidden="true" />
      </button>
      <button type="button" class="btn btn--outline btn--block" @click="router.push({ name: 'identify' })">
        <IconArrowLeft aria-hidden="true" />
        {{ t('risk.back') }}
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
