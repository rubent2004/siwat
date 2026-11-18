import { LEGAL_RULES } from './legal-rules'
import type { DiagnosisAnswers, DiagnosisResult, InstitutionId, Light, RuleId } from './types'

const LIGHT_SEVERITY: Record<Light, number> = { green: 0, yellow: 1, red: 2 }

/** Institutions are listed from the most to the least urgent channel. */
const INSTITUTION_ORDER: InstitutionId[] = ['pnc', 'fgr', 'isdemu', 'tse']

function matchRules(answers: DiagnosisAnswers): RuleId[] {
  const has = (conduct: DiagnosisAnswers['conducts'][number]) => answers.conducts.includes(conduct)
  const rules: RuleId[] = []

  if (answers.physicalThreat || answers.privateDataExposed || has('threats') || has('doxing')) {
    rules.push('high-risk')
  }
  if (has('impersonation') || has('deepfake')) {
    rules.push('identity')
  }
  if (answers.electoralContext && has('disinformation')) {
    rules.push('electoral')
  }
  // Symbolic violence is the preventive baseline: it also covers anything no other rule caught.
  if (has('sexist-insults') || rules.length === 0) {
    rules.push('symbolic')
  }
  return rules
}

/** Classification engine: crosses the answers with the legal database (spec section 5). */
export function classify(answers: DiagnosisAnswers): DiagnosisResult {
  const rules = matchRules(answers).map((id) => LEGAL_RULES[id])

  const light = rules.reduce<Light>(
    (worst, rule) => (LIGHT_SEVERITY[rule.light] > LIGHT_SEVERITY[worst] ? rule.light : worst),
    'green',
  )

  const institutions = new Set(rules.flatMap((rule) => rule.institutions))
  if (answers.electoralContext) institutions.add('tse')

  return {
    light,
    rules: rules.map((rule) => rule.id),
    legalBasis: rules.flatMap((rule) => rule.legalBasis),
    institutions: INSTITUTION_ORDER.filter((id) => institutions.has(id)),
    reportOnPlatform: rules.some((rule) => rule.reportOnPlatform),
  }
}
