<script setup lang="ts">
import IconLogOut from '~icons/lucide/log-out'
import { quickExit } from '../../features/camouflage/quick-exit'
import BrandMark from './BrandMark.vue'
</script>

<template>
  <header class="topbar">
    <RouterLink :to="{ name: 'welcome' }" class="topbar__home" aria-label="SIWAT, ir al inicio">
      <BrandMark />
    </RouterLink>
    <button type="button" class="topbar__exit" aria-describedby="exit-hint" @click="quickExit">
      <IconLogOut aria-hidden="true" />
      SALIR RÁPIDO
    </button>
    <span id="exit-hint" class="visually-hidden">También puedes presionar Esc dos veces.</span>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) max(var(--space-4), (100% - var(--measure)) / 2);
  background: var(--plum);
  color: #fff;
}

.topbar__home {
  display: inline-flex;
  align-items: center;
  min-height: var(--touch);
  color: #fff;
  text-decoration: none;

  &:focus-visible {
    outline-color: #fff;
  }
}

.topbar__exit {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch);
  min-width: var(--touch);
  padding: 0 var(--space-4);
  background: var(--exit);
  color: #fff;
  border: 1.5px solid rgb(255 255 255 / 0.35);
  border-radius: var(--radius-control);
  font-weight: 700;
  letter-spacing: 0.03em;

  & svg {
    width: 1.15em;
    height: 1.15em;
  }

  &:hover {
    background: var(--exit-hover);
  }

  &:focus-visible {
    outline-color: #fff;
  }
}
</style>
