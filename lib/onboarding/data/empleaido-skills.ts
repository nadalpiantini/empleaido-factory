/**
 * Empleaido Skills Registry
 * Defines all available skills per empleaido
 */

export interface SkillDefinition {
  name: string;
  description: string;
  status: 'native' | 'locked';
  critical: boolean;
  inputSchema?: {
    required?: string[];
    properties?: Record<string, { type: string }>;
  };
}

export const empleaidoSkills: Record<string, Record<string, SkillDefinition>> = {
  sera: {
    parse_invoice: {
      name: 'parse_invoice',
      description: 'Extraer datos de facturas (PDF/imágenes)',
      status: 'native',
      critical: false,
      inputSchema: {
        required: ['file_url'],
        properties: {
          file_url: { type: 'string' },
        },
      },
    },
    calculate_itbis: {
      name: 'calculate_itbis',
      description: 'Calcular ITBIS mensual',
      status: 'native',
      critical: true, // Financial calculation
      inputSchema: {
        required: ['invoices'],
        properties: {
          invoices: { type: 'array' },
        },
      },
    },
    classify_ncf: {
      name: 'classify_ncf',
      description: 'Clasificar comprobantes fiscales NCF',
      status: 'native',
      critical: false,
      inputSchema: {
        required: ['ncf_string'],
        properties: {
          ncf_string: { type: 'string' },
        },
      },
    },
    dgii_alerts: {
      name: 'dgii_alerts',
      description: 'Alertas de vencimientos DGII',
      status: 'native',
      critical: true, // Compliance critical
      inputSchema: {
        required: ['rnc'],
        properties: {
          rnc: { type: 'string' },
        },
      },
    },
    // Locked skills (upgrade required)
    tax_planning: {
      name: 'tax_planning',
      description: 'Planeación fiscal estratégica',
      status: 'locked',
      critical: true,
    },
    isr_calculation: {
      name: 'isr_calculation',
      description: 'Cálculo de ISR anual',
      status: 'locked',
      critical: true,
    },
    dgii_representation: {
      name: 'dgii_representation',
      description: 'Representación ante DGII',
      status: 'locked',
      critical: true,
    },
  },

  kael: {
    create_content: {
      name: 'create_content',
      description: 'Crear contenido para redes sociales',
      status: 'native',
      critical: false,
    },
    content_calendar: {
      name: 'content_calendar',
      description: 'Generar calendar de posts',
      status: 'native',
      critical: false,
    },
    analytics_basic: {
      name: 'analytics_basic',
      description: 'Análisis de métricas básicas',
      status: 'native',
      critical: false,
    },
    // Locked skills
    brand_strategy: {
      name: 'brand_strategy',
      description: 'Estrategia de marca completa',
      status: 'locked',
      critical: true,
    },
    ad_campaigns: {
      name: 'ad_campaigns',
      description: 'Gestión de campañas publicitarias',
      status: 'locked',
      critical: true,
    },
  },

  nora: {
    customer_greeting: {
      name: 'customer_greeting',
      description: 'Respuestas de bienvenida',
      status: 'native',
      critical: false,
    },
    onboarding_flow: {
      name: 'onboarding_flow',
      description: 'Flujo de onboarding de clientes',
      status: 'native',
      critical: false,
    },
    retention_tips: {
      name: 'retention_tips',
      description: 'Consejos de retención',
      status: 'native',
      critical: false,
    },
    // Locked
    churn_analysis: {
      name: 'churn_analysis',
      description: 'Análisis de cancelaciones',
      status: 'locked',
      critical: true,
    },
  },

  lior: {
    process_optimization: {
      name: 'process_optimization',
      description: 'Optimización de procesos',
      status: 'native',
      critical: false,
    },
    inventory_tracking: {
      name: 'inventory_tracking',
      description: 'Seguimiento de inventario',
      status: 'native',
      critical: false,
    },
    workflow_automation: {
      name: 'workflow_automation',
      description: 'Automatización de flujos',
      status: 'native',
      critical: false,
    },
    // Locked
    supply_chain_strategy: {
      name: 'supply_chain_strategy',
      description: 'Estrategia de supply chain',
      status: 'locked',
      critical: true,
    },
  },

  ziv: {
    contract_review: {
      name: 'contract_review',
      description: 'Revisión básica de contratos',
      status: 'native',
      critical: true,
    },
    terms_template: {
      name: 'terms_template',
      description: 'Templates de términos y condiciones',
      status: 'native',
      critical: false,
    },
    compliance_checklist: {
      name: 'compliance_checklist',
      description: 'Checklist de cumplimiento normativo',
      status: 'native',
      critical: false,
    },
    // Locked
    legal_representation: {
      name: 'legal_representation',
      description: 'Representación legal',
      status: 'locked',
      critical: true,
    },
    complex_litigation: {
      name: 'complex_litigation',
      description: 'Litigios complejos',
      status: 'locked',
      critical: true,
    },
  },
};
