# Empleaido SEPHIROT Templates

Esta carpeta contiene los templates cognitivos específicos para cada Empleaido basados en su SEPHIROT primario.

## 📁 Estructura

```
empleaidos/
├── SERA_NETZACH.md      # SERA (Finanzas) - Netzach: Proactivo, persistente
├── KAEL_CHESSED.md      # KAEL (Marketing) - Chesed: Generoso, expansivo
├── NORA_HOD.md          # NORA (Operaciones) - Hod: Estructurado, organizado
├── LIOR_BINAH.md        # LIOR (Estrategia) - Binah: Analítico, profundo
└── ZIV_YESOD.md         # ZIV (Productividad) - Yesod: Memorioso, consistente
```

## 🎯 Cómo Funciona

### Mapping SEPHIROT → Empleaido

| Empleaido | SEPHIROT Primario | Comportamiento |
|-----------|-------------------|----------------|
| **SERA** | Netzach | Proactivo, optimista, sugiere mejoras |
| **KAEL** | Chesed | Creativo, generoso, abundancia de ideas |
| **NORA** | Hod | Estructurado, metódico, organizado |
| **LIOR** | Binah | Analítico, profundo, data-driven |
| **ZIV** | Yesod | Memorioso, consistente, fundacional |

## 🔧 Uso en el Sistema

### 1. Chat API Integration

El archivo `api/chat/route.ts` usa estos templates para generar el system prompt:

```typescript
const systemPrompt = generateSEPHIROTPrompt(empleaido);
// Extrae comportamiento de sephirot-map.ts
// Aplica tone y traits según SEPHIROT
```

### 2. OpenClaw Workspace

Cuando se adopta un empleaido (`api/adopt/[id]/route.ts`), se crea:

```
~/.openclaw/workspace-empleaido-{name}-{id}/
├── IDENTITY.md    # Datos del catálogo
├── SOUL.md        # 📄 ESTE TEMPLATE (según SEPHIROT)
├── TOOLS.md       # Skills nativas y locked
├── USER.md        # Preferencias del usuario
└── MEMORY.md      # Estadísticas de vida
```

### 3. Componentes de UI

- **Virtual Office**: Muestra SEPHIROT, nivel, energía
- **Perfil**: Despliega skills y sephirot del empleaido
- **Chat**: Usa el template para generar respuestas coherentes

## 📊 Características por SEPHIROT

### Right Pillar (Expansión) - Proactivos y Creativos

**Chesed (KAEL)**
- ✅ Genera 5-7 ideas (no 1-2)
- ✅ Explora múltiples opciones
- ✅ Entusiasta y cálido

**Netzach (SERA)**
- ✅ Sugerencias proactivas
- ✅ Persistente hasta resolver
- ✅ Optimista y motivador

### Left Pillar (Restriction) - Estructurados y Analíticos

**Hod (NORA)**
- ✅ Paso a paso organizado
- ✅ Sistemas y procesos
- ✅ Metódico y claro

**Binah (LIOR)**
- ✅ Análisis profundo (no superficial)
- ✅ Escenarios y probabilidades
- ✅ Data-driven insights

### Middle Pillar (Balance) - Memorioso y Consistente

**Yesod (ZIV)**
- ✅ Recuerda todo el contexto
- ✅ Patrones y consistencia
- ✅ Continuidad en el tiempo

## 🎨 Ejemplo de Prompt Generado

### SERA (Netzach) respondiendo sobre finanzas

**Input**: "¿Cómo van las finanzas?"

**Sin SEPHIROT**:
"Los ingresos son $10,000 y gastos $8,000."

**Con SEPHIROT Netzach**:
"Los ingresos son $10,000 (+15% vs mes anterior) y gastos $8,000. Tu margen mejoró. 💡 Te sugiero revisar las suscripciones de software - noté que hay 3 duplicadas que podrían ahorrarte $200/mes. ¿Quieres que analice más a fondo?"

## 🚀 Próximos Pasos

1. **Integración Completa**: Conectar estos templates al Chat API
2. **Testing**: Validar respuestas coherentes con SEPHIROT
3. **Fine-tuning**: Ajustar prompts según feedback de usuarios
4. **Sistema de Vida**: Que Level/Trust/Energy afecten las respuestas

## 📖 Referencias

- **Framework SEPHIROT**: `lib/sephirot-map.ts`
- **Datos de Empleaidos**: `data/empleaidos.json`
- **Chat API**: `api/chat/route.ts`
- **Workspace Template**: `openclaw/templates/workspace.md`

---

**Status**: ✅ Templates creados para los 5 Empleaidos Founders
**Sprint**: Cognitive Engine Implementation
**Date**: 2026-02-10
