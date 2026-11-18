import type { jsPDF as JsPdf } from 'jspdf'
import { CONDUCTS, labelOf, LIGHT_COPY, PLATFORMS, ROLES } from '../diagnosis/catalog'
import type { DiagnosisAnswers, DiagnosisResult } from '../diagnosis/domain/types'
import { INSTITUTIONS } from '../result/route-catalog'
import type { EvidenceRecord } from './domain/evidence'

export interface BitacoraInput {
  caseCode: string
  generatedAt: Date
  answers: DiagnosisAnswers
  result: DiagnosisResult
  evidence: { record: EvidenceRecord; file?: File }[]
}

const PAGE = { width: 210, height: 297, margin: 18 }
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2
const PLUM: [number, number, number] = [56, 17, 59]
const LIGHT_RGB: Record<DiagnosisResult['light'], [number, number, number]> = {
  red: [230, 57, 70],
  yellow: [201, 154, 30],
  green: [42, 157, 143],
}

const DISCLAIMER =
  'Este documento es una bitácora personal de respaldo. SIWAT no interpone denuncias por ti ni sustituye los procesos legales ante la FGR o el TSE.'

const yesNo = (value: boolean | null) => (value === null ? 'Sin responder' : value ? 'Sí' : 'No')

/** Writes the evidence log as a PDF entirely in the browser. */
export async function createBitacoraPdf(input: BitacoraInput): Promise<Blob> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = PAGE.margin

  const ensureSpace = (height: number) => {
    if (y + height > PAGE.height - PAGE.margin - 10) {
      doc.addPage()
      y = PAGE.margin
    }
  }

  const text = (value: string, options: { size?: number; bold?: boolean; mono?: boolean; gap?: number } = {}) => {
    const size = options.size ?? 10
    doc.setFont(options.mono ? 'courier' : 'helvetica', options.bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(value, CONTENT_WIDTH) as string[]
    const lineHeight = size * 0.45
    for (const line of lines) {
      ensureSpace(lineHeight)
      doc.text(line, PAGE.margin, y)
      y += lineHeight
    }
    y += options.gap ?? 1.5
  }

  const heading = (value: string) => {
    ensureSpace(14)
    y += 3
    doc.setTextColor(...PLUM)
    text(value, { size: 12.5, bold: true, gap: 2 })
    doc.setTextColor(0, 0, 0)
  }

  const field = (label: string, value: string) => text(`${label}: ${value}`)

  const { answers, result } = input
  const copy = LIGHT_COPY[result.light]

  // Header band
  doc.setFillColor(...PLUM)
  doc.rect(0, 0, PAGE.width, 26, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('SIWAT · Bitácora de Evidencia', PAGE.margin, 16)
  doc.setTextColor(0, 0, 0)
  y = 36

  field('Código de caso', input.caseCode)
  field('Generado (UTC)', input.generatedAt.toISOString())

  // Verdict box: the light's colour, its name and its meaning.
  const boxTop = y + 2
  y = boxTop + 8
  doc.setTextColor(...LIGHT_RGB[result.light])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(copy.title.toUpperCase(), PAGE.margin + 4, y)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const verdictLines = doc.splitTextToSize(copy.body, CONTENT_WIDTH - 8) as string[]
  doc.text(verdictLines, PAGE.margin + 4, y + 6)
  y += 6 + verdictLines.length * 4.3
  doc.setDrawColor(...LIGHT_RGB[result.light])
  doc.setLineWidth(1.2)
  doc.rect(PAGE.margin, boxTop, CONTENT_WIDTH, y - boxTop)
  y += 7

  text(DISCLAIMER, { size: 9 })

  heading('1. Lo ocurrido')
  field('Plataformas', answers.platforms.map((platform) => labelOf(PLATFORMS, platform)).join(', '))
  field('Durante campaña o ejercicio de cargo público', yesNo(answers.electoralContext))
  field('Conductas', answers.conducts.map((conduct) => labelOf(CONDUCTS, conduct)).join('; '))
  field('Amenazas de daño físico, sexual o contra la familia', yesNo(answers.physicalThreat))
  field('Exposición de dirección, trabajo, teléfono o imágenes íntimas', yesNo(answers.privateDataExposed))
  if (answers.role) field('Espacio de participación', labelOf(ROLES, answers.role))
  if (answers.department) field('Departamento', answers.department)
  field('Relato', answers.narrative.trim() || 'No registrado')

  heading('2. Enlace de la publicación o perfil')
  text(answers.evidenceUrl || 'No registrado', { mono: !!answers.evidenceUrl })

  heading('3. Capturas y huella digital (SHA-256)')
  if (!input.evidence.length) text('No se adjuntaron capturas.')
  for (const [index, { record, file }] of input.evidence.entries()) {
    text(`Prueba ${index + 1}: ${record.name} (${record.type}, ${record.size} bytes)`, { bold: true, gap: 0.5 })
    text(`SHA-256: ${record.sha256}`, { mono: true, size: 8.5, gap: 0.5 })
    text(`Huella calculada (UTC): ${record.hashedAtUtc}`, { mono: true, size: 8.5 })
    if (file) await addImage(doc, file, (height) => {
      ensureSpace(height + 4)
      const top = y
      y += height + 4
      return top
    })
    else text('(La imagen se cargó en una sesión anterior y no está en memoria; conserva el archivo original.)', { size: 8.5 })
  }

  heading('4. Marco legal aplicable')
  for (const reference of result.legalBasis) {
    text(reference.law, { bold: true, gap: 0.5 })
    text(reference.summary)
  }

  heading('5. A dónde acudir')
  for (const id of result.institutions) {
    const institution = INSTITUTIONS[id]
    text(institution.name, { bold: true, gap: 0.5 })
    text(institution.actions.map((action) => `${action.label}: ${action.href.replace('tel:', 'Tel. ')}`).join(' · '))
  }

  heading('6. Cómo conservar tu prueba')
  text(
    'Conserva los archivos originales sin editar, recortar ni reenviar por aplicaciones que los compriman. ' +
      'La huella SHA-256 identifica cada imagen: si cambia un solo píxel, la huella será distinta. ' +
      'Para verificarla, calcula de nuevo el SHA-256 del archivo original (por ejemplo «sha256sum archivo.png» ' +
      'en Linux/macOS o «certutil -hashfile archivo.png SHA256» en Windows) y compárala con la de esta bitácora.',
  )

  const pages = doc.getNumberOfPages()
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(99, 80, 106)
    doc.text(`${input.caseCode} · Página ${page} de ${pages} · Bitácora personal de respaldo. SIWAT no interpone denuncias.`, PAGE.margin, PAGE.height - 10)
  }

  return doc.output('blob')
}

async function addImage(doc: JsPdf, file: File, place: (height: number) => number) {
  const bitmap = await createImageBitmap(file)
  const maxWidth = 80
  const maxHeight = 110
  const scale = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height)
  const width = bitmap.width * scale
  const height = bitmap.height * scale
  bitmap.close()
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
  const top = place(height)
  doc.addImage(dataUrl, file.type === 'image/png' ? 'PNG' : 'JPEG', PAGE.margin, top, width, height)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: filename })
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
