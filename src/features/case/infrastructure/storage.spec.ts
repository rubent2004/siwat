import { describe, expect, it } from 'vitest'
import { emptyAnswers } from '../../diagnosis/domain/types'
import type { CaseSnapshot } from '../domain/case-snapshot'
import { createPinVault, isValidPin, PinVaultError } from './pin-vault'
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
})

describe('pin vault', () => {
  it('only accepts PINs of exactly 4 digits', () => {
    expect(isValidPin('0420')).toBe(true)
    expect(isValidPin('042')).toBe(false)
    expect(isValidPin('04a0')).toBe(false)
  })

  it('stores the snapshot encrypted and opens it with the same pseudonym and PIN', async () => {
    const storage = new MemoryStorage()
    const vault = createPinVault(storage, { iterations: 1000 })

    await vault.save('Luna', '0420', snapshot)

    const raw = [...storage.items.values()].join('')
    expect(raw).not.toContain('Publicaron mi dirección')
    expect(raw).not.toContain('Luna')
    expect(vault.exists()).toBe(true)
    await expect(vault.open('Luna', '0420')).resolves.toEqual(snapshot)
  })

  it('rejects a wrong PIN without revealing data', async () => {
    const storage = new MemoryStorage()
    const vault = createPinVault(storage, { iterations: 1000 })
    await vault.save('Luna', '0420', snapshot)

    await expect(vault.open('Luna', '9999')).rejects.toThrow(PinVaultError)
    await expect(vault.open('Luna', '9999')).rejects.toThrow(/Seudónimo o PIN incorrectos/)
  })

  it('removes every trace when cleared', async () => {
    const storage = new MemoryStorage()
    const vault = createPinVault(storage, { iterations: 1000 })
    await vault.save('Luna', '0420', snapshot)

    vault.clear()

    expect(vault.exists()).toBe(false)
    expect(storage.items.size).toBe(0)
  })
})
