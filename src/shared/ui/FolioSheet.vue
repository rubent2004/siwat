<script setup lang="ts">
defineProps<{
  /** Folio number in the case file, e.g. "01". Omitted on sheets outside the case. */
  folio?: string
  caseCode?: string
}>()
</script>

<template>
  <section class="folio">
    <div v-if="folio" class="folio__head">
      <span class="data">Folio {{ folio }}</span>
      <span class="data">{{ caseCode ?? 'SIWAT' }}</span>
    </div>
    <slot />
  </section>
</template>

<style scoped>
/* A sheet in a case file: white paper, hairline edge, the lip of the sheets below it. */
.folio {
  position: relative;
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-4) var(--space-5);
  background: var(--sheet);
  border: 1px solid var(--edge);
  border-radius: var(--radius-sheet);
  box-shadow:
    0 3px 0 -1px var(--sheet),
    0 3px 0 0 var(--edge);

  @media (min-width: 30rem) {
    padding: var(--space-5) var(--space-5) var(--space-6);
  }
}

.folio__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-1) var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--edge);
  color: var(--ink-muted);
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
