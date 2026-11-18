<script setup lang="ts">
import { ref } from 'vue'
import IconPhone from '~icons/lucide/phone'

const dialog = ref<HTMLDialogElement>()
defineExpose({ open: () => dialog.value?.showModal() })
</script>

<template>
  <dialog ref="dialog" class="sheet-dialog" aria-labelledby="emergency-title" closedby="any">
    <h2 id="emergency-title">Si estás en peligro ahora, llama</h2>
    <p>Ambas líneas son gratuitas. Tú decides qué contar.</p>
    <div class="sheet-dialog__actions">
      <a class="btn btn--plum btn--block" href="tel:911"><IconPhone aria-hidden="true" /> Llamar al 911</a>
      <a class="btn btn--primary btn--block" href="tel:126"><IconPhone aria-hidden="true" /> Llamar al 126</a>
    </div>
    <form method="dialog">
      <button class="btn btn--ghost btn--block" autofocus>Cerrar</button>
    </form>
  </dialog>
</template>

<style>
/* Unscoped: shared by every native dialog in the app. */
.sheet-dialog {
  width: min(100% - 2rem, 26rem);
  padding: var(--space-5);
  border: 1px solid var(--edge);
  border-radius: var(--radius-sheet);
  background: var(--sheet);
  color: var(--ink);
  box-shadow: 0 24px 48px -16px rgb(36 17 42 / 0.45);

  &[open] {
    display: grid;
    gap: var(--space-4);
  }

  & h2 {
    font-size: var(--text-xl);
  }
}

.sheet-dialog__actions {
  display: grid;
  gap: var(--space-3);
}
</style>
