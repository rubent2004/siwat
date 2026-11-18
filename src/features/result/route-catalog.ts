import type { InstitutionId, Platform } from '../diagnosis/domain/types'

export interface ContactAction {
  label: string
  href: string
  kind: 'call' | 'web'
}

export interface Institution {
  name: string
  purpose: string
  actions: ContactAction[]
}

/** Official channels in El Salvador (audio request: results link straight to official platforms). */
export const INSTITUTIONS: Record<InstitutionId, Institution> = {
  pnc: {
    name: 'Policía Nacional Civil (PNC - 911)',
    purpose: 'Emergencias y riesgo para tu integridad física o la de tu familia.',
    actions: [{ label: 'Llamar a emergencia (PNC 911)', href: 'tel:911', kind: 'call' }],
  },
  fgr: {
    name: 'Fiscalía General de la República (FGR)',
    purpose: 'Investigación de amenazas, doxing y suplantación de identidad.',
    actions: [{ label: 'Consultar canales de atención FGR', href: 'https://www.fiscalia.gob.sv/', kind: 'web' }],
  },
  isdemu: {
    name: 'ISDEMU (Línea 126)',
    purpose: 'Orientación gratuita para mujeres que enfrentan violencia.',
    actions: [
      { label: 'Contactar orientación gratuita (ISDEMU 126)', href: 'tel:126', kind: 'call' },
      { label: 'Abrir 126 Te Orienta', href: 'https://126teorienta.gob.sv/dirservicios/', kind: 'web' },
    ],
  },
  tse: {
    name: 'Tribunal Supremo Electoral (TSE)',
    purpose: 'Violencia política durante una campaña electoral o en el ejercicio de un cargo.',
    actions: [{ label: 'Reportar violencia política (TSE)', href: 'https://www.tse.gob.sv/', kind: 'web' }],
  },
}

/**
 * Where the «Reportar» option lives on each network.
 * Generic until the ANDRYSAS manual text is supplied (assumption A3).
 */
export const REPORT_LOCATION: Record<Platform, string> = {
  facebook: 'Toca los tres puntos (…) de la publicación o del perfil y elige «Reportar». Selecciona el motivo: acoso, suplantación o desnudos.',
  whatsapp: 'Abre el chat, toca el nombre del contacto o del grupo y elige «Reportar».',
  tiktok: 'Mantén presionado el video o toca «Compartir» y elige «Reportar». En un perfil, usa los tres puntos.',
  x: 'Toca los tres puntos (…) de la publicación o del perfil y elige «Reportar».',
  instagram: 'Toca los tres puntos (…) de la publicación, historia o perfil y elige «Reportar».',
  youtube: 'Toca los tres puntos (⋮) del video o comentario y elige «Denunciar».',
  telegram: 'Abre el perfil, canal o mensaje, toca los tres puntos y elige «Reportar».',
  email: 'No borres el correo: guárdalo completo («Descargar mensaje» o «Mostrar original») y márcalo como spam o phishing.',
  other: 'Busca la opción «Reportar» o «Denunciar» junto a la publicación o en el perfil de quien te agrede.',
}

export const SHIELD_MEASURES = [
  { id: 'two-step', label: 'Activa la verificación en 2 pasos', detail: 'En la configuración de seguridad de cada red. Así nadie entra aunque tenga tu contraseña.' },
  { id: 'hide-contact', label: 'Oculta tu teléfono y correo', detail: 'Que solo tú los veas en tu perfil público.' },
  { id: 'sessions', label: 'Revisa las sesiones abiertas', detail: 'Cierra las que no reconozcas y cambia tu contraseña si ves alguna extraña.' },
] as const
