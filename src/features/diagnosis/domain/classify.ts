import { hasConduct, LEGAL_RULES, type LegalRule } from './legal-rules'
import type { DiagnosisAnswers, DiagnosisResult, InstitutionId, LegalReference, Light, RuleId } from './types'

const LIGHT_SEVERITY: Record<Light, number> = { green: 0, yellow: 1, red: 2 }

/** Institutions are listed from the most to the least urgent channel. */
const INSTITUTION_ORDER: InstitutionId[] = ['pnc', 'fgr', 'isdemu', 'tse']

/** P03 asks whether intimate or sexual images are involved only when something was exposed or altered. */
export function asksIntimateContent(answers: DiagnosisAnswers): boolean {
  return answers.privateDataExposed === true || hasConduct(answers, 'deepfake')
}

function matchRules(answers: DiagnosisAnswers): RuleId[] {
  const has = (conduct: DiagnosisAnswers['conducts'][number]) => hasConduct(answers, conduct)
  const rules: RuleId[] = []

  if (
    answers.physicalThreat ||
    answers.privateDataExposed ||
    answers.intimateContent === true ||
    has('threats') ||
    has('doxing')
  ) {
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

/** The references of the matched rules that apply to the answers, each id once, in its first position. */
function applicableLegalBasis(rules: LegalRule[], answers: DiagnosisAnswers): LegalReference[] {
  const basis = new Map<LegalReference['id'], LegalReference>()
  for (const { reference, appliesTo } of rules.flatMap((rule) => rule.legalBasis)) {
    if (!basis.has(reference.id) && appliesTo(answers)) basis.set(reference.id, reference)
  }
  return [...basis.values()]
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
    legalBasis: applicableLegalBasis(rules, answers),
    institutions: INSTITUTION_ORDER.filter((id) => institutions.has(id)),
    reportOnPlatform: rules.some((rule) => rule.reportOnPlatform),
  }
}
