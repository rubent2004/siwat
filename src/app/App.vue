<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppFooter from '../shared/ui/AppFooter.vue'
import AppHeader from '../shared/ui/AppHeader.vue'

const route = useRoute()
const { t } = useI18n()
</script>

<template>
  <RouterView v-if="route.meta.camouflage" />
  <template v-else>
    <a class="skip-link" href="#main">{{ t('app.skipLink') }}</a>
    <AppHeader />
    <main id="main" class="app-main">
      <RouterView />
    </main>
    <AppFooter />
  </template>
</template>

<style scoped>
.app-main {
  width: min(100% - 2rem, var(--measure));
  margin-inline: auto;
  padding-block: var(--space-5) var(--space-7);
}

.skip-link {
  position: absolute;
  inset-inline-start: var(--space-3);
  top: -4rem;
  z-index: 20;
  padding: var(--space-2) var(--space-4);
  background: var(--sheet);
  border-radius: var(--radius-control);
  font-weight: 700;

  &:focus {
    top: var(--space-3);
  }
}
</style>
