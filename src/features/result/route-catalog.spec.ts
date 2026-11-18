import { describe, expect, it } from 'vitest'
import es from '../../i18n/locales/es.json'
import { PLATFORMS } from '../diagnosis/catalog'
import { reportStepKeys } from './route-catalog'

const message = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], es)

describe('reportStepKeys', () => {
  it.each(PLATFORMS.filter((platform) => platform !== 'prefer-not-to-say'))(
    'lists every report step written for %s, and only those',
    (platform) => {
      const keys = reportStepKeys(platform)
      const written = Object.keys(message(`reportLocation.${platform}`) as object)

      expect(keys.length).toBeGreaterThanOrEqual(3)
      expect(keys.map((key) => key.split('.').pop())).toEqual(written)
      for (const key of keys) expect(typeof message(key)).toBe('string')
    },
  )

  it('has no report guide for "prefer-not-to-say"', () => {
    expect(reportStepKeys('prefer-not-to-say')).toEqual([])
  })
})
