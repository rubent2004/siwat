import type { CaseRepository, CaseSnapshot, KeyValueStorage } from '../domain/case-snapshot'

const CASE_KEY = 'siwat:case'

/** Keeps the case for the current tab only; it disappears when the tab is closed. */
export function createSessionRepository(storage: KeyValueStorage): CaseRepository {
  return {
    load() {
      const raw = storage.getItem(CASE_KEY)
      if (!raw) return null
      try {
        return JSON.parse(raw) as CaseSnapshot
      } catch {
        return null
      }
    },
    save(snapshot) {
      storage.setItem(CASE_KEY, JSON.stringify(snapshot))
    },
    clear() {
      storage.removeItem(CASE_KEY)
    },
  }
}
