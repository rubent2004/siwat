import { computed, reactive, watch } from 'vue'
import { resetLocale } from '../../i18n'
import { resetAccessibility } from '../accessibility/use-accessibility'
import { asksIntimateContent, classify } from '../diagnosis/domain/classify'
import { emptyAnswers, type DiagnosisAnswers } from '../diagnosis/domain/types'
import {
  createCaseCode,
  createEvidenceRecord,
  validateEvidenceFiles,
  type EvidenceRecord,
} from '../evidence/domain/evidence'
import type { CaseSnapshot } from './domain/case-snapshot'
import { createSessionRepository } from './infrastructure/session-repository'

const sessionRepository = createSessionRepository(sessionStorage)

interface CaseState extends CaseSnapshot {
  consentAccepted: boolean
}

function freshState(): CaseState {
  return { answers: emptyAnswers(), evidence: [], caseCode: createCaseCode(), consentAccepted: false }
}

const restored = sessionRepository.load()
const state = reactive<CaseState>(restored ? { ...restored, consentAccepted: true } : freshState())

/** Original screenshots stay in memory only (keyed by SHA-256); they are needed for the PDF. */
const evidenceFiles = new Map<string, File>()


function snapshot(): CaseSnapshot {
  return { answers: state.answers, evidence: state.evidence, caseCode: state.caseCode }
}

watch(
  () => [state.answers, state.evidence, state.caseCode],
  () => {
    if (!state.consentAccepted) return
    sessionRepository.save(snapshot())
  },
  { deep: true },
)

// The intimate-content follow-up only exists while it is asked: hiding it (on P02 or P03) clears it.
watch(
  () => asksIntimateContent(state.answers),
  (asked) => {
    if (!asked) state.answers.intimateContent = null
  },
)

const result = computed(() => classify(state.answers))

const step1Complete = computed(
  () => state.answers.platforms.length > 0 && state.answers.electoralContext !== null && state.answers.conducts.length > 0,
)

const step2Complete = computed(
  () =>
    step1Complete.value &&
    state.answers.physicalThreat !== null &&
    state.answers.privateDataExposed !== null &&
    (!asksIntimateContent(state.answers) || state.answers.intimateContent !== null),
)

function updateAnswers(patch: Partial<DiagnosisAnswers>) {
  Object.assign(state.answers, patch)
}

async function addEvidence(files: File[]): Promise<void> {
  const fresh = files.filter((file) => ![...evidenceFiles.values()].some((known) => known === file))
  validateEvidenceFiles(fresh, state.evidence.length)
  for (const file of fresh) {
    const record = await createEvidenceRecord(file)
    if (state.evidence.some((existing) => existing.sha256 === record.sha256)) continue
    evidenceFiles.set(record.sha256, file)
    state.evidence.push(record)
  }
}

function removeEvidence(sha256: string) {
  evidenceFiles.delete(sha256)
  state.evidence = state.evidence.filter((record) => record.sha256 !== sha256)
}

function evidenceFile(record: EvidenceRecord): File | undefined {
  return evidenceFiles.get(record.sha256)
}

/** Key of the PIN-protected local space that earlier versions stored in localStorage. */
const LEGACY_VAULT_KEY = 'siwat:vault'

/**
 * «Limpiar datos de este dispositivo»: erases the session, in-memory files,
 * the language choice and the accessibility options, plus any local space left by an earlier version.
 */
function clearDevice() {
  sessionRepository.clear()
  localStorage.removeItem(LEGACY_VAULT_KEY)
  evidenceFiles.clear()
  Object.assign(state, freshState())
  resetLocale()
  resetAccessibility()
}

export function useCase() {
  return {
    state,
    result,
    step1Complete,
    step2Complete,
    acceptConsent: () => {
      state.consentAccepted = true
      sessionRepository.save(snapshot())
    },
    updateAnswers,
    addEvidence,
    removeEvidence,
    evidenceFile,
    clearDevice,
  }
}
