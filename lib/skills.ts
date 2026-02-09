/**
 * SKILL CATALOG
 *
 * Organized by domain. Each skill maps to OpenClaw capabilities.
 * Skills can be native (included) or locked (unlockable).
 */

export const SKILL_GROUPS = {
  // SERA domain
  contabilidad: [
    'ocr_facturas',
    'itbis_mensual',
    'clasificacion_ncf',
    'alertas_dgii',
    'isr_anual',
    'planeacion_fiscal',
    'conciliacion_bancaria',
    'reportes_fiscales',
  ],

  // KAEL domain
  growth: [
    'plan_contenido',
    'publicacion_rrss',
    'metricas_basicas',
    'ads_automation',
    'funnels',
    'email_marketing',
    'seo_basico',
    'analytics_avanzado',
  ],

  // NORA domain
  operaciones: [
    'organizacion_docs',
    'checklists',
    'recordatorios',
    'automatizaciones',
    'integraciones',
    'workflows',
    'reportes_operativos',
    'gestion_tareas',
  ],

  // LIOR domain
  finanzas: [
    'flujo_caja',
    'proyecciones',
    'alertas_financieras',
    'valuaciones',
    'mna',
    'presupuestos',
    'kpis_financieros',
    'analisis_costos',
  ],

  // ZIV domain
  productividad: [
    'agenda',
    'recordatorios',
    'priorizacion',
    'delegacion',
    'automatizacion_avanzada',
    'time_blocking',
    'focus_mode',
    'revision_semanal',
  ],

  // UXA domain
  ux: [
    'problem_reframing',
    'mental_model_alignment',
    'information_architecture',
    'actions_affordances',
    'system_states',
    'critical_decisions',
    'ux_specification',
    'antifragile_build_order',
  ],
} as const;

export type SkillDomain = keyof typeof SKILL_GROUPS;
export type Skill = (typeof SKILL_GROUPS)[SkillDomain][number];

/**
 * Human-readable skill names
 */
export const SKILL_LABELS: Record<string, string> = {
  // Contabilidad
  ocr_facturas: 'OCR de Facturas',
  itbis_mensual: 'ITBIS Mensual',
  clasificacion_ncf: 'Clasificacion NCF',
  alertas_dgii: 'Alertas DGII',
  isr_anual: 'ISR Anual',
  planeacion_fiscal: 'Planeacion Fiscal',
  conciliacion_bancaria: 'Conciliacion Bancaria',
  reportes_fiscales: 'Reportes Fiscales',

  // Growth
  plan_contenido: 'Plan de Contenido',
  publicacion_rrss: 'Publicacion RRSS',
  metricas_basicas: 'Metricas Basicas',
  ads_automation: 'Automatizacion de Ads',
  funnels: 'Funnels de Conversion',
  email_marketing: 'Email Marketing',
  seo_basico: 'SEO Basico',
  analytics_avanzado: 'Analytics Avanzado',

  // Operaciones
  organizacion_docs: 'Organizacion de Documentos',
  checklists: 'Checklists',
  recordatorios: 'Recordatorios',
  automatizaciones: 'Automatizaciones',
  integraciones: 'Integraciones',
  workflows: 'Workflows',
  reportes_operativos: 'Reportes Operativos',
  gestion_tareas: 'Gestion de Tareas',

  // Finanzas
  flujo_caja: 'Flujo de Caja',
  proyecciones: 'Proyecciones',
  alertas_financieras: 'Alertas Financieras',
  valuaciones: 'Valuaciones',
  mna: 'M&A',
  presupuestos: 'Presupuestos',
  kpis_financieros: 'KPIs Financieros',
  analisis_costos: 'Analisis de Costos',

  // Productividad
  agenda: 'Agenda',
  priorizacion: 'Priorizacion',
  delegacion: 'Delegacion',
  automatizacion_avanzada: 'Automatizacion Avanzada',
  time_blocking: 'Time Blocking',
  focus_mode: 'Modo Foco',
  revision_semanal: 'Revision Semanal',

  // UX
  problem_reframing: 'Reenmarcado del Problema',
  mental_model_alignment: 'Alineacion de Modelo Mental',
  information_architecture: 'Arquitectura de Informacion',
  actions_affordances: 'Acciones y Affordances',
  system_states: 'Estados del Sistema',
  critical_decisions: 'Decisiones Criticas UX',
  ux_specification: 'Especificacion UX',
  antifragile_build_order: 'Orden de Construccion Antifragil',
};

/**
 * Get all skills for a domain
 */
export function getSkillsByDomain(domain: SkillDomain): readonly string[] {
  return SKILL_GROUPS[domain];
}

/**
 * Get human-readable label for a skill
 */
export function getSkillLabel(skill: string): string {
  return SKILL_LABELS[skill] || skill;
}

/**
 * Check if a skill exists in any domain
 */
export function isValidSkill(skill: string): boolean {
  return Object.values(SKILL_GROUPS).some(group =>
    (group as readonly string[]).includes(skill)
  );
}
