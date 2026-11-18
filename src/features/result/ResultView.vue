<script setup lang="ts">
import { computed } from 'vue'
import IconPhone from '~icons/lucide/phone'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import VerdictStamp from '../../shared/ui/VerdictStamp.vue'
import { useCase } from '../case/use-case'
import { LIGHT_COPY } from '../diagnosis/catalog'
import ActionRoute from './ActionRoute.vue'
import AnonymousStatsOptIn from './AnonymousStatsOptIn.vue'
import BitacoraPanel from './BitacoraPanel.vue'

const { state, result } = useCase()
const copy = computed(() => LIGHT_COPY[result.value.light])
const issuedAt = new Date().toISOString()
</script>

<template>
  <div class="result">
    <FolioSheet folio="04" caption="Resultado" :case-code="state.caseCode">
      <div class="verdict" :class="`verdict--${result.light}`">
        <div class="verdict__text">
          <h1 tabindex="-1" class="verdict__title">{{ copy.title }}</h1>
          <p>{{ copy.body }}</p>
        </div>
        <VerdictStamp class="verdict__stamp" :light="result.light" :label="copy.label" :issued-at-utc="issuedAt" />
      </div>

      <a v-if="result.light === 'red'" href="tel:911" class="btn btn--plum btn--block">
        <IconPhone aria-hidden="true" />
        Llamar a emergencia (PNC 911)
      </a>

      <details class="law" open>
        <summary>¿Qué dice la ley salvadoreña sobre tu caso?</summary>
        <dl class="law__list">
          <div v-for="reference in result.legalBasis" :key="reference.law" class="law__item">
            <dt>{{ reference.law }}</dt>
            <dd>{{ reference.summary }}</dd>
          </div>
        </dl>
      </details>
    </FolioSheet>

    <FolioSheet folio="05" caption="Respaldo">
      <BitacoraPanel />
    </FolioSheet>

    <FolioSheet folio="06" caption="Ruta">
      <ActionRoute />
    </FolioSheet>

    <AnonymousStatsOptIn />
  </div>
</template>

<style scoped>
.result {
  display: grid;
  gap: var(--space-5);
}

.verdict {
  --tone: var(--red-text);
  --tint: var(--red-tint);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-sheet);
  background: var(--tint);

  @media (max-width: 26rem) {
    grid-template-columns: 1fr;

    & .verdict__stamp {
      justify-self: end;
      margin-top: calc(var(--space-6) * -1);
      order: -1;
    }
  }
}

.verdict--yellow {
  --tone: var(--yellow-text);
  --tint: var(--yellow-tint);
}

.verdict--green {
  --tone: var(--green-text);
  --tint: var(--green-tint);
}

.verdict__text {
  display: grid;
  gap: var(--space-2);
}

.verdict__title {
  font-size: var(--text-xl);
  color: var(--tone);
  outline: none;
}

.law {
  border-top: 1px dashed var(--edge);
  padding-top: var(--space-2);

  & summary {
    display: flex;
    align-items: center;
    min-height: var(--touch);
    font-weight: 700;
    color: var(--plum);
    cursor: pointer;
  }
}

.law__list {
  display: grid;
  gap: var(--space-3);
  margin: 0;
}

.law__item {
  display: grid;
  gap: var(--space-1);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--edge);

  &:last-child {
    border-bottom: 0;
  }

  & dt {
    font-family: var(--font-data);
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--ink);
  }

  & dd {
    margin: 0;
    font-size: var(--text-sm);
  }
}
</style>
