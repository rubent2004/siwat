import type { DiagnosisAnswers } from '../../diagnosis/domain/types'
import type { EvidenceRecord } from '../../evidence/domain/evidence'

/** Everything SIWAT keeps about a case. Screenshots are stored only as integrity records. */
export interface CaseSnapshot {
  answers: DiagnosisAnswers
  evidence: EvidenceRecord[]
  caseCode: string
}

/** Port: where a case snapshot lives on this device. */
export interface CaseRepository {
  load(): CaseSnapshot | null
  save(snapshot: CaseSnapshot): void
  clear(): void
}

export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
