# EMPLEAIDO FACTORY - Architecture

## System Overview

```
┌──────────────────────────┐
│  BACKSTAGE / FABRICA     │  ← Creator (you)
│  - Design Empleaidos     │
│  - Assign identity       │
│  - Publish to catalog    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  CATALOGO / TIENDA       │  ← Customer
│  - Browse profiles       │
│  - Compare Empleaidos    │
│  - Adopt one             │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  EMPLEAIDO VIVO          │  ← OpenClaw + Sephirot
│  - Instantiate           │
│  - Learn / act           │
│  - Evolve                │
└──────────────────────────┘
```

## Data Model

### Empleaido (Core Entity)

```typescript
interface Empleaido {
  // Identity
  id: string;           // empleaido-XXXXX
  serial: number;       // Display number
  name: string;         // Callsign
  status: Status;

  // Architecture
  sephirot: {
    primary: Sephirah;
    secondary: Sephirah[];
  };

  // Commercial
  role: { main, sub, tier };
  pricing: { monthly_usd, annual_usd };

  // Capabilities
  skills: { native, locked };

  // Visual
  visual: { accessory, color_accent };

  // Life System
  life: { level, experience, trust, energy };

  // Narrative
  identity: { motivation, boundaries, safety_rejections };
}
```

### Adoption (Relationship)

```typescript
interface Adoption {
  id: string;
  user_id: string;
  empleaido_id: string;
  status: 'active' | 'paused' | 'ended';
  bond_started_at: string;
  cycle: number;
  confidence: number;
}
```

## Sephirot as Product Architecture

| Layer | Sephirah | Function |
|-------|----------|----------|
| Intent | Keter | Classify what user wants |
| Expansion | Chokmah | Generate hypotheses |
| Restriction | Binah | Apply constraints |
| Safety | Gevurah | SHIELD - refusal logic |
| Balance | Tiferet | Orchestrate |
| Memory | Yesod | Relationship continuity |
| Output | Malkuth | Deliver to real world |

## Life System

### XP & Levels
- 100 XP per level
- Max level: 50
- XP sources: task_completed (+20), session (+5)

### Trust
- Range: 0.0 - 1.0
- Affects autonomy and recommendations
- Increases with successful tasks
- Decreases with errors and idle time

### Energy
- Range: 0 - 100
- Consumed by activities
- Regenerates over time
- Prevents overuse

## Skill Architecture

### Domains
1. **Contabilidad** (SERA)
2. **Growth** (KAEL)
3. **Operaciones** (NORA)
4. **Finanzas** (LIOR)
5. **Productividad** (ZIV)

### Unlock Mechanics (Future)
- Usage-based: Complete X tasks with related skill
- Tier-based: Upgrade tier to unlock
- Time-based: After Y months of adoption

## Integration Points

### OpenClaw (Future)
```
Adoption → spawnOpenClawAgent(empleaido) → Live Agent
```

### Sefirotic Orchestrator (Future)
```
Request → Keter (classify) → Route by Sephirah → Execute → Malkuth (deliver)
```

### Supabase (Future)
- `users` table
- `empleaidos` table
- `adoptions` table
- `life_events` table

## Security Considerations

1. **No real ID simulation**: EID format cannot be mistaken for government IDs
2. **AI transparency**: Always disclose Empleaidos are AI agents
3. **Boundaries**: Each Empleaido has explicit refusal patterns
4. **SHIELD**: Gevurah-based safety gate for all outputs
