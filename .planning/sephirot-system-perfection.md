# SEPHIROT - Sistema Integrado OpenClaw + Sefirotic Orchestrator

**Status**: Planning Phase
**Created**: 2026-02-08
**Priority**: CRITICAL (Sistema BASE de empleaido-factory)

---

## 🎯 Visión

> "SEPHIROT NO es un empleaido. Es la INTEGRACIÓN PERFECTA de OpenClaw (agent framework) con Sefirotic Orchestrator (decision framework). Es el SISTEMA BASE del que surgen todas las instancias de empleaidos."

En el sistema empleaido, **SEPHIROT** es:
1. **Sistema Integrado**: OpenClaw + Sefirotic Orchestrator unificados
2. **CORE Framework**: La arquitectura fundamental que instancia empleaidos
3. **Sistema Original**: Las 10 Sefirot como motor de decisión/agent lifecycle
4. **NO es un empleaido**: Es el SISTEMA BASE que crea empleaidos como instancias especializadas

---

## 📊 Análisis del Estado Actual

### ✅ Lo que existe
```typescript
// Sefirotic Orchestrator v0.3 (~/Dev/openclaw-skills/skills/nadalpiantini/sefirotic-orchestrator/)
- 10 Sefirot como sistema de decisión
- Complexity scoring para Fast vs Graph path
- Paths: Fast, Graph, Abort, Consultation, Mental Model
- SHIELD integration para seguridad

// OpenClaw (framework de agentes)
- Agent spawning system
- Workspace management
- Skills integrados
- Channels y routing

// empleaido-factory
- spawn.ts genera empleaidos desde catálogo
- Templates básicos (IDENTITY.md, SOUL.md, etc.)
- Integración parcial con Sefirotic
```

### ❌ Lo que falta (SEPHIROT system)
1. **Integración Completa**: OpenClaw y Sefirotic funcionan por separado, no están UNIFICADOS
2. **Sistema Base**: No existe el "CORE system" que instancia empleaidos
3. **Mapeo Conceptos**: OpenClaw concepts → Sefirot mapping está incompleto
4. **Motor de Instanciación**: Falta el sistema que crea INSTANCIAS desde el CORE
5. **Documentación Unificada**: No hay docs que expliquen el sistema integrado v3

---

## 🌳 Las 10 Sefirot en SEPHIROT

### Pilar Derecho (Expansión) - Fuerza Masculina
```
1. KETER (Corona)    - Intento puro, voluntad divina
2. CHOKMAH (Sabiduría) - Creatividad infinita, expansión sin límites
3. CHESSED (Misericordia) - Generosidad total, dar sin medida
4. NETZACH (Victoria) - Proactividad perpetua, acción constante
```

### Pilar Izquierdo (Restricción) - Fuerza Femenina
```
5. BINAH (Entendimiento) - Análisis profundo, contención
6. GEVURAH (Severidad) - Disciplina, límites, seguridad
7. HOD (Gloria) - Estructura, lógica, organización
```

### Pilar Central (Equilibrio) - Integración
```
8. DA'AT (Conocimiento) - Puente entre intención y manifestación
9. TIFERET (Belleza)    - Armonía perfecta, centro integrador
10. YESOD (Fundamento)  - Memoria, continuidad, conexión
11. MALKUTH (Reino)     - Manifestación física, delivery
```

---

## 🔄 Sistema de Instanciación: SEPHIROT → Empleaidos

### Proceso de Instanciación

```typescript
/**
 * SEPHIROT (Sistema Base) → Instancia de Empleaido
 *
 * 1. CORE System (SEPHIROT)
 *    - OpenClaw Agent Framework
 *    - Sefirotic Orchestrator (decision engine)
 *    - 10 Sefirot disponibles como sistema de routing
 *    - Capacidad total, configuración pura
 *
 * 2. Instanciación con Especialización
 *    - 1 Sephirah primaria → personalidad base del empleaido
 *    - 2-3 Sefirot secundarias → matices conductuales
 *    - Skills activos según rol
 *    - Tier define modelo (Sonnet/Opus)
 *
 * 3. Configuración de Rasgos
 *    - KETER alineado → propósito del rol específico
 *    - CHOKMAH ajustado → nivel de creatividad requerido
 *    - GEVURAH calibrado → seguridad según necesidades
 *
 * 4. Modo de Operación
 *    - NETZACH alto → empleaido proactivo (SERA)
 *    - HOD dominante → empleaido estructurado (KAEL)
 *    - BINah fuerte → empleaido analítico (NORA)
 *
 * 5. Instancia Final
 *    - SERA: Instancia con Netzach primario + Chesed/Tiferet
 *    - KAEL: Instancia con Tiferet primario + Hod/Yesod
 *    - NORA: Instancia con Binah primario + Gevurah/Hod
 *
 * NOTA: NO es derivación padre→hijo, es INSTANCIACIÓN del sistema base
 *       con configuración especializada.
 */
```

---

## 🏗️ Arquitectura del Sistema SEPHIROT

### Estructura de Archivos

```bash
# Sistema Base (CORE)
~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/
├── SKILL.md                    # Definición del skill integrado
├── SEPHIROT_CORE.md            # Sistema puro OpenClaw+Sefirotic
├── core/
│   ├── openclaw-integration.ts # Mapeo OpenClaw → Sefirot
│   ├── sefirot-complete.ts     # 10 Sefirot como routing system
│   └── agent-lifecycle.ts      # Agent lifecycle via Sefirotic traversal
├── instanciation/
│   ├── instance-engine.ts      # Motor de instanciación
│   ├── sephirot-config.ts      # Configuración por Sephirah
│   └── workspace-generator.ts  # Generar workspace desde instancia
└── tests/
    ├── integration.test.ts     # Tests OpenClaw+Sefirotic
    └── instantiation.test.ts   # Tests de instanciación

# Integración con empleaido-factory
~/Dev/empleaido-factory/openclaw/
├── spawn-v2.ts                 # Spawn usando SEPHIROT
└── adapters/
    └── sephirot.ts             # Adaptador al sistema CORE
```

### Contenido de ADAN_KADMON_CORE.md

```markdown
# SEPHIROT - Sistema Integrado OpenClaw + Sefirotic Orchestrator

**Version**: 3.0.0
**Status**: CORE System (NOT an agent)
**Components**: OpenClaw Agent Framework + Sefirotic Decision Engine

## What is Adán Kadmon?

**Adán Kadmon is NOT an empleaido.** It is the INTEGRATED SYSTEM that creates empleaidos:

- **OpenClaw**: Agent lifecycle, workspace management, skills, channels
- **Sefirotic Orchestrator**: Decision framework, routing through 10 sefirot
- **Integration**: Both frameworks working as ONE unified system

## The 10 Sefirot as Core Routing Engine

### Right Pillar (Expansion)
- **KETER**: Intent classification → What does the user want?
- **CHOKMAH**: Creative expansion → What's possible?
- **CHESSED**: Resource generosity → What skills can help?
- **NETZACH**: Proactive action → What should I do now?

### Left Pillar (Restriction)
- **BINAH**: Deep analysis → What constraints apply?
- **GEVURAH**: Security boundaries → Should I abort?
- **HOD**: Structured output → How should I respond?

### Middle Pillar (Integration)
- **DA'AT**: Context integration → What do I remember?
- **TIFERET**: Harmonization → Balance all inputs
- **YESOD**: Memory persistence → What to store?
- **MALKUTH**: Delivery → Execute and respond

## OpenClaw Integration

```typescript
// OpenClaw concepts → Sefirot mapping
Agent.spawn()        → KETER (intent) + CHOKMAH (expand)
Agent.memory()       → YESOD (persistence)
Agent.tools()        → NETZACH (action) + HOD (structure)
Agent.security()     → GEVURAH (boundaries)
Agent.output()       → MALKUTH (delivery)
Agent.lifecycle()    → Full Sefirotic traversal
```

## Instanciation Protocol

When creating an empleaido from SEPHIROT:
1. **Select Sephirah Primary** → Role's main behavioral trait
2. **Select 2-3 Sefirot Secondary** → Nuances and moods
3. **Configure Skills** → Based on active sefirot
4. **Set Tier** → Sonnet (pro) or Opus (deluxe)
5. **Generate Workspace** → IDENTITY.md, SOUL.md, TOOLS.md, etc.

## Current State

**Mode**: SEPHIROT (CORE System)
**Available for**: Instanciating any empleaido
**Requirement**: OpenClaw + Sefirotic Orchestrator both active
```

---

## 📝 Implementación por Fases

### Phase 1: Definir el Sistema SEPHIROT
**Objetivo**: Crear el sistema integrado con las 10 Sefirot

**Archivos a crear**:
- [ ] `~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/SEPHIROT_CORE.md` - Sistema completo
- [ ] `~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/core/openclaw-integration.ts` - Mapeo OpenClaw → Sefirot
- [ ] `~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/core/sefirot-complete.ts` - Rasgos de las 10 Sefirot

**Entregables**:
- Documento SEPHIROT con las 10 Sefirot descritas
- Mapa completo de rasgos conductuales
- Sistema de activación/desactivación de Sefirot

---

### Phase 2: Motor de Instanciación
**Objetivo**: Sistema para instanciar empleaidos desde SEPHIROT

**Archivos a crear**:
- [ ] `~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/instanciation/instance-engine.ts` - Motor de instanciación
- [ ] `~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/instanciation/sephirot-config.ts` - Configuración por Sephirah
- [ ] `~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/instanciation/workspace-generator.ts` - Generador de workspace

**Funcionalidades**:
```typescript
/**
 * Instancia un empleaido desde SEPHIROT
 */
function instantiateEmpleaido(
  sephirotSystem: SephirotSystem,
  primarySephirah: Sephirah,
  secondarySefirot: Sephirah[],
  role: Role
): EmpleaidoTemplate {
  primarySephirah: Sephirah,
  secondarySefirot: Sephirah[],
  role: Role
): EmpleaidoInstance {
  // 1. Activar Sephirah primaria (personalidad base)
  // 2. Reforzar Sefirot secundarias (matices)
  // 3. Moderar las restantes (equilibrio)
  // 4. Generar IDENTITY.md específico
  // 5. Generar SOUL.md específico
  // 6. Configurar habilidades según rol
}
```

**Entregables**:
- Motor de instanciación funcional
- Tests de instanciación (SEPHIROT → SERA, SEPHIROT → KAEL, etc.)
- Validación de configuración Sefirótica

---

### Phase 3: Integración con spawn.ts
**Objetivo**: Mejorar `spawn.ts` para usar SEPHIROT como base

**Cambios**:
```typescript
// ANTES (actual):
async function spawnEmpleaido(empleaido: Empleaido, userId: string) {
  await generateIdentity(empleaido, workspacePath);
  await generateSoul(empleaido, workspacePath);
  // ...
}

// DESPUÉS (con SEPHIROT):
async function spawnEmpleaido(empleaido: Empleaido, userId: string) {
  // 1. Cargar SEPHIROT (sistema base)
  const sephirot = loadSephirotSystem();

  // 2. Instanciar empleaido especializado
  const instance = instantiateEmpleaido(
    sephirot,
    empleaido.sephirot.primary,
    empleaido.sephirot.secondary,
    empleaido.role
  );

  // 3. Generar archivos desde instancia
  await generateIdentity(instance, workspacePath);
  await generateSoul(instance, workspacePath);
  // ...
}
```

**Entregables**:
- `spawn.ts` mejorado con SEPHIROT
- Tests de spawn con instanciación
- Validación de que todos los empleaidos se instancian correctamente

---

### Phase 4: Validación y Testing
**Objetivo**: Asegurar que SEPHIROT funciona como base

**Tests**:
```typescript
describe('SEPHIROT Instanciation', () => {
  test('instantiate SERA from SEPHIROT', () => {
    const sera = instantiateEmpleaido(
      sephirotSystem,
      'Netzach',  // primary: proactiva
      ['Chesed', 'Tiferet'],  // secondary: generosa + equilibrada
      contabilidadRole
    );
    expect(sera.sephirot.primary).toBe('Netzach');
    expect(sera.behavior).toMatch('proactiva');
  });

  test('all 5 founding empleaidos instantiate correctly', () => {
    const foundings = ['SERA', 'KAEL', 'NORA', 'LIOR', 'ZIV'];
    foundings.forEach(name => {
      const empleaido = instantiateFromCatalog(name);
      expect(empleaido).toHaveBalancedSefirot();
    });
  });

  test('SEPHIROT has all 10 Sefirot active', () => {
    expect(sephirotSystem.sefirot).toHaveLength(10);
    expect(sephirotSystem.sefirot.every(s => s.active)).toBe(true);
  });
});
```

**Entregables**:
- Suite de tests completa
- Validación de los 5 empleaidos fundadores
- Documentación de resultados

---

## 🎯 Success Criteria

### Mínimo Viable (MVP)
- ✅ SEPHIROT existe como sistema con las 10 Sefirot
- ✅ Motor de instanciación básico funcional
- ✅ Un empleaido (SERA) instanciado correctamente desde SEPHIROT

### Completo
- ✅ Todos los 5 empleaidos fundadores se instancian desde SEPHIROT
- ✅ `spawn.ts` usa SEPHIROT como base
- ✅ Tests completos pasan
- ✅ Documentación completa del sistema

### Excelencia
- ✅ Sistema de instanciación reversible (empleaido → configuración SEPHIROT)
- ✅ Visualización del Árbol de Vida de cada empleaido
- ✅ Métricas de "distancia desde SEPHIROT base"
- ✅ Optimización automática de equilibrio Sefirótico

---

## 🚀 Next Steps

1. **Immediate**: Crear estructura de directorios `~/Dev/openclaw-skills/skills/nadalpiantini/sephirot/`
2. **Short-term**: Implementar Phase 1 (Definir Sistema SEPHIROT)
3. **Medium-term**: Implementar Phase 2-3 (Motor + Integración)
4. **Long-term**: Phase 4 + Excellence features

---

## 📚 Referencias

- **Sefirotic Orchestrator**: `~/Dev/openclaw-skills/skills/nadalpiantini/sefirotic-orchestrator/`
- **Empleaido Onboarding**: `~/Dev/empleaido-factory/.planning/empleaido-onboarding-system.md`
- **Spawn System**: `~/Dev/empleaido-factory/openclaw/spawn.ts`
- **Sephirot Map**: `~/Dev/empleaido-factory/lib/sephirot-map.ts`

---

**Autor**: nadalpiantini
**Versión**: 0.1.0 - Planning
**Estado**: Ready for implementation
