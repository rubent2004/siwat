import { describe, expect, it } from 'vitest'
import { emptyAnswers } from '../../diagnosis/domain/types'
import type { CaseSnapshot } from '../domain/case-snapshot'
import { createSessionRepository } from './session-repository'

class MemoryStorage implements Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  readonly items = new Map<string, string>()
  getItem(key: string) {
    return this.items.get(key) ?? null
  }
  setItem(key: string, value: string) {
    this.items.set(key, value)
  }
  removeItem(key: string) {
    this.items.delete(key)
  }
}

const snapshot: CaseSnapshot = {
  answers: { ...emptyAnswers(), platforms: ['tiktok'], conducts: ['doxing'], narrative: 'Publicaron mi dirección' },
  evidence: [],
  caseCode: 'SIWAT-2026-ABCD',
}

describe('session repository', () => {
  it('saves, loads and clears the case snapshot', () => {
    const storage = new MemoryStorage()
    const repository = createSessionRepository(storage)

    repository.save(snapshot)
    expect(repository.load()).toEqual(snapshot)

    repository.clear()
    expect(repository.load()).toBeNull()
    expect(storage.items.size).toBe(0)
  })

  it('returns null instead of throwing when stored data is corrupted', () => {
    const storage = new MemoryStorage()
    storage.setItem('siwat:case', '{not json')

    expect(createSessionRepository(storage).load()).toBeNull()
  })

  it('loads a snapshot saved before the free-text answers existed, with empty texts', () => {
    const storage = new MemoryStorage()
    const { otherPlatform: _platform, otherRole: _role, ...oldAnswers } = snapshot.answers
    storage.setItem('siwat:case', JSON.stringify({ ...snapshot, answers: oldAnswers }))

    const loaded = createSessionRepository(storage).load()

    expect(loaded?.answers.otherPlatform).toBe('')
    expect(loaded?.answers.otherRole).toBe('')
    expect(loaded?.answers.platforms).toEqual(['tiktok'])
  })

  it('loads a snapshot saved before the intimate-content follow-up existed, as unanswered', () => {
    const storage = new MemoryStorage()
    const { intimateContent: _intimate, ...oldAnswers } = snapshot.answers
    storage.setItem('siwat:case', JSON.stringify({ ...snapshot, answers: oldAnswers }))

    const loaded = createSessionRepository(storage).load()

    expect(loaded?.answers.intimateContent).toBeNull()
    expect(loaded?.answers.conducts).toEqual(['doxing'])
  })
})
