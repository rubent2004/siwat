import { nextTick, ref } from 'vue'

/** Text of the app's single polite live region (rendered once by LiveAnnouncer in App.vue). */
export const announcement = ref('')

/**
 * Says `message` through the screen reader without moving focus.
 * Cleared first, so the same message can be announced again.
 */
export async function announce(message: string): Promise<void> {
  announcement.value = ''
  await nextTick()
  // Give the screen reader a moment to notice the empty region before the new text.
  setTimeout(() => (announcement.value = message), 150)
}
