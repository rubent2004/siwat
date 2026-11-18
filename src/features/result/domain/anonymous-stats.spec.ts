import { describe, expect, it } from 'vitest'
import { emptyAnswers } from '../../diagnosis/domain/types'
import { buildAnonymousStats } from './anonymous-stats'

describe('buildAnonymousStats', () => {
  it('keeps only aggregated variables and drops URL, narrative and evidence', () => {
    const stats = buildAnonymousStats(
      {
        ...emptyAnswers(),
        role: 'candidata',
        department: 'San Miguel',
        platforms: ['facebook', 'tiktok'],
        conducts: ['threats'],
        evidenceUrl: 'https://facebook.com/agresor',
        narrative: 'Me dijeron que sabían dónde vivo',
      },
      'red',
    )

    expect(stats).toEqual({
      department: 'San Miguel',
      role: 'candidata',
      platforms: ['facebook', 'tiktok'],
      conducts: ['threats'],
      light: 'red',
    })
  })

  it('reports unanswered optional fields as "sin-dato"', () => {
    const stats = buildAnonymousStats({ ...emptyAnswers(), platforms: ['x'], conducts: ['deepfake'] }, 'yellow')

    expect(stats.department).toBe('sin-dato')
    expect(stats.role).toBe('sin-dato')
  })
})
