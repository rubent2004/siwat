import { describe, expect, it } from 'vitest'
import { PREFER_NOT_TO_SAY, togglePlatform } from './platforms'

describe('togglePlatform', () => {
  it('adds and removes a platform like a plain checkbox group', () => {
    const added = togglePlatform(['facebook'], 'tiktok', true)

    expect(added).toEqual(['facebook', 'tiktok'])
    expect(togglePlatform(added, 'facebook', false)).toEqual(['tiktok'])
  })

  it('unchecks every other platform when "prefer-not-to-say" is chosen', () => {
    expect(togglePlatform(['facebook', 'other'], PREFER_NOT_TO_SAY, true)).toEqual([PREFER_NOT_TO_SAY])
  })

  it('unchecks "prefer-not-to-say" when a platform is chosen afterwards', () => {
    expect(togglePlatform([PREFER_NOT_TO_SAY], 'whatsapp', true)).toEqual(['whatsapp'])
  })

  it('never duplicates a platform that is already checked', () => {
    expect(togglePlatform(['x'], 'x', true)).toEqual(['x'])
  })

  it('does not change the list it receives', () => {
    const selected = Object.freeze(['facebook'] as const)

    togglePlatform(selected, PREFER_NOT_TO_SAY, true)
    expect(selected).toEqual(['facebook'])
  })
})
