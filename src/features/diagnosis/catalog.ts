import type { Conduct, Light, Platform } from './domain/types'

/**
 * Answer options. Their visible text lives in src/i18n/locales under the keys built below,
 * so every language (and the Spanish Bitácora PDF) reads it from one place.
 */
export const ROLES = [
  'alcaldesa-sindica-regidora',
  'diputada',
  'candidata',
  'militante',
  'lideresa-comunitaria',
  'activista-defensora',
  'otro',
] as const

/** Proper names: shown as they are in every language. */
export const DEPARTMENTS: string[] = [
  'Ahuachapán',
  'Cabañas',
  'Chalatenango',
  'Cuscatlán',
  'La Libertad',
  'La Paz',
  'La Unión',
  'Morazán',
  'San Miguel',
  'San Salvador',
  'San Vicente',
  'Santa Ana',
  'Sonsonate',
  'Usulután',
]

export const PLATFORMS: Platform[] = [
  'facebook',
  'whatsapp',
  'tiktok',
  'x',
  'instagram',
  'youtube',
  'telegram',
  'email',
  'other',
  // Always last: it unchecks the others (see togglePlatform).
  'prefer-not-to-say',
]

export const CONDUCTS: Conduct[] = [
  'threats',
  'sexist-insults',
  'doxing',
  'deepfake',
  'impersonation',
  'disinformation',
]

export const isRole = (value: string): value is (typeof ROLES)[number] =>
  (ROLES as readonly string[]).includes(value)

export const roleKey = (role: (typeof ROLES)[number]) => `catalog.roles.${role}`
export const platformKey = (platform: Platform) => `catalog.platforms.${platform}`
export const conductKey = (conduct: Conduct, part: 'label' | 'description') => `catalog.conducts.${conduct}.${part}`
export const lightKey = (light: Light, part: 'label' | 'title' | 'body') => `catalog.light.${light}.${part}`
