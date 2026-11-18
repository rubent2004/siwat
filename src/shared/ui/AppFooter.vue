<script setup lang="ts">
import LocaleSelect from './LocaleSelect.vue'
</script>

<template>
  <footer class="footer">
    <i18n-t keypath="footer.text" tag="p" scope="global">
      <template #phone><a href="tel:911">911</a></template>
    </i18n-t>
    <LocaleSelect class="footer__locale" />
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

.footer__locale {
  margin-top: var(--space-4);
}
</style>
