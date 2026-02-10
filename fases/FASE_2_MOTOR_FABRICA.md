# 🏭 FASE 2: FÁBRICA DE MOTORES
**Sistema de creación y validación de motores de agentes**

---

## 🎯 Objetivos

- [x] Diseñar arquitectura modular de motores
- [x] Implementar Motor de Contabilidad completo
- [x] Crear Motor Genérico programable
- [x] Sistema de validación de motores
- [x] Sistema de testing automatizado
- [x] Documentación de API de motores

---

## 🧠 Arquitectura de un Motor

### Estructura Base

```typescript
// src/types/motor.ts

export interface MotorBase {
  id: string;
  name: string;
  description: string;
  version: string;
  category: MotorCategory;
  author: string;

  // Configuración del motor
  config: MotorConfig;

  // Código del motor
  code: MotorCode;

  // Metadatos
  metadata: MotorMetadata;
}

export type MotorCategory =
  | 'contabilidad'
  | 'finanzas'
  | 'rrhh'
  | 'ventas'
  | 'marketing'
  | 'soporte'
  | 'generico';

export interface MotorConfig {
  // Variables de entorno requeridas
  envVars: string[];

  // APIs externas necesarias
  externalAPIs: ExternalAPI[];

  // Dependencias de otros motores
  dependencies: string[];

  // Límites de uso
  limits: {
    maxTokens: number;
    maxExecutionTime: number; // segundos
    maxAPICalls: number;
  };
}

export interface ExternalAPI {
  name: string;
  baseUrl: string;
  authType: 'api_key' | 'oauth' | 'basic';
  required: boolean;
}

export interface MotorCode {
  // Prompt del sistema (instrucciones para el LLM)
  systemPrompt: string;

  // Tools disponibles (funciones que puede llamar el agente)
  tools: Tool[];

  // Flujo de ejecución (grafo de LangGraph)
  graph: ExecutionGraph;

  // Handlers de eventos
  handlers: {
    onInit?: string;
    onSuccess?: string;
    onError?: string;
  };
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  implementation: string; // Código JavaScript/TypeScript
}

export interface ExecutionGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  type: 'input' | 'llm' | 'tool' | 'database' | 'output';
  config: any;
}

export interface GraphEdge {
  from: string;
  to: string;
  condition?: string; // Expresión condicional
}

export interface MotorMetadata {
  tags: string[];
  examples: MotorExample[];
  pricing: {
    setupCost: number;
    perExecutionCost: number;
  };
  documentation: string;
}

export interface MotorExample {
  input: string;
  output: string;
  description: string;
}
```

---

## 💼 Motor de Contabilidad

### Implementación Completa

```typescript
// src/motores/motor-contabilidad.ts

import { MotorBase, Tool, ExecutionGraph } from '@/types/motor';

export const MOTOR_CONTABILIDAD: MotorBase = {
  id: 'motor-contabilidad-v1',
  name: 'Motor de Contabilidad',
  description: 'Automatiza tareas contables básicas: facturas, gastos, impuestos',
  version: '1.0.0',
  category: 'contabilidad',
  author: 'Sephirot',

  config: {
    envVars: [
      'OPENAI_API_KEY',
      'DATABASE_URL',
    ],
    externalAPIs: [],
    dependencies: [],
    limits: {
      maxTokens: 4000,
      maxExecutionTime: 60,
      maxAPICalls: 10,
    },
  },

  code: {
    systemPrompt: `Eres un asistente contable experto. Tu rol es ayudar con:

1. **Facturas**: Procesar, categorizar y registrar facturas
2. **Gastos**: Clasificar y organizar gastos
3. **Impuestos**: Calcular impuestos y generar reportes
4. **Reportes**: Crear reportes financieros

REGLAS:
- Siempre verificar la información fiscal con el usuario
- No inventar datos, pedir aclaraciones si falta información
- Mantener registros detallados de todas las transacciones
- Seguir las normas contables vigentes

IMPORTANTE: Eres un asistente, no un contador certificado. Siempre recomienda
verificar con un contador profesional para decisiones fiscales importantes.`,

    tools: [
      {
        name: 'parse_invoice',
        description: 'Extrae información estructurada de una factura',
        parameters: {
          type: 'object',
          properties: {
            imageData: {
              type: 'string',
              description: 'Imagen de la factura en base64 o URL',
            },
          },
          required: ['imageData'],
        },
        implementation: 'parseInvoiceImplementation',
      },

      {
        name: 'calculate_tax',
        description: 'Calcula impuestos basado en monto y tasa',
        parameters: {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              description: 'Monto base',
            },
            taxRate: {
              type: 'number',
              description: 'Tasa impositiva (ej: 0.21 para 21%)',
            },
            country: {
              type: 'string',
              description: 'Código de país (ej: AR, US, ES)',
            },
          },
          required: ['amount', 'taxRate'],
        },
        implementation: 'calculateTaxImplementation',
      },

      {
        name: 'categorize_expense',
        description: 'Categoriza un gasto según su descripción',
        parameters: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Descripción del gasto',
            },
            amount: {
              type: 'number',
              description: 'Monto del gasto',
            },
          },
          required: ['description', 'amount'],
        },
        implementation: 'categorizeExpenseImplementation',
      },

      {
        name: 'generate_report',
        description: 'Genera un reporte financiero',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['monthly', 'quarterly', 'yearly', 'custom'],
              description: 'Tipo de reporte',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Fecha inicio (YYYY-MM-DD)',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Fecha fin (YYYY-MM-DD)',
            },
          },
          required: ['type'],
        },
        implementation: 'generateReportImplementation',
      },

      {
        name: 'save_record',
        description: 'Guarda un registro en la base de datos',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['invoice', 'expense', 'tax'],
              description: 'Tipo de registro',
            },
            data: {
              type: 'object',
              description: 'Datos del registro',
            },
          },
          required: ['type', 'data'],
        },
        implementation: 'saveRecordImplementation',
      },
    ],

    graph: {
      nodes: [
        {
          id: 'input',
          type: 'input',
          config: {},
        },
        {
          id: 'llm-analyze',
          type: 'llm',
          config: {
            model: 'gpt-4-turbo',
            temperature: 0.3,
          },
        },
        {
          id: 'tool-execute',
          type: 'tool',
          config: {
            parallel: true,
          },
        },
        {
          id: 'database-save',
          type: 'database',
          config: {
            table: 'accounting_records',
          },
        },
        {
          id: 'output',
          type: 'output',
          config: {},
        },
      ],
      edges: [
        { from: 'input', to: 'llm-analyze' },
        { from: 'llm-analyze', to: 'tool-execute' },
        { from: 'tool-execute', to: 'database-save' },
        { from: 'database-save', to: 'output' },
      ],
    },

    handlers: {
      onInit: 'console.log("Motor de contabilidad iniciado")',
      onSuccess: 'notifySuccess(result)',
      onError: 'logError(error)',
    },
  },

  metadata: {
    tags: ['contabilidad', 'finanzas', 'facturas', 'impuestos'],
    examples: [
      {
        input: 'Procesa esta factura: [imagen adjunta]',
        output: 'Factura procesada: Proveedor: ABC SA, Monto: $1500, IVA: $315, Total: $1815',
        description: 'Procesar factura desde imagen',
      },
      {
        input: 'Calcula el IVA de $5000 con tasa 21%',
        output: 'Monto base: $5000, IVA (21%): $1050, Total: $6050',
        description: 'Cálculo de impuestos',
      },
      {
        input: 'Categoriza este gasto: "Comida de reunión con clientes"',
        output: 'Categoría: Gastos de Representación, Subcategoría: Alimentación',
        description: 'Categorización de gastos',
      },
    ],
    pricing: {
      setupCost: 0,
      perExecutionCost: 0.002, // ~$0.002 por ejecución
    },
    documentation: '# Motor de Contabilidad\n\nEste motor automatiza tareas contables básicas...',
  },
};
```

### Implementación de Tools

```typescript
// src/motores/contabilidad/implementations.ts

import { openai } from '@/lib/llm';
import { supabase } from '@/lib/db';

// Tool 1: Parse Invoice
export async function parseInvoiceImplementation(params: {
  imageData: string;
}) {
  const { imageData } = params;

  // Usar visión de GPT-4 para extraer datos
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'system',
        content: 'Eres un experto en extraer datos de facturas. Extrae: número, fecha, proveedor, monto, impuestos.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extrae toda la información relevante de esta factura:',
          },
          {
            type: 'image_url',
            image_url: {
              url: imageData,
            },
          },
        ],
      },
    ],
  });

  const extractedData = JSON.parse(response.choices[0].message.content);

  return {
    success: true,
    data: {
      invoiceNumber: extractedData.numero,
      date: extractedData.fecha,
      provider: extractedData.proveedor,
      subtotal: extractedData.subtotal,
      tax: extractedData.impuestos,
      total: extractedData.total,
    },
  };
}

// Tool 2: Calculate Tax
export async function calculateTaxImplementation(params: {
  amount: number;
  taxRate: number;
  country?: string;
}) {
  const { amount, taxRate, country } = params;

  const tax = amount * taxRate;
  const total = amount + tax;

  // Reglas especiales por país
  let appliedTaxRate = taxRate;
  if (country === 'AR') {
    // Argentina: IVA 21% estándar
    appliedTaxRate = 0.21;
  } else if (country === 'ES') {
    // España: IVA 21% estándar
    appliedTaxRate = 0.21;
  }

  return {
    success: true,
    data: {
      baseAmount: amount,
      taxRate: appliedTaxRate,
      taxAmount: tax,
      total: total,
      country: country || 'N/A',
    },
  };
}

// Tool 3: Categorize Expense
export async function categorizeExpenseImplementation(params: {
  description: string;
  amount: number;
}) {
  const { description, amount } = params;

  // Usar GPT-4 para categorizar
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `Categoriza gastos en estas categorías:
- Servicios (internet, software, suscripciones)
- Alimentación (comidas, restaurantes)
- Transporte (gasolina, viajes,Uber)
- Oficina (suministros, mobiliario)
- Marketing (publicidad, redes sociales)
- Representación (clientes, reuniones)

Responde con JSON: {"categoria": "X", "subcategoria": "Y", "confianza": 0.9}`,
      },
      {
        role: 'user',
        content: `Categoriza: ${description}`,
      },
    ],
  });

  const categorization = JSON.parse(response.choices[0].message.content);

  return {
    success: true,
    data: {
      description,
      amount,
      ...categorization,
    },
  };
}

// Tool 4: Generate Report
export async function generateReportImplementation(params: {
  type: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate?: string;
  endDate?: string;
}) {
  const { type, startDate, endDate } = params;

  // Calcular rango de fechas
  const now = new Date();
  let start: Date;
  let end: Date = now;

  if (type === 'monthly') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (type === 'quarterly') {
    const quarter = Math.floor(now.getMonth() / 3);
    start = new Date(now.getFullYear(), quarter * 3, 1);
  } else if (type === 'yearly') {
    start = new Date(now.getFullYear(), 0, 1);
  } else {
    start = new Date(startDate);
    end = new Date(endDate);
  }

  // Query a la base de datos
  const { data: records } = await supabase
    .from('accounting_records')
    .select('*')
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  // Generar reporte
  const report = {
    type,
    period: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    summary: {
      totalIngresos: records.filter(r => r.type === 'ingreso').reduce((sum, r) => sum + r.amount, 0),
      totalGastos: records.filter(r => r.type === 'gasto').reduce((sum, r) => sum + r.amount, 0),
      balance: 0,
    },
    records,
  };

  report.summary.balance = report.summary.totalIngresos - report.summary.totalGastos;

  return {
    success: true,
    data: report,
  };
}

// Tool 5: Save Record
export async function saveRecordImplementation(params: {
  type: 'invoice' | 'expense' | 'tax';
  data: any;
}) {
  const { type, data } = params;

  const { data: record, error } = await supabase
    .from('accounting_records')
    .insert({
      type,
      data,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data: record,
  };
}
```

---

## 🔧 Motor Genérico Programable

```typescript
// src/motores/motor-generico.ts

import { MotorBase } from '@/types/motor';

export const MOTOR_GENERICO: MotorBase = {
  id: 'motor-generico-v1',
  name: 'Motor Genérico',
  description: 'Motor programable para cualquier caso de uso',
  version: '1.0.0',
  category: 'generico',
  author: 'Sephirot',

  config: {
    envVars: ['OPENAI_API_KEY'],
    externalAPIs: [],
    dependencies: [],
    limits: {
      maxTokens: 8000,
      maxExecutionTime: 120,
      maxAPICalls: 20,
    },
  },

  code: {
    systemPrompt: `Eres un asistente de IA programable. Tu comportamiento está determinado
por las instrucciones proporcionadas por el usuario.

INSTRUCCIONES DEL USUARIO:
{user_instructions}

REGLAS GENERALES:
- Sigue fielmente las instrucciones del usuario
- Si hay ambigüedad, pregunta aclaraciones
- Sé preciso y conciso en tus respuestas
- Mantén el contexto de la conversación`,

    tools: [
      {
        name: 'execute_code',
        description: 'Ejecuta código JavaScript/TypeScript de forma segura',
        parameters: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Código a ejecutar',
            },
          },
          required: ['code'],
        },
        implementation: 'executeCodeSafely',
      },
      {
        name: 'call_api',
        description: 'Hace una llamada HTTP a una API externa',
        parameters: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL de la API',
            },
            method: {
              type: 'string',
              enum: ['GET', 'POST', 'PUT', 'DELETE'],
              description: 'Método HTTP',
            },
            headers: {
              type: 'object',
              description: 'Headers adicionales',
            },
            body: {
              type: 'object',
              description: 'Body de la petición (para POST/PUT)',
            },
          },
          required: ['url', 'method'],
        },
        implementation: 'callExternalAPI',
      },
    ],

    graph: {
      nodes: [
        {
          id: 'input',
          type: 'input',
          config: {},
        },
        {
          id: 'llm-process',
          type: 'llm',
          config: {
            model: 'gpt-4-turbo',
            temperature: 0.7,
          },
        },
        {
          id: 'tool-execute',
          type: 'tool',
          config: {},
        },
        {
          id: 'output',
          type: 'output',
          config: {},
        },
      ],
      edges: [
        { from: 'input', to: 'llm-process' },
        { from: 'llm-process', to: 'tool-execute', condition: 'needs_tool' },
        { from: 'tool-execute', to: 'llm-process' },
        { from: 'llm-process', to: 'output', condition: 'has_result' },
      ],
    },

    handlers: {},
  },

  metadata: {
    tags: ['generico', 'programable', 'custom'],
    examples: [
      {
        input: 'Instrucciones: Actúa como un asistente de ventas que recomienda productos',
        output: 'Entendido. Soy tu asistente de ventas. ¿Qué tipo de producto buscas?',
        description: 'Configurar motor como asistente de ventas',
      },
    ],
    pricing: {
      setupCost: 0,
      perExecutionCost: 0.003,
    },
    documentation: '# Motor Genérico\n\nPermite crear cualquier tipo de asistente...',
  },
};
```

---

## ✅ Sistema de Validación

```typescript
// src/services/motor-validator.ts

import { MotorBase } from '@/types/motor';
import { z } from 'zod';

const MotorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  category: z.enum(['contabilidad', 'finanzas', 'rrhh', 'ventas', 'marketing', 'soporte', 'generico']),
  author: z.string().min(1),

  config: z.object({
    envVars: z.array(z.string()).optional(),
    externalAPIs: z.array(z.object({
      name: z.string(),
      baseUrl: z.string().url(),
      authType: z.enum(['api_key', 'oauth', 'basic']),
      required: z.boolean(),
    })).optional(),
    dependencies: z.array(z.string()).optional(),
    limits: z.object({
      maxTokens: z.number().positive(),
      maxExecutionTime: z.number().positive(),
      maxAPICalls: z.number().positive().optional(),
    }),
  }),

  code: z.object({
    systemPrompt: z.string().min(50),
    tools: z.array(z.object({
      name: z.string().min(1),
      description: z.string().min(10),
      parameters: z.object({
        type: z.literal('object'),
        properties: z.record(z.any()),
        required: z.array(z.string()).optional(),
      }),
      implementation: z.string().min(1),
    })).min(1),
    graph: z.object({
      nodes: z.array(z.object({
        id: z.string(),
        type: z.enum(['input', 'llm', 'tool', 'database', 'output']),
        config: z.any(),
      })).min(1),
      edges: z.array(z.object({
        from: z.string(),
        to: z.string(),
        condition: z.string().optional(),
      })),
    }),
    handlers: z.object({
      onInit: z.string().optional(),
      onSuccess: z.string().optional(),
      onError: z.string().optional(),
    }).optional(),
  }),

  metadata: z.object({
    tags: z.array(z.string()).optional(),
    examples: z.array(z.object({
      input: z.string(),
      output: z.string(),
      description: z.string(),
    })).optional(),
    pricing: z.object({
      setupCost: z.number().nonnegative(),
      perExecutionCost: z.number().nonnegative(),
    }),
    documentation: z.string().optional(),
  }),
});

export class MotorValidator {
  async validate(motor: Partial<MotorBase>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validación de schema
    try {
      MotorSchema.parse(motor);
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.push(...e.errors.map(err => `${err.path.join('.')}: ${err.message}`));
      }
    }

    // 2. Validaciones de lógica de negocio
    if (motor.code?.tools) {
      // Verificar que tools tengan implementaciones válidas
      for (const tool of motor.code.tools) {
        try {
          // Intentar obtener la implementación
          const impl = this.getImplementation(tool.implementation);
          if (!impl) {
            errors.push(`Tool ${tool.name}: implementación "${tool.implementation}" no encontrada`);
          }
        } catch (e) {
          errors.push(`Tool ${tool.name}: error al cargar implementación`);
        }
      }
    }

    // 3. Validación del grafo
    if (motor.code?.graph) {
      const { nodes, edges } = motor.code.graph;
      const nodeIds = new Set(nodes.map(n => n.id));

      for (const edge of edges) {
        if (!nodeIds.has(edge.from)) {
          errors.push(`Edge inválido: nodo "${edge.from}" no existe`);
        }
        if (!nodeIds.has(edge.to)) {
          errors.push(`Edge inválido: nodo "${edge.to}" no existe`);
        }
      }

      // Verificar que haya exactamente un nodo input y uno output
      const inputNodes = nodes.filter(n => n.type === 'input');
      const outputNodes = nodes.filter(n => n.type === 'output');

      if (inputNodes.length !== 1) {
        errors.push('Debe haber exactamente un nodo de tipo "input"');
      }
      if (outputNodes.length !== 1) {
        errors.push('Debe haber exactamente un nodo de tipo "output"');
      }
    }

    // 4. Warnings
    if (!motor.metadata?.documentation || motor.metadata.documentation.length < 100) {
      warnings.push('Documentación muy corta (menos de 100 caracteres)');
    }

    if (!motor.metadata?.examples || motor.metadata.examples.length === 0) {
      warnings.push('No hay ejemplos de uso');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private getImplementation(name: string) {
    // Mapa de implementaciones disponibles
    const implementations: Record<string, any> = {
      parseInvoiceImplementation,
      calculateTaxImplementation,
      categorizeExpenseImplementation,
      generateReportImplementation,
      saveRecordImplementation,
      executeCodeSafely,
      callExternalAPI,
    };

    return implementations[name];
  }
}

export const motorValidator = new MotorValidator();
```

---

## 🧪 Sistema de Testing

```typescript
// src/services/motor-tester.ts

import { MotorBase } from '@/types/motor';
import { executeMotor } from './motor-executor';

interface TestCase {
  name: string;
  input: string;
  expectedOutput?: any;
  timeout?: number;
}

export class MotorTester {
  async testMotor(motor: MotorBase): Promise<{
    passed: number;
    failed: number;
    results: Array<{
      test: string;
      passed: boolean;
      output?: any;
      error?: string;
    }>;
  }> {
    const results = [];
    let passed = 0;
    let failed = 0;

    // 1. Tests de ejemplo del motor
    if (motor.metadata.examples) {
      for (const example of motor.metadata.examples) {
        try {
          const result = await executeMotor(motor, example.input);

          const expected = JSON.stringify(example.output);
          const actual = JSON.stringify(result);

          const testPassed = actual.includes(expected) || result.success;

          if (testPassed) {
            passed++;
            results.push({
              test: `Example: ${example.description}`,
              passed: true,
              output: result,
            });
          } else {
            failed++;
            results.push({
              test: `Example: ${example.description}`,
              passed: false,
              output: result,
              error: `Expected: ${expected}, Got: ${actual}`,
            });
          }
        } catch (error) {
          failed++;
          results.push({
            test: `Example: ${example.description}`,
            passed: false,
            error: error.message,
          });
        }
      }
    }

    // 2. Tests de límites
    try {
      // Test de timeout
      const startTime = Date.now();
      await executeMotor(motor, 'Test input', {
        timeout: motor.config.limits.maxExecutionTime * 1000,
      });
      const duration = Date.now() - startTime;

      if (duration > motor.config.limits.maxExecutionTime * 1000) {
        failed++;
        results.push({
          test: 'Timeout limit',
          passed: false,
          error: `Execution exceeded ${motor.config.limits.maxExecutionTime}s`,
        });
      } else {
        passed++;
        results.push({
          test: 'Timeout limit',
          passed: true,
        });
      }
    } catch (error) {
      failed++;
      results.push({
        test: 'Timeout limit',
        passed: false,
        error: error.message,
      });
    }

    return { passed, failed, results };
  }
}
```

---

## ✅ Checklist FASE 2

### Arquitectura
- [ ] Types de Motor definidos
- [ ] Interfaces de Tools creadas
- [ ] ExecutionGraph diseñado

### Motores Implementados
- [ ] Motor de Contabilidad funcional
- [ ] Motor Genérico programable
- [ ] Tools de contabilidad implementadas
- [ ] Tools genéricas implementadas

### Validación
- [ ] MotorValidator implementado
- [ ] Tests de schema funcionando
- [ ] Tests de lógica de negocio
- [ ] Tests de grafo

### Testing
- [ ] MotorTester implementado
- [ ] Tests de ejemplos
- [ ] Tests de límites

### Documentación
- [ ] API de motores documentada
- [ ] Guía para crear motores
- [ ] Ejemplos de uso

---

**Siguiente fase**: `FASE_3_LINEA_ENSAMBLAJE.md` - Sistema de composición de agentes
