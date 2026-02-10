# 🎨 DESIGN NOTES - EMPLEAIDO FACTORY

**Version**: 1.0
**Last Updated**: 2026-02-07
**Status**: MVP Complete

---

## 🏗️ ARCHITECTURE OVERVIEW

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     EMPLEAIDO FACTORY                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │   Next.js   │───▶│   Supabase   │◀───│  OpenClaw  │ │
│  │  Frontend   │    │  PostgreSQL  │    │   Agent    │ │
│  │  + Routes   │    │  + RLS       │    │  Spawner   │ │
│  └─────────────┘    └──────────────┘    └────────────┘ │
│         │                    │                    │      │
│         └────────┬───────────┴────────────────────┘      │
│                  ▼                                       │
│         ┌─────────────────┐                              │
│         │   Life Engine   │                              │
│         │  XP/Trust/Energy│                              │
│         └─────────────────┘                              │
│                  │                                       │
│                  ▼                                       │
│         ┌─────────────────┐                              │
│         │   Sephirot       │                              │
│         │   Framework      │                              │
│         └─────────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action
    │
    ▼
Next.js Route (Server Component)
    │
    ├─▶ Read empleaidos.json (Static)
    │
    └─▶ Query Supabase (Dynamic)
         │
         ├─▶ ef_empleaidos (Profiles)
         ├─▶ ef_adoptions (User relationships)
         └─▶ ef_life_events (Activity log)
              │
              ▼
         Life Engine Processing
              │
              ▼
         Response + UI Update
```

---

## 🎭 SEPHIROT FRAMEWORK (Product Psychology)

### Core Concept

The Sephirot (Kabbalah Tree of Life) provides the **behavioral framework** for empleaidos. This is NOT decoration — it's **operational product psychology**.

### Three Pillars Architecture

```
        ┌──────────── BINAH ────────────┐
        │    (Understanding)             │
   LEFT PILLAR                      RIGHT PILLAR
 (Restriction)                      (Expansion)
        │                                 │
        │                                 │
    ┌───▼───┐                        ┌───▼───┐
    │  HOD  │                        │CHESED │
    │(Glory)│                        │(Mercy)│
    └───┬───┘                        └───┬───┘
        │                                 │
        │          MIDDLE PILLAR          │
        │         (Balance)               │
        │              │                  │
        │          ┌───▼────┐             │
        │          │ YESOD  │             │
        └──────────│(Found.)│─────────────┘
                   └────────┘
```

### Empleaido Mapping

**Right Pillar (Expansion Archetypes)**:
- **SERA** (Netzach - Victory) - Relentless accountant, never gives up
- **KAEL** (Chesed - Kindness) - Abundant marketer, generous with ideas

**Left Pillar (Restriction Archetypes)**:
- **NORA** (Hod - Glory) - Precise operator, glorious through structure
- **LIOR** (Binah - Understanding) - Strategic CFO, deep comprehension

**Middle Pillar (Balance Archetypes)**:
- **ZIV** (Yesod - Foundation) - Productivity harmonizer, foundation-builder

### Behavioral Implications

Each Sephirah defines:
1. **Tone of voice** (how empleaido communicates)
2. **Decision-making style** (how empleaido solves problems)
3. **Skill progression** (what empleaido unlocks)
4. **User interaction** (how empleaido responds to user)

**Example**:
- SERA (Netzach) never suggests "skip" — always finds a way
- KAEL (Chesed) over-delivers — suggests 10 marketing tactics when asked for 3
- NORA (Hod) precise and structured — always follows protocols exactly
- LIOR (Binah) strategic — sees big picture, warns of long-term consequences
- ZIV (Yesod) balanced — never extremes, always practical middle ground

---

## 🧬 LIFE ENGINE (Gamification System)

### Core Metrics

```typescript
interface Life {
  level: number;        // 1-100 progression
  experience: number;   // XP points earned
  energy: number;       // 0-100 daily capacity
  trust: number;        // 0-1.0 relationship score
}
```

### XP System

**XP Sources**:
- Task completion: 10-100 XP (based on complexity)
- Successful output: +20 XP bonus
- User feedback: +/-10 XP
- Daily activity: +5 XP passive
- Skill usage: +15 XP per native skill used

**Leveling Formula**:
```
XP_needed = 100 * level * 1.5
Example:
  Level 2: 300 XP
  Level 3: 450 XP
  Level 10: 1,500 XP
```

### Trust System

**Trust Score** (0.0 - 1.0):
- Starts at: 0.5 (neutral)
- Increases: Consistent usage, positive feedback, task success
- Decreases: Errors, negative feedback, neglect (no activity)

**Trust Thresholds**:
- 0.0-0.3: Low trust (limited features)
- 0.3-0.7: Medium trust (standard features)
- 0.7-1.0: High trust (unlocks advanced features)

**Trust Impacts**:
- Skill unlock speed
- Response quality
- Proactive suggestions
- Error recovery

### Energy System

**Daily Energy** (0-100):
- Resets at midnight user timezone
- Each task costs: 5-20 energy (based on complexity)
- Low energy (< 20): Slower responses, suggests rest
- Zero energy: Can still work but outputs are "tired" (quality check)

**Energy Recovery**:
- Automatic: 100 energy at midnight
- Premium: Buy extra energy (future monetization)
- Rest mode: User can "rest" empleaido for bonus next day

---

## 🎨 UI/UX DESIGN PRINCIPLES

### Design Philosophy

1. **Collectible-First**: Empleaidos feel like Pokemon/NFT collecting
2. **Utility-Second**: But they actually DO stuff (not just art)
3. **Emotional Connection**: Life system creates attachment
4. **Professional Polish**: Not a toy — enterprise-grade under the hood

### Color System

**Brand Colors**:
- Primary: Blue (`#3B82F6`) - Trust, technology
- Secondary: Purple (`#8B5CF6`) - Mystery, Sephirot magic
- Accent: Varies per empleaido (visual.color_accent)

**Sephirot Colors** (Future):
- Netzach: Green (`#4CAF50`) - Victory, growth
- Chesed: Blue (`#2196F3`) - Kindness, abundance
- Hod: Orange (`#FF9800`) - Glory, structure
- Binah: Indigo (`#3F51B5`) - Understanding, wisdom
- Yesod: Purple (`#9C27B0`) - Foundation, balance

### Typography

- **Headings**: System font stack (Inter-like)
- **Body**: Default sans-serif
- **Monospace**: For code/technical outputs

### Layout Patterns

**Catalog View** (Homepage):
```
┌───────────────────────────────────────┐
│  EMPLEAIDO FACTORY                    │
├───────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ SERA │  │ KAEL │  │ NORA │       │
│  │ 🧾   │  │ 📣   │  │ 🗂️   │       │
│  │ $X/mo│  │ $Y/mo│  │ $Z/mo│       │
│  └──────┘  └──────┘  └──────┘       │
└───────────────────────────────────────┘
```

**Profile View** (Empleaido Detail):
```
┌───────────────────────────────────────┐
│  ← Back to Catalog                    │
├───────────────────────────────────────┤
│            🧾 SERA                     │
│       EMPLEAIDO #04094                │
│                                        │
│  "Voy a hacer que tus impuestos...    │
│   se resuelvan solos."                │
│                                        │
│  ┌─────────────┬─────────────┐       │
│  │ ✓ Included  │ 🔒 Locked    │       │
│  │ • Skill 1   │ • Skill 5    │       │
│  │ • Skill 2   │ • Skill 6    │       │
│  └─────────────┴─────────────┘       │
│                                        │
│  ⚠️ What I Don't Do:                  │
│  • No tax evasion                     │
│  • No personal returns (solo RD)      │
│                                        │
│  [   Adopt SERA for $X/month   ]     │
└───────────────────────────────────────┘
```

### Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640-1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

---

## 🧩 COMPONENT PATTERNS

### Page Components (Server Components)

```typescript
// Pattern: Async Server Component
export default async function EmpleaidoProfile({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const empleaido = await getEmpleaido(id);

  return <ProfileView empleaido={empleaido} />;
}
```

### Data Loading Pattern

```typescript
// Static data (empleaidos.json)
import empleaidos from '@/data/empleaidos.json';

// Dynamic data (future Supabase)
const { data } = await supabase
  .from('ef_adoptions')
  .select('*')
  .eq('user_id', userId);
```

### Error Handling Pattern

```typescript
if (!empleaido) {
  return (
    <NotFound>
      <p>Empleaido not found</p>
      <Link href="/">← Back to catalog</Link>
    </NotFound>
  );
}
```

---

## 🎯 VISUAL DESIGN SYSTEM

### Empleaido Visual Schema

```typescript
interface Visual {
  accessory: "headband" | "glasses" | "hat" | "scarf" | "bowtie";
  color_accent: string;  // Hex color
  style_notes: string;   // Generation prompt hints
  image_url?: string;    // Runware CDN URL
}
```

### Image Generation

**Process**:
1. Define personality + Sephirah archetype
2. Generate Runware prompt with style constraints
3. Call Runware API with FLUX Schnell model
4. Store permanent CDN URL in empleaido profile

**Style Guide**:
- Consistent art style across all 5
- Professional but friendly
- Subtle Sephirot symbolism in accessories
- Color accents match personality

**Current Assets**:
- ✅ SERA: https://im.runware.ai/image/ws/2/ii/4670e19d-6e62-455a-b62a-c44b457099fd.jpg
- ✅ KAEL: https://im.runware.ai/image/ws/2/ii/c718c09b-68d4-4e8e-8700-2ac63998bc82.jpg
- ✅ NORA: https://im.runware.ai/image/ws/2/ii/3f845299-1115-42d0-b0cd-fc384580f69b.jpg
- ✅ LIOR: https://im.runware.ai/image/ws/2/ii/c09a40a1-ea6e-476e-b61d-aa0b829b6a2e.jpg
- ✅ ZIV: https://im.runware.ai/image/ws/2/ii/c2c7d55e-b585-4035-8ff0-62793d9a57fc.jpg

---

## 🔄 STATE MANAGEMENT

### Current (MVP)

**Static JSON** (`empleaidos.json`):
- Profiles, skills, life stats
- Read-only at runtime
- Fast, no DB calls needed for catalog

**Server Components**:
- No client state needed
- All data fetched server-side
- SEO-friendly, fast initial load

### Future (Sprint 2+)

**Client State** (React Context):
```typescript
interface AppState {
  user: User | null;
  adoptedEmpleaidos: Empleaido[];
  theme: 'light' | 'dark';
}
```

**Server State** (Supabase):
```typescript
// Real-time subscriptions
const channel = supabase
  .channel('empleaido-updates')
  .on('postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'ef_life_events' },
    handleLifeUpdate
  );
```

---

## 🎬 ANIMATIONS & INTERACTIONS (Future)

### Planned Animations

1. **Level Up** - Confetti + badge animation
2. **Skill Unlock** - Lock → Key → Unlock sequence
3. **Energy Depletion** - Pulse + dim effect
4. **Trust Increase** - Heart fill animation
5. **XP Gain** - Number count-up with glow

### Micro-interactions

- Hover states on empleaido cards
- Smooth page transitions
- Loading skeletons
- Toast notifications for actions

---

## 📐 DESIGN PATTERNS

### Naming Conventions

**Files**:
- Pages: `page.tsx` (Next.js convention)
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `types.ts` or inline

**CSS Classes** (Tailwind):
- Descriptive: `text-gray-600`, `bg-blue-50`
- Responsive: `md:grid-cols-2`, `lg:text-xl`
- State: `hover:bg-gray-50`, `active:scale-95`

### File Organization

```
app/
├── (routes)/
│   ├── page.tsx              # Homepage
│   ├── backstage/            # Admin
│   ├── dashboard/            # User area
│   └── empleaido/[id]/       # Dynamic profile
└── src/
    ├── data/                 # Static JSON
    ├── lib/                  # Utilities
    │   ├── types.ts
    │   ├── sephirot.ts
    │   ├── skills.ts
    │   └── life-engine.ts
    └── ...
```

---

## 🚧 DESIGN DEBT (Future)

1. **Dark theme** - Currently only light mode
2. **Loading states** - No skeletons yet
3. **Error boundaries** - Basic error handling only
4. **Accessibility** - No ARIA labels, keyboard nav
5. **Animations** - Static UI, no motion
6. **Mobile optimization** - Works but not perfect
7. **Print styles** - No print CSS

---

## 📝 DESIGN DECISIONS (ADRs)

### ADR-001: Server Components Only (MVP)
- **Decision**: No client components in MVP
- **Rationale**: Simpler, faster, SEO-friendly
- **Trade-off**: No client interactivity (yet)
- **Status**: Accepted

### ADR-002: Static JSON for Profiles
- **Decision**: empleaidos.json instead of DB reads for catalog
- **Rationale**: Faster, no DB calls, simple deployment
- **Trade-off**: Must redeploy to update profiles
- **Status**: Accepted (will move to DB in Sprint 2)

### ADR-003: Tailwind Over CSS-in-JS
- **Decision**: Tailwind CSS, no styled-components/emotion
- **Rationale**: Faster dev, smaller bundle, no runtime
- **Trade-off**: Verbose HTML classes
- **Status**: Accepted

### ADR-004: No Component Library
- **Decision**: Build custom components, no shadcn/ui/Chakra
- **Rationale**: Full control, lighter bundle, learn patterns
- **Trade-off**: More work, reinventing wheels
- **Status**: Accepted (may revisit for complex components)

---

**Last Updated**: 2026-02-07
**Next Review**: Sprint 2 planning
**Owner**: Nadal Piantini
