# 🤖 Empleaido Motors Architecture

**Pattern**: Specialized Agent Motors (inspired by LangGraph approach)

## Concepto

Cada Empleaido es un **Motor Especializado** con:
- **Core Engine**: Base Agent class (comportamiento compartido)
- **Specialized Layer**: Skills específicas del empleaido
- **Personality Layer**: Sefirot nature (Netzach, Hod, etc.)
- **Memory System**: Session + long-term learning
- **Tool Registry**: Native + locked skills

```typescript
// Motor Base
abstract class EmpleaidoMotor {
  abstract execute(input: string): Promise<Result>
  abstract skills: Skill[]
  personality: SefirotNature
  memory: MemorySystem
}

// Motor Especializado
class MotorSERA extends EmpleaidoMotor {
  skills = [parseInvoice, calculateITBIS, dgiiCompliance]
  personality = Netzach // Proactiva, optimista
}

class MotorKAEL extends EmpleaidoMotor {
  skills = [socialAds, contentStrategy, analytics]
  personality = Hod // Empática, creativa
}
```

## Onboarding como Bootstrap del Motor

El **onboarding NO es un proceso separado** → es el **bootstrap del motor**:

```
Fase 0: Spawn (Crea archivos base)
    ↓
IDENTITY.md → Profesional Identity (static)
SOUL.md → Personality Baseline (static)
TOOLS.md → Skills Registry (static)
USER.md → Empty template (dynamic)
MEMORY.md → Life stats (dynamic)
BOOTSTRAP.md → Onboarding guide (deleted after)
    ↓
Fase 1-5: User conversa con motor
    ↓
Motor aprende preferences → USER.md llena
Motor calibra communication → SOUL.md actualizada
Motor gana XP → MEMORY.md updated
    ↓
BOOTSTRAP.md deleted → Motor "fully operational"
```

## Implementación Sprint 3

### 1. Onboarding State Machine
`lib/onboarding/phases/state-machine.ts`
- Phase progression logic
- Conversation state tracking
- USER.md progressive updates

### 2. Skill Reliability Guards
`lib/onboarding/guards/skill-guards.ts`
- Pre-execution validation
- Scope checking (no hallucinations)
- Safety rejections

### 3. Memory System
`lib/onboarding/memory/progressive-builder.ts`
- USER.md building functions
- SOUL.md dynamic updates
- MEMORY.md life stats

### 4. BOOTSTRAP.md Template
`lib/onboarding/templates/bootstrap-template.md`
- Empleaido-specific conversation scripts
- Sefirot explanation flow
- Skill scope clarification

## Connection to Existing Code

```typescript
// Existing: lib/openclaw/agent-interface.ts
spawnEmpleaido(empleaidoId, userId) → creates workspace with BOOTSTRAP.md

// New: lib/onboarding/phases/
processMessage(userId, message) → handles onboarding conversation

// New: lib/onboarding/guards/
validateSkillExecution(empleaidoId, skill, input) → scope checking

// Existing: components/virtual-office/chat/
ChatOverlay.tsx → sends messages to onboarding API
```

## Next Actions (YOLO Mode)

1. ✅ Create directory structure
2. 🔄 Implement state machine
3. 🔄 Create skill guards
4. 🔄 Build BOOTSTRAP.md template generator
5. 🔄 Integrate with existing chat API
6. 🔄 Test with SERA empleaido
7. 🔄 Deploy to staging

No keys, no APIs, no small decisions stopping.
