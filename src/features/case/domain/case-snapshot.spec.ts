import { describe, expect, it } from 'vitest'
import { emptyAnswers } from '../../diagnosis/domain/types'
import { toPlainSnapshot, type CaseSnapshot } from './case-snapshot'

describe('toPlainSnapshot', () => {
  const snapshot: CaseSnapshot = {
    answers: { ...emptyAnswers(), platforms: ['facebook'], conducts: ['threats'] },
    evidence: [],
    caseCode: 'SIWAT-2026-ABCD',
  }

  it('returns a copy that structuredClone accepts even when the source is a Proxy (Vue reactive state)', () => {
    const reactiveLike = new Proxy(snapshot, {})

    expect(() => structuredClone(reactiveLike)).toThrow()
    const plain = toPlainSnapshot(reactiveLike)

    expect(() => structuredClone(plain)).not.toThrow()
    expect(plain).toEqual(snapshot)
  })

  it('does not share references with the source, so later edits do not leak into the saved copy', () => {
    const source = structuredClone(snapshot)
    const plain = toPlainSnapshot(source)
    source.answers.conducts.push('doxing')

    expect(plain.answers.conducts).toEqual(['threats'])
  })
})
