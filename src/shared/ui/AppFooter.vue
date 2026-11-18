<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconAccessibility from '~icons/lucide/accessibility'
import { openAccessibilityPanel } from '../../features/accessibility/use-accessibility'
import LocaleSelect from './LocaleSelect.vue'

const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <i18n-t keypath="footer.text" tag="p" scope="global">
      <template #phone><a href="tel:911">911</a></template>
    </i18n-t>
    <div class="footer__tools">
      <LocaleSelect />
      <button type="button" class="footer__a11y" @click="openAccessibilityPanel">
        <IconAccessibility aria-hidden="true" />
        {{ t('footer.accessibility') }}
      </button>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: var(--space-5) max(var(--space-4), (100% - var(--measure)) / 2) var(--space-6);
  border-top: 1px solid var(--edge);
  color: var(--ink-muted);
  font-size: var(--text-sm);

  & a {
    font-weight: 700;
  }
}

.footer__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-5);
  margin-top: var(--space-4);
}

.footer__a11y {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch);
  padding: 0;
  border: 0;
  background: none;
  color: var(--plum);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;

  & svg {
    flex-shrink: 0;
    width: 1.25em;
    height: 1.25em;
  }
}
</style>
