# 🔗 FASE 3: LÍNEA DE ENSAMBLAJE
**Sistema de composición y orquestación de agentes**

---

## 🎯 Objetivos

- [x] Sistema para combinar múltiples motores
- [x] Orquestador de agentes con LangGraph
- [x] Sistema de conexión de motores
- [x] Gestión de estado entre motores
- [x] Pipeline de ejecución
- [x] Sistema de errores y reintentos

---

## 🏗️ Arquitectura de Ensamblaje

### Concepto de Agente Compuesto

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENTE COMPLETO                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   MOTOR 1   │    │   MOTOR 2   │    │   MOTOR 3   │     │
│  │Contabilidad│    │  Finanzas   │    │  Usuario    │     │
│  │             │    │             │    │             │     │
│  │ - Tools     │    │ - Tools     │    │ - Custom    │     │
│  │ - Prompts   │    │ - Prompts   │    │ - Prompts   │     │
│  │ - Graph     │    │ - Graph     │    │ - Graph     │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  ORCHESTRATOR  │                       │
│                    │  (LangGraph)   │                       │
│                    │                │                       │
│                    │ - Route inputs │                       │
│                    │ - Merge outputs│                       │
│                    │ - Handle errors│                       │
│                    └────────┬───────┘                       │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │  USER INTERFACE │                      │
│                    │  (Chat UI)      │                      │
│                    └─────────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Sistema de Composición

### Tipo Agente Compuesto

```typescript
// src/types/agente.ts

export interface AgenteCompuesto {
  id: string;
  name: string;
  description: string;

  // Motores que componen el agente
  motores: {
    motorId: string;
    config: {
      enabled: boolean;
      priority: number; // 1-10, mayor = más prioritario
      customizations?: {
        systemPrompt?: string; // Override del prompt
        tools?: string[]; // Tools habilitadas
      };
    };
  }[];

  // Configuración de orquestación
  orquestacion: {
    mode: 'sequential' | 'parallel' | 'conditional' | 'router';
    fallbackStrategy: 'stop' | 'continue' | 'retry';
    maxRetries: number;
    timeout: number; // segundos
  };

  // Conexiones entre motores
  conexiones: Conexion[];

  // Estado global
  estadoGlobal: {
    schema: Record<string, any>; // Definición del estado compartido
    persistencia: boolean; // Si persistir estado entre ejecuciones
  };
}

export interface Conexion {
  from: {
    motorId: string;
    output?: string; // Output específico del motor
  };
  to: {
    motorId: string;
    input?: string; // Input específico del motor
  };
  condition?: string; // Expresión condicional
  transform?: TransformFunction; // Transformación de datos
}

export interface TransformFunction {
  type: 'map' | 'filter' | 'reduce' | 'custom';
  code: string; // JavaScript expression
}
```

### Servicio de Ensamblaje

```typescript
// src/services/agente-ensamblador.ts

import { AgenteCompuesto } from '@/types/agente';
import { MOTOR_CONTABILIDAD } from '@/motores/motor-contabilidad';
import { MOTOR_GENERICO } from '@/motores/motor-generico';
import { getMotorById } from '@/services/motor-repository';

export class AgenteEnsamblador {
  async ensamblar(agenteConfig: AgenteCompuesto) {
    // 1. Cargar motores
    const motores = await Promise.all(
      agenteConfig.motores.map(async (m) => {
        const motor = await getMotorById(m.motorId);
        return {
          motor,
          config: m.config,
        };
      })
    );

    // 2. Validar configuración
    this.validarConfig(agenteConfig, motores);

    // 3. Construir grafo de orquestación
    const graph = await this.construirGrafo(agenteConfig, motores);

    // 4. Compilar agente
    const agenteCompilado = {
      id: agenteConfig.id,
      graph,
      estadoGlobal: agenteConfig.estadoGlobal,
      motores: motores.map(m => m.motor),
    };

    return agenteCompilado;
  }

  private validarConfig(config: AgenteCompuesto, motores: any[]) {
    // Validar que todos los motores existen
    const motoresFaltantes = config.motores.filter(m =>
      !motores.find(loaded => loaded.motor.id === m.motorId)
    );

    if (motoresFaltantes.length > 0) {
      throw new Error(`Motores no encontrados: ${motoresFaltantes.map(m => m.motorId).join(', ')}`);
    }

    // Validar conexiones
    for (const conn of config.conexiones) {
      const fromMotor = motores.find(m => m.motor.id === conn.from.motorId);
      const toMotor = motores.find(m => m.motor.id === conn.to.motorId);

      if (!fromMotor) {
        throw new Error(`Conexión inválida: motor "${conn.from.motorId}" no existe`);
      }
      if (!toMotor) {
        throw new Error(`Conexión inválida: motor "${conn.to.motorId}" no existe`);
      }
    }
  }

  private async construirGrafo(config: AgenteCompuesto, motores: any[]) {
    const { StateGraph } = await import('@langchain/langgraph');

    // Definir estado global
    const stateSchema = config.estadoGlobal.schema;

    // Crear grafo
    const graph = new StateGraph({ stateSchema });

    // Agregar nodos (motores)
    for (const { motor, motorConfig } of motores) {
      if (!motorConfig.config.enabled) continue;

      const nodeFunction = this.crearNodoMotor(motor, motorConfig);
      graph.addNode(motor.id, nodeFunction);
    }

    // Agregar edges (conexiones)
    if (config.orquestacion.mode === 'sequential') {
      // Ejecución secuencial
      for (let i = 0; i < config.conexiones.length; i++) {
        const conn = config.conexiones[i];
        graph.addEdge(conn.from.motorId, conn.to.motorId);
      }
    } else if (config.orquestacion.mode === 'parallel') {
      // Ejecución paralela
      const startNodeId = 'START';
      const endNodeId = 'END';

      for (const conn of config.conexiones) {
        graph.addEdge(startNodeId, conn.to.motorId);
        graph.addEdge(conn.from.motorId, endNodeId);
      }
    } else if (config.orquestacion.mode === 'router') {
      // Router basado en condiciones
      graph.addConditionalEdges(
        'router',
        this.crearRouterLogic(config),
        config.conexiones.map(c => c.to.motorId)
      );
    }

    return graph.compile();
  }

  private crearNodoMotor(motor: any, motorConfig: any) {
    return async (state: any) => {
      try {
        // Aplicar customizaciones
        let systemPrompt = motor.code.systemPrompt;
        if (motorConfig.customizations?.systemPrompt) {
          systemPrompt = motorConfig.customizations.systemPrompt;
        }

        // Ejecutar motor
        const resultado = await this.ejecutarMotor(motor, {
          ...state,
          systemPrompt,
        });

        // Actualizar estado
        return {
          ...state,
          [motor.id]: resultado,
          lastOutput: resultado,
        };
      } catch (error) {
        if (motorConfig.config.priority >= 8) {
          // Motor crítico, propagar error
          throw error;
        } else {
          // Motor no crítico, continuar
          return {
            ...state,
            [motor.id]: { error: error.message },
          };
        }
      }
    };
  }

  private crearRouterLogic(config: AgenteCompuesto) {
    return (state: any) => {
      // Evaluar condiciones y decidir a qué motor enrutar
      for (const conn of config.conexiones) {
        if (!conn.condition) continue;

        const shouldRoute = this.evaluarCondicion(conn.condition, state);
        if (shouldRoute) {
          return conn.to.motorId;
        }
      }

      // Default: primer motor
      return config.conexiones[0]?.to.motorId;
    };
  }

  private evaluarCondicion(condition: string, state: any): boolean {
    // Evaluar expresión de forma segura
    try {
      const func = new Function('state', `return ${condition}`);
      return func(state);
    } catch {
      return false;
    }
  }

  private async ejecutarMotor(motor: any, input: any) {
    // Implementación de ejecución de motor
    // (ya vista en FASE 2)
    return { success: true, output: 'Motor ejecutado' };
  }
}

export const agenteEnsamblador = new AgenteEnsamblador();
```

---

## 🎯 Ejemplos de Ensamblaje

### Ejemplo 1: Agente de Finanzas Completas

```typescript
// examples/agente-finanzas-completas.ts

import { AgenteCompuesto } from '@/types/agente';

export const AGENTE_FINANZAS: AgenteCompuesto = {
  id: 'agente-finanzas-completo',
  name: 'Agente de Finanzas Completo',
  description: 'Contabilidad + Finanzas + Reportes automatizados',

  motores: [
    {
      motorId: 'motor-contabilidad-v1',
      config: {
        enabled: true,
        priority: 10,
        customizations: {
          systemPrompt: `Eres un asistente contable experto especializado en PyMEs.

FOCO:
- Facturas y cobranzas
- Gastos y categorización
- Impuestos básicos

REGLAS ESPECÍFICAS:
- Prioriza facturas vencidas
- Alerta sobre gastos inusuales
- Calcula IVA automáticamente`,
        },
      },
    },
    {
      motorId: 'motor-finanzas-v1',
      config: {
        enabled: true,
        priority: 8,
      },
    },
    {
      motorId: 'motor-generico-v1',
      config: {
        enabled: true,
        priority: 5,
        customizations: {
          systemPrompt: `Eres un asistente financiero adicional.

TU ROL:
- Responder preguntas generales
- Explicar conceptos financieros
- Dar recomendaciones básicas

NO:
- No registras transacciones
- No calculas impuestos (lo hace el motor de contabilidad)`,
        },
      },
    },
  ],

  orquestacion: {
    mode: 'router',
    fallbackStrategy: 'continue',
    maxRetries: 2,
    timeout: 120,
  },

  conexiones: [
    {
      from: { motorId: 'START' },
      to: { motorId: 'motor-contabilidad-v1' },
      condition: 'state.inputType === "invoice" || state.inputType === "expense"',
    },
    {
      from: { motorId: 'START' },
      to: { motorId: 'motor-finanzas-v1' },
      condition: 'state.inputType === "report" || state.inputType === "analysis"',
    },
    {
      from: { motorId: 'START' },
      to: { motorId: 'motor-generico-v1' },
      condition: '!state.inputType',
    },
    {
      from: { motorId: 'motor-contabilidad-v1' },
      to: { motorId: 'motor-finanzas-v1' },
      condition: 'state.needAnalysis === true',
    },
  ],

  estadoGlobal: {
    schema: {
      inputType: 'string',
      currentPeriod: 'object',
      transactions: 'array',
      reports: 'array',
      lastUpdate: 'string',
    },
    persistencia: true,
  },
};
```

### Ejemplo 2: Agente de Atención al Cliente

```typescript
// examples/agente-atencion-cliente.ts

export const AGENTE_ATENCION_CLIENTE: AgenteCompuesto = {
  id: 'agente-atencion-cliente',
  name: 'Agente de Atención al Cliente',
  description: 'Soporte + Consultas + Escalado a humano',

  motores: [
    {
      motorId: 'motor-soporte-v1',
      config: {
        enabled: true,
        priority: 10,
      },
    },
    {
      motorId: 'motor-consultas-v1',
      config: {
        enabled: true,
        priority: 8,
      },
    },
    {
      motorId: 'motor-escalado-v1',
      config: {
        enabled: true,
        priority: 5,
      },
    },
  ],

  orquestacion: {
    mode: 'conditional',
    fallbackStrategy: 'continue',
    maxRetries: 1,
    timeout: 60,
  },

  conexiones: [
    {
      from: { motorId: 'START' },
      to: { motorId: 'motor-soporte-v1' },
      condition: 'state.urgency === "low"',
    },
    {
      from: { motorId: 'START' },
      to: { motorId: 'motor-consultas-v1' },
      condition: 'state.category === "information"',
    },
    {
      from: { motorId: 'motor-soporte-v1' },
      to: { motorId: 'motor-escalado-v1' },
      condition: 'state.resolved === false && state.attempts >= 2',
    },
  ],

  estadoGlobal: {
    schema: {
      customerId: 'string',
      category: 'string',
      urgency: 'string',
      resolved: 'boolean',
      attempts: 'number',
      escalationReason: 'string',
    },
    persistencia: false,
  },
};
```

---

## 🔄 Ejecutor de Agentes

```typescript
// src/services/agente-ejecutor.ts

import { AgenteCompuesto } from '@/types/agente';
import { agenteEnsamblador } from './agente-ensamblador';
import { redis } from '@/lib/cache';

export class AgenteEjecutor {
  async ejecutar(
    agenteConfig: AgenteCompuesto,
    input: string,
    contexto?: any
  ) {
    // 1. Verificar cache
    const cacheKey = this.getCacheKey(agenteConfig.id, input);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. Ensamblar agente (o usar cached)
    let agenteCompilado = await this.getAgenteCompilado(agenteConfig.id);
    if (!agenteCompilado) {
      agenteCompilado = await agenteEnsamblador.ensamblar(agenteConfig);
      await this.cacheAgenteCompilado(agenteConfig.id, agenteCompilado);
    }

    // 3. Ejecutar con manejo de errores
    const resultado = await this.ejecutarConReintentos(
      agenteCompilado,
      input,
      contexto,
      agenteConfig.orquestacion
    );

    // 4. Cache resultado
    await redis.setex(cacheKey, 300, JSON.stringify(resultado)); // 5 min

    return resultado;
  }

  private async ejecutarConReintentos(
    agente: any,
    input: string,
    contexto: any,
    orquestacion: any
  ) {
    let intentos = 0;
    const maxIntentos = orquestacion.maxRetries || 1;

    while (intentos < maxIntentos) {
      try {
        const resultado = await this.ejecutarInterno(agente, input, contexto);

        return {
          success: true,
          output: resultado,
          intentos: intentos + 1,
        };
      } catch (error) {
        intentos++;

        if (intentos >= maxIntentos) {
          // Último intento falló
          if (orquestacion.fallbackStrategy === 'continue') {
            return {
              success: false,
              error: error.message,
              fallback: true,
            };
          } else {
            throw error;
          }
        }

        // Esperar antes de reintentar (backoff exponencial)
        await this.delay(Math.pow(2, intentos) * 1000);
      }
    }
  }

  private async ejecutarInterno(agente: any, input: string, contexto: any) {
    // Invocar el grafo compilado
    const initialState = {
      input,
      ...contexto,
      timestamp: new Date().toISOString(),
    };

    const result = await agente.graph.invoke(initialState);

    return result;
  }

  private async getAgenteCompilado(agenteId: string) {
    const cached = await redis.get(`compiled:${agenteId}`);
    return cached ? JSON.parse(cached) : null;
  }

  private async cacheAgenteCompilado(agenteId: string, agente: any) {
    await redis.setex(
      `compiled:${agenteId}`,
      3600, // 1 hora
      JSON.stringify(agente)
    );
  }

  private getCacheKey(agenteId: string, input: string): string {
    const hash = this.hashString(input);
    return `exec:${agenteId}:${hash}`;
  }

  private hashString(str: string): string {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const agenteEjecutor = new AgenteEjecutor();
```

---

## 🎨 Builder No-Code

### Estructura del Builder

```typescript
// src/components/builder/AgenteBuilder.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MotorLibrary } from './MotorLibrary';
import { ConnectionCanvas } from './ConnectionCanvas';
import { PropertyPanel } from './PropertyPanel';
import { AgenteCompuesto } from '@/types/agente';

export function AgenteBuilder() {
  const [selectedMotores, setSelectedMotores] = useState<string[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [config, setConfig] = useState<Partial<AgenteCompuesto>>({
    orquestacion: {
      mode: 'sequential',
      fallbackStrategy: 'continue',
      maxRetries: 2,
      timeout: 120,
    },
  });

  const handleAddMotor = (motorId: string) => {
    setSelectedMotores([...selectedMotores, motorId]);
  };

  const handleRemoveMotor = (motorId: string) => {
    setSelectedMotores(selectedMotores.filter(id => id !== motorId));
    setConnections(connections.filter(c =>
      c.from.motorId !== motorId && c.to.motorId !== motorId
    ));
  };

  const handleAddConnection = (connection: any) => {
    setConnections([...connections, connection]);
  };

  const handleSave = async () => {
    const agenteConfig: AgenteCompuesto = {
      id: `agente-${Date.now()}`,
      name: 'Mi Agente',
      description: 'Descripción del agente',
      motores: selectedMotores.map(motorId => ({
        motorId,
        config: {
          enabled: true,
          priority: 5,
        },
      })),
      conexiones: connections,
      orquestacion: config.orquestacion!,
      estadoGlobal: {
        schema: {},
        persistencia: false,
      },
    };

    // Guardar configuración
    await fetch('/api/agentes', {
      method: 'POST',
      body: JSON.stringify(agenteConfig),
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar: Biblioteca de motores */}
      <div className="w-64 border-r p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Motores</h2>
        <MotorLibrary
          selected={selectedMotores}
          onAdd={handleAddMotor}
          onRemove={handleRemoveMotor}
        />
      </div>

      {/* Canvas: Arrastrar y conectar */}
      <div className="flex-1 bg-gray-50 relative">
        <ConnectionCanvas
          motores={selectedMotores}
          connections={connections}
          onAddConnection={handleAddConnection}
        />
      </div>

      {/* Panel: Propiedades */}
      <div className="w-80 border-l p-4 overflow-auto">
        <PropertyPanel
          config={config}
          onChange={setConfig}
        />
        <Button
          className="w-full mt-4"
          onClick={handleSave}
        >
          Guardar Agente
        </Button>
      </div>
    </div>
  );
}
```

### Canvas de Conexiones

```typescript
// src/components/builder/ConnectionCanvas.tsx

'use client';

import { useCallback } from 'react';
import { MotorNode } from './MotorNode';

interface ConnectionCanvasProps {
  motores: string[];
  connections: any[];
  onAddConnection: (conn: any) => void;
}

export function ConnectionCanvas({
  motores,
  connections,
  onAddConnection,
}: ConnectionCanvasProps) {
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);

  const handleNodeDragStart = useCallback((motorId: string) => {
    setDraggingFrom(motorId);
  }, []);

  const handleNodeDrop = useCallback((targetMotorId: string) => {
    if (draggingFrom && draggingFrom !== targetMotorId) {
      onAddConnection({
        from: { motorId: draggingFrom },
        to: { motorId: targetMotorId },
      });
    }
    setDraggingFrom(null);
  }, [draggingFrom, onAddConnection]);

  return (
    <div className="w-full h-full relative p-8">
      {/* Render connections */}
      <svg className="absolute inset-0 pointer-events-none">
        {connections.map((conn, i) => (
          <ConnectionLine
            key={i}
            from={conn.from.motorId}
            to={conn.to.motorId}
          />
        ))}
      </svg>

      {/* Render motor nodes */}
      <div className="grid grid-cols-3 gap-4">
        {motores.map(motorId => (
          <MotorNode
            key={motorId}
            motorId={motorId}
            onDragStart={handleNodeDragStart}
            onDrop={handleNodeDrop}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist FASE 3

### Sistema de Composición
- [ ] AgenteCompuesto type definido
- [ ] AgenteEnsamblador implementado
- [ ] Validación de configuraciones
- [ ] Construcción de grafos

### Orquestación
- [ ] Ejecución secuencial
- [ ] Ejecución paralela
- [ ] Router condicional
- [ ] Manejo de errores

### Builder No-Code
- [ ] MotorLibrary component
- [ ] ConnectionCanvas component
- [ ] PropertyPanel component
- [ ] Drag & drop funcional

### Ejecución
- [ ] AgenteEjecutor implementado
- [ ] Sistema de reintentos
- [ ] Cache de agentes compilados
- [ ] Cache de resultados

---

**Siguiente fase**: `FASE_4_EMPAQUETADO.md` - Sistema de packaging y delivery
