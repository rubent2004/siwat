<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconCheck from '~icons/lucide/check'
import IconCircleAlert from '~icons/lucide/circle-alert'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import StepIndicator from '../../shared/ui/StepIndicator.vue'
import YesNoField from '../../shared/ui/YesNoField.vue'
import { useCase } from '../case/use-case'
import { CONDUCTS, conductKey, DEPARTMENTS, PLATFORMS, platformKey, roleKey, ROLES } from './catalog'
import { togglePlatform } from './domain/platforms'
import { FREE_TEXT_MAX_LENGTH, type Platform } from './domain/types'
import PlatformIcon from './PlatformIcon.vue'

const router = useRouter()
const { t } = useI18n()
const { state } = useCase()
const answers = state.answers
const submitted = ref(false)

function onPlatformChange(platform: Platform, event: Event) {
  answers.platforms = togglePlatform(answers.platforms, platform, (event.target as HTMLInputElement).checked)
  // A free text only lives while its option is chosen.
  if (!answers.platforms.includes('other')) answers.otherPlatform = ''
}

watch(
  () => answers.role,
  (role) => {
    if (role !== 'otro') answers.otherRole = ''
  },
)

const errors = computed(() => ({
  platforms: answers.platforms.length === 0 ? t('identify.errorPlatforms') : '',
  electoral: answers.electoralContext === null ? t('common.chooseYesNo') : '',
  conducts: answers.conducts.length === 0 ? t('identify.errorConducts') : '',
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
  <StepIndicator :step="1" :label="t('identify.stepLabel')" />

  <form class="identify" novalidate @submit.prevent="next">
    <FolioSheet folio="02" :case-code="state.caseCode">
      <h1 tabindex="-1" class="step-title">{{ t('identify.title') }}</h1>

      <div class="identify__pair">
        <div class="field">
          <label class="field__label" for="role">{{ t('identify.role') }}</label>
          <select id="role" v-model="answers.role" class="input">
            <option value="">{{ t('identify.preferNot') }}</option>
            <option v-for="role in ROLES" :key="role" :value="role">{{ t(roleKey(role)) }}</option>
          </select>
          <div v-if="answers.role === 'otro'" class="field">
            <label class="field__label" for="other-role">{{ t('identify.otherRole') }}</label>
            <input
              id="other-role"
              v-model="answers.otherRole"
              class="input"
              type="text"
              autocomplete="off"
              :maxlength="FREE_TEXT_MAX_LENGTH"
              aria-describedby="other-role-hint"
            />
            <span id="other-role-hint" class="field__hint">
              {{ t('identify.otherRoleHint', { max: FREE_TEXT_MAX_LENGTH }) }}
            </span>
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="department">{{ t('identify.department') }}</label>
          <select id="department" v-model="answers.department" class="input">
            <option value="">{{ t('identify.preferNot') }}</option>
            <option v-for="department in DEPARTMENTS" :key="department" :value="department">{{ department }}</option>
          </select>
        </div>
      </div>
      <p class="field__hint">{{ t('identify.hint') }}</p>

      <fieldset
        class="group"
        data-group="platforms"
        :aria-describedby="visibleErrors.platforms ? 'platforms-error' : undefined"
      >
        <legend class="field__label">
          {{ t('identify.platforms') }} <span class="req">{{ t('identify.required') }}</span>
        </legend>
        <div class="chips">
          <label v-for="platform in PLATFORMS" :key="platform" class="chip">
            <input
              type="checkbox"
              :value="platform"
              :checked="answers.platforms.includes(platform)"
              @change="onPlatformChange(platform, $event)"
            />
            <IconCheck class="chip__check" aria-hidden="true" />
            <PlatformIcon :platform="platform" />
            {{ t(platformKey(platform)) }}
          </label>
        </div>
        <div v-if="answers.platforms.includes('other')" class="field">
          <label class="field__label" for="other-platform">{{ t('identify.otherPlatform') }}</label>
          <input
            id="other-platform"
            v-model="answers.otherPlatform"
            class="input"
            type="text"
            autocomplete="off"
            :maxlength="FREE_TEXT_MAX_LENGTH"
            aria-describedby="other-platform-hint"
          />
          <span id="other-platform-hint" class="field__hint">
            {{ t('identify.otherPlatformHint', { max: FREE_TEXT_MAX_LENGTH }) }}
          </span>
        </div>
        <p v-if="visibleErrors.platforms" id="platforms-error" class="error-text">
          <IconCircleAlert role="img" :aria-label="t('common.error')" /> {{ visibleErrors.platforms }}
        </p>
      </fieldset>

      <div data-group="electoral">
        <YesNoField
          v-model="answers.electoralContext"
          :legend="t('identify.electoral')"
          :error="visibleErrors.electoral"
        />
      </div>

      <fieldset
        class="group"
        data-group="conducts"
        :aria-describedby="visibleErrors.conducts ? 'conducts-error' : undefined"
      >
        <legend class="field__label">{{ t('identify.conducts') }}</legend>
        <div class="conducts">
          <label v-for="conduct in CONDUCTS" :key="conduct" class="conduct">
            <input v-model="answers.conducts" type="checkbox" :value="conduct" />
            <span>
              <strong>{{ t(conductKey(conduct, 'label')) }}</strong>
              <span class="conduct__desc">{{ t(conductKey(conduct, 'description')) }}</span>
            </span>
          </label>
        </div>
        <p v-if="visibleErrors.conducts" id="conducts-error" class="error-text">
          <IconCircleAlert role="img" :aria-label="t('common.error')" /> {{ visibleErrors.conducts }}
        </p>
      </fieldset>
    </FolioSheet>

    <button class="btn btn--plum btn--block">
      {{ t('identify.next') }}
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
  border: var(--control-border) solid var(--control-edge);
  border-radius: 999px;
  background: var(--sheet);
  font-weight: 700;
  font-size: var(--text-sm);
  overflow-wrap: anywhere;
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
