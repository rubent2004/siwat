<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import IconExternalLink from '~icons/lucide/external-link'
import IconPhone from '~icons/lucide/phone'
import { useCase } from '../case/use-case'
import { platformKey } from '../diagnosis/catalog'
import {
  actionLabelKey,
  institutionPurposeKey,
  INSTITUTIONS,
  reportLocationKey,
  SHIELD_MEASURES,
} from './route-catalog'

const { t } = useI18n()
const { state, result } = useCase()
const shieldDone = reactive<Record<string, boolean>>({})
</script>

<template>
  <section class="route" aria-labelledby="route-title">
    <h2 id="route-title">{{ t('route.title') }}</h2>

    <ol class="route__steps">
      <li class="route__step">
        <h3>{{ t('route.step1') }}</h3>
        <details v-for="platform in state.answers.platforms" :key="platform" class="disclosure">
          <summary>{{ t('route.seeSteps', { platform: t(platformKey(platform)) }) }}</summary>
          <ol class="howto">
            <li>{{ t('route.howtoSave') }}</li>
            <li>{{ t(reportLocationKey(platform)) }}</li>
            <li>{{ t('route.howtoConfirm') }}</li>
          </ol>
        </details>
      </li>

      <li class="route__step">
        <h3>{{ t('route.step2') }}</h3>
        <p class="route__note">{{ t('route.note') }}</p>
        <ul class="institutions">
          <li v-for="id in result.institutions" :key="id" class="institution">
            <p class="institution__name" lang="es-SV">{{ INSTITUTIONS[id].name }}</p>
            <p class="institution__purpose">{{ t(institutionPurposeKey(id)) }}</p>
            <div class="institution__actions">
              <a
                v-for="(action, index) in INSTITUTIONS[id].actions"
                :key="action.href"
                :href="action.href"
                class="btn btn--block"
                :class="index === 0 ? 'btn--plum' : 'btn--outline'"
                v-bind="action.kind === 'web' ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
              >
                <IconPhone v-if="action.kind === 'call'" aria-hidden="true" />
                {{ t(actionLabelKey(action.id)) }}
                <IconExternalLink v-if="action.kind === 'web'" aria-hidden="true" />
                <span v-if="action.kind === 'web'" class="visually-hidden">{{ t('common.newTab') }}</span>
              </a>
            </div>
          </li>
        </ul>
      </li>

      <li class="route__step">
        <h3>{{ t('route.step3') }}</h3>
        <details class="disclosure" open>
          <summary>{{ t('route.shieldSummary') }}</summary>
          <ul class="shield">
            <li v-for="measure in SHIELD_MEASURES" :key="measure">
              <label class="check-row">
                <input v-model="shieldDone[measure]" type="checkbox" />
                <span>
                  <strong>{{ t(`shield.${measure}.label`) }}</strong>
                  <span class="shield__detail">{{ t(`shield.${measure}.detail`) }}</span>
                </span>
              </label>
            </li>
          </ul>
        </details>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.route {
  display: grid;
  gap: var(--space-4);

  & h2 {
    font-size: var(--text-lg);
  }
}

.route__steps {
  display: grid;
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

.route__step {
  display: grid;
  gap: var(--space-3);

  & h3 {
    font-size: var(--text-md);
    color: var(--ink);
  }
}

.route__note {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--plum);
}

.disclosure {
  border-top: 1px solid var(--edge);

  &:last-of-type {
    border-bottom: 1px solid var(--edge);
  }

  & summary {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-height: var(--touch);
    padding: var(--space-2) 0;
    font-weight: 700;
    color: var(--plum);
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::before {
      content: '';
      flex-shrink: 0;
      width: 0.9em;
      height: 0.9em;
      background: currentColor;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")
        no-repeat center / contain;
      rotate: -90deg;

      @media (prefers-reduced-motion: no-preference) {
        transition: rotate 0.2s;
      }
    }
  }

  &[open] > summary::before {
    rotate: 0deg;
  }

  &::details-content {
    interpolate-size: allow-keywords;
    overflow: clip;
    contain: layout;
  }

  &:not([open])::details-content {
    block-size: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    &::details-content {
      transition: block-size 0.3s ease-in-out, content-visibility 0.3s allow-discrete;
    }
  }
}

.howto,
.shield {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0 0 var(--space-4) var(--space-5);
  font-size: var(--text-sm);
}

.shield {
  padding-left: 0;
  list-style: none;
}

.shield__detail {
  display: block;
  color: var(--ink-muted);
}

.institutions {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.institution {
  display: grid;
  gap: var(--space-2);
  padding-block: var(--space-4);
  border-top: 1px solid var(--edge);

  &:last-child {
    border-bottom: 1px solid var(--edge);
  }
}

.institution__name {
  font-weight: 700;
  color: var(--plum);
}

.institution__purpose {
  font-size: var(--text-sm);
  color: var(--ink-muted);
}

.institution__actions {
  display: grid;
  gap: var(--space-2);
  margin-top: var(--space-1);
}
</style>
