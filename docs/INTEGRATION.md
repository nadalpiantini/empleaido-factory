# EMPLEAIDO FACTORY - OpenClaw Integration

## Ecosystem Map

```
~/.openclaw/                          # OpenClaw Home
├── squadrons/empleaido/              # Existing Empleaido Squadron (business ops)
├── workspace/                        # Main workspace (Lady lives here)
├── skills/                           # Local skills
└── openclaw.json                     # Agent config

~/Dev/openclaw-skills/skills/         # Skills Repository
└── nadalpiantini/
    └── sefirotic-orchestrator/       # Sefirotic routing framework

~/Dev/empleaido-factory/              # THIS PROJECT
├── catalog/                          # Product catalog (5 Empleaidos)
├── lib/                              # TypeScript contracts
├── app/                              # Next.js Backstage
└── openclaw/                         # NEW: OpenClaw integration layer
```

## Integration Points

### 1. Sefirotic Orchestrator → Empleaido Routing

Each Empleaido has a primary Sephirah that determines its behavior:

| Empleaido | Sephirah | Behavior |
|-----------|----------|----------|
| SERA | Netzach | Proactive, persistent (tax alerts) |
| KAEL | Chesed | Creative, expansive (growth marketing) |
| NORA | Hod | Structured, organized (backoffice) |
| LIOR | Binah | Analytical, restrictive (CFO) |
| ZIV | Yesod | Memory-focused, consistent (productivity) |

**Integration**: When spawning an Empleaido agent, the Sefirotic Orchestrator uses
the Empleaido's primary Sephirah to route tasks through the appropriate pillar.

### 2. OpenClaw Agent Registration

Each Empleaido becomes an OpenClaw agent:

```json
// ~/.openclaw/openclaw.json agents.list[]
{
  "id": "empleaido-sera-04094",
  "name": "SERA",
  "workspace": "~/.openclaw/workspace-empleaido-sera",
  "model": "zai/claude-sonnet-4",
  "identity": {
    "name": "SERA",
    "theme": "Contabilidad RD",
    "emoji": "🧾",
    "serial": 4094,
    "sephirah": "Netzach",
    "tier": "deluxe"
  }
}
```

### 3. Squadron → Factory Relationship

```
~/.openclaw/squadrons/empleaido/    # Business operations (existing)
├── brand/                          # Brand marketing
├── sales/                          # Lead generation
├── tender/                         # Opportunity adapter
└── ...

~/Dev/empleaido-factory/            # Product factory (this)
├── catalog/                        # Define Empleaidos
├── backstage/                      # Create/manage
└── openclaw/                       # Spawn agents
```

**The Squadron handles business operations.**
**The Factory handles product creation.**

### 4. Skill Packaging

Each Empleaido skill domain maps to OpenClaw skills:

```
Empleaido: SERA (Contabilidad RD)
├── ocr_facturas    → skill: @nadalpiantini/sera-ocr
├── itbis_mensual   → skill: @nadalpiantini/sera-itbis
├── alertas_dgii    → skill: @nadalpiantini/sera-dgii
└── ...
```

Skills are packaged as:
```
~/Dev/openclaw-skills/skills/nadalpiantini/sera/
├── SKILL.md
├── _meta.json
├── src/
│   ├── ocr.ts
│   ├── itbis.ts
│   └── dgii.ts
└── package.json
```

### 5. Workspace Structure per Empleaido

```
~/.openclaw/workspace-empleaido-sera/
├── IDENTITY.md      # Empleaido identity (from catalog)
├── SOUL.md          # Behavioral guidelines
├── MEMORY.md        # Conversation memory (Yesod)
├── TOOLS.md         # Available skills
├── USER.md          # Current adopter context
└── memory/          # Persistent memory folder
```

### 6. Adoption Flow (OpenClaw Integration)

```
1. User clicks "Adoptar" in Backstage
2. API creates adoption record
3. OpenClaw spawns agent:
   - Create workspace: ~/.openclaw/workspace-empleaido-{name}/
   - Register in openclaw.json
   - Initialize IDENTITY.md from catalog
   - Copy skill permissions
4. Sefirotic Orchestrator routes by Sephirah
5. Empleaido is live
```

## File Mapping

| Factory File | OpenClaw Equivalent |
|--------------|---------------------|
| `catalog/empleaidos.json` | Source of truth for spawning |
| `lib/types.ts` | Shared types |
| `lib/sephirot-map.ts` | Informs Sefirotic routing |
| `lib/skills.ts` | Maps to OpenClaw skills |
| `lib/life-engine.ts` | Updates workspace MEMORY.md |

## Commands (Future)

```bash
# Factory commands
empleaido spawn sera --user user-123     # Create agent from catalog
empleaido list                           # Show catalog
empleaido status sera                    # Check agent health

# OpenClaw integration
openclaw agents list                     # Shows empleaido-sera-04094
openclaw chat empleaido-sera-04094       # Talk to SERA
```

## Security Considerations

1. **SHIELD Integration**: Gevurah rules from Sefirotic Orchestrator apply
2. **Boundaries**: Each Empleaido has explicit refusal patterns (identity.boundaries)
3. **Tier Limits**: Base/Pro/Deluxe affect skill access
4. **User Isolation**: Each adoption gets isolated workspace

## Next Steps

1. [ ] Create `openclaw/` directory in factory
2. [ ] Build spawn adapter (catalog → agent)
3. [ ] Define workspace templates per Sephirah
4. [ ] Package skills per Empleaido
5. [ ] Connect adoption flow to spawn
