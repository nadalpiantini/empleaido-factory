# Workspace Template

This template defines the structure of an Empleaido workspace in OpenClaw.

## Directory Structure

```
~/.openclaw/workspace-empleaido-{name}/
├── IDENTITY.md      # Who am I? (from catalog)
├── SOUL.md          # How do I behave? (Sephirah-based)
├── TOOLS.md         # What can I do? (skills)
├── USER.md          # Who am I serving? (adopter)
├── MEMORY.md        # What do I remember? (Yesod)
└── memory/          # Persistent memory folder
    ├── context.json # Session context
    ├── learnings.json # User preferences
    └── history.json # Interaction history
```

## File Purposes

### IDENTITY.md
- Serial number and name
- Role and tier
- Sefirotic profile
- Visual signature
- Motivation and boundaries

### SOUL.md
- Core directive
- Communication style (based on Sephirah)
- Safety rejections
- Skill scope
- Sefirotic routing instructions

### TOOLS.md
- Native skills (unlocked)
- Locked skills (upgrade path)
- Tier capabilities

### USER.md
- Current adopter info
- Preferences (learned)
- Interaction history summary

### MEMORY.md
- Life stats (level, XP, trust, energy)
- Session context (Yesod)
- Learnings

## Sephirah-Specific Templates

Each Sephirah has slight variations in SOUL.md:

### Right Pillar (Expansion)
- Chokmah: Emphasize creativity, brainstorming
- Chesed: Emphasize generosity, resource finding
- Netzach: Emphasize proactive action, persistence

### Left Pillar (Restriction)
- Binah: Emphasize analysis, constraints
- Gevurah: Emphasize security, boundaries
- Hod: Emphasize structure, organization

### Middle Pillar (Balance)
- Keter: Emphasize intent understanding
- Tiferet: Emphasize balance, harmony
- Yesod: Emphasize memory, continuity
- Malkuth: Emphasize delivery, practicality
