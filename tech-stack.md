# 🛠️ TECH STACK - EMPLEAIDO FACTORY

**Version**: 1.0
**Last Updated**: 2026-02-07
**Status**: Production

---

## 🎨 FRONTEND

### Framework
- **Next.js 16.1.6** with App Router
  - **Why**: Server Components, streaming, best-in-class React framework
  - **Turbopack**: Enabled for faster dev builds (485ms startup)
  - **Version notes**: Requires async params for dynamic routes

### UI/Styling
- **Tailwind CSS 4**
  - **Why**: Utility-first, rapid prototyping, consistent design system
  - **PostCSS**: @tailwindcss/postcss for processing
  - **Custom config**: Minimal setup, default theme

### Language
- **TypeScript 5**
  - **Strict mode**: Enabled
  - **Target**: ES2017
  - **Path aliases**: `@/*` → `./src/*`

### State Management
- **React 19.2.3** (built-in hooks)
  - **useState**: Component-level state
  - **useContext**: For theme/user context (future)
  - **No Redux/Zustand**: Keeping it simple for MVP

### UI Components
- **Native React Components**
  - **Why**: No component library bloat, full control
  - **Future**: May add shadcn/ui for complex components

---

## 🔧 BACKEND

### Framework
- **Next.js API Routes**
  - **Route Handlers**: Modern App Router API
  - **Serverless**: Auto-deployed on Vercel
  - **Example**: `/api/generate-images` for Runware

### Database
- **Supabase (PostgreSQL 15)**
  - **Why**: Managed Postgres, RLS built-in, generous free tier
  - **Connection**: Direct Postgres connection (not REST API)
  - **Schema**: Multi-tenant with `ef_` prefix
  - **Tables**:
    - `ef_empleaidos` (core profiles)
    - `ef_adoptions` (user relationships)
    - `ef_empleaido_events` (activity log)
    - `ef_life_events` (XP/trust/energy changes)

### Database Security
- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: User can only see their own adoptions
- **Multi-tenancy**: ef_ prefix prevents collision with other projects
- **Indexes**: On id, user_id, serial for fast queries

### Database Functions
- **ef_apply_activity()**: Calculates XP/trust/energy changes
- **Future**: ef_level_up(), ef_unlock_skill()

---

## 🔐 AUTHENTICATION (Future - Sprint 2)

### Planned
- **Supabase Auth**
  - **Why**: Integrated with database, handles JWT, magic links
  - **Providers**: Email + Google + GitHub
  - **Sessions**: Server-side with cookies

### Current
- **Demo mode**: DEMO_USER for testing
- **No auth required**: Open access during development

---

## 🌐 EXTERNAL APIS & SERVICES

### Image Generation
- **Runware SDK (@runware/sdk-js 1.2.3)**
  - **Purpose**: AI image generation for empleaidos
  - **CDN**: Permanent URLs (im.runware.ai)
  - **Models**: FLUX Schnell (fast generation)
  - **Status**: ✅ 5/5 images generated successfully

### Voice Generation (Planned - Sprint 2)
- **ElevenLabs (elevenlabs 1.59.0)**
  - **Purpose**: Voice profiles per empleaido
  - **Status**: 📦 Package installed, not implemented

### OpenClaw Integration
- **OpenClaw CLI** (local installation)
  - **Purpose**: Agent spawning system
  - **Workspace**: `~/.openclaw/workspace-empleaido-{name}-{serial}/`
  - **Files**: IDENTITY.md, SOUL.md, TOOLS.md, USER.md, MEMORY.md
  - **Status**: ✅ SERA agent spawned successfully

### Sefirotic Routing
- **Custom adapter**: `openclaw/sefirotic-routing.ts`
  - **Purpose**: Routes empleaidos by Sephirah archetype
  - **Mapping**:
    - Netzach/Chesed → Right Pillar (expansion)
    - Hod/Binah → Left Pillar (restriction)
    - Yesod → Middle Pillar (balance)

---

## 🚀 HOSTING & DEPLOYMENT

### Platform
- **Vercel** (Hobby Plan)
  - **Why**: Zero-config Next.js, edge network, free SSL
  - **Region**: US East (closest to target users)
  - **Bandwidth**: 100GB/month limit

### Domain (Future)
- **TBD**: empleaidofactory.com or empleaido.ai
- **DNS**: Vercel DNS or Cloudflare

### CI/CD
- **Git**: Local repo (not pushed yet)
- **Deployment**: Manual `vercel deploy` (future: GitHub integration)
- **Environments**:
  - Development: localhost:3000
  - Production: TBD

---

## 📦 PACKAGE MANAGEMENT

### Manager
- **npm** (default Node.js)
  - **Lock file**: package-lock.json committed
  - **Scripts**:
    - `npm run dev` → Development server
    - `npm run build` → Production build
    - `npm start` → Production server
    - `npm run lint` → ESLint check

### Dependencies (Production)
```json
{
  "@runware/sdk-js": "^1.2.3",
  "elevenlabs": "^1.59.0",
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

### Dev Dependencies
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.6",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

## 🔧 DEVELOPMENT ENVIRONMENT

### IDE
- **Cursor** (recommended)
  - **Why**: AI-native coding, better than Copilot
  - **Alternative**: VS Code + GitHub Copilot

### Node.js
- **Version**: 20.x (LTS)
  - **Why**: Stable, Next.js 16 compatible
  - **Package manager**: npm (default)

### Browser Testing
- **Primary**: Chrome/Arc (webkit-based)
- **Mobile**: Safari iOS, Chrome Android (responsive mode)

### Tools
- **OpenClaw CLI**: Installed globally for agent operations
- **Supabase CLI**: For schema migrations (future)
- **Vercel CLI**: For deployments

---

## 📊 MONITORING & ANALYTICS (Future)

### Planned
- **Vercel Analytics**: Built-in, free on Hobby
- **Sentry**: Error tracking (if needed)
- **PostHog**: Product analytics (open source)
- **Supabase Dashboard**: Database metrics

### Current
- **Manual testing**: curl + browser DevTools
- **Server logs**: Next.js dev server output

---

## 🔒 SECURITY

### Current
- ✅ TypeScript strict mode
- ✅ Next.js security headers (default)
- ✅ RLS on Supabase tables
- ✅ Multi-tenant isolation (ef_ prefix)
- ✅ No hardcoded secrets (env vars future)

### Future (Sprint 2)
- 🔐 Environment variables (.env.local)
- 🔐 API route authentication
- 🔐 Rate limiting on public endpoints
- 🔐 CORS configuration

---

## 🧪 TESTING (Future)

### Planned
- **Vitest**: Unit tests for utilities
- **Playwright**: E2E testing for critical flows
- **React Testing Library**: Component tests

### Current
- **Manual QA**: Browser testing all routes
- **TypeScript**: Type checking as testing

---

## 📈 PERFORMANCE

### Current Metrics
- **Server startup**: 485ms (Turbopack)
- **Page compilation**: ~200-500ms per route
- **Route responses**: 200 OK on all endpoints
- **Build size**: TBD (production build pending)

### Optimizations Applied
- ✅ Turbopack enabled
- ✅ Server Components (default)
- ✅ Image optimization (Next.js built-in)
- ✅ Static JSON data (empleaidos.json)

---

## 🔄 VERSION CONTROL

### Git
- **Repository**: Local only (not pushed)
- **Branches**: main (single branch MVP)
- **Commits**: Manual, descriptive messages
- **Ignore**: .gitignore includes .next, node_modules, .env*

### Future
- **GitHub**: Public or private repo TBD
- **Branch strategy**: main + feature branches
- **PR process**: Review before merge

---

## 📚 DOCUMENTATION

### Inline
- **TypeScript types**: Self-documenting code
- **Comments**: Minimal, code should be self-explanatory

### Project-level
- ✅ README.md (overview)
- ✅ PRD.md (this file's sibling)
- ✅ tech-stack.md (this file)
- ✅ design-notes.md
- ✅ requirements.md
- ✅ Complete validation reports

---

## 🚨 KNOWN ISSUES

### Resolved
- ✅ Next.js 15+ async params (fixed)
- ✅ Directory structure (app/ vs src/app/) (fixed)
- ✅ Route registration 404s (fixed)

### Outstanding
- ⚠️ No auth system (intentional, Sprint 2)
- ⚠️ No payment integration (intentional, Sprint 2)
- ⚠️ ElevenLabs not implemented (intentional, Sprint 2)
- ⚠️ No tests (intentional, post-MVP)

---

## 🎯 TECH DEBT (Future Sprints)

1. **Add test coverage** (unit + E2E)
2. **Implement proper error boundaries**
3. **Add loading states/skeletons**
4. **Optimize bundle size** (code splitting)
5. **Add database migrations system**
6. **Implement feature flags**
7. **Add proper logging (Winston/Pino)**
8. **Set up staging environment**

---

**Last Review**: 2026-02-07
**Next Review**: Sprint 2 planning
**Owner**: Nadal Piantini
