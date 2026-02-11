# ⚡ PLAN DE ACCIÓN INMEDIATO

**Fecha**: 2026-02-10
**Tiempo estimado**: 2 semanas hasta MVP completo
**Estado**: READY TO EXECUTE

---

## 📅 SEMANA 1: Foundation + Revenue

### DÍA 1 (HOY) - Stripe Integration (4 horas)

#### Paso 1: Instalar dependencias
```bash
cd /Users/nadalpiantini/dev/empleaido-factory/app
npm install stripe @stripe/stripe-js
```

#### Paso 2: Crear estructura de archivos
```bash
mkdir -p lib/stripe
mkdir -p app/app/api/stripe/create-checkout
mkdir -p app/app/api/stripe/webhooks
```

#### Paso 3: Implementar Stripe client
```typescript
// lib/stripe/index.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
})

export const PRICE_IDS = {
  base: process.env.STRIPE_PRICE_BASE!,
  pro: process.env.STRIPE_PRICE_PRO!,
  deluxe: process.env.STRIPE_PRICE_DELUXE!,
}
```

#### Paso 4: Crear checkout endpoint
```typescript
// app/app/api/stripe/create-checkout/route.ts
import { stripe, PRICE_IDS } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const { empleaidoId, tier } = await req.json()
  const headersList = await headers()
  const origin = headersList.get('origin')

  // Get user from session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
    mode: 'subscription',
    success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/catalog/${empleaidoId}`,
    metadata: {
      empleaido_id: empleaidoId,
      user_id: user.id,
      tier,
    },
  })

  return Response.json({ url: session.url })
}
```

#### Paso 5: Crear webhook handler
```typescript
// app/app/api/stripe/webhooks/route.ts
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { empleaido_id, user_id, tier } = session.metadata

    // Activate adoption
    await supabase.from('ef_adoptions').insert({
      user_id,
      empleaido_id,
      tier,
      status: 'active',
      stripe_subscription_id: session.subscription as string,
      created_at: new Date().toISOString(),
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    await supabase.from('ef_adoptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', subscription.id)
  }

  return Response.json({ received: true })
}
```

#### Paso 6: Agregar variables de entorno
```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASE=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_DELUXE=price_...
```

#### Paso 7: Actualizar schema de Supabase
```sql
-- Adiciones a tabla existente
ALTER TABLE ef_adoptions
ADD COLUMN tier TEXT DEFAULT 'base',
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN status TEXT DEFAULT 'pending';
```

**Checklist Día 1**:
- [ ] Stripe instalado
- [ ] Endpoints creados
- [ ] Webhook configurado en Stripe dashboard
- [ ] Test payment flow completo
- [ ] Environment variables en Vercel/Supabase

---

### DÍA 2-3 - Agent Execution API (8 horas)

#### Paso 1: Crear execution engine
```bash
mkdir -p lib/execution
mkdir -p app/app/api/agent/execute
```

#### Paso 2: Implementar core execution
```typescript
// lib/execution/engine.ts
import { executeAgent } from '@/lib/spawn'
import { supabase } from '@/lib/supabase'
import { applyActivity } from '@/lib/life-engine'

export async function executeEmpleaido(
  agentId: string,
  userId: string,
  input: string
) {
  // 1. Verify adoption
  const { data: adoption } = await supabase
    .from('ef_adoptions')
    .select('*')
    .eq('user_id', userId)
    .eq('empleaido_id', agentId)
    .single()

  if (!adoption || adoption.status !== 'active') {
    throw new Error('No active adoption found')
  }

  // 2. Check limits
  const thisMonth = new Date()
  const { count } = await supabase
    .from('ef_executions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1))

  const limits = { base: 100, pro: 1000, deluxe: Infinity }
  if (count! >= limits[adoption.tier]) {
    throw new Error('Monthly limit exceeded')
  }

  // 3. Execute
  const result = await executeAgent(agentId, input)

  // 4. Update life stats
  await applyActivity(agentId, 'task_completed')

  // 5. Log execution
  await supabase.from('ef_executions').insert({
    empleaido_id: agentId,
    user_id: userId,
    input,
    output: result.output,
    cost: result.cost || 0,
    created_at: new Date().toISOString(),
  })

  return result
}
```

#### Paso 3: Crear API endpoint
```typescript
// app/app/api/agent/execute/route.ts
import { executeEmpleaido } from '@/lib/execution/engine'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { agentId, input } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  try {
    const result = await executeEmpleaido(agentId, user.id, input)
    return Response.json(result)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
```

#### Paso 4: Crear tabla de ejecuciones
```sql
CREATE TABLE ef_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empleaido_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  input TEXT NOT NULL,
  output TEXT,
  cost DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_executions_user_month ON ef_executions(user_id, created_at);
```

**Checklist Día 2-3**:
- [ ] Execution engine implementado
- [ ] API endpoint funcional
- [ ] Rate limiting por tier
- [ ] Execution logging
- [ ] Tests manuales pasando

---

### DÍA 4-5 - Enhanced Onboarding (8 horas)

#### Paso 1: Crear wizard de 3 pasos
```bash
mkdir -p app/app/onboarding
mkdir -p app/app/components/onboarding/steps
```

#### Paso 2: Implementar wizard
```typescript
// app/app/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { Step1_SelectEmpleaido } from '@/components/onboarding/steps/Step1'
import { Step2_Customize } from '@/components/onboarding/steps/Step2'
import { Step3_Payment } from '@/components/onboarding/steps/Step3'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    empleaidoId: '',
    name: '',
    customFields: {},
    tier: 'base',
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Selecciona tu Empleaido</span>
            <span>Personaliza</span>
            <span>Confirma</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        {step === 1 && (
          <Step1_SelectEmpleaido
            onNext={(empleaidoId) => {
              setData({ ...data, empleaidoId })
              setStep(2)
            }}
          />
        )}

        {step === 2 && (
          <Step2_Customize
            empleaidoId={data.empleaidoId}
            onNext={(customData) => {
              setData({ ...data, ...customData })
              setStep(3)
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3_Payment
            data={data}
            onComplete={() => {
              // Redirect to Stripe
            }}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  )
}
```

#### Paso 3: Implementar componentes de pasos
```typescript
// components/onboarding/steps/Step1.tsx
export function Step1_SelectEmpleaido({ onNext }) {
  const empleaidos = useEmpleaidos()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Elige tu primer Empleaido
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {empleaidos.map((e) => (
          <EmpleaidoCard
            key={e.id}
            empleaido={e}
            onSelect={() => onNext(e.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

**Checklist Día 4-5**:
- [ ] Wizard UI implementado
- [ ] Validaciones funcionando
- [ ] Progress indicator
- [ ] Navigation (back/next)
- [ ] Flow completo testeado

---

## 📅 SEMANA 2: Builder + Enhanced Features

### DÍA 6-10 - No-Code Builder (20 horas)

#### Paso 1: Setup
```bash
mkdir -p app/app/builder
mkdir -p app/app/components/builder
npm install @dnd-kit/core @dnd-kit/sortable react beautiful-dnd
```

#### Paso 2: Core builder UI
```typescript
// app/app/builder/page.tsx
'use client'

import { useState } from 'react'
import { BuilderLayout } from '@/components/builder/BuilderLayout'
import { PreviewPanel } from '@/components/builder/PreviewPanel'
import { ConfigPanel } from '@/components/builder/ConfigPanel'

export default function BuilderPage() {
  const [config, setConfig] = useState<EmpleaidoConfig>(DEFAULT)

  return (
    <BuilderLayout>
      <PreviewPanel config={config} />
      <ConfigPanel
        config={config}
        onChange={setConfig}
        sections={BUILDER_SECTIONS}
      />
      <ActionBar onSave={handleSave} onPublish={handlePublish} />
    </BuilderLayout>
  )
}
```

#### Paso 3: Implementar drag & drop
```typescript
// components/builder/ConfigPanel.tsx
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'

export function ConfigPanel({ config, onChange, sections }) {
  const [activeTab, setActiveTab] = useState('basic')

  return (
    <div className="w-1/2 bg-white border-l p-6">
      <Tabs value={activeTab} onChange={setActiveTab}>
        {sections.map((section) => (
          <Tab key={section.id} value={section.id}>
            {section.title}
          </Tab>
        ))}
      </Tabs>

      {activeTab === 'basic' && <BasicInfoSection config={config} onChange={onChange} />}
      {activeTab === 'personality' && <PersonalitySection config={config} onChange={onChange} />}
      {activeTab === 'skills' && <SkillsSection config={config} onChange={onChange} />}
      {activeTab === 'custom' && <CustomFieldsSection config={config} onChange={onChange} />}
    </div>
  )
}
```

#### Paso 4: Database schema para custom empleaidos
```sql
CREATE TABLE ef_custom_empleaidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  sephirot_id TEXT NOT NULL,
  personality JSONB NOT NULL,
  skills JSONB NOT NULL,
  custom_fields JSONB,
  pricing JSONB NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ef_custom_field_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empleaido_id UUID REFERENCES ef_custom_empleaidos(id),
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL,
  options JSONB,
  required BOOLEAN DEFAULT false
);
```

**Checklist Día 6-10**:
- [ ] Builder UI funcional
- [ ] Drag & drop trabajando
- [ ] Live preview
- [ ] Custom fields editor
- [ ] Draft/publish system
- [ ] Save/load functionality

---

### DÍA 11-12 - Streaming Chat (8 horas)

#### Paso 1: Setup
```bash
mkdir -p app/app/chat/[agentId]
npm install @ai-sdk/openai ai use-chat
```

#### Paso 2: Streaming API
```typescript
// app/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages, agentId } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: await getAgentSystemPrompt(agentId),
    messages,
  })

  return result.toDataStreamResponse()
}
```

#### Paso 3: Chat UI con streaming
```typescript
// app/app/chat/[agentId]/page.tsx
'use client'

import { useChat } from 'ai/react'

export default function ChatPage({ params }: { params: { agentId: string } }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { agentId: params.agentId },
  })

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe tu mensaje..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </form>
    </div>
  )
}
```

**Checklist Día 11-12**:
- [ ] Streaming endpoint
- [ ] Chat UI con streaming
- [ ] Message history
- [ ] File upload
- [ ] Typing indicators

---

### DÍA 13-14 - Dashboard Enhancements + Polish (8 horas)

#### Paso 1: Enhanced dashboard
```typescript
// app/app/dashboard/page.tsx
export default async function DashboardPage() {
  const { data: { user } } = await supabase.auth.getUser()

  const [empleaidos, stats] = await Promise.all([
    getUserEmpleaidos(user.id),
    getDashboardStats(user.id),
  ])

  return (
    <div className="p-8">
      <StatsGrid stats={stats} />
      <EmpleaidoGrid empleaidos={empleaidos} />
      <ActivityTimeline userId={user.id} />
    </div>
  )
}
```

#### Paso 2: Real-time stats
```typescript
// lib/stats.ts
export async function getDashboardStats(userId: string) {
  const { data: executions } = await supabase
    .from('ef_executions')
    .select('*')
    .eq('user_id', userId)

  const thisMonth = executions.filter(e =>
    new Date(e.created_at).getMonth() === new Date().getMonth()
  )

  return {
    totalEmpleaidos: 0, // from adoptions
    totalCost: thisMonth.reduce((sum, e) => sum + (e.cost || 0), 0),
    totalExecutions: thisMonth.length,
    avgCost: thisMonth.reduce((sum, e) => sum + (e.cost || 0), 0) / thisMonth.length,
  }
}
```

**Checklist Día 13-14**:
- [ ] Dashboard con stats reales
- [ ] Activity timeline
- [ ] Cost tracking visible
- [ ] Quick actions
- [ ] Responsive design
- [ ] Dark mode (opcional)
- [ ] Error boundaries
- [ ] Loading states

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-production
- [ ] Todas las variables de entorno configuradas
- [ ] Stripe webhooks apuntando a production URL
- [ ] Supabase RLS policies verificadas
- [ ] Database indexes creados
- [ ] CDN assets configurados
- [ ] Error tracking (Sentry) configurado
- [ ] Analytics (Vercel) configurado

### Testing final
- [ ] Flujo completo: Onboarding → Payment → Chat
- [ ] Tier limits funcionando
- [ ] Custom empleaidos creados y publicados
- [ ] Execution costs tracking
- [ ] Webhooks procesando correctamente

### Launch
- [ ] Deploy a Vercel
- [ ] Run migrations en Supabase
- [ ] Verificar Stripe products/prices
- [ ] Test en producción
- [ ] Monitor logs por 24h
- [ ] Beta user invite

---

## 📊 SUCCESS METRICS

### Week 1
- [ ] Stripe checkout funcionando
- [ ] 5 test purchases completados
- [ ] Execution API estable
- [ ] Onboarding流畅

### Week 2
- [ ] Builder MVP usable
- [ ] 3 custom empleaidos creados
- [ ] Streaming chat estable
- [ ] Dashboard con datos reales

### Post-launch (Month 1)
- 🎯 100 beta users
- 🎯 20 paying customers
- 🎯 $500 MRR
- 🎯 < 2% error rate

---

## 🆘 SUPPORT

Si encuentras bloqueos:
1. Verificar logs en Vercel
2. Revisar Supabase logs
3. Check Stripe dashboard
4. Verificar environment variables

---

**READY TO BUILD! 🚀**
