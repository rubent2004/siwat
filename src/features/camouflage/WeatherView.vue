<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconCloud from '~icons/lucide/cloud'
import IconCloudRain from '~icons/lucide/cloud-rain'
import IconCloudSun from '~icons/lucide/cloud-sun'
import IconDroplets from '~icons/lucide/droplets'
import IconSun from '~icons/lucide/sun'
import IconWind from '~icons/lucide/wind'
import { returnFromCamouflage } from './quick-exit'
import { createTapWindow } from './tap-window'

/**
 * P06: a neutral weather screen with no trace of SIWAT, in any language.
 * Holding the sun for 2 seconds returns to the hidden session, and so does activating it
 * 3 times within 2 seconds, which also works with a screen reader (TalkBack/VoiceOver
 * double-tap) and the keyboard. Nothing on screen hints at either gesture.
 */
const { t } = useI18n()
const HOLD_MS = 2000
let holdTimer: ReturnType<typeof setTimeout> | undefined
const holding = ref(false)

function startHold(event?: PointerEvent) {
  cancelHold()
  // Keep receiving the pointer even if a shaky hand slides off the sun.
  if (event) (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  holding.value = true
  holdTimer = setTimeout(() => {
    holding.value = false
    returnFromCamouflage()
  }, HOLD_MS)
}

function cancelHold() {
  clearTimeout(holdTimer)
  holding.value = false
}

const taps = createTapWindow({ count: 3, windowMs: 2000 })

/** Each click, tap or Enter on the sun counts; the third within 2 seconds returns. */
function countActivation(event: Event) {
  if (!taps.register(event.timeStamp)) return
  cancelHold()
  returnFromCamouflage()
}

function onKeydown(event: KeyboardEvent) {
  if (event.repeat) return
  // Enter's keydown is prevented (it starts the hold), so it never also fires a click.
  if (event.key === 'Enter') countActivation(event)
  if (!holding.value) startHold()
}

onBeforeUnmount(() => {
  cancelHold()
  taps.reset()
})

const hours = [
  { time: '14:00', temp: 29, icon: IconSun },
  { time: '15:00', temp: 29, icon: IconCloudSun },
  { time: '16:00', temp: 28, icon: IconCloudSun },
  { time: '17:00', temp: 27, icon: IconCloud },
  { time: '18:00', temp: 25, icon: IconCloudRain },
]
const days = [
  { day: 'weather.tomorrow', min: 21, max: 29, icon: IconCloudSun },
  { day: 'weather.friday', min: 22, max: 30, icon: IconSun },
  { day: 'weather.saturday', min: 21, max: 27, icon: IconCloudRain },
]
</script>

<template>
  <div class="weather">
    <header class="weather__head">
      <p class="weather__city">{{ t('weather.city') }}</p>
      <p class="weather__sub">{{ t('weather.subtitle') }}</p>
    </header>

    <section class="weather__now">
      <button
        type="button"
        class="weather__sun"
        :class="{ 'is-holding': holding }"
        :aria-label="t('weather.sunLabel')"
        @pointerdown="startHold"
        @pointerup="cancelHold"
        @pointercancel="cancelHold"
        @keydown.enter.space.prevent="onKeydown"
        @keyup.enter.space="cancelHold"
        @click="countActivation"
        @contextmenu.prevent
      >
        <IconSun aria-hidden="true" />
      </button>
      <p class="weather__temp">28°C</p>
      <p class="weather__desc">{{ t('weather.now') }}</p>
      <ul class="weather__facts">
        <li><IconDroplets aria-hidden="true" /> {{ t('weather.humidity', { value: 68 }) }}</li>
        <li><IconWind aria-hidden="true" /> {{ t('weather.wind', { value: 9 }) }}</li>
      </ul>
    </section>

    <section class="weather__card" :aria-label="t('weather.hourly')">
      <ul class="weather__hours">
        <li v-for="hour in hours" :key="hour.time">
          <span>{{ hour.time }}</span>
          <component :is="hour.icon" aria-hidden="true" />
          <strong>{{ hour.temp }}°</strong>
        </li>
      </ul>
    </section>

    <section class="weather__card" :aria-label="t('weather.daily')">
      <ul class="weather__days">
        <li v-for="day in days" :key="day.day">
          <span>{{ t(day.day) }}</span>
          <component :is="day.icon" aria-hidden="true" />
          <span>{{ day.min }}° / {{ day.max }}°</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.weather {
  min-height: 100dvh;
  padding: var(--space-6) var(--space-4);
  display: grid;
  align-content: start;
  justify-items: center;
  gap: var(--space-5);
  background: linear-gradient(#4a90d9, #7db4e6);
  color: #fff;
  font-family: system-ui, sans-serif;
  text-align: center;
}

.weather__city {
  font-size: 1.75rem;
  font-weight: 600;
}

.weather__sub {
  opacity: 0.9;
}

.weather__now {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
}

.weather__sun {
  display: grid;
  place-items: center;
  width: 7rem;
  height: 7rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #ffd25a;
  touch-action: none;
  user-select: none;
  -webkit-touch-callout: none;

  & svg {
    width: 100%;
    height: 100%;
  }

  &:focus-visible {
    outline-color: #fff;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition:
      scale 2s linear,
      rotate 2s linear;

    &.is-holding {
      scale: 0.88;
      rotate: 45deg;
    }
  }
}

.weather__temp {
  font-size: 4rem;
  font-weight: 300;
  line-height: 1;
}

.weather__desc {
  font-size: 1.25rem;
}

.weather__facts {
  display: flex;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--text-sm);

  & li {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
  }

  & svg {
    width: 1em;
    height: 1em;
  }
}

.weather__card {
  width: min(100%, 26rem);
  padding: var(--space-4);
  border-radius: 16px;
  background: rgb(255 255 255 / 0.18);
}

.weather__hours {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;

  & li {
    display: grid;
    justify-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.weather__days {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  & li {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    text-align: start;

    & :last-child {
      text-align: end;
    }
  }

  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
