import { describe, expect, it } from 'vitest'
import { createTapWindow } from './tap-window'

describe('createTapWindow', () => {
  it('fires on the third activation within 2 seconds', () => {
    const taps = createTapWindow({ count: 3, windowMs: 2000 })

    expect(taps.register(0)).toBe(false)
    expect(taps.register(700)).toBe(false)
    expect(taps.register(1900)).toBe(true)
  })

  it('does not fire when the three activations span more than 2 seconds', () => {
    const taps = createTapWindow({ count: 3, windowMs: 2000 })

    taps.register(0)
    taps.register(1000)
    expect(taps.register(2100)).toBe(false)
  })

  it('keeps counting from the activations still inside the window', () => {
    const taps = createTapWindow({ count: 3, windowMs: 2000 })

    taps.register(0)
    taps.register(1500)
    taps.register(2100)
    expect(taps.register(3000)).toBe(true)
  })

  it('starts over after firing, so a fourth tap alone does not fire again', () => {
    const taps = createTapWindow({ count: 3, windowMs: 2000 })

    taps.register(0)
    taps.register(100)
    taps.register(200)
    expect(taps.register(300)).toBe(false)
  })

  it('forgets earlier activations on reset', () => {
    const taps = createTapWindow({ count: 3, windowMs: 2000 })

    taps.register(0)
    taps.register(100)
    taps.reset()
    expect(taps.register(200)).toBe(false)
  })
})
