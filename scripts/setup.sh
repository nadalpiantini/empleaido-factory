#!/bin/bash

################################################################################
# 🔧 Agent Wrapping Platform - Setup Script
#
# Este script configura todo el entorno de desarrollo necesario para
# implementar la plataforma de wrapping de agentes.
#
# Uso:
#   chmod +x setup.sh
#   ./setup.sh
################################################################################

set -e  # Detener en errores

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funciones de utilidad
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                              ║
║   🔧 AGENT WRAPPING PLATFORM - SETUP                       ║
║                                                              ║
║   Inicializando entorno de desarrollo...                    ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# 1. Verificar prerequisitos
log_info "Verificando prerequisitos..."

# Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    log_info "Instalar desde: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
log_success "Node.js: $NODE_VERSION"

# pnpm
if ! command -v pnpm &> /dev/null; then
    log_info "Instalando pnpm..."
    npm install -g pnpm
fi
PNPM_VERSION=$(pnpm -v)
log_success "pnpm: $PNPM_VERSION"

# Docker (opcional)
if command -v docker &> /dev/null; then
    log_success "Docker instalado"
else
    log_warning "Docker no instalado (opcional para desarrollo local)"
fi

# 2. Directorio del proyecto
PROJECT_DIR="$HOME/agent-wrapping-platform"
log_info "Creando proyecto en: $PROJECT_DIR"

if [ -d "$PROJECT_DIR" ]; then
    log_warning "El directorio ya existe"
    read -p "¿Continuar y sobrescribir? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Setup cancelado"
        exit 0
    fi
    rm -rf "$PROJECT_DIR"
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 3. Crear proyecto Next.js
log_info "Creando proyecto Next.js..."
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

# 4. Instalar dependencias
log_info "Instalando dependencias core..."

# Core dependencies
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
    stripe \
    react-hook-form \
    @hookform/resolvers \
    date-fns \
    superjson

log_success "Dependencias core instaladas"

# Dev dependencies
log_info "Instalando dependencias de desarrollo..."
pnpm add -D \
    @types/node \
    typescript \
    prisma \
    @prisma/client \
    dotenv-cli \
    @types/react \
    @types/react-dom

log_success "Dependencias de desarrollo instaladas"

# 5. Setup shadcn/ui
log_info "Configurando shadcn/ui..."
pnpm dlx shadcn-ui@latest init --yes --defaults

# Instalar componentes necesarios
pnpm dlx shadcn-ui@latest add \
    button \
    card \
    input \
    label \
    select \
    textarea \
    dialog \
    dropdown-menu \
    tabs \
    badge \
    avatar \
    toast \
    table

log_success "shadcn/ui configurado"

# 6. Crear estructura de directorios
log_info "Creando estructura de directorios..."
mkdir -p src/{app/\(auth\),app/\(dashboard\),app/api,components/{ui,auth,motores,agentes,layout,builder},lib,server/{trpc,router,services,prompts},types}
mkdir -p prisma
mkdir -p public

log_success "Estructura creada"

# 7. Crear .env.example
log_info "Creando archivo de entorno..."
cat > .env.example << 'ENVEOF'
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
ENVEOF

log_success ".env.example creado"

# 8. Crear schema de Prisma
log_info "Creando schema de base de datos..."
cat > prisma/schema.prisma << 'PRISMAEOF'
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
  motores       Motor[]
  agentes       Agente[]
}

model Motor {
  id            String   @id @default(uuid())
  name          String
  description   String   @db.Text
  category      String
  code          String   @db.Text
  config        Json
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
  motores     Json
  config      Json
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  isPublic    Boolean  @default(false)
  status      String   @default("active")
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
  status      String
  error       String?
  tokensUsed  Int?
  costUsd     Decimal?
  createdAt   DateTime @default(now())
  completedAt DateTime?

  @@index([agentId])
}
PRISMAEOF

log_success "Schema de Prisma creado"

# 9. Configurar scripts de package.json
log_info "Configurando scripts..."
npm pkg set scripts.dev="next dev"
npm pkg set scripts.build="next build"
npm pkg set scripts.start="next start"
npm pkg set scripts.lint="next lint"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.db:push="prisma db push"
npm pkg set scripts.db:studio="prisma studio"

log_success "Scripts configurados"

# 10. Crear .gitignore
log_info "Creando .gitignore..."
cat > .gitignore << 'GITIGNOREEOF'
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
GITIGNOREEOF

log_success ".gitignore creado"

# 11. Inicializar git
log_info "Inicializando Git..."
git init
git add .
git commit -m "Initial commit: Agent Wrapping Platform setup"

log_success "Git inicializado"

# 12. Instrucciones post-setup
cat << POSTSETUPEOF

${GREEN}
╔════════════════════════════════════════════════════════════╗
║                                                              ║
║   ✅ SETUP COMPLETADO                                       ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝
${NC}

${BLUE}📝 Próximos pasos:${NC}

1. Configurar variables de entorno:
   ${YELLOW}cp .env.example .env.local${NC}
   ${YELLOW}# Editar .env.local con tus API keys${NC}

2. Configurar base de datos:
   ${YELLOW}pnpm db:push${NC}

3. Iniciar servidor de desarrollo:
   ${YELLOW}pnpm dev${NC}

4. Abrir en navegador:
   ${GREEN}http://localhost:3000${NC}

${BLUE}📚 Documentación:${NC}
   Plan completo: ~/agent-wrapping-plan/README.md
   Fase 1: ~/agent-wrapping-plan/fases/FASE_1_FUNDACION.md
   Fase 2: ~/agent-wrapping-plan/fases/FASE_2_MOTOR_FABRICA.md
   Fase 3: ~/agent-wrapping-plan/fases/FASE_3_LINEA_ENSAMBLAJE.md
   Fase 4: ~/agent-wrapping-plan/fases/FASE_4_EMPAQUETADO.md
   Fase 5: ~/agent-wrapping-plan/fases/FASE_5_SERVICIO_CLIENTE.md
   Fase 6: ~/agent-wrapping-plan/fases/FASE_6_ESCALAMIENTO.md

${BLUE}🚀 Comenzar implementación:${NC}
   ${YELLOW}cd ~/agent-wrapping-plan/fases${NC}
   ${YELLOW}cat FASE_1_FUNDACION.md | less${NC}

${GREEN}¡Listo para comenzar! 🎉${NC}

POSTSETUPEOF

# Hacer el script ejecutable
chmod +x "$0"
