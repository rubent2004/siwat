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

/** Stable id of one legal reference; its summary is looked up by this id in each language. */
export type LegalReferenceId =
  | 'leiv-49-51'
  | 'leiv-50'
  | 'leiv-55-e'
  | 'ledic-22-32'
  | 'leiv-55-c'
  | 'leiv-55-c-d'
  | 'electoral-code-173-249'
  | 'lie-20-23'
  | 'leiv-9'
  | 'leiv-55-a'
  | 'belem-do-para-3-7'

export interface LegalReference {
  id: LegalReferenceId
  /** Official name of the law, always in Spanish. */
  law: string
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
