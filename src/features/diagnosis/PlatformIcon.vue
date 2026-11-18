<script setup lang="ts">
import type { Component } from 'vue'
import IconEllipsis from '~icons/lucide/ellipsis'
import IconEyeOff from '~icons/lucide/eye-off'
import IconMail from '~icons/lucide/mail'
import IconFacebook from '~icons/simple-icons/facebook'
import IconInstagram from '~icons/simple-icons/instagram'
import IconTelegram from '~icons/simple-icons/telegram'
import IconTiktok from '~icons/simple-icons/tiktok'
import IconWhatsapp from '~icons/simple-icons/whatsapp'
import IconX from '~icons/simple-icons/x'
import IconYoutube from '~icons/simple-icons/youtube'
import type { Platform } from './domain/types'

defineProps<{ platform: Platform }>()

/** Brand marks (Simple Icons) compiled into the bundle; drawn in the text colour, never in brand colours. */
const ICONS: Record<Platform, Component> = {
  facebook: IconFacebook,
  whatsapp: IconWhatsapp,
  tiktok: IconTiktok,
  x: IconX,
  instagram: IconInstagram,
  youtube: IconYoutube,
  telegram: IconTelegram,
  email: IconMail,
  other: IconEllipsis,
  'prefer-not-to-say': IconEyeOff,
}
</script>

<template>
  <component :is="ICONS[platform]" class="platform-icon" aria-hidden="true" focusable="false" />
</template>

<style scoped>
.platform-icon {
  flex-shrink: 0;
  width: 1.1em;
  height: 1.1em;
  color: currentColor;
}
</style>
