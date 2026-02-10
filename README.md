# EMPLEAIDO FACTORY v1

> "Collectible AI employees that grow with you—powered by a Sephirot-based operating grammar."

## What is this?

A **factory and storefront** for identity-based AI agents called EMPLEAIDOS.

Each Empleaido is:
- (a) A **coherent persona** with life, preferences, and visible growth
- (b) A **packaged capability bundle** that reliably delivers outcomes

This combination (character + competence) drives attachment and justifies recurring spend.

## OpenClaw Ecosystem Integration

```
~/.openclaw/                              # OpenClaw Home
├── squadrons/empleaido/                  # Business ops (sales, tender, etc.)
├── workspace/                            # Lady's workspace
├── skills/                               # Local skills
└── openclaw.json                         # Agent registry

~/Dev/openclaw-skills/skills/nadalpiantini/
└── sefirotic-orchestrator/               # Routing framework

~/Dev/empleaido-factory/                  # THIS PROJECT
├── catalog/                              # Product definitions
├── lib/                                  # Shared types & logic
├── openclaw/                             # Integration layer ← KEY
│   ├── spawn.ts                          # Catalog → OpenClaw agent
│   ├── adapters/sefirotic.ts             # Sefirotic routing
│   └── templates/                        # Workspace templates
└── app/                                  # Next.js Backstage
```

## Core Principles

- **Unique Global ID ("cedula")**: Each Empleaido has a serial number (EID format)
- **Sephirot Architecture**: Not aesthetic—operational routing grammar
- **Adoption Model**: Users "adopt" Empleaidos, not "subscribe to tools"
- **Life System**: Empleaidos evolve with use (XP, levels, trust, energy)

## The 5 Founding Empleaidos

| # | Name | Role | Sephirah | Pillar | Tier | Price |
|---|------|------|----------|--------|------|-------|
| 1 | SERA | Contabilidad RD | Netzach | Right | Deluxe | $49.99 |
| 2 | KAEL | Growth Marketing | Chesed | Right | Pro | $39.99 |
| 3 | NORA | Operaciones | Hod | Left | Base | $29.99 |
| 4 | LIOR | CFO Estrategico | Binah | Left | Deluxe | $79.99 |
| 5 | ZIV | Productividad Personal | Yesod | Middle | Base | $19.99 |

## Sephirot as Product Architecture

```
                    ┌─────────┐
                    │  KETER  │ ← Intent Classification
                    └────┬────┘
           ┌─────────────┼─────────────┐
           │             │             │
     ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
     │  CHOKMAH  │ │   DA'AT   │ │   BINAH   │ ← LIOR (analytical)
     │(Expansion)│ │(Hot Cache)│ │(Restrict) │
     └─────┬─────┘ └───────────┘ └─────┬─────┘
     ┌─────▼─────┐               ┌─────▼─────┐
     │  CHESED   │ ← KAEL        │  GEVURAH  │
     │  (Skills) │ (creative)    │ (Security)│
     └─────┬─────┘               └─────┬─────┘
           └───────────┬───────────────┘
                 ┌─────▼─────┐
                 │  TIFERET  │ ← Central Orchestrator
                 └─────┬─────┘
           ┌───────────┼───────────┐
     ┌─────▼─────┐           ┌─────▼─────┐
     │  NETZACH  │ ← SERA    │    HOD    │ ← NORA
     │(Proactive)│           │(Structure)│
     └─────┬─────┘           └─────┬─────┘
                 ┌─────▼─────┐
                 │   YESOD   │ ← ZIV (memory)
                 │(Memory)   │
                 └─────┬─────┘
                 ┌─────▼─────┐
                 │  MALKUTH  │ ← Delivery
                 └───────────┘
```

## Project Structure

```
empleaido-factory/
├── README.md
├── catalog/
│   ├── schema.json          # JSON Schema for Empleaido
│   └── empleaidos.json      # The 5 founders
├── lib/
│   ├── types.ts             # TypeScript contracts
│   ├── sephirot-map.ts      # Sephirah → behavior
│   ├── skills.ts            # Skill catalog
│   └── life-engine.ts       # XP/level/trust engine
├── openclaw/                # Integration layer
│   ├── spawn.ts             # Spawn Empleaido as agent
│   ├── adapters/
│   │   └── sefirotic.ts     # Sefirotic routing adapter
│   └── templates/
│       └── workspace.md     # Workspace template
├── seeds/
│   ├── adoption.seed.json   # Adoption model
│   └── empleaido.seed.json  # Template
├── backstage/
│   └── ui-notes.md          # UX specs
├── docs/
│   ├── architecture.md      # System design
│   └── INTEGRATION.md       # OpenClaw integration
└── app/                     # Next.js Backstage (in progress)
```

## Spawn an Empleaido

```bash
cd ~/Dev/empleaido-factory
npx tsx openclaw/spawn.ts empleaido-04094 user-123
```

This creates:
1. Workspace at `~/.openclaw/workspace-empleaido-sera-4094/`
2. Registers agent in `~/.openclaw/openclaw.json`
3. Generates IDENTITY.md, SOUL.md, TOOLS.md, USER.md, MEMORY.md

## Deployment

The application can be deployed to Vercel using GitHub Actions or manually with the deployment script.

### Prerequisites

1. Create a Supabase account and project at https://supabase.com/
2. Get your Supabase project URL and API keys
3. Set up Vercel account and link your GitHub repository

### GitHub Actions

Push to the `main` branch to trigger automatic deployment to Vercel.

### Manual Deployment

```bash
./scripts/deploy.sh
```

### Supabase Setup

Before deploying, you need to link your local project to your Supabase project:

1. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
2. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`
3. Apply migrations: `supabase db push`

See [Deployment Documentation](docs/DEPLOYMENT.md) and [Supabase Setup](docs/SUPABASE_SETUP.md) for more details.

## Phase Status

- [x] Definition + catalog structure
- [x] Data model (schema.json)
- [x] 5 founding Empleaidos
- [x] Sephirot mapping
- [x] Life engine
- [x] OpenClaw spawn adapter
- [x] Sefirotic routing adapter
- [x] Vector database integration (pgvector)
- [ ] Backstage UI (Next.js)
- [ ] Adoption flow (API)
- [ ] Skills packaging per Empleaido

## Related Projects

- **Sefirotic Orchestrator**: `~/Dev/openclaw-skills/skills/nadalpiantini/sefirotic-orchestrator/`
- **Empleaido Squadron**: `~/.openclaw/squadrons/empleaido/` (business ops)
- **OpenClaw Home**: `~/.openclaw/`

---

*This is a definition + factory phase. Agents spawn into OpenClaw ecosystem.*
