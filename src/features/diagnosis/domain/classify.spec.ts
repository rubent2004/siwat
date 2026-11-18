import { describe, expect, it } from 'vitest'
import { classify } from './classify'
import { emptyAnswers, type DiagnosisAnswers } from './types'

function answers(overrides: Partial<DiagnosisAnswers>): DiagnosisAnswers {
  return {
    ...emptyAnswers(),
    platforms: ['facebook'],
    electoralContext: false,
    physicalThreat: false,
    privateDataExposed: false,
    ...overrides,
  }
}

const laws = (result: ReturnType<typeof classify>) => result.legalBasis.map((ref) => ref.law)

describe('classify', () => {
  it('returns red when the user received physical threats (P03 filter 1)', () => {
    const result = classify(answers({ conducts: ['sexist-insults'], physicalThreat: true }))

    expect(result.light).toBe('red')
    expect(result.rules).toContain('high-risk')
    expect(result.institutions).toEqual(['pnc', 'fgr', 'isdemu'])
    expect(laws(result)).toContain('LEIV Art. 55 lit. e')
  })

  it('cites the Código Penal threats articles in the red rule', () => {
    const result = classify(answers({ conducts: ['threats'] }))

    expect(laws(result)).toEqual([
      'LEIV Arts. 49 y 51',
      'LEIV Art. 50',
      'Código Penal Arts. 154 y 155',
      'LEIV Art. 55 lit. e',
    ])
  })

  it('returns red when private data or intimate images were exposed (P03 filter 2)', () => {
    const result = classify(answers({ conducts: ['sexist-insults'], privateDataExposed: true }))

    expect(result.light).toBe('red')
    expect(laws(result)).toContain('LEIV Art. 50')
  })

  it.each(['threats', 'doxing'] as const)('returns red when the %s conduct is marked', (conduct) => {
    expect(classify(answers({ conducts: [conduct] })).light).toBe('red')
  })

  it.each(['impersonation', 'deepfake'] as const)(
    'returns yellow with LEDIC basis for %s without red triggers',
    (conduct) => {
      const result = classify(answers({ conducts: [conduct] }))

      expect(result.light).toBe('yellow')
      expect(result.rules).toEqual(['identity'])
      expect(result.institutions).toEqual(['fgr'])
      expect(result.reportOnPlatform).toBe(true)
      expect(laws(result)[0]).toMatch(/LEDIC Arts\. 22 y 24/)
    },
  )

  it('escalates impersonation to red when combined with a physical threat', () => {
    const result = classify(answers({ conducts: ['impersonation'], physicalThreat: true }))

    expect(result.light).toBe('red')
    expect(result.rules).toEqual(['high-risk', 'identity'])
  })

  it('returns yellow with electoral basis and TSE for disinformation in electoral context', () => {
    const result = classify(answers({ conducts: ['disinformation'], electoralContext: true }))

    expect(result.light).toBe('yellow')
    expect(result.rules).toEqual(['electoral'])
    expect(result.institutions).toEqual(['isdemu', 'tse'])
    expect(laws(result)).toContain('Código Electoral (Arts. 173 y 249)')
    expect(laws(result)[0]).toBe('LEIV Art. 10 lit. d y Art. 10-A (D.L. 829/2021)')
  })

  it('returns green (preventive) for sexist insults only', () => {
    const result = classify(answers({ conducts: ['sexist-insults'] }))

    expect(result.light).toBe('green')
    expect(result.rules).toEqual(['symbolic'])
    expect(result.institutions).toEqual(['isdemu'])
    expect(result.reportOnPlatform).toBe(true)
    expect(laws(result)).toContain('Convención Belém do Pará (Arts. 3, 4 lit. j y 7)')
  })

  it('falls back to green preventive for disinformation outside an electoral context', () => {
    const result = classify(answers({ conducts: ['disinformation'], electoralContext: false }))

    expect(result.light).toBe('green')
    expect(result.rules).toEqual(['symbolic'])
  })

  it('enables the TSE route whenever the electoral context is Sí', () => {
    const result = classify(answers({ conducts: ['sexist-insults'], electoralContext: true }))

    expect(result.institutions).toContain('tse')
  })

  it('merges institutions without duplicates in urgency order', () => {
    const result = classify(
      answers({ conducts: ['threats', 'impersonation', 'disinformation', 'sexist-insults'], electoralContext: true }),
    )

    expect(result.light).toBe('red')
    expect(result.institutions).toEqual(['pnc', 'fgr', 'isdemu', 'tse'])
    expect(new Set(laws(result)).size).toBe(laws(result).length)
  })

  it('ignores "prefer-not-to-say" as a platform: the light only depends on the conducts and risk', () => {
    const base = answers({ conducts: ['impersonation'] })

    expect(classify({ ...base, platforms: ['prefer-not-to-say'] })).toEqual(classify(base))
    expect(classify({ ...base, platforms: ['prefer-not-to-say'] }).light).toBe('yellow')
  })
})
