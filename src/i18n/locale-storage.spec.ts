import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearStoredLocale, readStoredLocale, storeLocale } from './locale-storage'

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

function stubStorages() {
  const session = new MemoryStorage()
  const local = new MemoryStorage()
  vi.stubGlobal('sessionStorage', session)
  vi.stubGlobal('localStorage', local)
  return { session, local }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('locale storage', () => {
  it('falls back to Spanish when nothing was chosen', () => {
    stubStorages()

    expect(readStoredLocale()).toBe('es')
  })

  it('writes and reads the chosen locale from sessionStorage only', () => {
    const { session, local } = stubStorages()

    storeLocale('de')

    expect(readStoredLocale()).toBe('de')
    expect([...session.items.values()]).toEqual(['de'])
    expect(local.items.size).toBe(0)
  })

  it('falls back to Spanish for an unknown stored value', () => {
    const { session } = stubStorages()
    storeLocale('en')
    const [key] = session.items.keys()
    session.setItem(key!, 'fr')

    expect(readStoredLocale()).toBe('es')
  })

  it('removes the stored locale when cleared', () => {
    const { session, local } = stubStorages()
    storeLocale('zh-CN')

    clearStoredLocale()

    expect(session.items.size).toBe(0)
    expect(local.items.size).toBe(0)
    expect(readStoredLocale()).toBe('es')
  })

  it('falls back to Spanish when sessionStorage is unavailable', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
    })

    expect(readStoredLocale()).toBe('es')
  })
})
