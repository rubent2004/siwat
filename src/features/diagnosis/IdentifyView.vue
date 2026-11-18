<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconCheck from '~icons/lucide/check'
import IconCircleAlert from '~icons/lucide/circle-alert'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import StepIndicator from '../../shared/ui/StepIndicator.vue'
import YesNoField from '../../shared/ui/YesNoField.vue'
import { useCase } from '../case/use-case'
import { CONDUCTS, DEPARTMENTS, PLATFORMS, ROLES } from './catalog'

const router = useRouter()
const { state } = useCase()
const answers = state.answers
const submitted = ref(false)

const errors = computed(() => ({
  platforms: answers.platforms.length === 0 ? 'Marca al menos una red o canal donde ocurrió.' : '',
  electoral: answers.electoralContext === null ? 'Elige Sí o No.' : '',
  conducts: answers.conducts.length === 0 ? 'Marca al menos una de las situaciones.' : '',
}))

const visibleErrors = computed(() =>
  submitted.value ? errors.value : { platforms: '', electoral: '', conducts: '' },
)

async function next() {
  submitted.value = true
  const firstInvalid = (['platforms', 'electoral', 'conducts'] as const).find((key) => errors.value[key])
  if (!firstInvalid) {
    void router.push({ name: 'risk' })
    return
  }
  await nextTick()
  document.querySelector<HTMLInputElement>(`[data-group="${firstInvalid}"] input`)?.focus()
}
</script>

<template>
  <StepIndicator :step="1" label="Paso 1 de 2: Identifica lo que ocurrió" />

  <form class="identify" novalidate @submit.prevent="next">
    <FolioSheet folio="02" :case-code="state.caseCode">
      <h1 tabindex="-1" class="step-title">¿Qué pasó y dónde?</h1>

      <div class="identify__pair">
        <div class="field">
          <label class="field__label" for="role">¿Desde qué espacio participas? (Opcional)</label>
          <select id="role" v-model="answers.role" class="input">
            <option value="">Prefiero no decir</option>
            <option v-for="role in ROLES" :key="role.value" :value="role.value">{{ role.label }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="department">Departamento (Opcional)</label>
          <select id="department" v-model="answers.department" class="input">
            <option value="">Prefiero no decir</option>
            <option v-for="department in DEPARTMENTS" :key="department" :value="department">{{ department }}</option>
          </select>
        </div>
      </div>
      <p class="field__hint">Estos dos datos solo sirven para estadística anónima. No te identifican.</p>

      <fieldset
        class="group"
        data-group="platforms"
        :aria-describedby="visibleErrors.platforms ? 'platforms-error' : undefined"
      >
        <legend class="field__label">¿Dónde ocurrió la agresión? <span class="req">(obligatorio)</span></legend>
        <div class="chips">
          <label v-for="platform in PLATFORMS" :key="platform.value" class="chip">
            <input v-model="answers.platforms" type="checkbox" :value="platform.value" />
            <IconCheck class="chip__check" aria-hidden="true" />
            {{ platform.label }}
          </label>
        </div>
        <p v-if="visibleErrors.platforms" id="platforms-error" class="error-text">
          <IconCircleAlert role="img" aria-label="Error" /> {{ visibleErrors.platforms }}
        </p>
      </fieldset>

      <div data-group="electoral">
        <YesNoField
          v-model="answers.electoralContext"
          legend="¿Ocurre durante una campaña electoral o en el ejercicio de un cargo público?"
          :error="visibleErrors.electoral"
        />
      </div>

      <fieldset
        class="group"
        data-group="conducts"
        :aria-describedby="visibleErrors.conducts ? 'conducts-error' : undefined"
      >
        <legend class="field__label">Marca todo lo que te haya pasado:</legend>
        <div class="conducts">
          <label v-for="conduct in CONDUCTS" :key="conduct.value" class="conduct">
            <input v-model="answers.conducts" type="checkbox" :value="conduct.value" />
            <span>
              <strong>{{ conduct.label }}</strong>
              <span class="conduct__desc">{{ conduct.description }}</span>
            </span>
          </label>
        </div>
        <p v-if="visibleErrors.conducts" id="conducts-error" class="error-text">
          <IconCircleAlert role="img" aria-label="Error" /> {{ visibleErrors.conducts }}
        </p>
      </fieldset>
    </FolioSheet>

    <button class="btn btn--plum btn--block">
      Siguiente: Evaluar riesgo y prueba
      <IconArrowRight aria-hidden="true" />
    </button>
  </form>
</template>

<style scoped>
.identify {
  display: grid;
  gap: var(--space-5);
  margin-top: var(--space-4);
}

.step-title {
  font-size: var(--text-xl);
  outline: none;
}

.identify__pair {
  display: grid;
  gap: var(--space-4);

  @media (min-width: 34rem) {
    grid-template-columns: 1fr 1fr;
  }
}

.group {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  border: 0;

  & legend {
    padding: 0;
    margin-bottom: var(--space-3);
  }
}

.req {
  font-weight: 400;
  color: var(--ink-muted);
  font-size: var(--text-sm);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch);
  padding: var(--space-2) var(--space-4);
  border: 1.5px solid #b9a9b6;
  border-radius: 999px;
  background: var(--sheet);
  font-weight: 700;
  font-size: var(--text-sm);
  cursor: pointer;

  & input {
    position: absolute;
    opacity: 0;
    inset: 0;
    margin: 0;
    cursor: pointer;
  }

  &:has(:focus-visible) {
    outline: 3px solid var(--plum);
    outline-offset: 2px;
  }

  &:has(:checked) {
    border-color: var(--plum);
    background: var(--plum);
    color: #fff;
  }
}

.chip__check {
  display: none;
  width: 1rem;
  height: 1rem;

  .chip:has(:checked) & {
    display: block;
  }
}

.conducts {
  display: grid;
  border-bottom: 1px solid var(--edge);
}

.conduct {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-2);
  border-top: 1px solid var(--edge);
  cursor: pointer;

  & input {
    flex-shrink: 0;
    width: 1.375rem;
    height: 1.375rem;
    margin: 0.15rem 0 0;
  }

  & strong {
    display: block;
  }

  &:hover {
    background: var(--paper);
  }

  &:has(:checked) {
    background: var(--plum-50);
  }
}

.conduct__desc {
  display: block;
  color: var(--ink-muted);
  font-size: var(--text-sm);
}
</style>
