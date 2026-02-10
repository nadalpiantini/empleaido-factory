# 📋 PRD - EMPLEAIDO FACTORY

**Product Requirements Document**
**Version**: 1.0
**Date**: 2026-02-07
**Status**: Sprint 1 Complete

---

## 🎯 FASE 1: DEFINICIÓN DE LA APLICACIÓN

### 1.1 Product Summary

**Empleaido Factory** es una plataforma de empleados AI coleccionables que combina utilidad empresarial con mecánicas de gamificación. A diferencia de herramientas SaaS tradicionales, los Empleaidos son agentes AI únicos con personalidad, especialización y sistema de vida que evoluciona con el uso.

El problema que resuelve: Las empresas necesitan automatización empresarial (contabilidad, marketing, operaciones) pero las soluciones actuales son genéricas y sin engagement. Empleaidos ofrece agentes especializados que "crecen" con tu negocio, creando una conexión emocional mientras entregan valor funcional real.

**Propuesta de valor única**: Primer sistema de "AI Employees as Collectibles" que combina OpenClaw (spawning de agentes reales), sistema de vida (XP/trust/energy), arquitectura Sephirot (product psychology), y visual assets profesionales. No es solo automation — es un equipo AI que adoptas.

### 1.2 Target Users & Geographies

**Primary Users**:
- 🎯 Freelancers RD (República Dominicana) - Necesitan contabilidad DGII
- 🎯 Startups LATAM - Operaciones lean con recursos limitados
- 🎯 Solopreneurs globales - Productivity + growth automation

**Secondary Users**:
- Small business owners (2-10 personas)
- Consultores independientes
- Agencias boutique

**Geographies**:
- **Primary**: República Dominicana (compliance local, idioma español)
- **Secondary**: LATAM (México, Colombia, Argentina, Chile)
- **Future**: Global (English localization)

**Market Size**:
- RD: ~200K freelancers registrados DGII
- LATAM: ~15M freelancers/solopreneurs
- Global: 50M+ knowledge workers

### 1.3 Platforms

**MVP (v1.0)**:
- ✅ **Web App** (Next.js 16) - Primary interface
- ✅ **Browser-based** - No installation required
- ✅ **Responsive** - Mobile-friendly UI

**Future Platforms (v2.0+)**:
- 📱 iOS Native App (React Native)
- 📱 Android Native App (React Native)
- 🖥️ Desktop App (Electron) - Para power users
- 🔌 Public API - Para integraciones third-party
- 💬 Slack/Discord Bots - Empleaidos en team chat

### 1.4 Key Constraints

**Technical Constraints**:
- ✅ Multi-tenant database (shared Supabase) - Requiere ef_ prefix isolation
- ✅ OpenClaw dependency - Sistema de spawn no es standalone
- ✅ Next.js 15+ async params API - Breaking changes vs v14
- ⚠️ CDN-hosted assets (Runware) - No self-hosted images

**Budgetary Constraints**:
- 💰 Supabase Free Tier limits (500MB DB, 2GB bandwidth/month)
- 💰 Vercel Hobby Plan (100GB bandwidth/month)
- 💰 Runware API costs (imagen generation)
- 💰 No ElevenLabs budget yet (voice postponed to v2)

**Regulatory Constraints**:
- 🏛️ DGII compliance (Dominican tax law) - SERA must follow NCF rules
- 🏛️ Data residency - User data stays in assigned geography
- 🏛️ GDPR (future) - If expanding to EU

**Time Constraints**:
- 🕐 Sprint 1: 1 week (COMPLETE)
- 🕐 Sprint 2: Voice + payments (2 weeks target)
- 🕐 Launch target: End of Q1 2026

### 1.5 Must Haves (MVP - Sprint 1) ✅

**Core Features** (ALL DELIVERED):
- ✅ **5 Founding Empleaidos** - SERA, KAEL, NORA, LIOR, ZIV
- ✅ **Catalog Page** - Browse all empleaidos
- ✅ **Profile Pages** - Dynamic routes `/empleaido/[id]`
- ✅ **Life Engine** - XP, trust, energy, level system
- ✅ **Sephirot Mapping** - Behavioral framework operational
- ✅ **OpenClaw Integration** - Spawn system functional (SERA proven)
- ✅ **Skills System** - Native + locked progression
- ✅ **Visual Assets** - 5 AI-generated images (Runware CDN)
- ✅ **Database Schema** - Multi-tenant with RLS
- ✅ **Backstage Management** - Admin interface
- ✅ **User Dashboard** - My Empleaidos view

**Technical Requirements** (ALL MET):
- ✅ TypeScript strict mode
- ✅ Next.js 16 with Turbopack
- ✅ Supabase PostgreSQL with RLS
- ✅ Responsive Tailwind CSS
- ✅ ef_ table prefixes (multi-tenant safe)

### 1.6 Nice to Haves (Sprint 2+)

**Voice & Audio** (Sprint 2):
- 🔊 ElevenLabs voice generation per empleaido
- 🔊 Audio profile assets
- 🔊 Voice interaction system (future)

**Payments & Monetization** (Sprint 2):
- 💳 Stripe integration
- 💳 Subscription tiers (base/pro/deluxe)
- 💳 Annual discount logic
- 💳 Adoption flow with payment

**Enhanced Gamification** (Sprint 3):
- 🎮 Leveling animations
- 🎮 Skill unlock progression
- 🎮 Trust-based feature unlocking
- 🎮 Energy management UX
- 🎮 XP earning mechanics

**Team Features** (Sprint 4):
- 👥 Multiple empleaidos per user
- 👥 Team dashboard view
- 👥 Empleaido coordination system
- 👥 Shared workspace integration

**Advanced Integrations** (Future):
- 🔗 QuickBooks/Xero sync (SERA)
- 🔗 HubSpot/Mailchimp (KAEL)
- 🔗 Notion/Asana (NORA)
- 🔗 Google Analytics (LIOR)
- 🔗 Todoist/Calendar (ZIV)

**Social Features** (Future):
- 🌐 Empleaido marketplace (trading/gifting)
- 🌐 Leaderboards
- 🌐 Community showcases
- 🌐 Referral system

---

## 📊 SUCCESS METRICS

**MVP Success Criteria** (Sprint 1):
- ✅ All routes functional (100% uptime)
- ✅ TypeScript compilation clean
- ✅ 5 empleaidos with complete profiles
- ✅ OpenClaw spawn proven working
- ✅ Database production-ready

**Business Metrics** (Sprint 2+):
- 🎯 100 beta users in first month
- 🎯 10% conversion to paid (10 paid adoptions)
- 🎯 $500 MRR by end of Q1 2026
- 🎯 90%+ user satisfaction (NPS)

**Technical Metrics**:
- ⚡ Page load < 2s (P95)
- ⚡ API response < 500ms (P95)
- ⚡ 99.9% uptime SLA
- ⚡ Zero critical security issues

---

## 🚀 ROADMAP

**Sprint 1** (COMPLETE - Feb 7, 2026):
- Foundation + OpenClaw + Visual Assets

**Sprint 2** (Target: Feb 21, 2026):
- Voice generation + Payment integration + Beta launch

**Sprint 3** (Target: Mar 7, 2026):
- Enhanced UX + Gamification mechanics + Analytics

**Sprint 4** (Target: Mar 21, 2026):
- Team features + Advanced integrations + Marketing push

**Q2 2026**:
- Scale to 1000 users
- Expand to 10 empleaidos
- Launch API for developers

---

## 📝 NOTES

**What Makes This Different**:
1. **Sephirot Framework** - Not decoration, actual product psychology
2. **OpenClaw Integration** - Real agent spawning, not simulated
3. **Life System** - Genuine progression, not fake metrics
4. **Collectible UX** - Emotional connection + utility combined

**Key Learnings (Sprint 1)**:
- Next.js 15+ async params required for dynamic routes
- Directory structure matters (app/ vs src/app/)
- Runware CDN reliable for permanent assets
- Multi-tenant DB requires strict ef_ prefix discipline

**Risks Mitigated**:
- ✅ Multi-tenant DB collision → ef_ prefix isolation
- ✅ Route registration → Directory restructure fixed
- ✅ OpenClaw complexity → SERA spawn proven successful

---

**Status**: Sprint 1 COMPLETE - Ready for Sprint 2 planning
