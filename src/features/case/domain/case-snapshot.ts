import { emptyAnswers, type DiagnosisAnswers } from '../../diagnosis/domain/types'
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

/**
 * Fills answers added after a snapshot was stored (e.g. the «Otra»/«Otro» free texts),
 * so cases saved by an earlier version keep loading.
 */
export function withCurrentAnswers(snapshot: CaseSnapshot): CaseSnapshot {
  return { ...snapshot, answers: { ...emptyAnswers(), ...snapshot.answers } }
}

/**
 * Plain, detached copy of a snapshot. Vue's reactive state is a Proxy, which structuredClone
 * and Web Crypto callers cannot clone; every value in a snapshot is JSON-safe, so a JSON round trip
 * gives an independent copy.
 */
export function toPlainSnapshot(snapshot: CaseSnapshot): CaseSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as CaseSnapshot
}
