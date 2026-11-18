<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCase } from '../case/use-case'
import { buildAnonymousStats } from './domain/anonymous-stats'

const { t } = useI18n()
const { state, result } = useCase()
const optedIn = ref(false)
const preview = computed(() => JSON.stringify(buildAnonymousStats(state.answers, result.value.light), null, 2))
</script>

<template>
  <section class="stats" aria-labelledby="stats-title">
    <h2 id="stats-title">{{ t('stats.title') }}</h2>
    <label class="check-row">
      <input v-model="optedIn" type="checkbox" />
      <span>{{ t('stats.optIn') }}</span>
    </label>
    <div v-if="optedIn" class="stats__preview">
      <p class="field__hint">{{ t('stats.preview') }}</p>
      <pre class="data">{{ preview }}</pre>
    </div>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  gap: var(--space-3);

  & h2 {
    font-size: var(--text-md);
  }
}

.stats__preview {
  display: grid;
  gap: var(--space-2);

  & pre {
    margin: 0;
    padding: var(--space-3);
    overflow-x: auto;
    border: 1px solid var(--edge);
    border-radius: var(--radius-sheet);
    background: var(--paper);
    font-size: var(--text-xs);
  }
}
</style>
