import type { InstitutionId, LegalReference, Light, RuleId } from './types'

export interface LegalRule {
  id: RuleId
  light: Light
  legalBasis: LegalReference[]
  institutions: InstitutionId[]
  reportOnPlatform: boolean
}

/**
 * Legal database and classification rules (spec v2.0, section 5).
 * Order matters: it is the order in which legal references are shown.
 */
export const LEGAL_RULES: Record<RuleId, LegalRule> = {
  'high-risk': {
    id: 'high-risk',
    light: 'red',
    legalBasis: [
      {
        law: 'LEIV Arts. 49 y 51',
        summary:
          'Prisión de 3 a 10 años por difundir o crear contenido íntimo/sexual sin consentimiento por medios electrónicos.',
      },
      {
        law: 'LEIV Art. 50',
        summary: 'Prisión de 1 a 3 años por publicar datos personales que dañen el honor o la intimidad.',
      },
      {
        law: 'LEIV Art. 55 lit. e',
        summary: 'Sanciona exponer a una mujer a riesgo inminente para su integridad física o emocional.',
      },
    ],
    institutions: ['pnc', 'fgr', 'isdemu'],
    reportOnPlatform: false,
  },
  identity: {
    id: 'identity',
    light: 'yellow',
    legalBasis: [
      {
        law: 'Ley Especial contra los Delitos Informáticos y Conexos (LEDIC Arts. 22 y 32)',
        summary: 'Sanciona la suplantación de identidad y el uso fraudulento de datos informáticos.',
      },
      {
        law: 'LEIV Art. 55 lit. c',
        summary: 'Sanciona desacreditar o degradar a las mujeres en espacios de participación política.',
      },
    ],
    institutions: ['fgr'],
    reportOnPlatform: true,
  },
  electoral: {
    id: 'electoral',
    light: 'yellow',
    legalBasis: [
      {
        law: 'LEIV Art. 55 lit. c y d',
        summary: 'Sanciona burlarse, desacreditar u obstaculizar la participación política de las mujeres.',
      },
      {
        law: 'Código Electoral (Arts. 173 y 249)',
        summary: 'Prohíbe la propaganda sucia o difamatoria.',
      },
      {
        law: 'Ley de Igualdad (LIE Arts. 20-23)',
        summary: 'Garantiza igualdad en el ejercicio de derechos políticos.',
      },
    ],
    institutions: ['tse', 'isdemu'],
    reportOnPlatform: false,
  },
  symbolic: {
    id: 'symbolic',
    light: 'green',
    legalBasis: [
      {
        law: 'LEIV Art. 9',
        summary: 'Reconoce la violencia psicológica, emocional y simbólica contra las mujeres.',
      },
      {
        law: 'LEIV Art. 55 lit. a',
        summary: 'Sanciona difundir mensajes que promuevan odio o menosprecio hacia las mujeres.',
      },
      {
        law: 'Convención Belém do Pará (Arts. 3 y 7)',
        summary: 'Derecho a una vida libre de violencia en lo público y político.',
      },
    ],
    institutions: ['isdemu'],
    reportOnPlatform: true,
  },
}
