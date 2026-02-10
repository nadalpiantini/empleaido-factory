# 🚀 PLAN DE INTEGRACIÓN: AGENT WRAPPING → EMPLEAIDO FACTORY

**Fecha**: 2026-02-10
**Estado**: Propuesta Maximizada
**Prioridad**: ALTA

---

## 📊 ANÁLISIS COMPARATIVO

### Agent Wrapping Plan vs Empleaido Factory

| Componente | Agent Wrapping Plan | Empleaido Factory (Actual) | Gap |
|------------|---------------------|----------------------------|-----|
| **Motores Base** | Python/LangGraph | OpenClaw (existente) | ✅ CUBIERTO |
| **Marketplace** | Template Marketplace | Catalog (básico) | ⚠️ MEJORABLE |
| **Builder No-Code** | Drag & drop UI | ❌ NO EXISTE | 🔴 CRÍTICO |
| **Onboarding** | Wizard 3 pasos | ❌ PARCIAL | 🟡 IMPORTANTE |
| **Pagos** | Stripe | ❌ NO EXISTE | 🔴 CRÍTICO |
| **Chat Interface** | Streaming chat | Virtual Office (básico) | ⚠️ MEJORABLE |
| **Dashboard** | Stats + Agent cards | Dashboard (básico) | ⚠️ MEJORABLE |
| **Sistema de Templates** | User custom fields | Static profiles | 🔴 OPORTUNIDAD |
| **API Execution** | Execution Engine | ❌ NO EXISTE | 🔴 CRÍTICO |
| **Monitoring** | Sentry + Analytics | ❌ NO EXISTE | 🟡 IMPORTANTE |

---

## 🎯 OPORTUNIDADES DE MEJORA IDENTIFICADAS

### 🔴 CRÍTICAS (Bloquean escalabilidad)

1. **Builder No-Code de Empleaidos**
   - **Actual**: Solo 5 empleaidos estáticos
   - **Propuesto**: Usuarios crean empleaidos custom
   - **Impacto**: Escala ilimitada de empleaidos
   - **Esfuerzo**: 2 semanas

2. **Sistema de Ejecución de Agentes**
   - **Actual**: OpenClaw es local-only
   - **Propuesto**: API execution engine cloud
   - **Impacto**: Productizable como SaaS
   - **Esfuerzo**: 1 semana

3. **Stripe Payments**
   - **Actual**: Documentado, no implementado
   - **Propuesto**: Checkout + Webhooks + Suscripciones
   - **Impacto**: Revenue real
   - **Esfuerzo**: 3 días

### 🟡 IMPORTANTES (Mejoran conversión)

4. **Onboarding Wizard Mejorado**
   - **Actual**: Flow básico
   - **Propuesto**: 3-step interactive wizard
   - **Impacto**: +30% conversión
   - **Esfuerzo**: 2 días

5. **Template Marketplace Dinámico**
   - **Actual**: Catalog estático
   - **Propuesto**: Marketplace con filtros + search
   - **Impacto**: Discovery mejorado
   - **Esfuerzo**: 3 días

6. **Chat Interface con Streaming**
   - **Actual**: Virtual Office básico
   - **Propuesto**: Real-time streaming + file upload
   - **Impacto**: UX premium
   - **Esfuerzo**: 4 días

### ⚠️ MEJORAS (Quality of life)

7. **Dashboard con Stats en Tiempo Real**
   - **Actual**: Dashboard estático
   - **Propuesto**: Usage metrics + cost tracking
   - **Impacto**: Transparencia para usuarios
   - **Esfuerzo**: 2 días

8. **Sistema de Tickets de Soporte**
   - **Actual**: No existe
   - **Propuesto**: Integrated ticket system
   - **Impacto**: Customer success
   - **Esfuerzo**: 2 días

---

## 📋 PLAN DE IMPLEMENTACIÓN

### FASE 1: Foundation (Semana 1-2) 🔧

#### 1.1 Stripe Integration (3 días)
```typescript
// app/app/api/stripe/create-checkout/route.ts
export async function POST(req: Request) {
  const { empleaidoId, userId, tier } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
    success_url: `${origin}/dashboard?success=true`,
    cancel_url: `${origin}/catalog/${empleaidoId}`,
  })

  return Response.json({ url: session.url })
}
```

**Deliverables**:
- ✅ Checkout page
- ✅ Webhook handler
- ✅ Subscription tiers (Base: $9, Pro: $29, Deluxe: $79)
- ✅ User limits enforcement

#### 1.2 Agent Execution API (4 días)
```typescript
// api/agent-execute/route.ts
export async function POST(req: Request) {
  const { agentId, input, userId } = await req.json()

  // Check user has access to this agent
  const adoption = await getAdoption(userId, agentId)
  if (!adoption) return new Response('Unauthorized', { status: 401 })

  // Execute agent via OpenClaw
  const result = await executeAgent(agentId, input)

  // Log execution for billing
  await logExecution(agentId, userId, result.cost)

  return Response.json(result)
}
```

**Deliverables**:
- ✅ Execution endpoint
- ✅ Rate limiting por tier
- ✅ Cost tracking
- ✅ Execution logs

#### 1.3 Enhanced Onboarding (2 días)
```typescript
// app/app/onboarding/page.tsx
export default function OnboardingWizard() {
  const [step, setStep] = useState(1)

  return (
    <Wizard>
      {step === 1 && <Step1_SelectEmpleaido onNext={setStep(2)} />}
      {step === 2 && <Step2_CustomizeFields onNext={setStep(3)} />}
      {step === 3 && <Step3_ConfirmPayment onComplete={complete} />}
    </Wizard>
  )
}
```

**Deliverables**:
- ✅ 3-step wizard
- ✅ Progress indicator
- ✅ Field customization
- ✅ Payment flow integrado

---

### FASE 2: Marketplace + Builder (Semana 3-4) 🏪

#### 2.1 Dynamic Marketplace (3 días)
```typescript
// app/app/marketplace/page.tsx
export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { category?: string, search?: string }
}) {
  const empleaidos = await getEmpleaidos({
    category: searchParams.category,
    search: searchParams.search,
  })

  return (
    <div>
      <SearchBar />
      <CategoryFilter />
      <EmpleaidoGrid empleaidos={empleaidos} />
    </div>
  )
}
```

**Features**:
- ✅ Search por nombre/descripción
- ✅ Filter por Sephirot
- ✅ Sort by popular/newest
- ✅ Preview cards con stats

#### 2.2 No-Code Builder (7 días)
```typescript
// app/app/builder/page.tsx
export default function EmpleaidoBuilder() {
  const [config, setConfig] = useState<EmpleaidoConfig>(DEFAULT)

  return (
    <BuilderLayout>
      <PreviewPanel config={config} />
      <ConfigPanel>
        <BasicInfoSection config={config} onChange={setConfig} />
        <PersonalitySection config={config} onChange={setConfig} />
        <SkillsSection config={config} onChange={setConfig} />
        <SephirotSection config={config} onChange={setConfig} />
      </ConfigPanel>
      <ActionButtons>
        <Button onClick={() => saveDraft(config)}>Save Draft</Button>
        <Button onClick={() => publishEmpleaido(config)}>Publish</Button>
      </ActionButtons>
    </BuilderLayout>
  )
}
```

**Features**:
- ✅ Drag & drop components
- ✅ Live preview
- ✅ Personality builder (Sephirot selector)
- ✅ Skills selector con unlock levels
- ✅ Custom fields system
- ✅ Publish to marketplace
- ✅ Draft system

**Schema para Custom Empleaidos**:
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
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ef_custom_field_templates (
  id UUID PRIMARY KEY,
  empleaido_id UUID REFERENCES ef_custom_empleaidos(id),
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL, -- text, number, select, multiselect
  options JSONB,
  required BOOLEAN DEFAULT false
);
```

---

### FASE 3: Enhanced Chat + Dashboard (Semana 5) 💬

#### 3.1 Streaming Chat Interface (4 días)
```typescript
// app/app/chat/[agentId]/page.tsx
export default function AgentChatPage({ params }: { params: { agentId: string } }) {
  return (
    <ChatInterface agentId={params.agentId}>
      <ChatHeader />
      <MessageList streaming />
      <MessageInput withFileUpload />
      <SkillExecutor />
    </ChatInterface>
  )
}

// Hook para streaming
export function useAgentChat(agentId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = async (content: string) => {
    setIsStreaming(true)

    const response = await fetch('/api/agent-chat', {
      method: 'POST',
      body: JSON.stringify({ agentId, content }),
    })

    const reader = response.body.getReader()
    // Stream handling...
  }

  return { messages, sendMessage, isStreaming }
}
```

**Features**:
- ✅ Real-time streaming responses
- ✅ Message history con scroll
- ✅ File upload (PDF, images)
- ✅ Skill execution desde chat
- ✅ Typing indicators
- ✅ Message reactions

#### 3.2 Enhanced Dashboard (2 días)
```typescript
// app/app/dashboard/page.tsx
export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <DashboardLayout>
      <StatsGrid>
        <StatCard title="My Empleaidos" value={stats.empleaidosCount} />
        <StatCard title="This Month" value={stats.monthlyCost} prefix="$" />
        <StatCard title="Conversations" value={stats.conversations} />
        <StatCard title="XP Earned" value={stats.totalXP} />
      </StatsGrid>

      <Section title="Quick Actions">
        <QuickActionGrid>
          <ChatButton />
          <SkillsButton />
          <SettingsButton />
        </QuickActionGrid>
      </Section>

      <Section title="My Empleaidos">
        <EmpleaidoGrid empleaidos={stats.empleaidos} />
      </Section>
    </DashboardLayout>
  )
}
```

**Features**:
- ✅ Real-time usage stats
- ✅ Cost tracking por empleaido
- ✅ Activity timeline
- ✅ Quick actions
- ✅ Energy status indicators

---

### FASE 4: Monitoring + Soporte (Semana 6) 📊

#### 4.1 Sentry Integration (1 día)
```typescript
// app/app/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Remove sensitive data
    if (event.user?.email) delete event.user.email
    return event
  }
})
```

#### 4.2 Support Tickets (2 días)
```typescript
// app/app/support/tickets/page.tsx
export default function SupportTickets() {
  return (
    <SupportLayout>
      <TicketList />
      <NewTicketForm />
    </SupportLayout>
  )
}
```

---

## 🎨 ARQUITECTURA TÉCNICA

### Componentes Nuevos

```
empleaido-factory/
├── app/app/
│   ├── marketplace/          # NEW - Dynamic marketplace
│   │   ├── page.tsx
│   │   └── [category]/page.tsx
│   ├── builder/              # NEW - No-code builder
│   │   ├── page.tsx
│   │   ├── components/
│   │   │   ├── PreviewPanel.tsx
│   │   │   ├── ConfigPanel.tsx
│   │   │   └── DragDropCanvas.tsx
│   │   └── templates/
│   ├── onboarding/           # ENHANCED - 3-step wizard
│   │   ├── page.tsx
│   │   └── steps/
│   ├── chat/                 # NEW - Streaming chat
│   │   └── [agentId]/page.tsx
│   └── api/
│       ├── stripe/           # NEW - Payment endpoints
│       │   ├── create-checkout/route.ts
│       │   └── webhooks/route.ts
│       ├── agent-execute/    # NEW - Execution engine
│       │   └── route.ts
│       ├── chat/             # NEW - Chat streaming
│       │   └── route.ts
│       └── marketplace/      # NEW - Marketplace API
│           ├── route.ts
│           └── [id]/route.ts
├── lib/
│   ├── stripe.ts            # NEW - Stripe client
│   ├── execution-engine.ts  # NEW - Agent execution
│   ├── builder-templates.ts # NEW - Builder templates
│   └── marketplace-api.ts   # NEW - Marketplace functions
└── supabase/
    └── migrations/
        ├── 002_custom_empleaidos.sql  # NEW
        ├── 003_stripe_subscriptions.sql # NEW
        └── 004_execution_logs.sql     # NEW
```

---

## 💰 MODELO DE PRECIOS

### Tiers (Sugeridos desde Agent Wrapping Plan)

| Tier | Precio | Features |
|------|--------|----------|
| **Base** | $9/mes | 1 empleaido, 100 msgs/mes, chat básico |
| **Pro** | $29/mes | 3 empleaidos, 1000 msgs/mes, streaming, file upload |
| **Deluxe** | $79/mes | Unlimited empleaidos, unlimited msgs, custom builder, priority support |

### Custom Empleaidos

- **Publish to marketplace**: Gratis con tier Deluxe
- **Keep private**: Disponible en Pro
- **Revenue share**: 70% creator / 30% platform

---

## 📈 METRICS DE ÉXITO

### Sprint 2 (6 semanas)
- ✅ Stripe payments funcionando
- ✅ Builder no-code lanzado
- ✅ 10 custom empleaidos creados por beta users
- ✅ 50 paying users
- ✅ $500 MRR

### Sprint 3 (3 meses)
- 🎯 100 custom empleaidos en marketplace
- 🎯 500 paying users
- 🎯 $2,000 MRR
- 🎯 20% conversión free→paid

---

## 🚀 QUICK START: IMPLEMENTACIÓN INMEDIATA

### Paso 1: Stripe Setup (HOY)
```bash
cd /Users/nadalpiantini/dev/empleaido-factory/app
npm install stripe @stripe/stripe-js
```

### Paso 2: Crear API endpoints
```bash
mkdir -p app/app/api/stripe/create-checkout
mkdir -p app/app/api/stripe/webhooks
```

### Paso 3: Supabase migrations
```bash
# Crear tablas para subscriptions, custom_empleaidos
```

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. **HOY**: Implementar Stripe checkout
2. **MAÑANA**: Agent execution API
3. **ESTA SEMANA**: Enhanced onboarding
4. **PRÓXIMA SEMANA**: Builder no-code MVP

---

**Estado del Plan**: LISTO PARA IMPLEMENTACIÓN
**Prioridad**: ALTA
**ROI Esperado**: 10x en 3 meses
