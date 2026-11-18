<script setup lang="ts">
import { computed } from 'vue'
import type { Light } from '../../features/diagnosis/domain/types'

const props = defineProps<{ light: Light; label: string; caseCode: string; issuedAtUtc: string }>()

/** Each light has its own stamp shape so it reads without colour: octagon, triangle, circle. */
const SHAPES: Record<Light, string> = {
  red: 'M37 4h46l33 33v46l-33 33H37L4 83V37z',
  yellow: 'M60 6l56 104H4z',
  green: 'M60 4a56 56 0 1 1 0 112a56 56 0 1 1 0-112z',
}

const stampDate = computed(() => {
  const date = new Date(props.issuedAtUtc)
  const day = date.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
  const time = date.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
  return { day, time: `${time} UTC` }
})

/** "SIWAT-2026-ABCD" split in two lines so it fits inside every stamp shape. */
const caseCodeLines = computed(() => {
  const cut = props.caseCode.lastIndexOf('-')
  return [props.caseCode.slice(0, cut), props.caseCode.slice(cut + 1)]
})
</script>

<template>
  <div class="stamp" :class="`stamp--${light}`" aria-hidden="true">
    <svg viewBox="0 0 120 120" class="stamp__shape">
      <path :d="SHAPES[light]" />
    </svg>
    <span class="stamp__text">
      <span class="stamp__label">{{ label }}</span>
      <span class="stamp__date data">{{ stampDate.day }}<br />{{ stampDate.time }}</span>
      <span class="stamp__date data">{{ caseCodeLines[0] }}<br />{{ caseCodeLines[1] }}</span>
    </span>
  </div>
</template>

<style scoped>
.stamp {
  --ink-color: var(--red);
  position: relative;
  display: grid;
  place-items: center;
  width: 8.5rem;
  aspect-ratio: 1;
  color: var(--ink-color);
  rotate: -8deg;
  mix-blend-mode: multiply;

  @media (prefers-reduced-motion: no-preference) {
    animation: stamp-press 520ms var(--ease-out) both;
  }
}

.stamp--yellow {
  --ink-color: #c99a1e;
}

.stamp--green {
  --ink-color: var(--green);
}

.stamp__shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;

  & path {
    fill: color-mix(in srgb, var(--ink-color) 8%, transparent);
    stroke: var(--ink-color);
    stroke-width: 6;
    stroke-linejoin: round;
  }
}

.stamp__text {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.15rem;
  text-align: center;
}

.stamp--yellow .stamp__text {
  padding-top: 1.6rem;
}

.stamp__label {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stamp__date {
  max-width: 6.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.stamp--yellow .stamp__label {
  font-size: 1.05rem;
}

.stamp--yellow .stamp__date {
  max-width: 5rem;
}

/* The one authored motion: the stamp is pressed onto the folio. */
@keyframes stamp-press {
  from {
    opacity: 0.35;
    scale: 1.35;
    rotate: -16deg;
  }
}
</style>
