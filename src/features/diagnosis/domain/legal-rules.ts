import type { Conduct, DiagnosisAnswers, InstitutionId, LegalReference, Light, RuleId } from './types'

/** A legal reference and when it applies, judged only from what she marked (never from the screenshots). */
export interface ApplicableReference {
  reference: LegalReference
  appliesTo: (answers: DiagnosisAnswers) => boolean
}

export interface LegalRule {
  id: RuleId
  light: Light
  /** Every rule keeps at least one reference that always applies, so a matched rule never cites nothing. */
  legalBasis: ApplicableReference[]
  institutions: InstitutionId[]
  reportOnPlatform: boolean
}

export const hasConduct = (answers: DiagnosisAnswers, conduct: Conduct) => answers.conducts.includes(conduct)

const always = () => true

const cite = (
  id: LegalReference['id'],
  law: string,
  appliesTo: ApplicableReference['appliesTo'] = always,
): ApplicableReference => ({ reference: { id, law }, appliesTo })

const dataExposed = (answers: DiagnosisAnswers) => hasConduct(answers, 'doxing') || answers.privateDataExposed === true

/** LEIV Art. 55 lit. c is shared by the identity rule and the symbolic fallback; it is listed once. */
const leiv55c = (appliesTo: ApplicableReference['appliesTo']) => cite('leiv-55-c', 'LEIV Art. 55 lit. c', appliesTo)

/**
 * Legal database and classification rules (spec v2.0, section 5), checked against the consolidated
 * official texts: LEIV (reforms to 2023, incl. D.L. 829/2021), LEDIC (to 2021), Código Electoral (to 2023),
 * Código Penal, LIE (2011) and the Belém do Pará Convention.
 * Order matters: it is the order in which legal references are shown.
 * A reference is shown only when its rule matched and it applies to the answers.
 * Law names are official and stay in Spanish; each summary lives once per language
 * under `legal.<id>` in src/i18n/locales.
 */
export const LEGAL_RULES: Record<RuleId, LegalRule> = {
  'high-risk': {
    id: 'high-risk',
    light: 'red',
    legalBasis: [
      cite('leiv-49-51', 'LEIV Arts. 49 y 51', (answers) => answers.intimateContent === true),
      cite('leiv-50', 'LEIV Art. 50', dataExposed),
      cite('ledic-24', 'Ley Especial contra los Delitos Informáticos y Conexos (LEDIC Art. 24)', dataExposed),
      cite(
        'cp-154-155',
        'Código Penal Arts. 154 y 155',
        (answers) => hasConduct(answers, 'threats') || answers.physicalThreat === true,
      ),
      cite('leiv-55-e', 'LEIV Art. 55 lit. e'),
    ],
    institutions: ['pnc', 'fgr', 'isdemu'],
    reportOnPlatform: false,
  },
  identity: {
    id: 'identity',
    light: 'yellow',
    legalBasis: [
      cite('ledic-22', 'Ley Especial contra los Delitos Informáticos y Conexos (LEDIC Art. 22)', (answers) =>
        hasConduct(answers, 'impersonation'),
      ),
      leiv55c((answers) => hasConduct(answers, 'impersonation') || hasConduct(answers, 'deepfake')),
    ],
    institutions: ['fgr'],
    reportOnPlatform: true,
  },
  electoral: {
    id: 'electoral',
    light: 'yellow',
    legalBasis: [
      cite('leiv-10-d', 'LEIV Art. 10 lit. d y Art. 10-A (D.L. 829/2021)'),
      cite('leiv-55-c-d', 'LEIV Art. 55 lit. c y d'),
      cite('electoral-code-173-249', 'Código Electoral (Arts. 173 y 249)'),
      cite('lie-20-23', 'Ley de Igualdad (LIE Arts. 20-23)'),
    ],
    institutions: ['tse', 'isdemu'],
    reportOnPlatform: false,
  },
  symbolic: {
    id: 'symbolic',
    light: 'green',
    legalBasis: [
      cite('leiv-9', 'LEIV Art. 9'),
      cite('leiv-55-a', 'LEIV Art. 55 lit. a', (answers) => hasConduct(answers, 'sexist-insults')),
      // Fallback for what no other rule caught, e.g. disinformation outside an electoral context.
      leiv55c((answers) => !hasConduct(answers, 'sexist-insults')),
      cite('belem-do-para-3-4j-7', 'Convención Belém do Pará (Arts. 3, 4 lit. j y 7)'),
    ],
    institutions: ['isdemu'],
    reportOnPlatform: true,
  },
}
