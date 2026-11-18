<template>
  <span class="brand">
    <svg class="brand__lights" viewBox="0 0 12 34" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" fill="#E63946" />
      <circle cx="6" cy="17" r="4.5" fill="#E9C46A" />
      <circle cx="6" cy="28" r="4.5" fill="#2A9D8F" />
    </svg>
    <span class="brand__word">SIWAT</span>
  </span>
</template>

<style scoped>
.brand {
  display: inline-flex;
  font-size: var(--text-lg);
  align-items: center;
  gap: 0.4em;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
}

.brand__lights {
  height: 1.35em;
  width: auto;
}
</style>
