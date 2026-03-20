/**
 * BUILDER TEMPLATES & TYPES
 *
 * Configuration templates and validation for the no-code builder.
 */

// import {empleaidos} from '@/lib/data/empleaidos'

// ============================================
// TYPES
// ============================================

export interface EmpleaidoConfig {
  // Basic Info
  name: string
  tagline: string
  description: string
  emoji: string
  image_url?: string

  // Personality
  sephirot_id: SephirotId
  personality: {
    traits: string[]
    communication_style: 'formal' | 'casual' | 'friendly'
    humor_level: number // 0-1
    empathy_level: number // 0-1
  }

  // Skills
  skills: {
    native: string[]
    locked: Array<{ name: string; unlock_level: number }>
  }

  // Custom Fields (for user input)
  custom_fields?: CustomField[]

  // Pricing
  pricing: {
    adoption_fee: number
    monthly_subscription: number
  }

  // Additional
  is_public?: boolean
  category?: string
  tags?: string[]
}

export type SephirotId = 'netzach' | 'chesed' | 'hod' | 'binah' | 'yesod'

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea'
  options?: string[]
  required: boolean
  placeholder?: string
  default_value?: string | number | string[]
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

export const DEFAULT_CONFIG: EmpleaidoConfig = {
  name: '',
  tagline: '',
  description: '',
  emoji: '🤖',
  sephirot_id: 'netzach',
  personality: {
    traits: [],
    communication_style: 'friendly',
    humor_level: 0.5,
    empathy_level: 0.7,
  },
  skills: {
    native: [],
    locked: [],
  },
  custom_fields: [],
  pricing: {
    adoption_fee: 0,
    monthly_subscription: 9,
  },
  is_public: false,
  category: '',
  tags: [],
}

// ============================================
// SEPHIROT ARCHETYPES
// ============================================

export const SEPHIROT_ARCHETYPES = {
  netzach: {
    name: 'Netzach (Victoria)',
    description: 'Persistencia, determinación y superación. Ideal para tareas que requieren constancia.',
    keywords: ['perseverante', 'motivado', 'triunfador'],
    examples: ['SERA - Contabilidad'],
  },
  chesed: {
    name: 'Chesed (Bondad)',
    description: 'Abundancia, generosidad y creatividad. Perfecto para marketing y crecimiento.',
    keywords: ['generoso', 'creativo', 'abundante'],
    examples: ['KAEL - Marketing'],
  },
  hod: {
    name: 'Hod (Gloria)',
    description: 'Precisión, estructura y organización. Excelente para operaciones y gestión.',
    keywords: ['preciso', 'organizado', 'estructurado'],
    examples: ['NORA - Operaciones'],
  },
  binah: {
    name: 'Binah (Entendimiento)',
    description: 'Estrategia, análisis y visión a largo plazo. Ideal para planificación estratégica.',
    keywords: ['estratégico', 'analítico', 'visionario'],
    examples: ['LIOR - Estrategia'],
  },
  yesod: {
    name: 'Yesod (Fundación)',
    description: 'Balance, integración y armonía. Perfecto para productividad y bienestar.',
    keywords: ['equilibrado', 'integrador', 'armonioso'],
    examples: ['ZIV - Productividad'],
  },
}

// ============================================
// COMMUNICATION STYLES
// ============================================

export const COMMUNICATION_STYLES = {
  formal: {
    label: 'Formal',
    description: 'Profesional, estructurado y respetuoso',
    example: 'Buen día. Estoy a su disposición para asistirle.',
  },
  casual: {
    label: 'Casual',
    description: 'Relajado, directo y sin formalidades',
    example: '¡Epa! ¿Qué necesitas? Aquí estoy.',
  },
  friendly: {
    label: 'Amigable',
    description: 'Cercano, empático y cálido',
    example: '¡Hola! 👋 Soy tu amigo virtual. ¿En qué puedo ayudarte?',
  },
}

// ============================================
// SKILL TEMPLATES
// ============================================

export const SKILL_TEMPLATES = {
  contabilidad: ['Facturación', 'Gastos', 'Reportes', 'Impuestos DGII', 'Conciliación'],
  marketing: ['Redes Sociales', 'Email Marketing', 'SEO', 'Contenido', 'Campañas'],
  operaciones: ['Procesos', 'Gestión de Proyectos', 'Optimización', 'QA', 'Documentación'],
  estrategia: ['Análisis de Datos', 'Planificación', 'KPIs', 'Decisiones', 'Forecasting'],
  productividad: ['Gestión del Tiempo', 'Metas', 'Hábitos', 'Priorización', 'Focus'],
  general: ['Comunicación', 'Investigación', 'Análisis', 'Escritura', 'Organización'],
}

export const SKILL_CATEGORIES = Object.keys(SKILL_TEMPLATES)

// ============================================
// VALIDATION
// ============================================

export function validateConfig(config: EmpleaidoConfig): boolean {
  const errors = []

  if (!config.name || config.name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }

  if (!config.tagline || config.tagline.trim().length < 5) {
    errors.push('El eslogan debe tener al menos 5 caracteres')
  }

  if (!config.description || config.description.trim().length < 20) {
    errors.push('La descripción debe tener al menos 20 caracteres')
  }

  if (!config.personality.traits || config.personality.traits.length === 0) {
    errors.push('Selecciona al menos un rasgo de personalidad')
  }

  if (!config.skills.native || config.skills.native.length === 0) {
    errors.push('Añade al menos una habilidad nativa')
  }

  if (config.personality.humor_level < 0 || config.personality.humor_level > 1) {
    errors.push('El nivel de humor debe estar entre 0 y 1')
  }

  if (config.personality.empathy_level < 0 || config.personality.empathy_level > 1) {
    errors.push('El nivel de empatía debe estar entre 0 y 1')
  }

  if (errors.length > 0) {
    console.warn('Validation errors:', errors)
  }

  return errors.length === 0
}

// ============================================
// UTILITIES
// ============================================

/**
 * Generate a preview based on configuration
 */
export function generatePreview(config: EmpleaidoConfig): string {
  const style = COMMUNICATION_STYLES[config.personality.communication_style]

  return style.example.replace(
    'Soy tu',
    `Soy ${config.name || 'tu empleaido'}`
  )
}

/**
 * Get estimated pricing based on complexity
 */
export function estimatePricing(config: EmpleaidoConfig): {
  adoption_fee: number
  monthly_subscription: number
} {
  const skillCount = config.skills.native.length
  const hasCustomFields = config.custom_fields && config.custom_fields.length > 0

  let base = 9
  if (skillCount > 5) base += 5
  if (skillCount > 10) base += 10
  if (hasCustomFields) base += 5

  return {
    adoption_fee: 0,
    monthly_subscription: base,
  }
}

/**
 * Export config as JSON
 */
export function exportConfig(config: EmpleaidoConfig): string {
  return JSON.stringify(config, null, 2)
}

/**
 * Import config from JSON
 */
export function importConfig(json: string): EmpleaidoConfig | null {
  try {
    return JSON.parse(json) as EmpleaidoConfig
  } catch {
    return null
  }
}
