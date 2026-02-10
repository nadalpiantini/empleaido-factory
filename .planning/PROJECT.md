# EMPLEAIDO FACTORY 360° - Project Brief

**Version**: 2.0
**Last Updated**: 2026-02-09
**Status**: Planning Phase - System Integration

---

## Core Value

> **"The first AI workplace platform where your employees aren't just tools — they're teammates you adopt, work beside in virtual spaces, and watch grow through real-world interactions."**

Empleaido Factory 360° integra tres sistemas complementarios:
1. **Empleaido Factory Web** - Catálogo y adopción de empleados AI
2. **SUJETO10 Virtual Office** - Espacio de trabajo multiplayer 3D
3. **Sistema de Adopción & Onboarding** - Flujo completo 360°

---

## Product Vision

### What We're Building

Un producto **vendible, escalable y autoproducible** que permite a los usuarios:

1. **Discover** - Explorar catálogo de Empleaidos especializados
2. **Adopt** - Comprar/adoptar un Empleaido con subscription model
3. **Onboard** - Wizard interactivo de personalización del agente
4. **Work With** - Interactuar con el Empleaido en múltiples interfaces:
   - Virtual Office 3D (SUJETO10)
   - Dashboard web tradicional
   - Chat directo (sidebar/widget)
   - Browser automation (Chrome Extension)
5. **Grow** - Sistema de vida (XP, confianza, energía) que evoluciona

### Differentiation

🎯 **vs ChatGPT/Claude**: Empleaidos son persistentes, especializados, con identidad
🎯 **vs SaaS Tools**: Gamificación + conexión emocional + multi-interfaces
🎯 **vs Other AI Agents**: Sephirot behavioral framework + visual 3D presence

---

## Target Users

### Primary
- 🇩🇴 **Freelancers RD** - Contabilidad DGII, operaciones lean
- 🌎 **Solopreneurs LATAM** - Marketing, productividad, finanzas
- 💼 **Startups (2-10 personas)** - Team virtual AI completo

### Secondary
- Consultores independientes
- Agencias boutique
- Remote workers globales

---

## Current State (Feb 9, 2026)

### ✅ Empleaido Factory Web - 100% Complete
- **Tech**: Next.js 16, React 19, TypeScript, Tailwind 4
- **Status**: Production-ready
- **Features**:
  - 6 Empleaidos fundadores (SERA, KAEL, NORA, LIOR, ZIV, UXA)
  - Catálogo funcional con imágenes AI
  - Life Engine (XP, trust, energy)
  - OpenClaw integration (spawning funcional)
  - Supabase schema (prefijo `ef_` para multi-tenant)
- **Sprints Completados**:
  - Sprint 01: Foundation ✅
  - Sprint 01.5: Virtual Office Integration ✅
  - Sprint Adoption MVP: Flujo de adopción end-to-end ✅

### ✅ SUJETO10 Virtual Office - 85% Complete
- **Tech**: React 18, Vite, Phaser 3, Colyseus, Supabase
- **Status**: Backend deployado en AWS, frontend pendiente Vercel
- **Features**:
  - Virtual office 3D con movimiento (WASD + flechas)
  - NPCs interactivos (SERA implementado)
  - Chat overlay con proximidad
  - Dashboard con 49+ herramientas integradas
  - Chrome Extension (browser automation)
  - Multiplayer via Colyseus WebSocket
- **Deployment**:
  - Backend: 54.172.233.116:2567 (AWS) ✅
  - Frontend: Pendiente configurar `VITE_SERVER_URL`

### 🔄 Sistema de Adopción - 60% Complete
- **What's Done**:
  - API de adopción funcional (`/api/adopt/[id]`)
  - Onboarding básico con generación IDENTITY.md
  - OpenClaw workspace creation
- **What's Missing**:
  - Supabase auth real (actualmente mock user)
  - Stripe/PayPal payments integration
  - Onboarding wizard de 5 fases completo
  - Email verification & notifications

---

## Key Technical Decisions

### Architecture
| Decision | Rationale |
|----------|-----------|
| **Next.js 16** (Empleaido Factory) | App Router, Server Components, Turbopack |
| **React + Vite** (SUJETO10) | Build speed, HMR para Phaser game dev |
| **Supabase** (Shared DB) | Multi-tenant con `ef_` prefix isolation |
| **OpenClaw** | Agent spawning real, no simulación |
| **Colyseus** | Multiplayer realtime para Virtual Office |
| **Phaser 3** | 2D/3D gaming engine probado |

### Multi-Tenant Strategy
- **Prefijo `ef_`** en todas las tablas (empleaidofactory_)
- **Row Level Security (RLS)** para isolation de usuarios
- **Shared Supabase** (no separate databases per tenant)

### Deployment Strategy
| Component | Platform | Status |
|-----------|----------|--------|
| Empleaido Factory Frontend | Vercel | Planning |
| SUJETO10 Backend | AWS EC2 | ✅ Deployed |
| SUJETO10 Frontend | Vercel | Config pending |
| Database | Supabase Cloud | ✅ Ready |
| Chrome Extension | Chrome Web Store | TBD |

---

## Requirements Scope

### Phase 1: Foundation ✅
- [x] 6 Empleaidos con identidad completa
- [x] Catálogo web functional
- [x] Life Engine backend
- [x] OpenClaw integration
- [x] Virtual Office MVP con Phaser

### Phase 2: Monetization & Auth (CURRENT)
- [ ] Supabase Auth implementation
- [ ] Stripe integration (subscriptions)
- [ ] Checkout flow completo
- [ ] Email verification system
- [ ] User dashboard (my empleaidos)

### Phase 3: Onboarding 360°
- [ ] Wizard de 5 fases completo
- [ ] Personalización del agente
- [ ] Workspace initialization
- [ ] Skill unlock progression
- [ ] First task guidance

### Phase 4: Virtual Office Integration
- [ ] Merge empleaido-factory → sujeto10
- [ ] 6 rooms (una por empleaido)
- [ ] Cross-platform chat
- [ ] Life sync (virtual ↔ dashboard)
- [ ] Multiplayer collaboration

### Phase 5: Automation & Extensions
- [ ] Chrome Extension integration
- [ ] Browser automation workflows
- [ ] Form filling AI
- [ ] SaaS apps integration
- [ ] MCP plugin system

### Phase 6: Analytics & Growth
- [ ] User analytics tracking
- [ ] Empleaido performance metrics
- [ ] A/B testing framework
- [ ] Referral system
- [ ] Community features

---

## Constraints & Risks

### Technical Constraints
- ⚠️ **Multi-tenant Supabase** - Requires strict `ef_` prefix enforcement
- ⚠️ **OpenClaw dependency** - Not standalone, requires CLI installed
- ⚠️ **Two frontend codebases** - Next.js (empleaido) + Vite (sujeto10) need merge

### Budgetary Constraints
- 💰 **Supabase Free Tier** - 500MB DB, 2GB bandwidth/month
- 💰 **Vercel Hobby** - 100GB bandwidth/month
- 💰 **AWS EC2** - ~$15-25/mes para sujeto10 backend
- 💰 **Runware API** - Imagen generation costs

### Regulatory Constraints
- 🏛️ **DGII compliance** (RD) - SERA debe seguir NCF rules
- 🏛️ **Data residency** - User data en assigned geography
- 🏛️ **GDPR** - Future EU expansion

### Key Risks
1. **Multi-tenant database collision** - Mitigation: Strict `ef_` prefix + RLS
2. **Two frontend maintenance burden** - Mitigation: Phase 4 merge plan
3. **OpenClaw adoption friction** - Mitigation: Server-side spawning API
4. **Virtual Office performance** - Mitigation: Chunking, lazy loading

---

## Success Metrics

### MVP Success (Q1 2026)
- 100 beta users adopt empleaidos
- 70%+ users complete onboarding
- Average session > 15 minutes in Virtual Office
- NPS score > 40
- $0 churn in first month

### Product-Market Fit (Q2 2026)
- 1,000 active empleaidos adopted
- $10k MRR
- 60%+ users adopt 2+ empleaidos
- Virtual Office daily active > 30%

### Scale (Q3-Q4 2026)
- 10,000 empleaidos adopted
- $100k MRR
- Team features launched
- Enterprise pilot programs

---

## Open Questions

1. **Merge Strategy**: ¿Mergear empleaido-factory + sujeto10 en un solo monorepo?
2. **Payment Processor**: ¿Stripe vs PayPal vs ambos?
3. **Voice Timing**: ¿ElevenLabs en Phase 2 o Phase 5?
4. **Pricing Tiers**: ¿Mantener Base/Pro/Deluxe o simplificar?
5. **Geographic Focus**: ¿RD first o global launch desde inicio?

---

## Next Session Priorities

1. **Define Phase 2 tasks** (Auth + Payments)
2. **Create integration plan** (empleaido-factory ↔ sujeto10)
3. **Decide on payment processor** & implementation approach
4. **Plan onboarding wizard** details (5 fases)
5. **Set Q1 2026 launch target** with milestone breakdown
