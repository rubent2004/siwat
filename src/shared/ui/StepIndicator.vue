<script setup lang="ts">
defineProps<{ step: 1 | 2; label: string }>()
</script>

<template>
  <div class="steps">
    <p class="steps__label" :id="`step-${step}-label`">{{ label }}</p>
    <progress class="steps__bar" :value="step" max="2" :aria-labelledby="`step-${step}-label`">
      {{ step * 50 }}%
    </progress>
  </div>
</template>

<style scoped>
.steps {
  display: grid;
  gap: var(--space-2);
}

.steps__label {
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--plum);
}

.steps__bar {
  appearance: none;
  width: 100%;
  height: 0.5rem;
  border: 0;
  border-radius: 999px;
  background: var(--plum-50);
  overflow: hidden;

  &::-webkit-progress-bar {
    background: var(--plum-50);
  }

  &::-webkit-progress-value {
    background: var(--plum);
    border-radius: 999px;
  }

  &::-moz-progress-bar {
    background: var(--plum);
    border-radius: 999px;
  }
}
</style>
