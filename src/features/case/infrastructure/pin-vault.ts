import type { CaseSnapshot, KeyValueStorage } from '../domain/case-snapshot'

const VAULT_KEY = 'siwat:vault'
const DEFAULT_ITERATIONS = 310_000

interface StoredVault {
  v: 1
  salt: string
  iv: string
  data: string
}

export type PinVaultErrorCode = 'invalid-credentials' | 'not-found' | 'wrong-credentials'

/** Carries a stable code so the UI can show the message in the active language. */
export class PinVaultError extends Error {
  override name = 'PinVaultError'

  readonly code: PinVaultErrorCode

  constructor(code: PinVaultErrorCode) {
    super(code)
    this.code = code
  }
}

export interface PinVault {
  exists(): boolean
  save(pseudonym: string, pin: string, snapshot: CaseSnapshot): Promise<void>
  open(pseudonym: string, pin: string): Promise<CaseSnapshot>
  clear(): void
}

export const isValidPin = (pin: string) => /^\d{4}$/.test(pin)

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes))
const fromBase64 = (text: string) => Uint8Array.from(atob(text), (char) => char.charCodeAt(0))

/**
 * Optional local space protected by pseudonym + 4-digit PIN.
 * The snapshot is encrypted with AES-GCM using a PBKDF2-derived key; the pseudonym is never stored.
 * A 4-digit PIN deters casual access to a shared phone, it is not strong cryptography.
 */
export function createPinVault(
  storage: KeyValueStorage,
  { iterations = DEFAULT_ITERATIONS }: { iterations?: number } = {},
): PinVault {
  async function deriveKey(pseudonym: string, pin: string, salt: Uint8Array<ArrayBuffer>) {
    const secret = new TextEncoder().encode(`${pseudonym.trim().toLowerCase()}:${pin}`)
    const material = await crypto.subtle.importKey('raw', secret, 'PBKDF2', false, ['deriveKey'])
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    )
  }

  return {
    exists: () => storage.getItem(VAULT_KEY) !== null,

    async save(pseudonym, pin, snapshot) {
      if (!pseudonym.trim() || !isValidPin(pin)) {
        throw new PinVaultError('invalid-credentials')
      }
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(pseudonym, pin, salt)
      const plain = new TextEncoder().encode(JSON.stringify(snapshot))
      const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain))
      const stored: StoredVault = { v: 1, salt: toBase64(salt), iv: toBase64(iv), data: toBase64(cipher) }
      storage.setItem(VAULT_KEY, JSON.stringify(stored))
    },

    async open(pseudonym, pin) {
      const raw = storage.getItem(VAULT_KEY)
      if (!raw) throw new PinVaultError('not-found')
      try {
        const stored = JSON.parse(raw) as StoredVault
        const key = await deriveKey(pseudonym, pin, fromBase64(stored.salt))
        const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(stored.iv) }, key, fromBase64(stored.data))
        return JSON.parse(new TextDecoder().decode(plain)) as CaseSnapshot
      } catch {
        throw new PinVaultError('wrong-credentials')
      }
    },

    clear: () => storage.removeItem(VAULT_KEY),
  }
}
