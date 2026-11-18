<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconExternalLink from '~icons/lucide/external-link'
import IconPhone from '~icons/lucide/phone'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import { useCase } from '../case/use-case'
import { actionLabelKey } from '../result/route-catalog'

const router = useRouter()
const { t } = useI18n()
const { state } = useCase()

/** «Ir al Semáforo Diagnóstico»: the consent on P01 is still required before step 1. */
function goToDiagnosis() {
  void router.push({ name: state.consentAccepted ? 'identify' : 'welcome' })
}
</script>

<template>
  <FolioSheet>
    <h1 tabindex="-1" class="assistant__title">{{ t('assistant.title') }}</h1>
    <p>{{ t('assistant.intro') }}</p>

    <div class="assistant">
      <details class="assistant__item" name="assistant">
        <summary class="assistant__button">{{ t('assistant.capture.question') }}</summary>
        <ol class="assistant__body">
          <li v-for="n in 9" :key="n">{{ t(`assistant.capture.s${n}`) }}</li>
        </ol>
      </details>

      <details class="assistant__item" name="assistant">
        <summary class="assistant__button">{{ t('assistant.hide.question') }}</summary>
        <ol class="assistant__body">
          <li v-for="n in 3" :key="n">{{ t(`assistant.hide.s${n}`) }}</li>
        </ol>
      </details>

      <details class="assistant__item" name="assistant">
        <summary class="assistant__button">{{ t('assistant.shield.question') }}</summary>
        <div class="assistant__body">
          <p><strong>WhatsApp</strong></p>
          <ol>
            <li v-for="n in 3" :key="n">{{ t(`assistant.shield.whatsapp${n}`) }}</li>
          </ol>
          <p><strong>Facebook</strong></p>
          <ol>
            <li v-for="n in 3" :key="n">{{ t(`assistant.shield.facebook${n}`) }}</li>
          </ol>
        </div>
      </details>

      <a class="assistant__button assistant__link" href="tel:126">
        <IconPhone aria-hidden="true" />
        {{ t(actionLabelKey('isdemu-126')) }}
      </a>
      <a
        class="assistant__secondary"
        href="https://126teorienta.gob.sv/dirservicios/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t(actionLabelKey('isdemu-web')) }} <IconExternalLink aria-hidden="true" />
        <span class="visually-hidden">{{ t('common.newTab') }}</span>
      </a>

      <button type="button" class="btn btn--primary btn--block" @click="goToDiagnosis">
        {{ t('assistant.goDiagnosis') }}
        <IconArrowRight aria-hidden="true" />
      </button>
    </div>
  </FolioSheet>
</template>

<style scoped>
.assistant__title {
  font-size: var(--text-2xl);
  outline: none;
}

.assistant {
  display: grid;
  gap: var(--space-3);
}

.assistant__item {
  border: var(--control-border) solid var(--plum);
  border-radius: var(--radius-control);
  background: var(--sheet);

  &[open] {
    background: var(--plum-50);
  }
}

.assistant__button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 3.5rem;
  padding: var(--space-3) var(--space-4);
  font-weight: 700;
  color: var(--plum);
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  & svg {
    width: 1.25em;
    height: 1.25em;
    flex-shrink: 0;
  }
}

.assistant__link {
  border: var(--control-border) solid var(--plum);
  border-radius: var(--radius-control);
  background: var(--plum);
  color: #fff;
  text-decoration: none;

  &:hover {
    background: var(--plum-700);
  }
}

.assistant__secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  justify-self: start;
  min-height: var(--touch);
  font-weight: 700;

  & svg {
    width: 1em;
    height: 1em;
  }
}

.assistant__body {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0 var(--space-4) var(--space-4) var(--space-6);
  font-size: var(--text-sm);

  & ol {
    display: grid;
    gap: var(--space-1);
    margin: 0;
    padding-left: var(--space-5);
  }
}

div.assistant__body {
  padding-left: var(--space-4);
}
</style>
