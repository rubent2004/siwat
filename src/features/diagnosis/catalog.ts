import type { Conduct, Light, Platform } from './domain/types'

export interface Option<T extends string = string> {
  value: T
  label: string
}

export const ROLES: Option[] = [
  { value: 'alcaldesa-sindica-regidora', label: 'Alcaldesa/Síndica/Regidora' },
  { value: 'diputada', label: 'Diputada' },
  { value: 'candidata', label: 'Candidata' },
  { value: 'militante', label: 'Militante' },
  { value: 'lideresa-comunitaria', label: 'Lideresa comunitaria' },
  { value: 'activista-defensora', label: 'Activista/Defensora' },
  { value: 'otro', label: 'Otro' },
]

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

export const PLATFORMS: Option<Platform>[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'email', label: 'Correo' },
  { value: 'other', label: 'Otra' },
]

export const CONDUCTS: (Option<Conduct> & { description: string })[] = [
  { value: 'threats', label: 'Amenazas', description: 'Te dicen que te harán daño a ti o a tu familia.' },
  {
    value: 'sexist-insults',
    label: 'Insultos o burlas sexistas',
    description: 'Te humillan por ser mujer, tu cuerpo o vida privada.',
  },
  {
    value: 'doxing',
    label: 'Difusión de datos privados (Doxing)',
    description: 'Publicaron tu teléfono, dirección o fotos privadas sin permiso.',
  },
  {
    value: 'deepfake',
    label: 'Montajes o contenido falso (Deepfake)',
    description: 'Fotos, videos o audios alterados.',
  },
  {
    value: 'impersonation',
    label: 'Suplantación de identidad',
    description: 'Crearon una cuenta falsa haciéndose pasar por ti.',
  },
  {
    value: 'disinformation',
    label: 'Desinformación o ataque coordinado',
    description: 'Mentiras masivas o muchas cuentas atacándote para desacreditar tu labor política.',
  },
]

export const LIGHT_COPY: Record<Light, { label: string; title: string; body: string }> = {
  red: {
    label: 'Rojo',
    title: 'Semáforo rojo — Riesgo alto',
    body: 'Existen indicios graves contra tu integridad física, privacidad o delito informático. Requiere acción y resguardo inmediato.',
  },
  yellow: {
    label: 'Amarillo',
    title: 'Semáforo amarillo — Violencia política digital',
    body: 'Lo que vives busca desacreditar o limitar tu participación política. Documenta sistemáticamente y reporta.',
  },
  green: {
    label: 'Verde',
    title: 'Semáforo verde — Alerta preventiva',
    body: 'Manifestaciones iniciales de hostigamiento o violencia simbólica. No lo normalices; blinda tus cuentas y guarda registro.',
  },
}

export const labelOf = <T extends string>(options: Option<T>[], value: T) =>
  options.find((option) => option.value === value)?.label ?? value
