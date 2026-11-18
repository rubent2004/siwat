export const MAX_EVIDENCE_FILES = 3
export const ACCEPTED_EVIDENCE_TYPES = ['image/jpeg', 'image/png'] as const

/** Integrity record of one screenshot. The image itself never leaves the device. */
export interface EvidenceRecord {
  name: string
  size: number
  type: string
  sha256: string
  hashedAtUtc: string
}

export class EvidenceError extends Error {
  override name = 'EvidenceError'
}

export async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function createEvidenceRecord(file: File, now = new Date()): Promise<EvidenceRecord> {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sha256: await sha256Hex(await file.arrayBuffer()),
    hashedAtUtc: now.toISOString(),
  }
}

export function validateEvidenceFiles(files: File[], alreadyStored: number): void {
  if (alreadyStored + files.length > MAX_EVIDENCE_FILES) {
    throw new EvidenceError(`Puedes subir un máximo ${MAX_EVIDENCE_FILES} capturas. Quita una para agregar otra.`)
  }
  const invalid = files.find((file) => !(ACCEPTED_EVIDENCE_TYPES as readonly string[]).includes(file.type))
  if (invalid) {
    throw new EvidenceError(`«${invalid.name}» no es una imagen JPG o PNG. Sube la captura original en uno de esos formatos.`)
  }
}

/** 32 characters without 0/O or 1/I, so the code can be dictated over the phone. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function createCaseCode(
  now = new Date(),
  randomBytes: (length: number) => Uint8Array = (length) => crypto.getRandomValues(new Uint8Array(length)),
): string {
  // 256 is a multiple of 32, so the modulo keeps the distribution uniform.
  const suffix = Array.from(randomBytes(4), (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('')
  return `SIWAT-${now.getUTCFullYear()}-${suffix}`
}
