<template>
  <footer class="footer">
    <p>
      SIWAT es una herramienta preventiva de orientación. No presenta denuncias por ti. Si estás en peligro físico
      ahora, llama al <a href="tel:911">911</a>.
    </p>
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
</style>
