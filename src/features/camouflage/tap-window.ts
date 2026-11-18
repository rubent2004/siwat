/**
 * Counts activations (clicks, taps, Enter) and fires when `count` of them land within `windowMs`.
 * Pure: the caller passes the time, so it can be tested without a clock.
 */
export function createTapWindow({ count, windowMs }: { count: number; windowMs: number }) {
  let taps: number[] = []
  return {
    /** Records one activation at `now` (ms). True when it completes the series. */
    register(now: number): boolean {
      taps = [...taps.filter((time) => now - time < windowMs), now]
      if (taps.length < count) return false
      taps = []
      return true
    },
    reset() {
      taps = []
    },
  }
}
