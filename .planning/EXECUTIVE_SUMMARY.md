# 🎯 EMPLEAIDO FACTORY 360° - PLAN MAESTRO

**Fecha**: 9 de febrero de 2026
**Estado**: Foundation Complete ✅ | Roadmap Complete 📋 | Next: Phase 2 Planning
**Horizonte**: Q1-Q4 2026 (11 meses)

---

## 📊 EXECUTIVE SUMMARY

### Visión del Producto 360°

Empleaido Factory 360° integra tres sistemas en un producto **vendible, escalable y autoproducible**:

1. **Empleaido Factory Web** → Catálogo + Adopción + Dashboard
2. **SUJETO10 Virtual Office** → Espacio 3D multiplayer + NPCs
3. **Sistema de Onboarding** → Wizard personalización 5 fases

**Propuesta Única**: "Adopta" un empleado AI coleccionable que crece contigo, trabaja en múltiples interfaces (virtual office, dashboard, chat), y evoluciona mediante un sistema de vida (XP, confianza, energía).

---

## ✅ ESTADO ACTUAL (21% Complete)

### Foundation MVP - 100% Entregado
| Componente | Tech Stack | Estado | Notas |
|------------|-----------|--------|-------|
| **Empleaido Factory** | Next.js 16, React 19, TS | ✅ Production-ready | 6 empleaidos, catálogo, life engine |
| **Virtual Office** | React 18, Vite, Phaser 3 | ✅ 85% completo | Backend AWS deployado, frontend pendiente Vercel |
| **Adoption System** | Next.js API, OpenClaw | ✅ 60% completo | API funcional, onboarding básico, falta auth real |

### Hitos Alcanzados
- ✅ 6 Empleaidos fundadores con identidad completa (SERA, KAEL, NORA, LIOR, ZIV, UXA)
- ✅ OpenClaw spawning funcional (SERA agent probado)
- ✅ Supabase schema multi-tenant con `ef_` prefix
- ✅ Virtual Office 3D con movimiento, NPCs, chat overlay
- ✅ Life Engine backend (XP, trust, energy)
- ✅ Playwright automation validation del flujo de adopción

---

## 🚀 ROADMAP DE 14 PHASES

### v1.0 Launch Target - Q1 2026 (Marzo)
**Objetivo**: First paying customers con experiencia 360° completa

| Phase | Nombre | Status | Planes | Key Deliverables |
|-------|--------|--------|-------|------------------|
| ✅ 1 | Foundation | Complete | 3/3 | 6 empleaidos, catálogo, life engine |
| ✅ 1.5 | Virtual Office Integration | Complete | 2/2 | NPCs, chat overlay, Phaser scene |
| ✅ 1.75 | Adoption MVP | Complete | 2/2 | API adopción, onboarding básico |
| 🔄 2 | **Auth & User Management** | Planning | 0/5 | Supabase Auth, social auth, user profiles |
| 📋 3 | **Payment Integration** | Planned | 0/6 | Stripe, subscriptions, webhooks |
| 📋 4 | **Onboarding Wizard** | Planned | 0/5 | 5-phase wizard, personalización |
| 📋 5 | **Virtual Office Integration** | Planned | 0/8 | Merge empleaido-factory + sujeto10 |
| 📋 6 | **Multi-Empleaido Management** | Planned | 0/3 | Dashboard con múltiples empleados |

### v1.5 Growth - Q2 2026 (Junio)
**Objetivo**: $10k MRR, 1,000 empleaidos activos

| Phase | Nombre | Status | Planes | Key Deliverables |
|-------|--------|--------|-------|------------------|
| 📋 7 | **Chrome Extension** | Planned | 0/4 | Auth sync, empleaido selection, automation |
| 📋 8 | **Automation & Workflows** | Planned | 0/5 | CDP integration, workflow engine, form filling |
| 📋 9 | **Analytics & Metrics** | Planned | 0/3 | Event tracking, empleaido performance metrics |
| 📋 10 | **Community & Social** | Planned | 0/3 | Leaderboards, achievements, referral system |

### v2.0 Scale - Q3-Q4 2026 (Diciembre)
**Objetivo**: $100k MRR, enterprise customers, marketplace

| Phase | Nombre | Status | Planes | Key Deliverables |
|-------|--------|--------|-------|------------------|
| 📋 11 | **Voice & Audio** | Planned | 0/4 | ElevenLabs, 6 voces únicas, voice chat |
| 📋 12 | **Team Collaboration** | Planned | 0/5 | Team accounts, shared empleaidos, multiplayer |
| 📋 13 | **Enterprise Features** | Planned | 0/6 | SSO, audit logs, 2FA, compliance |
| 📋 14 | **Marketplace & Trading** | Planned | 0/5 | Marketplace UI, transfer system, rarity |

---

## 🎯 PRIORIDADES INMEDIATAS

### Phase 2: Authentication & User Management (5 planes)
**Timeline**: 2-3 semanas | **Blocker for**: Phases 3-14

**Decisiones Requeridas**:
1. ¿Supabase Auth v2 con magic links? ✅ Recomendado
2. ¿Social auth providers? (Google, GitHub) ✅ Recomendado ambos
3. ¿User profile structure? (avatar, preferences, settings)

**Entregables**:
- `/auth/login`, `/auth/signup`, `/auth/reset-password` pages
- Shared auth context para empleaido-factory + sujeto10
- User profile CRUD con Supabase `users` table
- RLS policies actualizadas con `auth.uid()`

### Phase 3: Payment Integration (6 planes)
**Timeline**: 3-4 semanas | **Blocker for**: Phase 4, 6-14

**Decisiones Requeridas**:
1. ¿Stripe vs PayPal vs ambos? (CRITICAL - pendiente decisión usuario)
2. ¿Pricing tiers definitivos? (Base/Pro/Deluxe montos)
3. ¿RD tax rules (ITBIS) implementation? (18% tax)

**Entregables**:
- Stripe Checkout flow (`/checkout/[empleaido-id]`)
- Webhook handlers (`/api/webhooks/stripe`)
- Subscription management (create, cancel, upgrade/downgrade)
- Invoice generation + email delivery

---

## ⚠️ RIESGOS CRÍTICOS & MITIGACIÓN

### 1. Multi-tenant Database Collision 🔴
**Risk**: Cross-tenant data leakage sin `ef_` prefix enforcement
**Mitigation**:
- Strict prefix enforcement en todas las queries
- RLS policies con `auth.uid()` validation
- Automated tests para multi-tenant isolation

### 2. Two Frontend Maintenance Burden 🟡
**Risk**: Next.js (empleaido) + Vite (sujeto10) = doble trabajo
**Mitigation**: Phase 5 merge decision (monorepo vs polyrepo)

### 3. OpenClaw Adoption Friction 🟡
**Risk**: Usuarios no tienen OpenClaw CLI instalado
**Mitigation**: Server-side spawning API (ya implementado)

### 4. Virtual Office Performance 🟢
**Risk**: Phaser 3 performance con múltiples NPCs
**Mitigation**: Chunking, lazy loading, spatial hashing

---

## 💰 METRICS DE ÉXITO

### MVP Success (Q1 2026)
- [ ] 100 beta users adopt empleaidos
- [ ] 70%+ completion rate onboarding
- [ ] Average session > 15 min en Virtual Office
- [ ] NPS score > 40
- [ ] $0 churn primer mes

### Product-Market Fit (Q2 2026)
- [ ] 1,000 active empleaidos adopted
- [ ] $10k MRR
- [ ] 60%+ users adopt 2+ empleaidos
- [ ] Virtual Office daily active > 30%

### Scale (Q3-Q4 2026)
- [ ] 10,000 empleaidos adopted
- [ ] $100k MRR
- [ ] Enterprise pilot programs (5+ clientes)
- [ ] Marketplace transactions (100+ trades)

---

## 🔮 PREGUNTAS ABIERTAS (Requieren Decisión Usuario)

### 1. Payment Processor (BLOCKER Phase 3)
**Opción A**: Stripe only (recomendado)
- Pros: API robusta, subscriptions management, excelente docs
- Cons: Fees 2.9% + $0.30, no soporte RD local

**Opción B**: PayPal only
- Pros: Popular en RD, soporte local
- Cons: API menos robusta, subscriptions más complicadas

**Opción C**: Ambos (Stripe + PayPal)
- Pros: Máxima flexibilidad usuario
- Cons: Doble integración, mayor mantenimiento

**Recomendación**: Stripe only por API superior, PayPal en Phase 14 si hay demanda

### 2. Merge Strategy (Decision Phase 5)
**Opción A**: Monorepo (Turborepo)
```
/repos/empleaido-360/
  /apps
    /empleaido-factory (Next.js)
    /sujeto10 (Vite+React)
  /packages
    /shared-auth
    /shared-types
    /shared-ui
```
Pros: Shared code, unified deps, single CI/CD
Cons: Learning curve, tooling overhead

**Opción B**: Polyrepo + npm packages
Pros: Independent deployments, familiar
Cons: Code duplication, sync issues

**Recomendación**: Monorepo con Turborepo para shared auth/types

### 3. Voice Timing (Phase 11 vs Earlier)
**Pregunta**: ¿ElevenLabs en Phase 2 (Q1) o Phase 11 (Q3)?

**Arguments for Phase 2**:
- Diferenciador clave vs competencia
- Mayor engagement emocional
- Marketing appeal ("habla con tu empleaido")

**Arguments for Phase 11**:
- Cost ($30+ por voz generada)
- Scope creep risk
- Technical complexity baja prioridad

**Recomendación**: Phase 11 (Q3) - mantener enfocado en MVP core

### 4. Pricing Tiers (Phase 3)
**Propuesta Actual**:
- Base: $19-29/mes (1-2 native skills)
- Pro: $39-49/mes (3-4 native + 2 locked)
- Deluxe: $79-99/mes (5+ native + 4 locked + priority)

**Pregunta**: ¿Ajustar montos? ¿Simplificar a 2 tiers?

**Recomendación**: Validar con 10 potential customers durante Phase 2

### 5. Geographic Launch Strategy
**Opción A**: RD first → LATAM → Global
Pros: Compliance local, idioma español, mercado underserved
Cons: Market size limitado

**Opción B**: Global launch desde inicio
Pros: TAM máximo
Cons: Competición fierce (OpenAI, Anthropic)

**Recomendación**: RD first (Q1), LATAM (Q2), Global (Q3+)

---

## 📅 NEXT ACTIONS (Inmediato)

### Hoy - Mañana
1. ✅ Revisión de this document con usuario
2. ✅ Decisiones sobre preguntas abiertas (especialmente #1 payment processor)
3. ✅ Aprobar ROADMAP.md y PROJECT.md

### Esta Semana
4. **Phase 2 Planning**: `/gsd:plan-phase 2`
   - Definir 5 planes para auth system
   - Decidir social auth providers
   - Especificar user profile structure

### Próximas 2 Semanas
5. **Phase 2 Execution**: Implement Supabase Auth
6. **Phase 3 Planning**: `/gsd:plan-phase 3`
   - Decision final: Stripe vs PayPal
   - Pricing tiers definitivos
   - ITBIS (RD tax 18%) implementation

---

## 📁 ARCHIVOS CREADOS

```
.planning/
├── PROJECT.md (brief completo con visión 360°)
├── ROADMAP.md (14 phases detalladas con milestones)
├── STATE.md (project memory para continuity)
├── config.json (planning config - mode: interactive, depth: comprehensive)
├── EXECUTIVE_SUMMARY.md (este archivo)
└── phases/
    ├── 01-foundation/ ✅
    ├── 01.5-virtual-office/ ✅
    ├── 01.75-adoption-mvp/ ✅
    ├── 02-auth-user-management/ 🔄
    ├── 03-payment-integration/ 📋
    └── ... (11 más hasta 14)
```

---

## 🎯 SUCCESS CRITERIA (Plan Maestro)

El plan se considera exitoso si:

### Technical
- [ ] All 14 phases completadas on schedule (Q4 2026)
- [ ] Zero critical bugs en producción
- [ ] 99.9% uptime (SLA)
- [ ] Multi-tenant isolation 100% seguro

### Business
- [ ] $100k MRR para end Q4 2026
- [ ] 10,000 empleaidos adopted
- [ ] Churn rate < 5% monthly
- [ ] NPS score > 50

### Product
- [ ] 360° experience funcional (catálogo → adopción → onboarding → virtual office → automation)
- [ ] 3+ interfaces por empleaido (dashboard, virtual office, chat, extension)
- [ ] Life system working (XP, trust, energy progression)
- [ ] User testimonials positivas

---

**STATUS**: Ready for Phase 2 Planning 🚀
**NEXT COMMAND**: `/gsd:plan-phase 2` (después de aprobar este plan master)
**BLOCKERS**: None (pending user approval of open questions)
