<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconLogOut from '~icons/lucide/log-out'
import IconShieldCheck from '~icons/lucide/shield-check'
import IconSiren from '~icons/lucide/siren'
import EmergencyDialog from '../../shared/ui/EmergencyDialog.vue'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import LocaleSelect from '../../shared/ui/LocaleSelect.vue'
import { useCase } from '../case/use-case'
import LocalSpaceDialog from './LocalSpaceDialog.vue'

const router = useRouter()
const { t } = useI18n()
const { state, acceptConsent, vaultActive } = useCase()

const consent = ref(state.consentAccepted)
const emergency = ref<InstanceType<typeof EmergencyDialog>>()
const localSpace = ref<InstanceType<typeof LocalSpaceDialog>>()

function start() {
  acceptConsent()
  void router.push({ name: 'identify' })
}
</script>

<template>
  <div class="welcome__locale">
    <LocaleSelect />
  </div>

  <FolioSheet folio="01">
    <h1 tabindex="-1" class="welcome__title">{{ t('welcome.title') }}</h1>
    <p>{{ t('welcome.lead') }}</p>

    <div class="notice">
      <IconShieldCheck aria-hidden="true" />
      <p>
        <strong>{{ t('welcome.noticeTitle') }}</strong> {{ t('welcome.noticeBody') }}
      </p>
    </div>

    <label class="check-row">
      <input v-model="consent" type="checkbox" />
      <span>{{ t('welcome.consent') }}</span>
    </label>

    <div class="welcome__actions">
      <button type="button" class="btn btn--primary btn--block" :disabled="!consent" @click="start">
        {{ t('welcome.start') }}
        <IconArrowRight aria-hidden="true" />
      </button>
      <button type="button" class="btn btn--plum btn--block" @click="emergency?.open()">
        <IconSiren aria-hidden="true" />
        {{ t('welcome.danger') }}
      </button>
    </div>

    <p class="welcome__exit-tip">
      <IconLogOut aria-hidden="true" />
      <i18n-t keypath="welcome.exitTip" tag="span" scope="global">
        <template #exit><strong>{{ t('header.exit') }}</strong></template>
        <template #hold><strong>{{ t('welcome.exitTipHold') }}</strong></template>
      </i18n-t>
    </p>

    <nav class="welcome__links" :aria-label="t('welcome.linksLabel')">
      <RouterLink :to="{ name: 'assistant' }">{{ t('welcome.assistantLink') }}</RouterLink>
      <button type="button" class="welcome__link-button" @click="localSpace?.open()">
        {{ vaultActive ? t('welcome.localSpaceActive') : t('welcome.localSpaceCreate') }}
      </button>
    </nav>

    <details class="privacy">
      <summary>{{ t('welcome.privacyTitle') }}</summary>
      <p>{{ t('welcome.privacyBody') }}</p>
    </details>
  </FolioSheet>

  <EmergencyDialog ref="emergency" />
  <LocalSpaceDialog ref="localSpace" @opened="router.push({ name: 'identify' })" />
</template>

<style scoped>
/* Above the folio, so someone who cannot read Spanish finds it before anything else. */
.welcome__locale {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.welcome__title {
  font-size: var(--text-2xl);
  letter-spacing: -0.02em;
  outline: none;
}

.welcome__actions {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.welcome__exit-tip {
  display: flex;
  gap: var(--space-3);
  padding-block: var(--space-3);
  border-block: 1px solid var(--edge);
  font-size: var(--text-sm);

  & svg {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.15rem;
    color: var(--exit);
  }
}

.welcome__links {
  display: grid;
  gap: var(--space-1);
  justify-items: start;

  & a,
  & button {
    display: inline-flex;
    align-items: center;
    min-height: var(--touch);
    font-weight: 700;
  }
}

.welcome__link-button {
  padding: 0;
  border: 0;
  background: none;
  color: var(--plum);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}

.privacy {
  border-top: 1px dashed var(--edge);
  padding-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--ink-muted);

  & summary {
    min-height: var(--touch);
    display: flex;
    align-items: center;
    font-weight: 700;
    color: var(--plum);
    cursor: pointer;
  }
}
</style>
