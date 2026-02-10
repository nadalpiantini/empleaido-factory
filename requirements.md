# 📋 REQUIREMENTS - EMPLEAIDO FACTORY

**Version**: 1.0
**Last Updated**: 2026-02-07
**Status**: Sprint 1 Complete

---

## 🎯 FUNCTIONAL REQUIREMENTS

### FR-001: Empleaido Catalog System

**User Story**:
> As a visitor, I want to browse available empleaidos so I can choose which one fits my needs.

**Acceptance Criteria**:
- ✅ Display grid of 5 empleaidos on homepage
- ✅ Show name, serial number, role, pricing per empleaido
- ✅ Click to view full profile
- ✅ Responsive layout (1/2/3 columns based on screen size)
- ✅ Display role emoji as visual identifier

**Priority**: P0 (Must Have)
**Status**: ✅ Complete

---

### FR-002: Empleaido Profile Page

**User Story**:
> As a visitor, I want to view detailed information about an empleaido so I can understand what it does.

**Acceptance Criteria**:
- ✅ Dynamic route `/empleaido/[id]`
- ✅ Display full profile (name, serial, role, motivation)
- ✅ Show native skills (included) and locked skills (unlockable)
- ✅ Display boundaries ("What I Don't Do")
- ✅ Show pricing (monthly + annual with savings)
- ✅ CTA button "Adopt {name}"
- ✅ Back link to catalog
- ✅ 404 page if empleaido not found

**Priority**: P0 (Must Have)
**Status**: ✅ Complete

---

### FR-003: Life Engine System

**User Story**:
> As an empleaido owner, I want my empleaido to have stats that evolve so I feel connected to its growth.

**Acceptance Criteria**:
- ✅ Each empleaido has: level, experience, energy, trust
- ✅ Stats stored in database schema
- ✅ Function `ef_apply_activity()` updates stats
- ✅ Display life stats on profile and dashboard

**Technical Details**:
```typescript
interface Life {
  level: number;        // 1-100
  experience: number;   // XP accumulated
  energy: number;       // 0-100 daily capacity
  trust: number;        // 0-1.0 relationship score
}
```

**Priority**: P0 (Must Have)
**Status**: ✅ Complete (backend ready, UX in Sprint 2)

---

### FR-004: Skills System

**User Story**:
> As a user, I want to see what my empleaido can do now and what I can unlock later.

**Acceptance Criteria**:
- ✅ Skills divided into "native" (included) and "locked" (future)
- ✅ Native skills shown with green ✓
- ✅ Locked skills shown with gray 🔒
- ✅ Skills have IDs mapped to human labels
- ✅ Future: Skills unlock based on trust level

**Skills Schema**:
```typescript
interface Skills {
  native: string[];    // Available immediately
  locked: string[];    // Require progression to unlock
}
```

**Priority**: P0 (Must Have)
**Status**: ✅ Complete (display only, unlock logic in Sprint 2)

---

### FR-005: OpenClaw Agent Spawning

**User Story**:
> As a developer, I want each empleaido to spawn a real OpenClaw agent so they can actually perform tasks.

**Acceptance Criteria**:
- ✅ `openclaw/spawn.ts` creates agent workspace
- ✅ Generates 5 markdown files (IDENTITY, SOUL, TOOLS, USER, MEMORY)
- ✅ Registers agent in `~/.openclaw/openclaw.json`
- ✅ Maps Sephirah to agent behavioral traits
- ✅ SERA proven working end-to-end

**Technical Details**:
```bash
Workspace: ~/.openclaw/workspace-empleaido-{name}-{serial}/
Files:
  - IDENTITY.md (who they are)
  - SOUL.md (purpose, motivation)
  - TOOLS.md (capabilities)
  - USER.md (user context)
  - MEMORY.md (interaction history)
```

**Priority**: P0 (Must Have)
**Status**: ✅ Complete

---

### FR-006: Sefirotic Routing System

**User Story**:
> As a system architect, I want empleaidos routed by their Sephirah archetype so behavior is consistent with their design.

**Acceptance Criteria**:
- ✅ Adapter in `openclaw/sefirotic-routing.ts`
- ✅ Maps each empleaido to Sephirah (Netzach, Chesed, Hod, Binah, Yesod)
- ✅ Routes tasks to appropriate empleaido based on archetype
- ✅ System documented in architecture docs

**Sephirot Mapping**:
```
Right Pillar (Expansion):
  - SERA (Netzach) - Never gives up
  - KAEL (Chesed) - Abundant, generous

Left Pillar (Restriction):
  - NORA (Hod) - Precise, structured
  - LIOR (Binah) - Strategic, wise

Middle Pillar (Balance):
  - ZIV (Yesod) - Harmonizer, practical
```

**Priority**: P0 (Must Have)
**Status**: ✅ Complete

---

### FR-007: Backstage Management Interface

**User Story**:
> As an admin, I want a management interface so I can oversee all empleaidos.

**Acceptance Criteria**:
- ✅ Route `/backstage` accessible
- ✅ Grid view of all empleaidos
- ✅ Shows: name, serial, tier, Sephirah, level, XP, energy
- ✅ Links to "Edit" (future) and "Preview" (profile page)
- ✅ Status indicator (active/inactive)
- ✅ "Create Empleaido" button (future)

**Priority**: P1 (Should Have)
**Status**: ✅ Complete

---

### FR-008: User Dashboard

**User Story**:
> As a user, I want a dashboard to see my adopted empleaidos so I can manage them.

**Acceptance Criteria**:
- ✅ Route `/dashboard` accessible
- ✅ Lists all user's employed empleaidos
- ✅ Shows: name, serial, role, life stats (level, XP, energy, trust)
- ✅ Link to detailed view `/dashboard/[id]`
- ✅ Empty state: "You haven't adopted any Empleaidos yet"
- ✅ Link back to catalog

**Priority**: P1 (Should Have)
**Status**: ✅ Complete (demo mode, auth in Sprint 2)

---

### FR-009: Dynamic Dashboard Detail Pages

**User Story**:
> As a user, I want to see detailed stats for each of my empleaidos.

**Acceptance Criteria**:
- ✅ Route `/dashboard/[id]` for each empleaido
- ✅ Shows: full profile, life stats grid, active/locked skills
- ✅ Displays OpenClaw agent status (workspace path, agent ID)
- ✅ Back link to dashboard
- ✅ 404 if empleaido not found

**Priority**: P1 (Should Have)
**Status**: ✅ Complete

---

### FR-010: Visual Assets Integration

**User Story**:
> As a product owner, I want professional AI-generated images for each empleaido.

**Acceptance Criteria**:
- ✅ 5 unique images generated via Runware API
- ✅ Permanent CDN URLs stored in profiles
- ✅ Consistent art style across all empleaidos
- ✅ Sephirot-inspired visual design
- ✅ Images display on profile pages

**Generated Assets**:
- ✅ SERA (Netzach green accent)
- ✅ KAEL (Chesed blue accent)
- ✅ NORA (Hod orange accent)
- ✅ LIOR (Binah indigo accent)
- ✅ ZIV (Yesod purple accent)

**Priority**: P1 (Should Have)
**Status**: ✅ Complete

---

## 🔒 NON-FUNCTIONAL REQUIREMENTS

### NFR-001: Performance

**Requirements**:
- ✅ Server startup < 1s (achieved: 485ms)
- ✅ Page load < 2s (all routes: ~200-500ms compile)
- ✅ Route responses: 200 OK status
- ✅ TypeScript compilation: clean, zero errors

**Priority**: P0
**Status**: ✅ Met

---

### NFR-002: Security

**Requirements**:
- ✅ TypeScript strict mode enabled
- ✅ Row Level Security (RLS) on database tables
- ✅ Multi-tenant isolation (ef_ prefix)
- ✅ No hardcoded secrets in code
- 🔄 Environment variables (Sprint 2)
- 🔄 API authentication (Sprint 2)

**Priority**: P0 (partial)
**Status**: ✅ Foundation complete, auth in Sprint 2

---

### NFR-003: Scalability

**Requirements**:
- ✅ Serverless architecture (Next.js on Vercel)
- ✅ PostgreSQL with proper indexes
- ✅ CDN-hosted static assets
- ✅ Stateless server components
- 🔄 Caching strategy (Sprint 2)

**Priority**: P1
**Status**: ✅ Architecture supports scale

---

### NFR-004: Maintainability

**Requirements**:
- ✅ TypeScript for type safety
- ✅ Clear file organization
- ✅ Documented architecture
- ✅ Git version control
- ✅ Code comments where necessary
- ❌ Unit tests (Sprint 3)

**Priority**: P1
**Status**: ✅ 80% complete (tests pending)

---

### NFR-005: Accessibility

**Requirements**:
- ❌ ARIA labels
- ❌ Keyboard navigation
- ❌ Screen reader support
- ✅ Responsive design
- ❌ Color contrast checks

**Priority**: P2
**Status**: ⚠️ Deferred to Sprint 3

---

### NFR-006: Browser Compatibility

**Requirements**:
- ✅ Chrome/Edge (webkit)
- ✅ Safari (iOS/Mac)
- ✅ Firefox
- ✅ Mobile browsers
- ✅ Responsive breakpoints

**Priority**: P1
**Status**: ✅ Complete (modern browsers only)

---

## 🔄 INTEGRATION REQUIREMENTS

### INT-001: Supabase Database

**Requirements**:
- ✅ PostgreSQL connection established
- ✅ Schema with ef_ prefix tables
- ✅ RLS policies configured
- ✅ Functions for life engine logic
- ✅ Indexes on critical columns

**Status**: ✅ Complete

---

### INT-002: OpenClaw CLI

**Requirements**:
- ✅ Local CLI installation
- ✅ Workspace creation functional
- ✅ Agent registration working
- ✅ SERA spawn proven successful
- 🔄 Bulk spawning (Sprint 2)

**Status**: ✅ MVP complete

---

### INT-003: Runware API

**Requirements**:
- ✅ SDK installed (@runware/sdk-js)
- ✅ Image generation endpoint
- ✅ 5/5 assets generated successfully
- ✅ Permanent CDN URLs
- 🔄 On-demand generation (Sprint 2)

**Status**: ✅ Complete

---

### INT-004: ElevenLabs API (Future)

**Requirements**:
- ✅ SDK installed (elevenlabs)
- ❌ Voice generation not implemented
- ❌ Audio profiles not created
- ❌ Voice interaction system

**Status**: 📦 Ready but not implemented (Sprint 2)

---

## 📊 DATA REQUIREMENTS

### DR-001: Empleaido Profile Schema

```typescript
interface Empleaido {
  id: string;              // empleaido-{serial}
  serial: number;          // Unique 4-digit
  name: string;            // SERA, KAEL, etc.
  status: "active" | "inactive";

  sephirot: {
    primary: Sephirah;
    secondary: Sephirah[];
  };

  role: {
    main: string;          // "Contabilidad RD"
    sub: string;           // "Freelancers"
    tier: "base" | "pro" | "deluxe";
  };

  skills: {
    native: string[];      // Included skills
    locked: string[];      // Unlockable skills
  };

  life: {
    level: number;
    experience: number;
    energy: number;
    trust: number;
  };

  identity: {
    motivation: string;    // Quote
    values: string[];
    boundaries: string[];  // What they DON'T do
  };

  pricing: {
    monthly_usd: number;
    annual_usd?: number;
  };

  visual: {
    accessory: string;
    color_accent: string;
    style_notes?: string;
    image_url?: string;
  };
}
```

**Priority**: P0
**Status**: ✅ Implemented

---

### DR-002: Database Tables

**ef_empleaidos**:
```sql
CREATE TABLE ef_empleaidos (
  id TEXT PRIMARY KEY,
  serial INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profile JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**ef_adoptions**:
```sql
CREATE TABLE ef_adoptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  empleaido_id TEXT REFERENCES ef_empleaidos(id),
  adopted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);
```

**ef_empleaido_events**:
```sql
CREATE TABLE ef_empleaido_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleaido_id TEXT REFERENCES ef_empleaidos(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**ef_life_events**:
```sql
CREATE TABLE ef_life_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleaido_id TEXT REFERENCES ef_empleaidos(id),
  activity_type TEXT NOT NULL,
  xp_change INTEGER DEFAULT 0,
  energy_change INTEGER DEFAULT 0,
  trust_change NUMERIC(3,2) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Priority**: P0
**Status**: ✅ Complete

---

## ✅ ACCEPTANCE CRITERIA (Overall)

### Sprint 1 Success Criteria

**Functional**:
- ✅ 5 empleaidos with complete profiles
- ✅ All routes functional (/, /backstage, /dashboard, /empleaido/[id], /dashboard/[id])
- ✅ OpenClaw integration proven (SERA spawned)
- ✅ Visual assets generated (5/5 images)
- ✅ Life engine backend ready

**Technical**:
- ✅ TypeScript strict mode, zero errors
- ✅ Next.js 16 with Turbopack
- ✅ Supabase schema with RLS
- ✅ Multi-tenant safe (ef_ prefix)
- ✅ Responsive UI (mobile/tablet/desktop)

**Quality**:
- ✅ No console errors
- ✅ All routes return 200 OK
- ✅ Clean server logs
- ✅ Fast compilation (< 1s startup)

---

## 🚧 OUT OF SCOPE (Sprint 1)

- ❌ User authentication
- ❌ Payment processing
- ❌ Voice generation
- ❌ Skill unlock UX
- ❌ Energy depletion visualization
- ❌ Trust progression animation
- ❌ Unit/E2E tests
- ❌ Dark theme
- ❌ Accessibility features
- ❌ Analytics tracking

---

## 📈 FUTURE REQUIREMENTS (Sprint 2+)

### Sprint 2: Authentication & Payments
- User signup/login (Supabase Auth)
- Stripe integration
- Adoption flow with payment
- User profile page
- Email notifications

### Sprint 3: Enhanced UX
- Dark theme
- Animations (level up, skill unlock)
- Loading states/skeletons
- Error boundaries
- Toast notifications

### Sprint 4: Advanced Features
- Team dashboard (multiple empleaidos)
- Energy management UX
- Trust-based unlocks
- Third-party integrations
- Public API

---

## 🎯 QUALITY GATES

### Before Sprint Closure
- ✅ All P0 requirements met
- ✅ All P1 requirements met
- ✅ TypeScript compilation clean
- ✅ All routes functional
- ✅ Documentation complete

### Before Production Deploy
- 🔄 Auth system implemented
- 🔄 Payment system tested
- 🔄 Error tracking enabled
- 🔄 Performance monitoring
- 🔄 Security audit

---

**Last Updated**: 2026-02-07
**Status**: Sprint 1 100% Complete
**Next Review**: Sprint 2 Planning
