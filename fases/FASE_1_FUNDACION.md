# 🔧 FASE 1: FUNDACIÓN
**Arquitectura base, setup inicial y estructura técnica**

---

## 🎯 Objetivos de esta Fase

- [x] Configurar proyecto Next.js con TypeScript
- [x] Setup de Supabase y schema inicial
- [x] Configurar tRPC para type-safe APIs
- [x] Integrar shadcn/ui para componentes UI
- [x] Setup de autenticación base
- [x] Configurar sistema de variables de entorno
- [x] Setup de infraestructura local (Docker)

---

## 📦 Tech Stack Definitivo

```yaml
frontend:
  framework: "Next.js 14 (App Router)"
  ui_library: "shadcn/ui"
  styling: "TailwindCSS"
  state_management: "Zustand"
  forms: "React Hook Form + Zod"

backend:
  api_layer: "tRPC"
  database: "Supabase (PostgreSQL 15)"
  cache: "Upstash Redis"
  vector_db: "Pinecone"
  auth: "Supabase Auth + Clerk"

orchestration:
  framework: "LangGraph"
  llm_primary: "OpenAI GPT-4-turbo"
  llm_secondary: "Anthropic Claude Sonnet"

infrastructure:
  hosting: "Vercel"
  container: "Docker"
  orchestration: "Kubernetes (futuro)"
  monitoring: "Sentry + Vercel Analytics"

payments:
  processor: "Stripe"
  billing: "Stripe Billing"
```

---

## 🏗️ Estructura de Proyecto

```
agent-wrapping-platform/
├── .env.local                    # Variables de entorno
├── .env.example                  # Template de variables
├── next.config.js               # Configuración Next.js
├── tailwind.config.ts           # Configuración Tailwind
├── tsconfig.json                # Configuración TypeScript
│
├── prisma/                      # Schema de base de datos
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Grupo de rutas auth
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Grupo dashboard protegido
│   │   │   ├── motores/        # Gestión de motores
│   │   │   ├── agentes/        # Gestión de agentes
│   │   │   ├── marketplace/    # Tienda de agentes
│   │   │   └── billing/        # Facturación
│   │   ├── api/                # API Routes (fallback)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/             # Componentes React
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── auth/               # Componentes auth
│   │   ├── motores/            # Motor components
│   │   ├── agentes/            # Agente components
│   │   └── layout/             # Layout components
│   │
│   ├── lib/                    # Utilidades y config
│   │   ├── db.ts               # Supabase client
│   │   ├── auth.ts             # Auth utilities
│   │   ├── validator.ts        # Zod schemas
│   │   └── utils.ts            # General utilities
│   │
│   ├── server/                 # Backend code (server-only)
│   │   ├── trpc/               # tRPC router
│   │   │   ├── root.ts
│   │   │   ├── router/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── motores.ts
│   │   │   │   ├── agentes.ts
│   │   │   │   └── billing.ts
│   │   │   └── trpc.ts
│   │   ├── services/           # Business logic
│   │   │   ├── motor.service.ts
│   │   │   ├── agente.service.ts
│   │   │   └── user.service.ts
│   │   └── prompts/            # LLM prompts
│   │       ├── motor-system.ts
│   │       └── agent-system.ts
│   │
│   └── types/                  # TypeScript types
│       ├── motor.ts
│       ├── agente.ts
│       └── api.ts
│
├── scripts/                    # Scripts utilitarios
│   ├── setup.sh
│   ├── seed-db.ts
│   └── test-env.sh
│
└── docker-compose.yml          # Infraestructura local
```

---

## 🚀 Script de Setup Inicial

### scripts/setup.sh

```bash
#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando setup de Agent Wrapping Platform...${NC}"

# 1. Verificar prerequisitos
echo -e "\n${BLUE}📋 Verificando prerequisitos...${NC}"

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no instalado. Instalar desde https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"

# pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${BLUE}📦 Instalando pnpm...${NC}"
    npm install -g pnpm
fi
PNPM_VERSION=$(pnpm -v)
echo -e "${GREEN}✅ pnpm: $PNPM_VERSION${NC}"

# Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}⚠️  Docker no instalado (opcional para desarrollo local)${NC}"
else
    echo -e "${GREEN}✅ Docker instalado${NC}"
fi

# 2. Crear proyecto Next.js
echo -e "\n${BLUE}🏗️  Creando proyecto Next.js...${NC}"

pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

# 3. Instalar dependencias core
echo -e "\n${BLUE}📦 Instalando dependencias...${NC}"

pnpm add \
    @trpc/server@next \
    @trpc/client@next \
    @trpc/react-query@next \
    @tanstack/react-query \
    zod \
    zustand \
    @supabase/supabase-js \
    @supabase/auth-helpers-nextjs \
    @upstash/redis \
    @pinecone-database/pinecone \
    openai \
    @anthropic-ai/sdk \
    langchain \
    @langchain/langgraph \
    stripe \
    react-hook-form \
    @hookform/resolvers \
    date-fns

# Dev dependencies
pnpm add -D \
    @types/node \
    typescript \
    prisma \
    @prisma/client \
    dotenv-cli

# 4. Setup shadcn/ui
echo -e "\n${BLUE}🎨 Setup shadcn/ui...${NC}"

pnpm dlx shadcn-ui@latest init --yes --defaults

# Componentes base que necesitamos
pnpm dlx shadcn-ui@latest add button card input label select textarea dialog dropdown-menu tabs badge avatar

# 5. Setup Prisma + Supabase
echo -e "\n${BLUE}🗄️  Setup base de datos...${NC}"

# Crear schema.prisma
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  motores       Motor[]
  agentes       Agente[]
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Motor {
  id            String   @id @default(uuid())
  name          String
  description   String   @db.Text
  category      String   // contabilidad, finanzas, rrhh, etc
  code          String   @db.Text  // Código del motor
  config        Json     // Configuración del motor
  isPublic      Boolean  @default(false)
  authorId      String
  author        User     @relation(fields: [authorId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  agentes       Agente[]
}

model Agente {
  id          String   @id @default(uuid())
  name        String
  description String   @db.Text
  motores     Json     // Array de motor IDs + configuraciones
  config      Json     // Configuración global del agente
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  isPublic    Boolean  @default(false)
  status      String   @default("active") // active, paused, archived
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  executions  Execution[]
}

model Execution {
  id          String   @id @default(uuid())
  agentId     String
  agent       Agente   @relation(fields: [agentId], references: [id])
  input       String   @db.Text
  output      String?  @db.Text
  status      String   // pending, running, completed, failed
  error       String?
  tokensUsed  Int?
  costUsd     Decimal?
  createdAt   DateTime @default(now())
  completedAt DateTime?

  @@index([agentId])
}
EOF

# 6. Crear archivo .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agent_platform"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# LLM APIs
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"

# Upstash Redis
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Pinecone
PINECONE_API_KEY="your-pinecone-key"
PINECONE_ENVIRONMENT="your-pinecone-env"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
NEXT_PUBLIC_STRIPE_PRICE_ID="your-price-id"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF

# 7. Crear directorios necesarios
echo -e "\n${BLUE}📁 Creando estructura de directorios...${NC}"

mkdir -p src/{app,components,lib,server,types}
mkdir -p src/app/{api,\(auth\),\(dashboard\)}
mkdir -p src/components/{ui,auth,motores,agentes,layout}
mkdir -p src/server/{trpc,services,prompts}
mkdir -p scripts/{dev,prod,test}

# 8. Inicializar git
echo -e "\n${BLUE}🔧 Inicializando Git...${NC}"

if [ ! -d ".git" ]; then
    git init
    cat > .gitignore << 'EOF'
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
build

# production
dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/migrations/
EOF

    git add .
    git commit -m "Initial commit: Agent Wrapping Platform foundation"
fi

# 9. Instrucciones post-setup
echo -e "\n${GREEN}✅ Setup completado!${NC}"
echo -e "\n${BLUE}📝 Próximos pasos:${NC}"
echo -e "1. Copiar .env.example a .env.local y llenar variables"
echo -e "2. Ejecutar: pnpm prisma db push"
echo -e "3. Ejecutar: pnpm dev"
echo -e "4. Abrir http://localhost:3000"
echo -e "\n${BLUE}📚 Para más información, ver README.md${NC}"
```

---

## 🗄️ Schema de Base de Datos

### Modelo Entidad-Relación

```mermaid
erDiagram
    User ||--o{ Motor : creates
    User ||--o{ Agente : owns
    Motor }o--|| User : author
    Motor ||--o{ Agente : used_in
    Agente ||--o{ Execution : generates

    User {
        uuid id PK
        string email UK
        string name
        datetime created_at
    }

    Motor {
        uuid id PK
        string name
        text description
        string category
        text code
        json config
        boolean is_public
        uuid author_id FK
    }

    Agente {
        uuid id PK
        string name
        text description
        json motores
        json config
        uuid owner_id FK
        boolean is_public
        string status
    }

    Execution {
        uuid id PK
        uuid agent_id FK
        text input
        text output
        string status
        int tokens_used
        decimal cost_usd
    }
```

---

## 🔌 Configuración tRPC

### src/server/trpc/trpc.ts

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { verifyAuth } from '@/lib/auth';

export type Context = {
  userId?: string;
  userRole?: string;
};

export const createTRPCContext = async (opts: CreateNextContextOptions): Promise<Context> => {
  const { req } = opts;

  // Verificar autenticación desde headers
  const token = req.headers.authorization?.replace('Bearer ', '');
  let userId: string | undefined;
  let userRole: string | undefined;

  if (token) {
    try {
      const verified = await verifyAuth(token);
      userId = verified.userId;
      userRole = verified.role;
    } catch (e) {
      // Token inválido, contexto sin auth
    }
  }

  return {
    userId,
    userRole,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Procedimiento protegido (requiere auth)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Debes iniciar sesión',
    });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

// Procedimiento de admin
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId || ctx.userRole !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Acceso denegado',
    });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
```

### src/server/trpc/root.ts

```typescript
import { z } from 'zod';
import { createTRPCRouter } from './trpc';
import { motorRouter } from './router/motores';
import { agenteRouter } from './router/agentes';
import { authRouter } from './router/auth';

export const appRouter = createTRPCRouter({
  motores: motorRouter,
  agentes: agenteRouter,
  auth: authRouter,

  // Health check
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
});

export type AppRouter = typeof appRouter;
```

---

## 🎨 Componentes UI Base

### Layout Principal

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agent Wrapping Platform',
  description: 'Plataforma para crear y gestionar agentes de IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
```

### Dashboard Layout

```typescript
// src/app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={session.user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Setup

### scripts/test-suite.sh

```bash
#!/bin/bash

echo "🧪 Ejecutando test suite..."

# Tests unitarios
echo "📝 Tests unitarios..."
pnpm test

# Tests de integración
echo "🔗 Tests de integración..."
pnpm test:integration

# Tests E2E
echo "🎭 Tests E2E..."
pnpm test:e2e

# Type checking
echo "🔍 Type checking..."
pnpm tsc --noEmit

# Linting
echo "🧹 Linting..."
pnpm lint

echo "✅ Test suite completado!"
```

---

## 🐳 Infraestructura Local

### docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL local
  postgres:
    image: postgres:15-alpine
    container_name: agent_platform_db
    environment:
      POSTGRES_USER: agent_platform
      POSTGRES_PASSWORD: agent_platform
      POSTGRES_DB: agent_platform
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis local
  redis:
    image: redis:7-alpine
    container_name: agent_platform_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## ✅ Checklist de Completado FASE 1

### Setup de Proyecto
- [ ] Proyecto Next.js creado
- [ ] Dependencias instaladas
- [ ] shadcn/ui configurado
- [ ] Estructura de directorios creada

### Base de Datos
- [ ] Prisma configurado
- [ ] Schema creado
- [ ] Migrations ejecutadas
- [ ] Supabase proyecto creado

### Backend
- [ ] tRPC configurado
- [ ] Routers creados (auth, motores, agentes)
- [ ] Context y middleware implementados

### Frontend
- [ ] Layout principal creado
- [ ] Dashboard layout creado
- [ ] Componentes base instalados

### DevOps
- [ ] Docker compose configurado
- [ ] Git inicializado
- [ ] .env.example creado
- [ ] Test suite creada

---

## 🚨 Problemas Comunes

### Error: "Cannot find module @trpc/server"
**Solución**: Reinstalar dependencias
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Database connection failed"
**Solución**: Verificar que Docker corriendo y db accesible
```bash
docker ps
docker-compose up -d
```

### Error: "shadcn/ui components not working"
**Solución**: Re-run shadcn init
```bash
pnpm dlx shadcn-ui@latest init
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)

---

**Siguiente fase**: `FASE_2_MOTOR_FABRICA.md` - Sistema de creación de motores
