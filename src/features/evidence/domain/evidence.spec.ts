import { describe, expect, it } from 'vitest'
import { createCaseCode, createEvidenceRecord, EvidenceError, sha256Hex, validateEvidenceFiles } from './evidence'

describe('sha256Hex', () => {
  it('hashes bytes with SHA-256 as lowercase hex', async () => {
    const bytes = new TextEncoder().encode('abc')

    await expect(sha256Hex(bytes.buffer)).resolves.toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })
})

describe('createEvidenceRecord', () => {
  it('stores name, size, type, SHA-256 and the UTC timestamp of the upload', async () => {
    const file = new File(['abc'], 'captura.png', { type: 'image/png' })
    const now = new Date('2026-11-18T15:04:05.123Z')

    const record = await createEvidenceRecord(file, now)

    expect(record).toEqual({
      name: 'captura.png',
      size: 3,
      type: 'image/png',
      sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      hashedAtUtc: '2026-11-18T15:04:05.123Z',
    })
  })
})

describe('validateEvidenceFiles', () => {
  const png = (name: string) => new File(['x'], name, { type: 'image/png' })

  it('accepts JPG and PNG files up to the 3-image limit', () => {
    expect(() =>
      validateEvidenceFiles([png('a.png'), new File(['x'], 'b.jpg', { type: 'image/jpeg' })], 1),
    ).not.toThrow()
  })

  const errorOf = (run: () => void) => {
    try {
      run()
    } catch (error) {
      return error
    }
    throw new Error('expected validateEvidenceFiles to throw')
  }

  it('rejects more than 3 images in total', () => {
    const error = errorOf(() => validateEvidenceFiles([png('a.png'), png('b.png')], 2))

    expect(error).toBeInstanceOf(EvidenceError)
    expect(error).toMatchObject({ code: 'too-many-files', params: { max: 3 } })
  })

  it('rejects formats other than JPG or PNG', () => {
    const gif = new File(['x'], 'a.gif', { type: 'image/gif' })

    const error = errorOf(() => validateEvidenceFiles([gif], 0))

    expect(error).toBeInstanceOf(EvidenceError)
    expect(error).toMatchObject({ code: 'unsupported-format', params: { name: 'a.gif' } })
  })
})

describe('createCaseCode', () => {
  it('formats SIWAT-<year>-XXXX from 4 unambiguous characters', () => {
    const code = createCaseCode(new Date('2026-11-18T00:00:00Z'), () => new Uint8Array([0, 1, 2, 23]))

    expect(code).toBe('SIWAT-2026-ABCZ')
  })

  it('uses only characters that cannot be confused when read aloud', () => {
    const code = createCaseCode(new Date('2026-01-01T00:00:00Z'))

    expect(code).toMatch(/^SIWAT-2026-[A-HJ-NP-Z2-9]{4}$/)
  })
})
