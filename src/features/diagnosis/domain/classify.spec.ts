import { describe, expect, it } from 'vitest'
import { asksIntimateContent, classify } from './classify'
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
const ids = (result: ReturnType<typeof classify>) => result.legalBasis.map((ref) => ref.id)

const LEDIC_22 = 'Ley Especial contra los Delitos Informáticos y Conexos (LEDIC Art. 22)'
const LEDIC_24 = 'Ley Especial contra los Delitos Informáticos y Conexos (LEDIC Art. 24)'

describe('classify', () => {
  it('returns red when the user received physical threats (P03 filter 1)', () => {
    const result = classify(answers({ conducts: ['sexist-insults'], physicalThreat: true }))

    expect(result.light).toBe('red')
    expect(result.rules).toContain('high-risk')
    expect(result.institutions).toEqual(['pnc', 'fgr', 'isdemu'])
    expect(laws(result)).toContain('LEIV Art. 55 lit. e')
  })

  it('cites only the Código Penal threats articles and LEIV 55 e for threats without exposure', () => {
    const result = classify(answers({ conducts: ['threats'] }))

    expect(laws(result)).toEqual(['Código Penal Arts. 154 y 155', 'LEIV Art. 55 lit. e'])
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
    'returns yellow through the identity rule for %s without red triggers',
    (conduct) => {
      const result = classify(answers({ conducts: [conduct], intimateContent: false }))

      expect(result.light).toBe('yellow')
      expect(result.rules).toEqual(['identity'])
      expect(result.institutions).toEqual(['fgr'])
      expect(result.reportOnPlatform).toBe(true)
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

  describe('legal basis: only the articles that apply to what she marked', () => {
    it('threats with a physical threat and no exposure cite only CP 154-155 and LEIV 55 e', () => {
      const result = classify(answers({ conducts: ['threats'], physicalThreat: true, privateDataExposed: false }))

      expect(result.light).toBe('red')
      expect(laws(result)).toEqual(['Código Penal Arts. 154 y 155', 'LEIV Art. 55 lit. e'])
      expect(laws(result)).not.toContain('LEIV Arts. 49 y 51')
      expect(laws(result)).not.toContain('LEIV Art. 50')
      expect(laws(result)).not.toContain(LEDIC_24)
    })

    it('doxing without intimate content cites LEIV 50, LEDIC 24 and LEIV 55 e, without 49/51 or the Código Penal', () => {
      const result = classify(answers({ conducts: ['doxing'], intimateContent: false }))

      expect(result.light).toBe('red')
      expect(laws(result)).toEqual(['LEIV Art. 50', LEDIC_24, 'LEIV Art. 55 lit. e'])
    })

    it('exposed private data with intimate content cites LEIV 49 y 51', () => {
      const result = classify(answers({ conducts: ['sexist-insults'], privateDataExposed: true, intimateContent: true }))

      expect(result.light).toBe('red')
      expect(laws(result)).toContain('LEIV Arts. 49 y 51')
    })

    it('a sexual deepfake is red with LEIV 49 y 51 and LEIV 55 c even without exposed data (spec 5: «Montaje íntimo → ROJO»)', () => {
      const result = classify(answers({ conducts: ['deepfake'], privateDataExposed: false, intimateContent: true }))

      expect(result.light).toBe('red')
      expect(result.rules).toEqual(['high-risk', 'identity'])
      expect(laws(result)).toContain('LEIV Arts. 49 y 51')
      expect(laws(result)).toContain('LEIV Art. 55 lit. c')
    })

    it('a non-sexual deepfake is yellow with only LEIV 55 c from the identity rule, without LEDIC 22', () => {
      const result = classify(answers({ conducts: ['deepfake'], intimateContent: false }))

      expect(result.light).toBe('yellow')
      expect(laws(result)).toEqual(['LEIV Art. 55 lit. c'])
    })

    it('impersonation alone is yellow with LEDIC 22 and LEIV 55 c', () => {
      const result = classify(answers({ conducts: ['impersonation'] }))

      expect(result.light).toBe('yellow')
      expect(laws(result)).toEqual([LEDIC_22, 'LEIV Art. 55 lit. c'])
    })

    it('sexist insults alone are green with LEIV 9, LEIV 55 a and Belém do Pará, without LEIV 55 c', () => {
      const result = classify(answers({ conducts: ['sexist-insults'] }))

      expect(result.light).toBe('green')
      expect(laws(result)).toEqual([
        'LEIV Art. 9',
        'LEIV Art. 55 lit. a',
        'Convención Belém do Pará (Arts. 3, 4 lit. j y 7)',
      ])
    })

    it('disinformation outside an electoral context is green with LEIV 9, LEIV 55 c and Belém do Pará, without LEIV 55 a', () => {
      const result = classify(answers({ conducts: ['disinformation'], electoralContext: false }))

      expect(result.light).toBe('green')
      expect(laws(result)).toEqual([
        'LEIV Art. 9',
        'LEIV Art. 55 lit. c',
        'Convención Belém do Pará (Arts. 3, 4 lit. j y 7)',
      ])
    })

    it('keeps one LEIV 55 c, in its first position, when identity and the symbolic fallback both cite it', () => {
      const result = classify(answers({ conducts: ['impersonation', 'disinformation'], electoralContext: false }))

      expect(result.rules).toEqual(['identity'])
      expect(ids(result).filter((id) => id === 'leiv-55-c')).toHaveLength(1)
    })

    it('never repeats an id and never returns an empty legal basis, for any combination of answers', () => {
      const conducts = ['threats', 'sexist-insults', 'doxing', 'deepfake', 'impersonation', 'disinformation'] as const
      const yesNo = [true, false, null] as const
      for (let mask = 0; mask < 2 ** conducts.length; mask++) {
        const marked = conducts.filter((_, bit) => mask & (1 << bit))
        for (const electoralContext of [true, false])
          for (const physicalThreat of yesNo)
            for (const privateDataExposed of yesNo)
              for (const intimateContent of yesNo) {
                const result = classify(
                  answers({ conducts: [...marked], electoralContext, physicalThreat, privateDataExposed, intimateContent }),
                )
                expect(result.legalBasis.length).toBeGreaterThan(0)
                expect(new Set(ids(result)).size).toBe(ids(result).length)
              }
      }
    })
  })

  describe('asksIntimateContent (P03 follow-up)', () => {
    it.each([
      { privateDataExposed: true, conducts: [], expected: true },
      { privateDataExposed: false, conducts: ['deepfake'], expected: true },
      { privateDataExposed: null, conducts: ['deepfake'], expected: true },
      { privateDataExposed: false, conducts: ['threats', 'doxing'], expected: false },
      { privateDataExposed: null, conducts: [], expected: false },
    ] as const)(
      'is $expected when exposure is $privateDataExposed and conducts are $conducts',
      ({ privateDataExposed, conducts, expected }) => {
        expect(asksIntimateContent(answers({ privateDataExposed, conducts: [...conducts] }))).toBe(expected)
      },
    )
  })
})
