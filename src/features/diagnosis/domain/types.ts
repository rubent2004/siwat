export type Platform =
  | 'facebook'
  | 'whatsapp'
  | 'tiktok'
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'telegram'
  | 'email'
  | 'other'

export type Conduct =
  | 'threats'
  | 'sexist-insults'
  | 'doxing'
  | 'deepfake'
  | 'impersonation'
  | 'disinformation'

/** Traffic-light result, ordered from lowest to highest severity. */
export type Light = 'green' | 'yellow' | 'red'

export type InstitutionId = 'pnc' | 'fgr' | 'isdemu' | 'tse'

export type RuleId = 'high-risk' | 'identity' | 'electoral' | 'symbolic'

export interface DiagnosisAnswers {
  role: string
  department: string
  platforms: Platform[]
  electoralContext: boolean | null
  conducts: Conduct[]
  physicalThreat: boolean | null
  privateDataExposed: boolean | null
  evidenceUrl: string
  narrative: string
}

export interface LegalReference {
  law: string
  summary: string
}

export interface DiagnosisResult {
  light: Light
  rules: RuleId[]
  legalBasis: LegalReference[]
  institutions: InstitutionId[]
  /** Whether reporting on the social platform itself is recommended. */
  reportOnPlatform: boolean
}

export const NARRATIVE_MAX_LENGTH = 500

export function emptyAnswers(): DiagnosisAnswers {
  return {
    role: '',
    department: '',
    platforms: [],
    electoralContext: null,
    conducts: [],
    physicalThreat: null,
    privateDataExposed: null,
    evidenceUrl: '',
    narrative: '',
  }
}
