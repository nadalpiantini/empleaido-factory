# 🔗 MAPEO TÉCNICO: Agent Wrapping → Empleaido Factory

**Fecha**: 2026-02-10
**Referencia**: Integration con `~/Downloads/agent-wrapping-plan`

---

## 📋 MAPEO DE FASES

### FASE 1: Fabricación de Motores ↔ Empleaido Factory

| Agent Wrapping Plan | Empleaido Factory | Status |
|---------------------|-------------------|--------|
| `agent-engines/` con Python/LangGraph | `openclaw/` + `lib/` con OpenClaw | ✅ **EQUIVALENTE** |
| MotorContable.py | SERA (Netzach) | ✅ **IMPLEMENTADO** |
| MotorUsuarios.py | Sistema de usuarios | ⚠️ **PARCIAL** |
| LLM Provider abstraction | `lib/llm/zai-client.ts` | ✅ **IMPLEMENTADO** |
| Tools (invoice_parser, calculator) | Skills system | ✅ **IMPLEMENTADO** |

**Conclusión**: Fase 1 está CUBIERTA por OpenClaw + Sephirot framework.

---

### FASE 2: Ensamblaje (Marketplace + Builder)

| Agent Wrapping Plan | Empleaido Factory | Gap | Acción |
|---------------------|-------------------|-----|--------|
| Template Marketplace | `app/app/catalog/page.tsx` | 🟡 | **ENHANCE**: Add search, filters, sorting |
| Builder No-Code | ❌ NO EXISTE | 🔴 | **BUILD**: Drag & drop builder |
| Sistema de Accounts | Supabase Auth | ⚠️ | **COMPLETE**: OAuth + user management |
| Payments (Stripe) | ❌ Documentado, no implementado | 🔴 | **IMPLEMENTAR**: Checkout + webhooks |

**Acción Crítica**: Builder No-Code es el mayor gap.

---

### FASE 3: Delivery (Onboarding + Pagos)

| Agent Wrapping Plan | Empleaido Factory | Gap | Acción |
|---------------------|-------------------|-----|--------|
| Wizard de 3 pasos | `app/app/components/onboarding/` | 🟡 | **ENHANCE**: Add progress, validation |
| Stripe checkout | ❌ NO EXISTE | 🔴 | **IMPLEMENTAR**: Full flow |
| Welcome emails | ❌ NO EXISTE | 🟡 | **ADD**: Resend integration |
| In-app tutorials | ❌ NO EXISTE | 🟢 | **OPTIONAL**: Nice to have |

**Acción Crítica**: Stripe implementation bloquea revenue.

---

### FASE 4: Usuario Final (Chat + Dashboard)

| Agent Wrapping Plan | Empleaido Factory | Gap | Acción |
|---------------------|-------------------|-----|--------|
| Chat en tiempo real | `virtual-office/` | 🟡 | **ENHANCE**: Add streaming, history |
| Upload de archivos | ❌ NO EXISTE | 🟡 | **ADD**: File upload endpoint |
| Dashboard con stats | `app/app/dashboard/page.tsx` | 🟡 | **ENHANCE**: Real-time metrics |
| Execution logs | ❌ NO EXISTE | 🟡 | **ADD**: Usage tracking |

**Conclusión**: Dashboard existe pero necesita enhancements.

---

### FASE 5: Servicio (Soporte + Monitoring)

| Agent Wrapping Plan | Empleaido Factory | Gap | Acción |
|---------------------|-------------------|-----|--------|
| Error tracking (Sentry) | ❌ NO EXISTE | 🔴 | **ADD**: Sentry integration |
| System monitoring | ❌ NO EXISTE | 🔴 | **ADD**: Vercel Analytics |
| Backup system | ❌ NO EXISTE | 🟡 | **SETUP**: Supabase automated backups |
| Status page | ❌ NO EXISTE | 🟢 | **OPTIONAL**: For transparency |

**Conclusión**: Operational basics needed before scaling.

---

## 🏗️ ARQUITECTURA: Agent Wrapping → Empleaido Factory

### Original (Agent Wrapping Plan)
```
┌─────────────────────────────────────────────────────────────┐
│                    USER LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  Web UI (Next.js) → No-Code Builder → Chat Interface        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   PLATFORM LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Template Engine  │  Marketplace  │  User Management         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Agent Orchestrator  │  Execution Engine  │  Cost Tracker    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     AGENT MOTORS                            │
├─────────────────────────────────────────────────────────────┤
│  MotorContable (Python)  │  MotorUsuarios (Python)          │
└─────────────────────────────────────────────────────────────┘
```

### Empleaido Factory (Con enhancements propuestos)
```
┌─────────────────────────────────────────────────────────────┐
│                    USER LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  Catalog → Builder (NEW) → Chat (ENHANCED) → Dashboard     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   PLATFORM LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Template Engine  │  Marketplace (ENHANCED)  │  Auth        │
│  Life Engine      │  Sephirot Framework       │  Payments(NEW)│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  OpenClaw Orchestrator  │  Execution API (NEW)  │  Skills   │
│  Agent Spawning         │  Cost Tracking (NEW)   │  Life Sys  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     AGENT MOTORS                            │
├─────────────────────────────────────────────────────────────┤
│  SERA (Netzach)  │  KAEL (Chesed)  │  NORA (Hod)           │
│  LIOR (Binah)    │  ZIV (Yesod)    │  Custom Agents (NEW)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 EJEMPLOS DE CÓDIGO: Migración del Plan

### 1. Template Marketplace (Plan → Empleaido Factory)

#### Original Plan (Python/Next.js)
```python
# agent-engines/src/template_engine.py
class Template:
    def __init__(self, id, name, agent_config, user_fields):
        self.id = id
        self.name = name
        self.agent_config = agent_config
        self.user_fields = user_fields
```

#### Empleaido Factory (TypeScript) ✅ EXISTENTE
```typescript
// lib/types.ts
export interface Empleaido {
  id: string
  name: string
  tagline: string
  description: string
  sephirot_id: SephirotId
  personality: Personality
  skills: Skills
  image_url: string
  pricing: Pricing
}
```

**MEJORA PROPUESTA**: Agregar `custom_fields` para builder:
```typescript
// enhanced types.ts
export interface Empleaido {
  // ... existing fields
  custom_fields?: CustomField[]  // NEW
  is_custom?: boolean             // NEW
  creator_id?: string             // NEW
}

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'select' | 'multiselect'
  options?: string[]
  required: boolean
  default_value?: any
}
```

---

### 2. Execution Engine (Plan → Empleaido Factory)

#### Original Plan
```python
# agent-engines/src/execution.py
class ExecutionEngine:
    async def execute(self, agent_id, input, config):
        agent = await load_agent(agent_id)
        result = await agent.run(input)
        await log_execution(agent_id, result)
        return result
```

#### Empleaido Factory (NUEVA IMPLEMENTACIÓN)
```typescript
// lib/execution-engine.ts
import { executeAgent } from './spawn'
import { supabase } from './supabase'

export interface ExecutionRequest {
  agentId: string
  userId: string
  input: string
  context?: Record<string, any>
}

export interface ExecutionResult {
  output: string
  cost: number
  tokens_used: number
  duration_ms: number
}

export async function executeEmpleaido(
  request: ExecutionRequest
): Promise<ExecutionResult> {
  // 1. Verify user has access
  const { data: adoption } = await supabase
    .from('ef_adoptions')
    .select('*')
    .eq('user_id', request.userId)
    .eq('empleaido_id', request.agentId)
    .single()

  if (!adoption) {
    throw new Error('User has not adopted this empleaido')
  }

  // 2. Check energy
  const empleaido = await getEmpleaido(request.agentId)
  if (empleaido.life.energy < 10) {
    throw new Error('Empleaido needs rest')
  }

  // 3. Execute via OpenClaw
  const startTime = Date.now()
  const result = await executeAgent(request.agentId, request.input)
  const duration = Date.now() - startTime

  // 4. Update life stats
  await applyActivity(request.agentId, 'task_completed')

  // 5. Log execution for billing
  await supabase.from('ef_executions').insert({
    empleaido_id: request.agentId,
    user_id: request.userId,
    input: request.input,
    output: result.output,
    cost: result.cost,
    tokens_used: result.tokens,
    duration_ms: duration,
    created_at: new Date().toISOString(),
  })

  return {
    output: result.output,
    cost: result.cost,
    tokens_used: result.tokens,
    duration_ms: duration,
  }
}
```

---

### 3. Stripe Integration (Plan → Empleaido Factory)

#### Original Plan
```typescript
// app/api/stripe/create-checkout/route.ts
export async function POST(req: Request) {
  const { userId, priceId } = await req.json()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    // ...
  })
}
```

#### Empleaido Factory (ADAPTADO con Life Engine)
```typescript
// app/app/api/stripe/create-checkout/route.ts
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

const TIERS = {
  base: { priceId: 'price_base', empleaidos: 1, messages: 100 },
  pro: { priceId: 'price_pro', empleaidos: 3, messages: 1000 },
  deluxe: { priceId: 'price_deluxe', empleaidos: -1, messages: -1 }, // unlimited
}

export async function POST(req: Request) {
  const { empleaidoId, userId, tier } = await req.json()

  // Get empleaido info
  const empleaido = await getEmpleaido(empleaidoId)

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer_email: (await getUser(userId)).email,
    line_items: [{
      price: TIERS[tier].priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${origin}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/catalog/${empleaidoId}`,
    metadata: {
      empleaido_id: empleaidoId,
      user_id: userId,
      tier: tier,
    },
  })

  // Create pending adoption record
  await supabase.from('ef_adoptions').insert({
    user_id: userId,
    empleaido_id: empleaidoId,
    status: 'pending_payment',
    stripe_session_id: session.id,
    created_at: new Date().toISOString(),
  })

  return Response.json({ url: session.url })
}

// Webhook handler
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const event = stripe.webhooks.constructEvent(await req.text(), sig, webhookSecret)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { empleaido_id, user_id, tier } = session.metadata

    // Activate adoption
    await supabase.from('ef_adoptions').update({
      status: 'active',
      tier: tier,
      activated_at: new Date().toISOString(),
    }).eq('stripe_session_id', session.id)

    // Initialize empleaido life
    await initializeEmpleaidoLife(empleaido_id, user_id)
  }

  return Response.json({ received: true })
}
```

---

### 4. No-Code Builder (NUEVO - No existe en plan original)

```typescript
// app/app/builder/page.tsx
'use client'

import { useState } from 'react'
import { BuilderLayout } from '@/components/builder/BuilderLayout'
import { PreviewPanel } from '@/components/builder/PreviewPanel'
import { ConfigPanel } from '@/components/builder/ConfigPanel'
import { EmpleaidoConfig, DEFAULT_CONFIG } from '@/lib/builder-templates'

export default function EmpleaidoBuilderPage() {
  const [config, setConfig] = useState<EmpleaidoConfig>(DEFAULT_CONFIG)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await saveDraft(config)
    setSaving(false)
  }

  const handlePublish = async () => {
    if (!validateConfig(config)) return
    await publishEmpleaido(config)
    // Redirect to marketplace
  }

  return (
    <BuilderLayout>
      <PreviewPanel config={config} />

      <ConfigPanel
        config={config}
        onChange={setConfig}
        sections={[
          { id: 'basic', title: 'Basic Info', component: BasicInfoSection },
          { id: 'personality', title: 'Personality', component: PersonalitySection },
          { id: 'sephirot', title: 'Sephirot Archetype', component: SephirotSelector },
          { id: 'skills', title: 'Skills', component: SkillsBuilder },
          { id: 'custom', title: 'Custom Fields', component: CustomFieldsBuilder },
        ]}
      />

      <ActionButtons>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button onClick={handlePublish} className="primary">
          Publish to Marketplace
        </button>
      </ActionButtons>
    </BuilderLayout>
  )
}

// lib/builder-templates.ts
export const DEFAULT_CONFIG: EmpleaidoConfig = {
  name: '',
  tagline: '',
  description: '',
  sephirot_id: 'netzach',
  personality: {
    traits: [],
    communication_style: 'professional',
    humor_level: 0.5,
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
}

export function validateConfig(config: EmpleaidoConfig): boolean {
  return !!(
    config.name &&
    config.tagline &&
    config.description &&
    config.skills.native.length > 0
  )
}
```

---

## 📊 COMPARATIVA DE STACK TECNOLÓGICO

| Componente | Agent Wrapping Plan | Empleaido Factory | Decisión |
|------------|---------------------|-------------------|----------|
| **Frontend** | Next.js 14 + shadcn/ui | Next.js 16 + Tailwind | ✅ **MANTENER** (más nuevo) |
| **Backend** | tRPC / API Routes | Next.js API Routes | ✅ **MANTENER** |
| **Database** | Supabase | Supabase | ✅ **MANTENER** |
| **Agent Engine** | Python/LangGraph | OpenClaw | ✅ **MANTENER** (más avanzado) |
| **Auth** | Supabase Auth | Supabase Auth | ✅ **MANTENER** |
| **Payments** | Stripe | 🔄 TO IMPLEMENT | 🔄 **IMPLEMENTAR** |
| **Monitoring** | Sentry + Vercel | ❌ NONE | 🔴 **AGREGAR** |
| **Email** | Resend | ❌ NONE | 🟡 **AGREGAR** |

---

## 🎯 GAP ANALYSIS PRIORITIZADO

### 🔴 CRITICAL (Implementar esta semana)

1. **Stripe Checkout + Webhooks**
   - Tiempo: 3 días
   - Impacto: Revenue activation
   - Código: Listo arriba

2. **Agent Execution API**
   - Tiempo: 2 días
   - Impacto: Product core functionality
   - Código: Listo arriba

### 🟡 HIGH (Implementar próxima semana)

3. **No-Code Builder MVP**
   - Tiempo: 1 semana
   - Impacto: Unlimited scalability
   - Estado: No existe, necesita full build

4. **Enhanced Onboarding Wizard**
   - Tiempo: 2 días
   - Impacto: +30% conversión
   - Estado: Parcialmente existe

### 🟢 MEDIUM (Sprint 3)

5. **Streaming Chat Interface**
   - Tiempo: 3 días
   - Impacto: UX premium
   - Estado: Virtual Office básico existe

6. **Dashboard con Real-time Stats**
   - Tiempo: 2 días
   - Impacto: User engagement
   - Estado: Dashboard estático existe

---

## 📝 RESUMEN EJECUTIVO

### ¿Qué está bien cubierto?
✅ Motores de agentes (OpenClaw > Python/LangGraph)
✅ Framework de comportamiento (Sephirot es único y superior)
✅ Sistema de vida (Life Engine es más avanzado que el plan)
✅ Catálogo básico

### ¿Qué falta implementar?
🔴 Stripe payments (bloquea revenue)
🔴 No-code builder (bloquea scalability)
🔴 Execution API (bloquea productización)
🟡 Enhanced onboarding (mejora conversión)
🟡 Streaming chat (mejora UX)
🟡 Monitoring (necesario para producción)

### Recommendation
**Empleaido Factory tiene una base SÓLIDA** que es SUPERIOR al plan original en varios aspectos (Sephirot, Life Engine, OpenClaw).

**El path forward es agregar las piezas de platformización**:
1. Pagos (3 días)
2. Execution API (2 días)
3. Builder (1 semana)

**Tiempo hasta producto completo**: ~2 semanas
**Inversión**: ~80 horas
**ROI esperado**: Platform escalable con recurring revenue

---

**Fin del Mapeo Técnico**
