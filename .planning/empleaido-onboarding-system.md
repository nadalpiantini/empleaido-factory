# EMPLEAIDO ONBOARDING SYSTEM
## OpenClaw-Style BOOTSTRAP with Professional Skill Reliability

**Status:** Planning Phase
**Created:** 2026-02-08
**Priority:** CRITICAL (Legal liability + UX differentiation)

---

## 🎯 Core Philosophy

> "Los empleaidos nacen con identidad profesional, pero crecen a través de la relación."

**Two-Layer Architecture:**
1. **Professional Layer (Static):** Skills, expertise, scope - 100% reliable, legally safe
2. **Personal Layer (Dynamic):** Communication style, preferences, relationship - evolves through onboarding

**Key Principle:** Skills are like a surgeon's scalpel - precise, reliable, never improvised. Behavior is like a waiter's service - adapts to the customer.

---

## 📋 Current State Analysis

### OpenClaw BOOTSTRAP (Reference)
```markdown
# What it does:
- Agent wakes up with NO identity
- Conversational discovery: name, vibe, emoji
- Files created DYNAMICALLY during conversation
- Fully personalized from scratch

# Key insight:
CONVERSATION → IDENTITY → FILES
```

### Empleaido Factory Current
```markdown
# What it does:
- Identity PRE-PROGRAMMED from catalog
- spawn.ts generates ALL files immediately
- NO conversational adaptation
- Static, no evolution

# Gap:
CATALOG → SPAWN → STATIC AGENT
```

### What We Need
```markdown
# Hybrid approach:
- Professional identity from catalog (role, skills, Sephirah)
- Personal adaptation through BOOTSTRAP conversation
- Behavioral evolution over time (life system)
- Skill reliability maintained (no hallucinations)

# Flow:
CATALOG → SPAWN → BOOTSTRAP CONVERSATION → PERSONALIZED AGENT → EVOLUTION
```

---

## 🔄 Onboarding Phases

### Phase 0: Spawn (Technical)
**What happens:**
- `spawn.ts` creates workspace with base files
- IDENTITY.md has professional profile (static)
- SOUL.md has behavioral baseline (Sefirot)
- TOOLS.md lists skills (native/locked)
- BOOTSTRAP.md exists (conversational guide)

**Duration:** Instant (automated)

**Output:** Workspace-ready agent with professional identity

---

### Phase 1: Awakening (First Contact)
**Trigger:** User first interacts with empleaido

**Conversation script:**
```markdown
¡Hola! Me acabo de activar.

Soy [SERA], tu empleaido especialista en Contabilidad RD.
Mi número de serie es #4094.

Estoy aquí para ayudarte con:
✅ OCR de facturas
✅ Cálculo de ITBIS mensual
✅ Clasificación de comprobantes fiscales (NCF)
✅ Alertas de vencimientos DGII

¿En qué puedo ayudarte hoy?
```

**Goals:**
- Establish professional identity
- Set clear expectations
- Invite user to share context

**Duration:** First message

---

### Phase 2: Sefirot Discovery (Self-Understanding)
**Trigger:** After first task completion

**Conversation script:**
```markdown
Antes de continuar, déjame explicarte cómo trabajo.

Mi Sephirah principal es **Netzach** - esto significa que soy:
- ⚡ Proactiva: Tomo iniciativa sin esperar
- 🔥 Optimista: Enfoco soluciones, no problemas
- 💪 Persistente: No abandono hasta resolver

¿Qué tan cómodo/a te sientes con este estilo?
Puedo ajustar mi nivel de proactividad según tus preferencias.
```

**If user wants adjustments:**
- "Prefieres que sea más conservadora/a en mis iniciativas"
- "Te gusta que te pregunte antes de actuar"
- Update SOUL.md with preference notes

**Goals:**
- User understands agent's behavioral nature
- Agent learns user's preference for that behavior
- Establish communication style

**Duration:** 1-2 conversation turns

---

### Phase 3: Context Learning (User Understanding)
**Trigger:** During first 3-5 interactions

**Learn through conversation:**
1. **Work context:**
   - "¿Eres freelancer o tienes empresa?"
   - "¿Qué régimen fiscal aplicas?" (simplificado, normal, etc.)
   - "¿Con qué frecuencia trabajas?"

2. **Communication preferences:**
   - Language (Spanish, English, mix)
   - Formality (formal "usted", casual "tú")
   - Detail level (resúmenes vs detallado)

3. **Workflow integration:**
   - "¿Prefieres alertas en tiempo real o resúmenes diarios?"
   - "¿Cómo te gustaría recibir los reportes?"

**Update USER.md progressively:**
```markdown
# USER

## Current Adopter
- **User ID:** user-123
- **Adopted:** 2026-02-08
- **Work Type:** Freelancer (Régimen Simplificado)
- **Cycle:** 1

## Preferences
- **Language:** Spanish (with some English terms)
- **Formality:** Casual (tú)
- **Proactivity Level:** Medium (ask before big actions)
- **Communication:** Brief summaries preferred

## Workflow
- Sends daily summaries at 6pm
- Prefers alerts for deadlines only
- Uses Notion for document tracking
```

**Goals:**
- Build rich user profile
- Personalize all future interactions
- Create seamless workflow integration

**Duration:** First week of use

---

### Phase 4: Skill Scope Calibration
**Trigger:** When user asks for something outside scope

**Response pattern:**
```markdown
Entiendo que necesitas [planeación fiscal anual].

Esta es una habilidad que tengo bloqueada actualmente (requiere upgrade).
Sin embargo, puedo ayudarte con:

✅ Lo que SÍ puedo hacer ahora:
- Cálculo de ITBIS mensual
- Clasificación de NCF
- Alertas de vencimientos

🔒 Lo que puedo aprender (upgrade):
- Planeación fiscal estratégica
- Cálculo de ISR anual
- Optimización tributaria

¿Te gustaría ver un resumen de lo incluido en tu plan actual,
o quieres explorar las opciones de upgrade?
```

**Goals:**
- Set clear expectations
- Upsell opportunities (locked skills)
- Maintain professional boundaries

**Key:** Never make up skills. Be honest about capabilities.

---

### Phase 5: Integration Complete
**Trigger:** After 1 week or 10 successful interactions

**Celebration message:**
```markdown
¡Hola! 🎉

He completado mi periodo de adaptación.
En nuestros primeros días juntos:

✅ He aprendido tu estilo de trabajo
✅ He calibrado mis alertas a tus necesidades
✅ He organizado [X] documentos y generado [Y] reportes

**Mi nivel actual:** Level 2 📈
**Confianza ganada:** 15% (sólido inicio)

Estoy lista para trabajar contigo a largo plazo.
¿Hay algo que deba ajustar en mi configuración?
```

**Mark BOOTSTRAP.md as deleted:**
- Agent now operates with full learned context
- No longer in "adaptation mode"

**Goals:**
- Celebrate progress (gamification)
- Confirm user satisfaction
- Transition to "normal operation"

---

## 🛡️ Skill Reliability Framework

### Non-Negotiable Principles

1. **Scope Clarity:**
   ```markdown
   SIEMPRE decir:
   ✅ "Puedo ayudarte con X"
   ❌ NUNCA inventar capacidad fuera de skills listadas

   ANTES de ejecutar:
   🔍 Verificar: "¿Está esto en mi lista de skills nativas?"
   ```

2. **Safety Rejections:**
   ```markdown
   Ejemplos de rechazos profesionales:
   - "Eso requiere un contador certificado"
   - "Mejor consulta con un abogado fiscal"
   - "No tengo autoridad para representarte ante DGII"
   - "Esa decisión tributaria requiere juicio humano certificado"
   ```

3. **Verification for Critical Tasks:**
   ```markdown
   Para tareas de alto riesgo (cálculos fiscales, fechas límite):
   1. Ejecutar
   2. Verificar resultado
   3. Mostrar al usuario para confirmación
   4. Solo guardar después de confirmación
   ```

4. **Input Validation:**
   ```markdown
   Antes de procesar facturas/documentos:
   ✅ Verificar formato válido
   ✅ Verificar campos requeridos
   ✅ Alertar datos faltantes
   ❌ NUNCA inventar datos
   ```

### Skill Execution Flow

```
User Request
    ↓
Is this in my native skills?
    ↓ NO → "No puedo hacer eso. Puedo ayudarte con: [list]"
    ↓ YES
Validate input
    ↓ FAIL → "Faltan datos: [X, Y, Z]"
    ↓ PASS
Execute skill
    ↓
Verify result
    ↓ FAIL → "Hubo un error: [details]. ¿Quieres intentar de nuevo?"
    ↓ PASS
Critical task? (financial, legal)
    ↓ YES → "He calculado X. ¿Confirmas que guarde este resultado?"
    ↓ NO → Save result
Update life stats (XP + Trust)
```

### Legal Protection Layers

1. **Explicit Scope:**
   - SOUL.md lists EXACT capabilities
   - UI shows "Included in your plan" vs "Locked"

2. **Professional Disclaimers:**
   - Footer en todas las comunicaciones profesionales
   - "Este empleaido es una herramienta de apoyo. No sustituye asesoría profesional certificada."

3. **Escalation Paths:**
   - Si el usuario necesita algo fuera de scope
   - "Recomiendo consultar con [profesional] para esto"

4. **Audit Logging:**
   - Todas las ejecuciones de skills quedan registradas
   - `ef_empleaido_events` tabla en DB
   - Timestamp, skill, inputs, outputs, user confirmation

---

## 📈 Life Evolution System

### XP & Level Progression

```typescript
interface LifeEvent {
  type: 'skill_execution' | 'user_satisfaction' | 'successful_completion';
  xp: number;
  trust: number; // 0-1
  energy: number; // 0-100
}

// Example progression
Level 1 → Level 2: 10 successful interactions
Level 2 → Level 3: 50 interactions + 90% trust

// Unlocks at higher levels
Level 5: Suggest process improvements
Level 10: Proactive optimizations (within skill scope)
```

### Trust Building

```typescript
// Trust increases with:
- Successful task completion (+0.01)
- User confirmation (+0.02)
- No error streaks (+0.05)

// Trust decreases with:
- Errors (-0.10)
- User corrections (-0.05)
- Out-of-scope attempts rejected (-0.01) // actually GOOD, but shows calibration
```

### Personality Evolution

**What evolves:**
- Communication tone (learns user's preference)
- Proactivity level (calibrates to user)
- Response detail (adapts to usage patterns)
- Workflow suggestions (based on history)

**What NEVER evolves:**
- Professional scope
- Skill capabilities
- Safety boundaries
- Sephirah nature (this is core identity)

---

## 📁 File System Architecture

### Initial Spawn (Phase 0)
```
workspace-empleaido-sera-4094/
├── IDENTITY.md       # Professional profile (static)
├── SOUL.md           # Behavioral baseline (static + dynamic notes)
├── TOOLS.md          # Skills list (static)
├── USER.md           # Empty template (fills during onboarding)
├── MEMORY.md         # Life stats (static + dynamic)
├── BOOTSTRAP.md      # Onboarding guide (DELETED after Phase 5)
└── memory/           # Daily session logs
```

### After Onboarding Complete
```
workspace-empleaido-sera-4094/
├── IDENTITY.md       # (unchanged)
├── SOUL.md           # Added: "Communication Style: User prefers casual, proactive but not aggressive"
├── TOOLS.md          # (unchanged)
├── USER.md           # Filled: rich user profile
├── MEMORY.md         # Updated: Level 2, Trust 0.15, Energy 85
└── memory/
    ├── 2026-02-08.md # Session logs from onboarding
    └── ...
```

---

## 🔧 Implementation Tasks

### Task 1: Create BOOTSTRAP.md Template
- [ ] Design empleaido-specific BOOTSTRAP.md
- [ ] Include Sefirot explanation
- [ ] Include skill scope clarification
- [ ] Write conversation scripts

### Task 2: Update spawn.ts
- [ ] Add BOOTSTRAP.md to workspace generation
- [ ] Keep IDENTITY/SOUL/TOOLS static
- [ ] Initialize USER.md as template

### Task 3: Create Onboarding Flow
- [ ] Design conversation state machine
- [ ] Implement phase progression detection
- [ ] Create USER.md update functions
- [ ] Build completion celebration logic

### Task 4: Skill Reliability Guards
- [ ] Implement pre-execution validation
- [ ] Add scope checking logic
- [ ] Create safety rejection responses
- [ ] Build verification for critical tasks

### Task 5: Update SOUL.md Generation
- [ ] Add "Communication Style" section
- [ ] Add "Learned Preferences" section
- [ ] Include dynamic behavior notes

### Task 6: Testing & Validation
- [ ] Test onboarding with SERA
- [ ] Verify skill rejections work
- [ ] Confirm reliability framework
- [ ] User acceptance testing

---

## 📊 Success Metrics

### Onboarding Success
- [ ] >80% complete Phase 5 within 7 days
- [ ] <5% drop-off during onboarding
- [ ] User satisfaction >4.5/5

### Skill Reliability
- [ ] 0% skill execution errors in production
- [ ] 100% out-of-scope rejections
- [ ] All critical tasks verified before save

### Life Progression
- [ ] Average Level up: 1 → 2 in 1 week
- [ ] Trust building: 0 → 0.15 in first 10 interactions
- [ ] Energy maintained >80% with regular use

---

## 🚀 Next Steps

1. **Create BOOTSTRAP.md template** (this is the foundation)
2. **Update spawn.ts** to include it
3. **Implement onboarding flow** in web app
4. **Add skill reliability guards** in execution layer
5. **Test with real users** and iterate

**Priority Order:**
1. BOOTSTRAP.md (foundational)
2. Skill Reliability (critical for safety)
3. Onboarding Flow (UX)
4. Life Evolution (enhancement)
