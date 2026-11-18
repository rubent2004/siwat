import type { Platform } from './types'

/** «Prefiero no decirlo»: answers the required question without naming a platform. */
export const PREFER_NOT_TO_SAY = 'prefer-not-to-say' satisfies Platform

/**
 * Checks or unchecks one platform. «Prefiero no decirlo» excludes every other platform,
 * and choosing a platform afterwards unchecks it. Returns a new list.
 */
export function togglePlatform(selected: readonly Platform[], platform: Platform, checked: boolean): Platform[] {
  if (!checked) return selected.filter((item) => item !== platform)
  if (platform === PREFER_NOT_TO_SAY) return [PREFER_NOT_TO_SAY]
  const others = selected.filter((item) => item !== PREFER_NOT_TO_SAY && item !== platform)
  return [...others, platform]
}

/** Platforms that have a report guide: every one except «Prefiero no decirlo». */
export const hasReportGuide = (platform: Platform) => platform !== PREFER_NOT_TO_SAY
