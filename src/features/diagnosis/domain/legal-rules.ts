import type { InstitutionId, LegalReference, Light, RuleId } from './types'

export interface LegalRule {
  id: RuleId
  light: Light
  legalBasis: LegalReference[]
  institutions: InstitutionId[]
  reportOnPlatform: boolean
}

/**
 * Legal database and classification rules (spec v2.0, section 5).
 * Order matters: it is the order in which legal references are shown.
 * Law names are official and stay in Spanish; each summary lives once per language
 * under `legal.<id>` in src/i18n/locales.
 */
export const LEGAL_RULES: Record<RuleId, LegalRule> = {
  'high-risk': {
    id: 'high-risk',
    light: 'red',
    legalBasis: [
      { id: 'leiv-49-51', law: 'LEIV Arts. 49 y 51' },
      { id: 'leiv-50', law: 'LEIV Art. 50' },
      { id: 'leiv-55-e', law: 'LEIV Art. 55 lit. e' },
    ],
    institutions: ['pnc', 'fgr', 'isdemu'],
    reportOnPlatform: false,
  },
  identity: {
    id: 'identity',
    light: 'yellow',
    legalBasis: [
      { id: 'ledic-22-32', law: 'Ley Especial contra los Delitos Informáticos y Conexos (LEDIC Arts. 22 y 32)' },
      { id: 'leiv-55-c', law: 'LEIV Art. 55 lit. c' },
    ],
    institutions: ['fgr'],
    reportOnPlatform: true,
  },
  electoral: {
    id: 'electoral',
    light: 'yellow',
    legalBasis: [
      { id: 'leiv-55-c-d', law: 'LEIV Art. 55 lit. c y d' },
      { id: 'electoral-code-173-249', law: 'Código Electoral (Arts. 173 y 249)' },
      { id: 'lie-20-23', law: 'Ley de Igualdad (LIE Arts. 20-23)' },
    ],
    institutions: ['tse', 'isdemu'],
    reportOnPlatform: false,
  },
  symbolic: {
    id: 'symbolic',
    light: 'green',
    legalBasis: [
      { id: 'leiv-9', law: 'LEIV Art. 9' },
      { id: 'leiv-55-a', law: 'LEIV Art. 55 lit. a' },
      { id: 'belem-do-para-3-7', law: 'Convención Belém do Pará (Arts. 3 y 7)' },
    ],
    institutions: ['isdemu'],
    reportOnPlatform: true,
  },
}
