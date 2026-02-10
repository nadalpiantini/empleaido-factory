# 🏢 Virtual Office Production Plan

**Status**: 🔄 IN PROGRESS - Phase 1 MVP Complete, need polish

## Current State (Phase 1 MVP)

### ✅ What's Working
- Phaser 3 integration
- Player movement (WASD + arrows)
- NPC rendering (SERA visible)
- Proximity detection (100px threshold)
- Chat overlay UI
- OpenClaw API stub (mock responses)

### ❌ Known Issues
1. **Import Resolution**: Phaser scenes need proper path resolution in Next.js
2. **Placeholder Sprites**: Using SVG circles instead of real SERA artwork
3. **Mock Chat**: Not connected to OpenClaw yet
4. **Single Room**: Only SERA's office exists

## What Needs to Be Done (YOLO Mode)

### 1. Fix Phaser Imports 🔧
```typescript
// Fix: components/virtual-office/scenes/OfficeScene.ts
// Need to configure Next.js to transpile Phaser properly

// next.config.ts
export default {
  experimental: {
    serverComponentsExternalPackages: ['phaser'],
  },
  transpilePackages: ['phaser'],
}
```

### 2. Create Real SERA Sprite 🎨
```bash
# Need AI-generated sprite for SERA
# Position: Sitting at desk
# Style: Professional accountant
# Format: PNG with sprite sheet
# - idle (3 frames)
# - working (3 frames)
# - talking (3 frames)
```

### 3. Connect OpenClaw Chat 🔌
```typescript
// Replace mock in: app/api/empleaido-chat/route.ts
// Connect to actual OpenClaw agent workspace

const response = await openclaw.executeAgent({
  workspacePath: adoption.workspace_path,
  message: message,
  userId: userId,
});
```

### 4. Expand to 6 Offices 🏗️
```
Layout:
[SERA] [KAEL] [NORA]
[LIOR] [ZIV]  [LOUNGE]
```

Each office needs:
- Room boundaries
- NPC placement
- Department-specific colors
- Interaction zone
- Props/decorations

### 5. Add Multi-User Presence 👥
```typescript
// See other users walking in real-time
const otherUsers = await supabase
  .channel('virtual-office')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'ef_virtual_office_presence',
    filter: `room_id=eq.${currentRoom}`,
  }, payload => {
    renderOtherUser(payload.new);
  })
  .subscribe();
```

### 6. Navigation System 🚪
```typescript
// Walk to door → transition to next room
// Add doors at room boundaries
onPlayerCollide(door) {
  loadRoom(door.targetRoom);
  fadeIn();
}
```

### 7. Ambient Audio 🎵
```typescript
// Background office sounds
const sounds = {
  keyboard: loadSound('keyboard-typing.mp3'),
  ambient: loadSound('office-ambient.mp3'),
  footstep: loadSound('footstep.mp3'),
};

// Play when player walks past working NPCs
```

## Implementation Order (YOLO - No Stopping)

1. ✅ Fix next.config.ts for Phaser imports
2. ✅ Create SERA sprite (placeholder → real later)
3. ✅ Connect OpenClaw chat API
4. ✅ Add 5 more office rooms
5. ✅ Add other empleaido NPCs
6. ✅ Implement room navigation
7. ✅ Add multi-user presence
8. ✅ Add ambient audio
9. ✅ Polish UI/UX
10. ✅ Deploy to staging

## Files to Modify

```
components/virtual-office/
├── PhaserGame.tsx          ✅ Fix imports
├── scenes/
│   ├── OfficeScene.ts      ✅ Add room navigation
│   └── createNPC.ts        ✅ Add all 5 empleaidos
├── chat/
│   └── ChatOverlay.tsx     ✅ Connect to real API
└── assets/
    ├── sera-sprite.png     🔴 NEED ARTWORK
    ├── office-bg.png       🔴 NEED ARTWORK
    └── sounds/             🔴 NEED AUDIO

app/api/
├── empleaido-chat/route.ts ✅ Connect OpenClaw
└── virtual-office/
    ├── presence/route.ts   🆕 Multi-user sync
    └── navigate/route.ts   🆕 Room transitions

lib/
└── virtual-office/
    ├── room-manager.ts     🆕 Room system
    ├── npc-spawn.ts        🆕 NPC factory
    └── audio-manager.ts    🆕 Sound system
```

## Success Metrics

- [ ] No console errors in browser
- [ ] Chat responds with real OpenClaw agent
- [ ] All 6 rooms accessible
- [ ] All 5 empleaidos visible and interactable
- [ ] Other users visible in real-time
- [ ] Loading time < 3 seconds
- [ ] Mobile-responsive (touch controls)

## Ready to Implement?

YES → Continuing with Sprint 5 implementation now...

---

**Estado**: YOLO MODE ACTIVE - Implementing all Virtual Office features
