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

  it('never includes the free texts written for "Otra" platform or "Otro" role', () => {
    const stats = buildAnonymousStats(
      {
        ...emptyAnswers(),
        role: 'otro',
        otherRole: 'Concejal suplente de Apopa',
        platforms: ['other'],
        otherPlatform: 'Foro del partido',
        conducts: ['sexist-insults'],
      },
      'green',
    )

    expect(stats).toEqual({
      department: 'sin-dato',
      role: 'otro',
      platforms: ['other'],
      conducts: ['sexist-insults'],
      light: 'green',
    })
    expect(JSON.stringify(stats)).not.toMatch(/Apopa|Foro del partido/)
  })

  it('never includes the intimate-content answer', () => {
    const stats = buildAnonymousStats(
      { ...emptyAnswers(), platforms: ['whatsapp'], conducts: ['deepfake'], privateDataExposed: true, intimateContent: true },
      'red',
    )

    expect(stats).toEqual({
      department: 'sin-dato',
      role: 'sin-dato',
      platforms: ['whatsapp'],
      conducts: ['deepfake'],
      light: 'red',
    })
    expect(Object.keys(stats)).not.toContain('intimateContent')
  })
})
