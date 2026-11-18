import type { Conduct, DiagnosisAnswers, Light, Platform } from '../../diagnosis/domain/types'

/** The only variables that may ever be shared with the ANDRYSAS observatory (spec section 1). */
export interface AnonymousStats {
  department: string
  role: string
  platforms: Platform[]
  conducts: Conduct[]
  light: Light
}

const NO_DATA = 'sin-dato'

export function buildAnonymousStats(answers: DiagnosisAnswers, light: Light): AnonymousStats {
  return {
    department: answers.department || NO_DATA,
    role: answers.role || NO_DATA,
    platforms: [...answers.platforms],
    conducts: [...answers.conducts],
    light,
  }
}
