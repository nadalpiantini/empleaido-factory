# FASE 2: ENSAMBLAJE DE PLATAFORMA

**Duración**: 2 semanas (Semanas 3-4)
**Prioridad**: 🔴 CRÍTICA
**Output**: Sistema que envuelve y entrega agentes

---

## 🎯 OBJETIVO

Construir la **fábrica** que toma los "motores" (agentes) de la Fase 1 y los convierte en un producto usable por usuarios NO técnicos.

```
Analogía: Estamos construyendo la línea de ensamblaje
          que toma motores y los convierte en autos completos
```

---

## 📦 ENTREGABLES

### 1. Frontend - Next.js App
- ✅ Next.js 14 con App Router
- ✅ shadcn/ui components
- ✅ TypeScript strict
- ✅ TailwindCSS styling

### 2. Backend - API Layer
- ✅ tRPC para type-safe APIs
- ✅ Supabase integration
- ✅ Authentication (NextAuth)
- ✅ Database schema completo

### 3. Template Marketplace
- ✅ Gallery de templates pre-built
- ✅ Preview de templates
- ✅ One-click deployment

### 4. No-Code Builder
- ✅ Drag & drop interface
- ✅ Block library
- ✅ Connection builder
- ✅ Live preview

### 5. Payment System
- ✅ Stripe integration
- ✅ Subscription management
- ✅ Usage tracking
- ✅ Invoicing

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                       │
│                   (Next.js 14 App)                      │
│  ┌─────────────┬─────────────┬─────────────┬─────────┐  │
│  │   Pages     │  Components │   Hooks     │ Utils   │  │
│  └─────────────┴─────────────┴─────────────┴─────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕ tRPC
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY                           │
│  ┌─────────────┬─────────────┬─────────────┬─────────┐  │
│  │  tRPC Routers │ Middleware │ Validation │  Auth   │  │
│  └─────────────┴─────────────┴─────────────┴─────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                    SERVICES LAYER                        │
│  ┌───────────────┬───────────────┬─────────────────────┐ │
│  │ Agent Service │Template Service│ User Service       │ │
│  │ Execution     │ Compilation   │ Subscription        │ │
│  └───────────────┴───────────────┴─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│  ┌───────────────┬───────────────┬─────────────────────┐ │
│  │  Supabase     │  Redis        │  Agent Core (F1)    │ │
│  │  (PostgreSQL) │  (Cache)      │  (Python Package)   │ │
│  └───────────────┴───────────────┴─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 ESTRUCTURA DE PROYECTO

```
agent-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Rutas principales
│   │   ├── dashboard/
│   │   ├── templates/
│   │   ├── builder/
│   │   ├── agents/
│   │   ├── settings/
│   │   └── billing/
│   ├── api/                      # API Routes (fallback)
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui components
│   ├── builder/                  # Builder-specific
│   │   ├── BlockEditor.tsx
│   │   ├── Canvas.tsx
│   │   └── PropertyPanel.tsx
│   ├── agents/                   # Agent-related
│   │   ├── AgentCard.tsx
│   │   ├── ChatInterface.tsx
│   │   └── ExecutionLog.tsx
│   └── templates/                # Template-related
│       ├── TemplateGallery.tsx
│       ├── TemplateCard.tsx
│       └── TemplatePreview.tsx
│
├── lib/                         # Core libraries
│   ├── agents/                  # Agent integration
│   │   ├── executor.ts          # Ejecuta agentes Python
│   │   └── types.ts             # TypeScript types
│   ├── db/                      # Database client
│   │   └── supabase.ts
│   ├── trpc/                    # tRPC setup
│   │   ├── server.ts            # tRPC server
│   │   └── client.ts            # tRPC client
│   └── utils/                   # Utilities
│       ├── validation.ts
│       └── formatting.ts
│
├── server/                      # Backend code
│   ├── routers/                 # tRPC routers
│   │   ├── agents.ts
│   │   ├── templates.ts
│   │   ├── users.ts
│   │   └── billing.ts
│   ├── services/                # Business logic
│   │   ├── AgentService.ts
│   │   ├── TemplateService.ts
│   │   └── SubscriptionService.ts
│   └── middleware/              # Express/tRPC middleware
│
└── prisma/                      # Database schema
    └── schema.prisma
```

---

## 🚀 ORDEN DE IMPLEMENTACIÓN

### Semana 3: Fundamentos

#### Día 1-2: Setup
```bash
cd ~/dev/agent-wrapping-plan
cd scripts/fase-2-ensamblaje

./01-init-nextjs.sh         # Inicializar Next.js
./02-setup-dependencies.sh  # Instalar dependencias
```

#### Día 3-5: Database + Auth
```bash
./03-setup-supabase.sh      # Configurar Supabase
./04-implement-auth.sh       # NextAuth integration
```

#### Día 6-7: tRPC Backend
```bash
./05-setup-trpc.sh          # Configurar tRPC
./06-create-routers.sh      # Crear routers principales
```

### Semana 4: Frontend + Features

#### Día 1-3: Template Marketplace
```bash
./07-template-gallery.sh     # UI de templates
./08-template-preview.sh     # Preview system
```

#### Día 4-6: No-Code Builder
```bash
./09-builder-ui.sh           # Builder interface
./10-block-library.sh        # Block components
```

#### Día 7-10: Payments + Polish
```bash
./11-stripe-integration.sh   # Stripe payments
./12-deploy-vercel.sh        # Deploy a Vercel
```

---

## 💾 DATABASE SCHEMA

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============= USERS =============

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  password      String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Subscription
  subscription  Subscription?
  usageLogs     UsageLog[]

  // Agents
  agents        Agent[]

  @@map("users")
}

// ============= SUBSCRIPTIONS =============

model Subscription {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  tier            SubscriptionTier @default(FREE)
  status          SubscriptionStatus @default(ACTIVE)

  stripeCustomerId String?
  stripeSubscriptionId String?

  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?

  cancelAtPeriodEnd  Boolean @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("subscriptions")
}

enum SubscriptionTier {
  FREE
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
}

// ============= TEMPLATES =============

model Template {
  id            String   @id @default(uuid())
  name          String
  description   String
  category      String

  // Template definition
  blocks        Json     // [{ type, config }]
  connections   Json     // [{ from, to }]

  isPublic      Boolean @default(true)
  isFeatured    Boolean @default(false)

  createdBy     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Usages
  agents        Agent[]

  @@map("templates")
}

// ============= USER AGENTS =============

model Agent {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])

  templateId    String?
  template      Template? @relation(fields: [templateId], references: [id])

  name          String
  description   String?

  // Agent configuration
  config        Json     // Overrides del template

  status        AgentStatus @default(ACTIVE)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Executions
  executions    Execution[]

  @@map("agents")
}

enum AgentStatus {
  ACTIVE
  PAUSED
  ARCHIVED
}

// ============= EXECUTIONS =============

model Execution {
  id            String   @id @default(uuid())
  agentId       String
  agent         Agent    @relation(fields: [agentId], references: [id])

  input         String
  output        String?  @db.Text

  status        ExecutionStatus @default(PENDING)
  error         String?  @db.Text

  tokensUsed    Int      @default(0)
  costUsd       Decimal  @default(0) @db.Decimal(10, 4)

  startedAt     DateTime @default(now())
  completedAt   DateTime?

  @@map("executions")
}

enum ExecutionStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}

// ============= USAGE LOGS =============

model UsageLog {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])

  action        String
  resourceType  String?
  resourceId    String?

  metadata      Json?

  createdAt     DateTime @default(now())

  @@map("usage_logs")
}
```

---

## 🎨 COMPONENTES CLAVE

### 1. TemplateGallery Component

```typescript
// components/templates/TemplateGallery.tsx
'use client'

import { TemplateCard } from './TemplateCard'
import { trpc } from '@/lib/trpc/client'

export function TemplateGallery() {
  const { data: templates, isLoading } = trpc.templates.list.useQuery()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates?.map(template => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
```

### 2. BlockEditor Component (Builder)

```typescript
// components/builder/BlockEditor.tsx
'use client'

import { useState } from 'react'
import { BlockLibrary } from './BlockLibrary'
import { Canvas } from './Canvas'
import { PropertyPanel } from './PropertyPanel'

export function BlockEditor() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

  const handleDrop = (block: Block) => {
    setBlocks([...blocks, block])
  }

  const handleUpdate = (blockId: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, ...updates } : b
    ))
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-screen">
      <BlockLibrary onDragStart={(block) => console.log(block)} />
      <Canvas blocks={blocks} onDrop={handleDrop} onSelect={setSelectedBlock} />
      <PropertyPanel block={selectedBlock} onUpdate={handleUpdate} />
    </div>
  )
}
```

### 3. ChatInterface Component

```typescript
// components/agents/ChatInterface.tsx
'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'

export function ChatInterface({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const executeAgent = trpc.agents.execute.useMutation()

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: 'user', content: input }])

    // Execute agent
    const result = await executeAgent.mutateAsync({
      agentId,
      input,
    })

    // Add agent response
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: result.output }
    ])

    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={executeAgent.isLoading}
      />
    </div>
  )
}
```

---

## 📡 tRPC ROUTERS

### Agent Router

```typescript
// server/routers/agents.ts
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'
import { AgentService } from '../services/AgentService'

export const agentsRouter = router({
  // Listar agentes del usuario
  list: publicProcedure.query(async ({ ctx }) => {
    const service = new AgentService(ctx.userId)
    return await service.list()
  }),

  // Obtener un agente
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const service = new AgentService(ctx.userId)
      return await service.get(input.id)
    }),

  // Crear agente desde template
  createFromTemplate: publicProcedure
    .input(z.object({
      templateId: z.string(),
      name: z.string(),
      config: z.object({}).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const service = new AgentService(ctx.userId)
      return await service.createFromTemplate(input)
    }),

  // Ejecutar agente
  execute: publicProcedure
    .input(z.object({
      agentId: z.string(),
      input: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const service = new AgentService(ctx.userId)

      // Verificar límites de uso
      await service.checkUsageLimits(ctx.userId)

      // Ejecutar
      return await service.execute(input.agentId, input.input)
    }),

  // Eliminar agente
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const service = new AgentService(ctx.userId)
      return await service.delete(input.id)
    }),
})
```

---

## ✅ CHECKLIST DE COMPLETACIÓN

### Backend
- [ ] Next.js project initialized
- [ ] tRPC configured
- [ ] Supabase connected
- [ ] Auth implemented
- [ ] All routers created
- [ ] Database schema deployed

### Frontend
- [ ] App Router structure
- [ ] shadcn/ui components
- [ ] Template gallery UI
- [ ] Builder interface
- [ ] Chat interface
- [ ] Settings pages

### Integration
- [ ] Agent Core (Python) integrated
- [ ] Template system working
- [ ] Payment flow complete
- [ ] Usage tracking working

### Deployment
- [ ] Vercel configured
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Custom domain (optional)

---

## 🚀 SIGUIENTE PASO

```bash
# Validar Fase 2 completa
cd ~/dev/agent-wrapping-plan/scripts/fase-2-ensamblaje
./13-validar-fase-2.sh

# Si todo OK, pasar a Fase 3
cd ../fase-3-delivery
cat README.md
```

---

**Fase 2 completa = La plataforma puede entregar agentes a usuarios** ✅
