import { describe, expect, it } from 'vitest'
import { createPreferenceStore, DEFAULT_PREFERENCES } from './preferences'

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

describe('accessibility preference store', () => {
  it('starts with every option off', () => {
    expect(DEFAULT_PREFERENCES).toEqual({ largeText: false, highContrast: false, readAloud: false })
    expect(createPreferenceStore(new MemoryStorage()).load()).toEqual(DEFAULT_PREFERENCES)
  })

  it('saves and loads the chosen options under one key', () => {
    const storage = new MemoryStorage()
    const store = createPreferenceStore(storage)

    store.save({ largeText: true, highContrast: false, readAloud: true })

    expect(store.load()).toEqual({ largeText: true, highContrast: false, readAloud: true })
    expect([...storage.items.keys()]).toEqual(['siwat:a11y'])
  })

  it('stores only the three options, nothing about the device or assistive technology', () => {
    const storage = new MemoryStorage()

    createPreferenceStore(storage).save({ largeText: true, highContrast: true, readAloud: false })

    expect(JSON.parse(storage.items.get('siwat:a11y')!)).toEqual({
      largeText: true,
      highContrast: true,
      readAloud: false,
    })
  })

  it('clear removes the options, so the defaults come back', () => {
    const storage = new MemoryStorage()
    const store = createPreferenceStore(storage)
    store.save({ largeText: true, highContrast: true, readAloud: true })

    store.clear()

    expect(storage.items.size).toBe(0)
    expect(store.load()).toEqual(DEFAULT_PREFERENCES)
  })

  it('falls back to the defaults for corrupted or partial data', () => {
    const storage = new MemoryStorage()
    const store = createPreferenceStore(storage)

    storage.setItem('siwat:a11y', '{not json')
    expect(store.load()).toEqual(DEFAULT_PREFERENCES)

    storage.setItem('siwat:a11y', JSON.stringify({ largeText: true, readAloud: 'yes' }))
    expect(store.load()).toEqual({ largeText: true, highContrast: false, readAloud: false })
  })
})
