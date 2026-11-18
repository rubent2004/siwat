import { computed, reactive, readonly, ref, watch } from 'vue'
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
import { createPinVault } from './infrastructure/pin-vault'
import { createSessionRepository } from './infrastructure/session-repository'

const sessionRepository = createSessionRepository(sessionStorage)
const pinVault = createPinVault(localStorage)

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

/** Pseudonym + PIN of the optional local space, kept in memory while the tab is open. */
let vaultCredentials: { pseudonym: string; pin: string } | null = null
const vaultActive = ref(false)
let vaultSaveTimer: ReturnType<typeof setTimeout> | undefined

function snapshot(): CaseSnapshot {
  return { answers: state.answers, evidence: state.evidence, caseCode: state.caseCode }
}

watch(
  () => [state.answers, state.evidence, state.caseCode],
  () => {
    if (!state.consentAccepted) return
    sessionRepository.save(snapshot())
    if (vaultCredentials) {
      clearTimeout(vaultSaveTimer)
      const { pseudonym, pin } = vaultCredentials
      const current = structuredClone(snapshot())
      vaultSaveTimer = setTimeout(() => void pinVault.save(pseudonym, pin, current), 600)
    }
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

async function createLocalSpace(pseudonym: string, pin: string) {
  await pinVault.save(pseudonym, pin, structuredClone(snapshot()))
  vaultCredentials = { pseudonym, pin }
  vaultActive.value = true
}

async function openLocalSpace(pseudonym: string, pin: string) {
  const opened = await pinVault.open(pseudonym, pin)
  Object.assign(state, opened, { consentAccepted: true })
  vaultCredentials = { pseudonym, pin }
  vaultActive.value = true
}

/**
 * «Limpiar datos de este dispositivo»: erases session, local space, in-memory files,
 * the language choice and the accessibility options.
 */
function clearDevice() {
  clearTimeout(vaultSaveTimer)
  sessionRepository.clear()
  pinVault.clear()
  evidenceFiles.clear()
  vaultCredentials = null
  vaultActive.value = false
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
    vaultActive: readonly(vaultActive),
    hasLocalSpace: () => pinVault.exists(),
    acceptConsent: () => {
      state.consentAccepted = true
      sessionRepository.save(snapshot())
    },
    updateAnswers,
    addEvidence,
    removeEvidence,
    evidenceFile,
    createLocalSpace,
    openLocalSpace,
    clearDevice,
  }
}
