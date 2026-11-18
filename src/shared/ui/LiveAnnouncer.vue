<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { announcement } from './announcer'

// A message belongs to the screen that produced it.
const route = useRoute()
watch(
  () => route.fullPath,
  () => (announcement.value = ''),
)
</script>

<template>
  <!-- The page's only polite live region: present from the start so screen readers watch it. -->
  <div class="visually-hidden" aria-live="polite" aria-atomic="true">{{ announcement }}</div>
</template>
