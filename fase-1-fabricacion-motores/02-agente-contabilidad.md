# 02 - Agente de Contabilidad - Implementación Completa

**Versión**: 1.0
**Status**: 🔴 CRÍTICO - Primer agente funcional
**Tiempo de lectura**: 40 minutos
**Tiempo de implementación**: 20-30 horas

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Casos de Uso](#casos-de-uso)
3. [Arquitectura del Agente](#arquitectura-del-agente)
4. [Implementación Paso a Paso](#implementación-paso-a-paso)
5. [Prompt Engineering](#prompt-engineering)
6. [Integraciones](#integraciones)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## 👁️ VISIÓN GENERAL

### Qué Hace Este Agente

```
INPUT: Documentos financieros (facturas, recibos, extractos)
PROCESO: Clasificación, extracción, categorización, contabilización
OUTPUT: Libro diario, reportes, asientos contables
```

### Valor Para el Usuario

```yaml
antes:
  tiempo: "4-8 horas por mes"
  errores: "Frecuentes (10-20%)"
  conocimiento_requerido: "Contabilidad básica"

despues:
  tiempo: "10 minutos por mes"
  errores: "Mínimos (<2%)"
  conocimiento_requerido: "Ninguno"
```

### Metáfora

```
Es como tener un contador junior que:
1. Nunca duerme
2. No comete errores por fatiga
3. Trabaja 24/7/365
4. Cuesta una fracción del salario real
```

---

## 🎯 CASOS DE USO

### Caso 1: Registro de Facturas de Proveedores

```yaml
input:
  - Factura PDF o imagen
  - Datos extraídos automáticamente

proceso:
  - Extraer datos (monto, fecha, proveedor)
  - Clasificar categoría (gastos operativos, materiales, etc)
  - Generar asiento contable
  - Actualizar libro mayor

output:
  - Asiento contable formateado
  - Confirmación de registro
```

**Prompt de Ejemplo**:
```
"Registra esta factura de $1,500 de Office Depot
 correspondiente a suministros de oficina de Julio 2024"
```

**Output Esperado**:
```json
{
  "asiento_contable": {
    "fecha": "2024-07-15",
    "descripcion": "Suministros de oficina - Office Depot",
    "debe": [
      {"cuenta": "6100-Suministros", "monto": 1500.00}
    ],
    "haber": [
      {"cuenta": "2100-Proveedores", "monto": 1500.00}
    ]
  },
  "clasificacion": {
    "categoria": "Gastos Operativos",
    "subcategoria": "Suministros de Oficina",
    "tipo_gasto": "Deductible"
  }
}
```

---

### Caso 2: Conciliación Bancaria

```yaml
input:
  - Extracto bancario (CSV o PDF)
  - Transacciones a conciliar

proceso:
  - Leer transacciones del extracto
  - Buscar coincidencias en libros contables
  - Identificar transacciones no registradas
  - Generar asientos de ajuste

output:
  - Reporte de conciliación
  - Asientos de ajuste necesarios
  - Alertas de discrepancias
```

**Prompt de Ejemplo**:
```
"Concilia este extracto bancario de Julio con
 los libros contables de la empresa"
```

**Output Esperado**:
```json
{
  "conciliacion": {
    "total_extracto": 45230.50,
    "total_libros": 44800.00,
    "diferencia": 430.50,
    "transacciones_conciliadas": 47,
    "transacciones_pendientes": 3
  },
  "ajustes_requeridos": [
    {
      "tipo": "cargo_no_identificado",
      "monto": 150.00,
      "fecha": "2024-07-22",
      "descripcion": "Cargo bancario no identificado",
      "accion": "Requiere investigación manual"
    }
  ]
}
```

---

### Caso 3: Generación de Reportes Financieros

```yaml
input:
  - Período (ej: Q3 2024)
  - Tipo de reporte (Balance General, Estado de Resultados)

proceso:
  - Consultar libro mayor
  - Calcular totales y subtotales
  - Formatear según estándares contables
  - Generar visualizaciones

output:
  - Reporte financiero completo
  - Gráficos y visualizaciones
  - Análisis de tendencias
```

**Prompt de Ejemplo**:
```
"Genera el Estado de Resultados del Q3 2024
 con análisis variación vs Q2 2024"
```

**Output Esperado**:
```json
{
  "estado_resultados": {
    "periodo": "Q3 2024",
    "ingresos": {
      "ventas_totales": 125000.00,
      "costo_ventas": (75000.00),
      "utilidad_bruta": 50000.00
    },
    "gastos_operativos": {
      "sueldos": (25000.00),
      "alquiler": (8000.00),
      "servicios": (3000.00),
      "depreciacion": (2000.00),
      "total_gastos": (38000.00)
    },
    "utilidad_operativa": 12000.00,
    "impuestos": (3600.00),
    "utilidad_neta": 8400.00
  },
  "analisis": {
    "margen_bruto": "40%",
    "margen_neto": "6.7%",
    "variacion_vs_q2": "+15% en utilidad neta"
  }
}
```

---

## 🏗️ ARQUITECTURA DEL AGENTE

### Grafo de Ejecución

```
┌──────────────┐
│ INPUT BLOCK  │ ← Usuario envía factura/pregunta
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ EXTRACT BLOCK│ ← Extraer datos de documentos (OCR, parsing)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ CLASSIFY     │ ← Clasificar transacción (categoría, tipo)
│   BLOCK      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ VALIDATE     │ ← Validar contra reglas contables
│   BLOCK      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ LLM BLOCK    │ ← Razonamiento contable (LLM principal)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ DATABASE     │ ← Guardar asiento contable
│   BLOCK      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ OUTPUT BLOCK │ ← Presentar resultado al usuario
└──────────────┘
```

### Diagrama de Estados

```typescript
interface AccountingAgentState extends AgentState {
  // Input original
  input: string;

  // Documentos extraídos
  documents?: {
    type: 'invoice' | 'receipt' | 'bank_statement' | 'general';
    data: any;
  };

  // Clasificación
  classification?: {
    category: string;
    subcategory: string;
    accountCode: string;
    taxTreatment: string;
  };

  // Asiento contable
  entry?: {
    date: string;
    description: string;
    debits: Array<{ account: string; amount: number }>;
    credits: Array<{ account: string; amount: number }>;
  };

  // Validaciones
  validations?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };

  // Contexto contable
  accounting?: {
    fiscalYear: number;
    period: string;
    currency: string;
    company: string;
  };
}
```

---

## 💻 IMPLEMENTACIÓN PASO A PASO

### Paso 1: Definir el Agente

```typescript
// src/agents/AccountingAgent.ts
import { Agent } from './Agent';
import { LangGraph } from '@langchain/langgraph';

export class AccountingAgent extends Agent {
  constructor(config: AccountingConfig) {
    super({
      id: 'accounting-agent',
      name: 'Agente de Contabilidad',
      version: '1.0.0',
      config,
    });
  }

  protected buildGraph(): LangGraph {
    // Crear bloques
    const inputBlock = new AccountingInputBlock();
    const extractBlock = new ExtractBlock();
    const classifyBlock = new ClassifyBlock();
    const validateBlock = new ValidateBlock();
    const llmBlock = new AccountingLLMBlock();
    const databaseBlock = new AccountingDatabaseBlock();
    const outputBlock = new AccountingOutputBlock();

    // Definir conexiones
    const connections = [
      { from: 'input', to: 'extract' },
      { from: 'extract', to: 'classify' },
      { from: 'classify', to: 'validate' },
      { from: 'validate', to: 'llm' },
      { from: 'llm', to: 'database' },
      { from: 'database', to: 'output' },
    ];

    // Construir grafo
    return new LangGraph({
      nodes: {
        input: inputBlock,
        extract: extractBlock,
        classify: classifyBlock,
        validate: validateBlock,
        llm: llmBlock,
        database: databaseBlock,
        output: outputBlock,
      },
      edges: connections,
    });
  }
}
```

---

### Paso 2: Bloque de Extracción

```typescript
// src/blocks/accounting/ExtractBlock.ts
import { Block } from '../../blocks/base/Block';

export class ExtractBlock extends Block<AccountingAgentState> {
  id = 'extract';
  type = 'tool';

  async execute(state: AccountingAgentState): Promise<BlockResult> {
    // 1. Determinar tipo de documento
    const docType = this.detectDocumentType(state.input);

    // 2. Extraer datos según tipo
    let extractedData: any;

    switch (docType) {
      case 'invoice':
        extractedData = await this.extractInvoice(state.input);
        break;
      case 'receipt':
        extractedData = await this.extractReceipt(state.input);
        break;
      case 'bank_statement':
        extractedData = await this.extractBankStatement(state.input);
        break;
      default:
        extractedData = await this.extractFromText(state.input);
    }

    // 3. Validar datos extraídos
    const validation = this.validateExtractedData(extractedData);

    if (!validation.isValid) {
      return {
        success: false,
        error: new Error(`Extracted data invalid: ${validation.errors.join(', ')}`),
      };
    }

    // 4. Actualizar estado
    return {
      success: true,
      data: extractedData,
      nextState: {
        documents: {
          type: docType,
          data: extractedData,
        },
      },
    };
  }

  private detectDocumentType(input: string): string {
    // Usar LLM para clasificar tipo de documento
    const prompt = `
      Clasifica el siguiente texto en uno de estos tipos:
      - invoice (factura de proveedor)
      - receipt (recibo de gasto)
      - bank_statement (extracto bancario)
      - general (texto general)

      Texto: ${input.substring(0, 500)}

      Responde solo con el tipo.
    `;

    // Llamada a LLM...
    // Simplificado para ejemplo
    return 'invoice';
  }

  private async extractInvoice(input: string): Promise<any> {
    // Usar LLM con prompting estructurado
    const prompt = `
      Eres un extractor de datos de facturas. Extrae la siguiente información en formato JSON:

      Factura:
      ${input}

      Extrae:
      - numero_factura: número de factura
      - fecha: fecha de la factura (YYYY-MM-DD)
      - proveedor: nombre del proveedor
      - monto_total: monto total (número)
      - iva: monto de IVA (número)
      - neto: monto neto (número)
      - descripcion: descripción de los productos/servicios
      - categoria: categoría de gasto (ej: "Suministros", "Servicios")

      Responde SOLO con JSON válido.
    `;

    const response = await this.callLLM(prompt, {
      temperature: 0.1, // Baja temperatura para consistencia
      responseFormat: { type: 'json_object' },
    });

    return JSON.parse(response.content);
  }

  private async extractReceipt(input: string): Promise<any> {
    // Similar a extractInvoice pero para recibos
    const prompt = `
      Eres un extractor de datos de recibos. Extrae...

      ${input}

      Responde SOLO con JSON válido.
    `;

    const response = await this.callLLM(prompt, {
      temperature: 0.1,
      responseFormat: { type: 'json_object' },
    });

    return JSON.parse(response.content);
  }

  private async extractBankStatement(input: string): Promise<any> {
    // Para extractos bancarios, puede ser CSV
    if (input.includes(',')) {
      // Parsear CSV
      return this.parseCSV(input);
    }

    // O usar LLM para PDF/imagen
    const prompt = `
      Extrae transacciones del extracto bancario...
    `;

    const response = await this.callLLM(prompt);

    return JSON.parse(response.content);
  }

  private validateExtractedData(data: any): ValidationResult {
    const errors: string[] = [];

    // Validaciones requeridas
    if (!data.monto_total || data.monto_total <= 0) {
      errors.push('Monto total inválido');
    }

    if (!data.fecha) {
      errors.push('Fecha faltante');
    }

    if (!data.proveedor && !data.comercio) {
      errors.push('Proveedor/comercio faltante');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

---

### Paso 3: Bloque de Clasificación

```typescript
// src/blocks/accounting/ClassifyBlock.ts
export class ClassifyBlock extends Block<AccountingAgentState> {
  id = 'classify';
  type = 'llm';

  async execute(state: AccountingAgentState): Promise<BlockResult> {
    const { documents } = state;

    if (!documents) {
      return {
        success: false,
        error: new Error('No documents to classify'),
      };
    }

    // 1. Obtener plan de cuentas de la base de datos
    const chartOfAccounts = await this.getChartOfAccounts();

    // 2. Clasificar usando LLM
    const prompt = `
      Eres un contador experto. Clasifica la siguiente transacción:

      DATOS:
      ${JSON.stringify(documents.data, null, 2)}

      PLAN DE CUENTAS DISPONIBLE:
      ${this.formatChartOfAccounts(chartOfAccounts)}

      TU TAREA:
      1. Determina la categoría contable adecuada
      2. Asigna el código de cuenta correcto
      3. Determina el tratamiento de impuestos
      4. Sugiere cuenta de contrapartida

      Responde en este formato JSON:
      {
        "categoria": "Gastos Operativos",
        "subcategoria": "Suministros de Oficina",
        "cuenta_debe": "6100-Suministros",
        "cuenta_haber": "2100-Proveedores",
        "tratamiento_iva": "Deductible",
        "tipo_gasto": "Operativo",
        "justificacion": "Explicación de la clasificación"
      }
    `;

    const response = await this.callLLM(prompt, {
      temperature: 0.2,
      responseFormat: { type: 'json_object' },
    });

    const classification = JSON.parse(response.content);

    // 3. Validar que las cuentas existen
    const validation = this.validateAccounts(classification, chartOfAccounts);

    if (!validation.isValid) {
      // Intentar recuperar con fallback
      return await this.fallbackClassification(documents.data, chartOfAccounts);
    }

    return {
      success: true,
      data: classification,
      nextState: {
        classification,
      },
    };
  }

  private async getChartOfAccounts(): Promise<Account[]> {
    // Obtener de la base de datos
    return await db.accounts.findMany({
      where: { active: true },
      orderBy: { code: 'asc' },
    });
  }

  private formatChartOfAccounts(accounts: Account[]): string {
    return accounts
      .map(acc => `- ${acc.code}: ${acc.name} (${acc.type})`)
      .join('\n');
  }

  private validateAccounts(
    classification: any,
    chartOfAccounts: Account[]
  ): ValidationResult {
    const errors: string[] = [];

    const debits = Array.isArray(classification.cuenta_debe)
      ? classification.cuenta_debe
      : [classification.cuenta_debe];
    const credits = Array.isArray(classification.cuenta_haber)
      ? classification.cuenta_haber
      : [classification.cuenta_haber];

    const allAccounts = [...debits, ...credits];

    for (const accountCode of allAccounts) {
      const exists = chartOfAccounts.some(acc =>
        acc.code === accountCode
      );

      if (!exists) {
        errors.push(`Cuenta ${accountCode} no existe en plan de cuentas`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

---

### Paso 4: Bloque de Validación

```typescript
// src/blocks/accounting/ValidateBlock.ts
export class ValidateBlock extends Block<AccountingAgentState> {
  id = 'validate';
  type = 'validation';

  async execute(state: AccountingAgentState): Promise<BlockResult> {
    const { documents, classification } = state;

    const validations: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // 1. Validar balances (debe = haber)
    const balanceValidation = this.validateBalances(state);
    if (!balanceValidation.isValid) {
      validations.errors.push(...balanceValidation.errors);
    }

    // 2. Validar fechas
    const dateValidation = this.validateDates(documents);
    if (!dateValidation.isValid) {
      validations.errors.push(...dateValidation.errors);
    }

    // 3. Validar montos
    const amountValidation = this.validateAmounts(documents);
    if (!amountValidation.isValid) {
      validations.errors.push(...amountValidation.errors);
    }

    // 4. Validar reglas de negocio
    const businessValidation = await this.validateBusinessRules(state);
    validations.warnings.push(...businessValidation.warnings);

    // 5. Determinar si es válido
    validations.isValid = validations.errors.length === 0;

    return {
      success: validations.isValid,
      data: validations,
      nextState: {
        validations,
      },
    };
  }

  private validateBalances(state: AccountingAgentState): ValidationResult {
    // Debe sumar lo mismo que Haber
    // Esta validación se hace después del LLM que genera el asiento

    // Por ahora retornamos válido
    // (se implementará cuando tengamos el asiento generado)
    return {
      isValid: true,
      errors: [],
    };
  }

  private validateDates(documents: any): ValidationResult {
    const errors: string[] = [];

    if (!documents?.data?.fecha) {
      errors.push('Fecha de documento faltante');
    }

    const fecha = new Date(documents.data.fecha);
    const hoy = new Date();

    if (fecha > hoy) {
      errors.push('La fecha del documento no puede ser futura');
    }

    // Validar que no sea muy antigua (> 1 año)
    const unAnioAtras = new Date();
    unAnioAtras.setFullYear(unAnioAtras.getFullYear() - 1);

    if (fecha < unAnioAtras) {
      errors.push('Fecha del documento muy antigua (> 1 año)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateAmounts(documents: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const monto = documents?.data?.monto_total;

    if (!monto || monto <= 0) {
      errors.push('Monto inválido');
    }

    // Warning para montos grandes
    if (monto > 10000) {
      warnings.push('Monto elevado - requiere aprobación adicional');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private async validateBusinessRules(state: AccountingAgentState): Promise<ValidationResult> {
    const warnings: string[] = [];

    // 1. Validar límites de gasto
    const limitValidation = await this.validateExpenseLimits(state);
    warnings.push(...limitValidation.warnings);

    // 2. Validar proveedor
    const supplierValidation = await this.validateSupplier(state);
    warnings.push(...supplierValidation.warnings);

    // 3. Validar duplicados
    const duplicateValidation = await this.checkDuplicates(state);
    if (!duplicateValidation.isValid) {
      return duplicateValidation;
    }

    return {
      isValid: true,
      warnings,
    };
  }

  private async validateExpenseLimits(state: AccountingAgentState): Promise<ValidationResult> {
    const warnings: string[] = [];

    // Obtener límites configurados para la categoría
    const limits = await db.expenseLimits.findUnique({
      where: { category: state.classification?.subcategoria },
    });

    if (limits && state.documents?.data?.monto_total > limits.monthlyLimit) {
      warnings.push(
        `Monto excede límite mensual de ${limits.monthlyLimit} para ${state.classification?.subcategoria}`
      );
    }

    return {
      isValid: true,
      warnings,
    };
  }

  private async validateSupplier(state: AccountingAgentState): Promise<ValidationResult> {
    const warnings: string[] = [];

    const supplierName = state.documents?.data?.proveedor;

    // Buscar proveedor en base de datos
    const supplier = await db.suppliers.findFirst({
      where: { name: { contains: supplierName } },
    });

    if (!supplier) {
      warnings.push('Proveedor no registrado - se creará registro nuevo');
    } else if (supplier.status === 'inactive') {
      warnings.push('Proveedor inactivo - verificar antes de continuar');
    } else if (supplier.requiresApproval) {
      warnings.push('Proveedor requiere aprobación previa');
    }

    return {
      isValid: true,
      warnings,
    };
  }

  private async checkDuplicates(state: AccountingAgentState): Promise<ValidationResult> {
    // Buscar facturas duplicadas
    const duplicates = await db.accountingEntries.findMany({
      where: {
        invoiceNumber: state.documents?.data?.numero_factura,
        supplier: state.documents?.data?.proveedor,
        amount: state.documents?.data?.monto_total,
      },
    });

    if (duplicates.length > 0) {
      return {
        isValid: false,
        errors: [`Factura duplicada detectada - ID: ${duplicates[0].id}`],
      };
    }

    return {
      isValid: true,
      errors: [],
    };
  }
}
```

---

### Paso 5: Bloque LLM Principal

```typescript
// src/blocks/accounting/AccountingLLMBlock.ts
export class AccountingLLMBlock extends Block<AccountingAgentState> {
  id = 'llm';
  type = 'llm';

  async execute(state: AccountingAgentState): Promise<BlockResult> {
    const { documents, classification, validations } = state;

    // 1. Construir prompt de contabilidad
    const prompt = this.buildAccountingPrompt(state);

    // 2. Llamar a LLM con parametros optimizados
    const response = await this.callLLM(prompt, {
      model: 'gpt-4', // Mejor modelo para razonamiento contable
      temperature: 0.3, // Baja temperatura para consistencia
      responseFormat: { type: 'json_object' },
      maxTokens: 2000,
    });

    // 3. Parsear respuesta
    const entry = JSON.parse(response.content);

    // 4. Validar estructura del asiento
    const validation = this.validateEntryStructure(entry);

    if (!validation.isValid) {
      return {
        success: false,
        error: new Error(`Asiento inválido: ${validation.errors.join(', ')}`),
      };
    }

    // 5. Actualizar estado
    return {
      success: true,
      data: entry,
      nextState: {
        entry,
      },
    };
  }

  private buildAccountingPrompt(state: AccountingAgentState): string {
    return `
Eres un contador profesional experto. Tu tarea es generar un asiento contable completo.

DATOS DE LA TRANSACCIÓN:
${JSON.stringify(state.documents?.data, null, 2)}

CLASIFICACIÓN CONTABLE:
${JSON.stringify(state.classification, null, 2)}

VALIDACIONES PREVIAS:
${JSON.stringify(state.validations, null, 2)}

PLAN DE CUENTAS:
${this.getRelevantAccounts(state.classification)}

INSTRUCCIONES:
1. Genera un asiento contable balanceado (debe = haber)
2. Usa las cuentas sugeridas en la clasificación
3. Incluye una descripción clara y profesional
4. Respeta el formato de fecha YYYY-MM-DD
5. Todos los montos deben ser positivos (el signo lo indica la cuenta)

FORMATO DE RESPUESTA JSON:
{
  "fecha": "2024-07-15",
  "descripcion": "Compra de suministros de oficina",
  "debe": [
    {
      "cuenta": "6100-Suministros",
      "codigo": "6100",
      "monto": 1500.00,
      "descripcion": "Suministros de oficina various"
    }
  ],
  "haber": [
    {
      "cuenta": "2100-Proveedores",
      "codigo": "2100",
      "monto": 1500.00,
      "descripcion": "Office Depot - Factura 001-2345"
    }
  ],
  "referencias": {
    "numero_factura": "001-2345",
    "proveedor": "Office Depot",
    "periodo_fiscal": "2024-07"
  },
  "metadata": {
    "moneda": "USD",
    "tipo_cambio": 1.0,
    "usuario": "sistema"
  }
}

Responde SOLO con JSON válido.
`;
  }

  private getRelevantAccounts(classification?: any): string {
    // Retorna cuentas relevantes basadas en clasificación
    if (!classification) return '';

    return `
Cuentas sugeridas:
- Debe: ${classification.cuenta_debe}
- Haber: ${classification.cuenta_haber}
`;
  }

  private validateEntryStructure(entry: any): ValidationResult {
    const errors: string[] = [];

    // Validar campos requeridos
    if (!entry.fecha) errors.push('Fecha faltante');
    if (!entry.descripcion) errors.push('Descripción faltante');
    if (!entry.debe || !Array.isArray(entry.debe)) errors.push('Debe faltante o inválido');
    if (!entry.haber || !Array.isArray(entry.haber)) errors.push('Haber faltante o inválido');

    // Validar balances
    if (entry.debe && entry.haber) {
      const totalDebe = entry.debe.reduce((sum: number, item: any) => sum + item.monto, 0);
      const totalHaber = entry.haber.reduce((sum: number, item: any) => sum + item.monto, 0);

      if (Math.abs(totalDebe - totalHaber) > 0.01) {
        errors.push(`Asiento no balancea: Debe=${totalDebe}, Haber=${totalHaber}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

---

### Paso 6: Bloque de Base de Datos

```typescript
// src/blocks/accounting/AccountingDatabaseBlock.ts
export class AccountingDatabaseBlock extends Block<AccountingAgentState> {
  id = 'database';
  type = 'database';

  async execute(state: AccountingAgentState): Promise<BlockResult> {
    const { entry, documents, classification } = state;

    try {
      // 1. Iniciar transacción
      await db.$transaction(async (tx) => {
        // 2. Guardar asiento contable
        const accountingEntry = await tx.accountingEntries.create({
          data: {
            date: new Date(entry.fecha),
            description: entry.descripcion,
            totalDebit: entry.debe.reduce((sum: number, item: any) => sum + item.monto, 0),
            totalCredit: entry.haber.reduce((sum: number, item: any) => sum + item.monto, 0),
            currency: entry.metadata?.moneda || 'USD',
            reference: entry.referencias?.numero_factura,
            supplier: entry.referencias?.proveedor,
            category: classification?.subcategoria,
            userId: state.context?.userId,
          },
        });

        // 3. Guardar líneas de débito
        for (const debit of entry.debe) {
          await tx.accountingEntryLines.create({
            data: {
              entryId: accountingEntry.id,
              accountCode: debit.codigo,
              accountName: debit.cuenta,
              debit: debit.monto,
              credit: 0,
              description: debit.descripcion,
            },
          });
        }

        // 4. Guardar líneas de crédito
        for (const credit of entry.haber) {
          await tx.accountingEntryLines.create({
            data: {
              entryId: accountingEntry.id,
              accountCode: credit.codigo,
              accountName: credit.cuenta,
              debit: 0,
              credit: credit.monto,
              description: credit.descripcion,
            },
          });
        }

        // 5. Actualizar libro mayor
        await this.updateGeneralLedger(tx, entry, accountingEntry.id);

        // 6. Crear/actualizar proveedor si no existe
        if (entry.referencias?.proveedor) {
          await tx.suppliers.upsert({
            where: { name: entry.referencias.proveedor },
            create: {
              name: entry.referencias.proveedor,
              status: 'active',
            },
            update: {},
          });
        }

        // 7. Guardar documento original si existe
        if (documents?.data) {
          await tx.documents.create({
            data: {
              entryId: accountingEntry.id,
              type: documents.type,
              data: documents.data,
              uploadedAt: new Date(),
            },
          });
        }
      });

      return {
        success: true,
        data: { message: 'Asiento guardado exitosamente' },
      };

    } catch (error) {
      logger.error('Error guardando asiento contable:', error);

      return {
        success: false,
        error: error as Error,
      };
    }
  }

  private async updateGeneralLedger(
    tx: any,
    entry: any,
    entryId: string
  ): Promise<void> {
    // Actualizar saldos de cuentas afectadas

    const affectedAccounts = new Set([
      ...entry.debe.map((d: any) => d.codigo),
      ...entry.haber.map((h: any) => h.codigo),
    ]);

    for (const accountCode of affectedAccounts) {
      // Calcular nuevo saldo
      const debits = entry.debe
        .filter((d: any) => d.codigo === accountCode)
        .reduce((sum: number, d: any) => sum + d.monto, 0);

      const credits = entry.haber
        .filter((h: any) => h.codigo === accountCode)
        .reduce((sum: number, h: any) => sum + h.monto, 0);

      // Obtener saldo actual
      const currentBalance = await tx.generalLedger.findUnique({
        where: { accountCode },
      });

      const newBalance = (currentBalance?.balance || 0) + debits - credits;

      // Actualizar o crear registro
      await tx.generalLedger.upsert({
        where: { accountCode },
        create: {
          accountCode,
          balance: newBalance,
          lastUpdate: new Date(),
        },
        update: {
          balance: newBalance,
          lastUpdate: new Date(),
        },
      });
    }
  }
}
```

---

### Paso 7: Bloque de Output

```typescript
// src/blocks/accounting/AccountingOutputBlock.ts
export class AccountingOutputBlock extends Block<AccountingAgentState> {
  id = 'output';
  type = 'output';

  async execute(state: AccountingAgentState): Promise<BlockResult> {
    const { entry, validations, documents } = state;

    // 1. Construir respuesta formateada
    const response = {
      exito: true,
      mensaje: 'Asiento contable generado exitosamente',

      asiento_contable: {
        id: this.generateEntryId(),
        fecha: entry.fecha,
        descripcion: entry.descripcion,
        numero_referencia: entry.referencias?.numero_factura,
      },

      resumen: {
        total_debe: this.formatCurrency(
          entry.debe.reduce((sum: number, item: any) => sum + item.monto, 0)
        ),
        total_haber: this.formatCurrency(
          entry.haber.reduce((sum: number, item: any) => sum + item.monto, 0)
        ),
        balanceado: true,
      },

      detalles: {
        debe: entry.debe.map((item: any) => ({
          cuenta: item.cuenta,
          codigo: item.codigo,
          monto: this.formatCurrency(item.monto),
          descripcion: item.descripcion,
        })),
        haber: entry.haber.map((item: any) => ({
          cuenta: item.cuenta,
          codigo: item.codigo,
          monto: this.formatCurrency(item.monto),
          descripcion: item.descripcion,
        })),
      },

      validaciones: {
        es_valido: validations?.isValid || true,
        advertencias: validations?.warnings || [],
      },

      metadatos: {
        categoria: state.classification?.subcategoria,
        tratamiento_iva: state.classification?.tratamiento_iva,
        moneda: entry.metadata?.moneda || 'USD',
        proveedor: entry.referencias?.proveedor,
      },

      proximos_pasos: [
        'Revisar el asiento contable generado',
        'Verificar que la clasificación es correcta',
        'Confirmar el asiento si todo está correcto',
        'El asiento se guardará en el libro mayor',
      ],
    };

    // 2. Generar representación visual
    const visual = this.generateVisualRepresentation(entry);

    return {
      success: true,
      data: { ...response, visual },
    };
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  private generateVisualRepresentation(entry: any): string {
    let visual = `
┌────────────────────────────────────────────────────────┐
│              ASIENTO CONTABLE                          │
├────────────────────────────────────────────────────────┤
│ Fecha: ${entry.fecha.padEnd(44)}│
│ Descripción: ${entry.descripcion.substring(0, 40).padEnd(40)}│
├────────────────────────────────────────────────────────┤
│ DÉBITO                              HABER              │
├────────────────────────────────────────────────────────┤
`;

    const maxLength = Math.max(entry.debe.length, entry.haber.length);

    for (let i = 0; i < maxLength; i++) {
      const debit = entry.debe[i];
      const credit = entry.haber[i];

      const debitLine = debit
        ? `${debit.codigo} - ${debit.cuenta.substring(0, 20)}`
        : '';
      const debitAmount = debit ? this.formatCurrency(debit.monto) : '';

      const creditLine = credit
        ? `${credit.codigo} - ${credit.cuenta.substring(0, 20)}`
        : '';
      const creditAmount = credit ? this.formatCurrency(credit.monto) : '';

      visual += `│ ${debitLine.padEnd(35)} │ ${debitAmount.padEnd(10)} │\n`;
      visual += `│ ${creditLine.padEnd(35)} │ ${creditAmount.padEnd(10)} │\n`;
      visual += '├────────────────────────────────────────────────────────┤\n';
    }

    const totalDebit = entry.debe.reduce((sum: number, item: any) => sum + item.monto, 0);
    const totalCredit = entry.haber.reduce((sum: number, item: any) => sum + item.monto, 0);

    visual += `│ ${'TOTALES:'.padEnd(35)} │ ${this.formatCurrency(totalDebit).padEnd(10)} │\n`;
    visual += `│ ${''.padEnd(35)} │ ${this.formatCurrency(totalCredit).padEnd(10)} │\n`;
    visual += '└────────────────────────────────────────────────────────┘';

    return visual;
  }
}
```

---

## 🧪 TESTING

### Unit Tests

```typescript
// tests/blocks/accounting/ExtractBlock.test.ts
import { describe, it, expect } from 'vitest';
import { ExtractBlock } from '@/blocks/accounting/ExtractBlock';

describe('ExtractBlock', () => {
  it('should extract invoice data correctly', async () => {
    const block = new ExtractBlock();

    const state = {
      input: `
        Factura: 001-2345
        Fecha: 15/07/2024
        Proveedor: Office Depot
        Monto Total: $1,500.00
        IVA: $315.00
        Neto: $1,185.00
        Descripción: Suministros de oficina varios
      `,
      messages: [],
      context: {},
      metadata: {
        startTime: Date.now(),
        tokensUsed: 0,
        costUsd: 0,
        currentBlock: '',
        errors: [],
      },
      intermediate: {},
    };

    const result = await block.execute(state);

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      numero_factura: '001-2345',
      proveedor: 'Office Depot',
      monto_total: 1500.00,
    });
  });

  it('should handle invalid invoice data', async () => {
    const block = new ExtractBlock();

    const state = {
      input: 'This is not a valid invoice',
      // ... resto del estado
    };

    const result = await block.execute(state);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// tests/integration/accounting/AccountingAgent.test.ts
describe('AccountingAgent Integration', () => {
  it('should process invoice end-to-end', async () => {
    const agent = new AccountingAgent({
      // config
    });

    const result = await agent.execute({
      input: 'Registra esta factura de Office Depot por $1,500',
      // ... estado inicial
    });

    expect(result.success).toBe(true);
    expect(result.data.entry).toBeDefined();
    expect(result.data.validations.es_valido).toBe(true);
  });
});
```

### Test Coverage Goal

```yaml
objetivo: "> 80% coverage"

desglose:
  blocks:
    ExtractBlock: 85%
    ClassifyBlock: 80%
    ValidateBlock: 85%
    AccountingLLMBlock: 75%
    AccountingDatabaseBlock: 80%
    AccountingOutputBlock: 85%

  agents:
    AccountingAgent: 75%

  integrations:
    database: 70%
    llm: 60% (mocking responses)
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Arquitectura
- [ ] Grafo de ejecución definido
- [ ] Estado del agente tipado
- [ ] Bloques implementados
- [ ] Conexiones establecidas

### Bloques
- [ ] ExtractBlock funcional
- [ ] ClassifyBlock funcional
- [ ] ValidateBlock funcional
- [ ] AccountingLLMBlock funcional
- [ ] AccountingDatabaseBlock funcional
- [ ] AccountingOutputBlock funcional

### Testing
- [ ] Unit tests para cada bloque
- [ ] Integration tests del agente
- [ ] E2E tests del flujo completo
- [ ] Test coverage > 80%

### Base de Datos
- [ ] Schema de accounting_entries
- [ ] Schema de accounting_entry_lines
- [ ] Schema de general_ledger
- [ ] Schema de suppliers
- [ ] Migrations ejecutadas

### Documentación
- [ ] API documentation
- [ ] Ejemplos de uso
- [ ] Diagramas de flujo
- [ ] Troubleshooting guide

---

## 📊 MÉTRICAS DE ÉXITO

### Técnicas
```yaml
performance:
  latency_p50: "< 3s"
  latency_p95: "< 8s"
  throughput: "> 10 agentes/segundo"

calidad:
  accuracy: "> 95%"
  error_rate: "< 2%"
  uptime: "> 99.5%"
```

### De Negocio
```yaml
adopcion:
  time_to_first_value: "< 5 min"
  satisfaction: "NPS > 40"

retencion:
  weekly_retention: "> 80%"
  monthly_retention: "> 60%"
```

---

## 🔄 PRÓXIMOS PASOS

Una vez completado este agente:

```bash
# 1. Validar implementación
npm run test:accounting

# 2. Ejecutar tests manuales
npm run test:integration

# 3. Documentar learnings
# Crear archivo de lecciones aprendidas

# 4. Pasar a siguiente fase
cd ../fase-2-ensamblaje-plataforma
```

---

**¡Este es el CORAZÓN del sistema! Asegúrate de que funcione perfectamente antes de avanzar.** 💙

Siguiente archivo: `03-sistema-plantillas.md`
