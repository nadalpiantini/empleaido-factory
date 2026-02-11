# Roadmap: Empleaido Factory 360°

## Overview

Empleaido Factory 360° es un sistema integrado de tres componentes: catálogo/adopción web (empleaido-factory), espacio de trabajo virtual 3D (sujeto10), y sistema completo de onboarding. Este roadmap define el path desde el estado actual (Foundation MVP completo) hasta un producto vendible, escalable y autoproducible.

**Journey**: Foundation Complete → Monetization & Auth → Virtual Office Integration → Automation & Extensions → Analytics & Growth → Scale & Enterprise

---

## Domain Expertise

None (custom product - no applicable domain skills)

---

## Phases

### Foundation (✅ COMPLETE)
- **Phase 1**: Foundation Sprint - ✅ Complete
- **Phase 1.5**: Virtual Office Integration - ✅ Complete
- **Phase 1.75**: Adoption MVP - ✅ Complete

### v1.0 Launch Target (Q1 2026)
- [ ] **Phase 2**: Authentication & User Management
- [ ] **Phase 3**: Payment Integration & Monetization
- [ ] **Phase 4**: Onboarding Wizard 360°
- [ ] **Phase 5**: Virtual Office Integration
- [ ] **Phase 6**: Multi-Empleaido Management

### v1.5 Growth (Q2 2026)
- [ ] **Phase 7**: Chrome Extension Integration
- [ ] **Phase 8**: Automation & Workflows
- [ ] **Phase 9**: Analytics & Metrics
- [ ] **Phase 10**: Community & Social Features

### v2.0 Scale (Q3-Q4 2026)
- [ ] **Phase 11**: Voice & Audio (ElevenLabs)
- [ ] **Phase 12**: Team Collaboration
- [ ] **Phase 13**: Enterprise Features
- [ ] **Phase 14**: Marketplace & Trading

---

## Phase Details

### ✅ Phase 1: Foundation Sprint (COMPLETE)
**Goal**: Core platform with 6 Empleaidos, catálogo funcional, life engine
**Depends on**: Nothing
**Research**: Unlikely (established patterns)
**Plans**: 3 plans (completed)

**Completed Features**:
- [x] 6 Empleaidos fundadores con identidad completa
- [x] Catálogo web con Next.js 16
- [x] Life Engine (XP, trust, energy)
- [x] OpenClaw integration functional
- [x] Supabase schema con multi-tenant RLS
- [x] Virtual Office MVP con Phaser 3

### ✅ Phase 1.5: Virtual Office Integration (COMPLETE)
**Goal**: Integrar empleaido-factory con sujeto10 virtual office
**Depends on**: Phase 1
**Research**: Unlikely (integration patterns known)
**Plans**: 2 plans (completed)

**Completed Features**:
- [x] Virtual Office 3D overlay
- [x] NPC system (SERA implemented)
- [x] Chat overlay con proximidad
- [x] Phaser game scene básica

### ✅ Phase 1.75: Adoption MVP (COMPLETE)
**Goal**: Validar flujo de adopción end-to-end
**Depends on**: Phase 1, Phase 1.5
**Research**: Unlikely (API integration patterns)
**Plans**: 2 plans (completed)

**Completed Features**:
- [x] API de adopción funcional
- [x] Onboarding básico (IDENTITY.md generation)
- [x] OpenClaw workspace creation
- [x] Playwright automation validation

---

### 🔄 Phase 2: Authentication & User Management (IN PLANNING)
**Goal**: Implement Supabase Auth completo con user management
**Depends on**: Phase 1.75
**Research**: Likely (Supabase Auth v2 patterns, magic links, social auth)
**Research topics**: Current Supabase Auth API, RLS policies for user data, social auth providers (Google, GitHub)
**Plans**: 3-5 plans

**Key Tasks**:
- [ ] 2.1: Supabase Auth setup (email/password, magic links)
- [ ] 2.2: Social auth integration (Google, GitHub)
- [ ] 2.3: User profile management (avatar, preferences)
- [ ] 2.4: Protected routes & middleware
- [ ] 2.5: Session management & refresh tokens

**Deliverables**:
- `/auth/login`, `/auth/signup`, `/auth/reset-password` pages
- Auth context provider para ambas apps (empleaido-factory + sujeto10)
- User profile CRUD operations
- RLS policies actualizadas con `auth.uid()`

---

### 📋 Phase 3: Payment Integration & Monetization (PLANNED)
**Goal**: Stripe integration con subscription management
**Depends on**: Phase 2
**Research**: Likely (Stripe API v2025, webhook patterns, subscription lifecycle)
**Research topics**: Current Stripe Checkout, Subscription scheduling, Webhook signature verification, RD tax rules (ITBIS)
**Plans**: 4-6 plans

**Key Tasks**:
- [ ] 3.1: Stripe account setup & API keys
- [ ] 3.2: Checkout flow (Stripe Checkout Session)
- [ ] 3.3: Subscription management (create, cancel, upgrade/downgrade)
- [ ] 3.4: Webhook handlers (payment succeeded, failed, canceled)
- [ ] 3.5: Invoice generation & email delivery
- [ ] 3.6: Pricing tier enforcement (Base/Pro/Deluxe)

**Deliverables**:
- `/checkout/[empleaido-id]` page con Stripe Checkout
- Webhook endpoint `/api/webhooks/stripe`
- Subscription status sync con Supabase `ef_adoptions`
- Admin dashboard para subscription management

**Pricing Model**:
- Base: $19-29/mes (1-2 native skills)
- Pro: $39-49/mes (3-4 native skills + 2 locked)
- Deluxe: $79-99/mes (5+ native skills + 4 locked + priority support)

---

### 📋 Phase 4: Onboarding Wizard 360° (PLANNED)
**Goal**: Wizard interactivo de 5 fases para personalización del Empleaido
**Depends on**: Phase 2, Phase 3
**Research**: Likely (UX patterns for onboarding, progressive profiling)
**Research topics**: User onboarding best practices, progressive form patterns, gamification techniques
**Plans**: 5 plans

**Key Tasks**:
- [ ] 4.1: Phase 1 - Welcome & Goal Setting (¿Qué buscas lograr?)
- [ ] 4.2: Phase 2 - Context Upload (business info, target audience)
- [ ] 4.3: Phase 3 - Skill Prioritization (¿qué skills activar primero?)
- [ ] 4.4: Phase 4 - Communication Style (tone, language, response length)
- [ ] 4.5: Phase 5 - First Task (guided first interaction)

**Deliverables**:
- `/onboarding/[empleaido-id]` page con 5-step wizard
- Progress bar con step navigation
- Context storage en Supabase `user_context` table
- OpenClaw workspace personalization (IDENTITY.md update)
- First task completion analytics

---

### 📋 Phase 5: Virtual Office Integration (PLANNED)
**Goal**: Merge empleaido-factory + sujeto10 en unified experience
**Depends on**: Phase 2, Phase 4
**Research**: Likely (monorepo vs polyrepo strategy, shared authentication)
**Research topics**: Monorepo tooling (Turborepo, Nx), shared auth patterns, cross-app state management
**Plans**: 6-8 plans

**Key Tasks**:
- [ ] 5.1: Decide merge strategy (monorepo vs separate repos)
- [ ] 5.2: Shared authentication layer (both apps use same Supabase Auth)
- [ ] 5.3: Shared user data layer (ef_adoptions accessible from both)
- [ ] 5.4: Navigation integration (links entre empleaido-factory ↔ sujeto10)
- [ ] 5.5: 6-room layout (una oficina por empleaido)
- [ ] 5.6: Life sync (virtual office ↔ dashboard stats)
- [ ] 5.7: Unified deployment strategy (Vercel multi-project)

**Deliverables**:
- Unified authentication (single sign-on entre ambas apps)
- Cross-platform navigation (botón "Enter Virtual Office" desde empleaido dashboard)
- 6 NPCs interactivos (SERA, KAEL, NORA, LIOR, ZIV, UXA)
- Shared state: XP gain en virtual office actualiza dashboard

**Architecture Decision Required**:
```
Option A: Monorepo (Turborepo)
  /apps
    /empleaido-factory
    /sujeto10
  /packages
    /shared-auth
    /shared-types
    /shared-ui

Option B: Polyrepo + npm packages
  empleaido-factory (repo)
  sujeto10 (repo)
  @empleaido/shared-auth (npm package)
  @empleaido/types (npm package)
```

---

### 📋 Phase 6: Multi-Empleaido Management (PLANNED)
**Goal**: Dashboard para gestionar múltiples Empleaidos adoptados
**Depends on**: Phase 2, Phase 5
**Research**: Unlikely (standard CRUD patterns)
**Plans**: 3 plans

**Key Tasks**:
- [ ] 6.1: My Empleaidos dashboard (`/dashboard`)
- [ ] 6.2: Empleaido switcher (quick switch entre empleados)
- [ ] 6.3: Team overview (todos los empleaidos en una vista)
- [ ] 6.4: Bulk actions (pause all, energy overview)

**Deliverables**:
- `/dashboard` page con grid de empleaidos adoptados
- Life stats overview (XP bars, trust scores, energy levels)
- Quick action buttons (chat, enter virtual office, pause)
- Sorting & filtering (by level, energy, last active)

---

### 📋 Phase 7: Chrome Extension Integration (PLANNED)
**Goal**: Integrar SUJETO10 Chrome Extension con empleaido-factory
**Depends on**: Phase 2, Phase 5
**Research**: Likely (Chrome Extension Manifest V3, message passing patterns)
**Research topics**: Chrome Extension MV3 best practices, service worker vs background script, cross-origin messaging
**Plans**: 4 plans

**Key Tasks**:
- [ ] 7.1: Auth sync (extension usa Supabase Auth de la app)
- [ ] 7.2: Empleaido selection dropdown en extension
- [ ] 7.3: Chat bridge (extension chat ↔ empleaido workspace)
- [ ] 7.4: Automation workflows (form filling usa empleaido context)

**Deliverables**:
- Chrome Extension con Supabase Auth integration
- Sidepanel shows user's empleaidos (from `ef_adoptions`)
- Form automation requests routed to selected empleaido
- Context sync: extension data → empleaido knowledge base

---

### 📋 Phase 8: Automation & Workflows (PLANNED)
**Goal**: Browser automation avanzado con empleaido context
**Depends on**: Phase 7
**Research**: Likely (Puppeteer/Playwright patterns, CDP integration)
**Research topics**: Chrome DevTools Protocol, Puppeteer Core for extensions, workflow engine patterns
**Plans**: 5 plans

**Key Tasks**:
- [ ] 8.1: CDP integration (Chrome DevTools Protocol)
- [ ] 8.2: Workflow engine (secuencias de acciones)
- [ ] 8.3: Smart form filling (empleaido context enrichment)
- [ ] 8.4: Multi-tab workflows (coordinar acciones across tabs)
- [ ] 8.5: Workflow library (templates comunes)

**Deliverables**:
- `/automation` dashboard para crear/editar workflows
- Chrome Extension con CDP capabilities
- Form filler que usa empleaido context (ej: SERA knows DGII form fields)
- Workflow templates (expense report, weekly recap, etc.)

---

### 📋 Phase 9: Analytics & Metrics (PLANNED)
**Goal**: Tracking completo de user behavior y empleaido performance
**Depends on**: Phase 2
**Research**: Likely (analytics platforms, event tracking patterns)
**Research topics**: Plausible/Simple Analytics (privacy-friendly), event schema design, funnel analysis
**Plans**: 3 plans

**Key Tasks**:
- [ ] 9.1: Event tracking setup (page views, interactions)
- [ ] 9.2: Empleaido performance metrics (tasks completed, success rate)
- [ ] 9.3: User engagement analytics (session length, retention)
- [ ] 9.4: Admin analytics dashboard

**Deliverables**:
- Privacy-first analytics (Plausible o self-hosted)
- `/analytics` page para user insights
- Admin dashboard con product metrics
- A/B testing framework foundation

---

### 📋 Phase 10: Community & Social Features (PLANNED)
**Goal**: Social features para engagement y retención
**Depends on**: Phase 6
**Research**: Unlikely (standard social patterns)
**Plans**: 3 plans

**Key Tasks**:
- [ ] 10.1: Leaderboards (XP rankings, empleaido levels)
- [ ] 10.2: Shareable achievements (badges, milestones)
- [ ] 10.3: Community showcase (user stories, use cases)
- [ ] 10.4: Referral system

**Deliverables**:
- `/community` page con leaderboards y showcases
- Achievement system con shareable badges
- Referral link generation
- User testimonials section

---

### 📋 Phase 11: Voice & Audio (PLANNED)
**Goal**: ElevenLabs integration para voz empleaido
**Depends on**: Phase 3
**Research**: Likely (ElevenLabs API v3, text-to-speech patterns)
**Research topics**: Current ElevenLabs API, voice cloning, TTS streaming, audio playback in browser
**Plans**: 4 plans

**Key Tasks**:
- [ ] 11.1: ElevenLabs account setup & API integration
- [ ] 11.2: Voice generation por empleaido (6 unique voices)
- [ ] 11.3: Audio player en dashboard/virtual office
- [ ] 11.4: Voice interaction system (speech-to-text + TTS)

**Deliverables**:
- 6 voice assets (SERA, KAEL, NORA, LIOR, ZIV, UXA)
- Audio player component con play/pause/speed control
- Voice chat (hablar con empleaido en virtual office)
- Voice settings (voice enable/disable, speed)

---

### 📋 Phase 12: Team Collaboration (PLANNED)
**Goal**: Múltiples usuarios trabajando con mismos empleaidos
**Depends on**: Phase 6, Phase 5
**Research**: Likely (multiplayer collaboration patterns, permissions)
**Research topics**: Colyseus room permissions, shared state management, collaboration UX patterns
**Plans**: 5 plans

**Key Tasks**:
- [ ] 12.1: Team accounts (multiple users per organization)
- [ ] 12.2: Shared empleaido ownership (team adopts 1 empleaido)
- [ ] 12.3: Role-based permissions (admin, member, viewer)
- [ ] 12.4: Virtual office multiplayer (multiple users en misma sala)
- [ ] 12.5: Collaboration features (shared whiteboard, task assignment)

**Deliverables**:
- Team management dashboard (`/team` settings)
- Shared empleaido subscriptions (team pricing)
- Multiplayer virtual office (ver teammates working with empleaido)
- Role-based access control (RBAC)

---

### 📋 Phase 13: Enterprise Features (PLANNED)
**Goal**: Features para clientes enterprise (50+ empleados)
**Depends on**: Phase 12
**Research**: Likely (Enterprise requirements: SSO, audit logs, compliance)
**Research topics**: SAML SSO integration, SOC2 compliance, audit logging, enterprise support tiers
**Plans**: 6 plans

**Key Tasks**:
- [ ] 13.1: SSO integration (SAML, Okta, Azure AD)
- [ ] 13.2: Audit logs (all user actions logged)
- [ ] 13.3: Advanced security (2FA, IP whitelisting)
- [ ] 13.4: Compliance features (data export, GDPR tools)
- [ ] 13.5: Enterprise support tier (SLA, dedicated support)
- [ ] 13.6: Custom contracts & invoicing

**Deliverables**:
- SSO setup wizard para enterprise admins
- `/audit-logs` page para compliance
- 2FA enforcement option
- Enterprise pricing page ($999+/mes)

---

### 📋 Phase 14: Marketplace & Trading (PLANNED)
**Goal**: Mercado secundario para empleaidos (trading, gifting)
**Depends on**: Phase 10
**Research**: Likely (marketplace patterns, transaction fees, escrow)
**Research topics**: Marketplace UX patterns, peer-to-peer transactions, digital asset regulations, smart contracts (optional)
**Plans**: 5 plans

**Key Tasks**:
- [ ] 14.1: Marketplace UI (browse, buy, sell empleaidos)
- [ ] 14.2: Transfer system (change ownership)
- [ ] 14.3: Gifting system (gift empleaido to another user)
- [ ] 14.4: Escrow service (safe transactions)
- [ ] 14.5: Rarity system (limited edition empleaidos)

**Deliverables**:
- `/marketplace` page con listings
- Transfer API (POST /api/transfer-ownership)
- Gifting flow (gift empleaido como regalo)
- Rarity badges (Limited, Rare, Legendary)

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 1.5 → 1.75 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | ✅ Complete | Feb 7, 2026 |
| 1.5. Virtual Office Integration | 2/2 | ✅ Complete | Feb 8, 2026 |
| 1.75. Adoption MVP | 2/2 | ✅ Complete | Feb 8, 2026 |
| 2. Authentication & User Management | 0/5 | 🔄 In Planning | - |
| 3. Payment Integration | 0/6 | 📋 Planned | - |
| 4. Onboarding Wizard | 0/5 | 📋 Planned | - |
| 5. Virtual Office Integration | 0/8 | 📋 Planned | - |
| 6. Multi-Empleaido Management | 0/3 | 📋 Planned | - |
| 7. Chrome Extension Integration | 0/4 | 📋 Planned | - |
| 8. Automation & Workflows | 0/5 | 📋 Planned | - |
| 9. Analytics & Metrics | 0/3 | 📋 Planned | - |
| 10. Community & Social | 0/3 | 📋 Planned | - |
| 11. Voice & Audio | 0/4 | 📋 Planned | - |
| 12. Team Collaboration | 0/5 | 📋 Planned | - |
| 13. Enterprise Features | 0/6 | 📋 Planned | - |
| 14. Marketplace & Trading | 0/5 | 📋 Planned | - |

**Overall Progress**: 3 complete / 14 total phases (21%)

---

## Milestones

### v1.0 MVP - Q1 2026 Launch
**Target**: End of March 2026
**Phases**: 2, 3, 4, 5, 6
**Goal**: First paying customers with complete 360° experience

### v1.5 Growth - Q2 2026
**Target**: End of June 2026
**Phases**: 7, 8, 9, 10
**Goal**: $10k MRR, 1,000 active empleaidos

### v2.0 Scale - Q3-Q4 2026
**Target**: End of December 2026
**Phases**: 11, 12, 13, 14
**Goal**: $100k MRR, enterprise customers, marketplace

---

## Next Up

**Phase 2: Authentication & User Management**

Ready to start planning Phase 2 with:
`/gsd:plan-phase 2`

This phase will implement Supabase Auth complete with email/password, magic links, and social authentication (Google, GitHub). The authentication layer will be shared across both empleaido-factory and sujeto10 applications.
