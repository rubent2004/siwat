import type { KeyValueStorage } from '../../case/domain/case-snapshot'

/** The three display and reading options. Nothing else is stored, and assistive technology is never detected. */
export interface AccessibilityPreferences {
  largeText: boolean
  highContrast: boolean
  readAloud: boolean
}

export const DEFAULT_PREFERENCES: Readonly<AccessibilityPreferences> = Object.freeze({
  largeText: false,
  highContrast: false,
  readAloud: false,
})

const PREFERENCES_KEY = 'siwat:a11y'

/** Keeps the options for the current tab only (sessionStorage), like the rest of the case. */
export function createPreferenceStore(storage: KeyValueStorage) {
  return {
    load(): AccessibilityPreferences {
      try {
        const stored = JSON.parse(storage.getItem(PREFERENCES_KEY) ?? '{}') as Record<string, unknown>
        return {
          largeText: stored.largeText === true,
          highContrast: stored.highContrast === true,
          readAloud: stored.readAloud === true,
        }
      } catch {
        return { ...DEFAULT_PREFERENCES }
      }
    },
    save({ largeText, highContrast, readAloud }: AccessibilityPreferences) {
      storage.setItem(PREFERENCES_KEY, JSON.stringify({ largeText, highContrast, readAloud }))
    },
    clear() {
      storage.removeItem(PREFERENCES_KEY)
    },
  }
}
