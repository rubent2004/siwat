import type { InstitutionId, Platform } from '../diagnosis/domain/types'

export type ContactActionId = 'pnc-911' | 'fgr-web' | 'isdemu-126' | 'isdemu-web' | 'tse-web'

export interface ContactAction {
  /** Label key: `institutions.actions.<id>`. */
  id: ContactActionId
  href: string
  kind: 'call' | 'web'
}

export interface Institution {
  /** Official name, shown in Spanish in every language. Its purpose is `institutions.<id>`. */
  name: string
  actions: ContactAction[]
}

/** Official channels in El Salvador (audio request: results link straight to official platforms). */
export const INSTITUTIONS: Record<InstitutionId, Institution> = {
  pnc: {
    name: 'Policía Nacional Civil (PNC - 911)',
    actions: [{ id: 'pnc-911', href: 'tel:911', kind: 'call' }],
  },
  fgr: {
    name: 'Fiscalía General de la República (FGR)',
    actions: [{ id: 'fgr-web', href: 'https://www.fiscalia.gob.sv/', kind: 'web' }],
  },
  isdemu: {
    name: 'ISDEMU (Línea 126)',
    actions: [
      { id: 'isdemu-126', href: 'tel:126', kind: 'call' },
      { id: 'isdemu-web', href: 'https://126teorienta.gob.sv/dirservicios/', kind: 'web' },
    ],
  },
  tse: {
    name: 'Tribunal Supremo Electoral (TSE)',
    actions: [{ id: 'tse-web', href: 'https://www.tse.gob.sv/', kind: 'web' }],
  },
}

export const institutionPurposeKey = (id: InstitutionId) => `institutions.${id}`
export const actionLabelKey = (id: ContactActionId) => `institutions.actions.${id}`

/**
 * Where the «Reportar» option lives on each network: `reportLocation.<platform>`.
 * Generic until the ANDRYSAS manual text is supplied (assumption A3).
 */
export const reportLocationKey = (platform: Platform) => `reportLocation.${platform}`

/** Account protection measures: `shield.<id>.label` and `shield.<id>.detail`. */
export const SHIELD_MEASURES = ['two-step', 'hide-contact', 'sessions'] as const
