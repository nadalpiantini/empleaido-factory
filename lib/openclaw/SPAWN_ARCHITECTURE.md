# 🤖 Automated Spawn Architecture

**Status**: ROADMAP READY - OpenClaw integration pending

## Flow

```
Payment Success (Webhook)
    ↓
spawnEmpleaito(userId, empleaidoId)
    ↓
1. Create workspace directory
    ↓
2. Call OpenClaw CLI
   openclaw spawn {empleaidoId} {userId} --workspace {path}
    ↓
3. Verify workspace created
    ↓
4. Store workspace reference in DB
    ↓
5. Return success
```

## Implementation

### File: `lib/openclaw/spawn.ts`

```typescript
export async function spawnEmpleaito(
  userId: string,
  empleaidoId: string
): Promise<SpawnResult> {
  // 1. Create workspace directory
  const workspacePath = join(workspacesRoot, `empleaido-${empleaidoId}-${userId}-${Date.now()}`);

  // 2. Call OpenClaw spawn
  const output = execSync(
    `openclaw spawn ${empleaidoId} ${userId} --workspace ${workspacePath} --auto-activate`
  );

  // 3. Verify workspace exists
  // 4. Store reference in DB

  return { success: true, workspacePath };
}
```

## OpenClaw Requirements

- **CLI Installed**: `npm install -g @openclaw/cli`
- **Configuration**: `~/.openclaw/config.yaml`
- **Templates**: Empleaido templates available
- **Workspace Storage**: Configured path

## Database Schema Update

```sql
ALTER TABLE ef_adoptions
ADD COLUMN workspace_path TEXT,
ADD COLUMN spawned_at TIMESTAMPTZ,
ADD COLUMN spawn_status VARCHAR(20) DEFAULT 'pending';
```

## Error Handling

- Spawn failure → mark adoption status = 'spawn_failed'
- Retry mechanism: `/api/admin/retry-spawn`
- Fallback: Manual spawn trigger from dashboard

## Testing

```bash
# Manual spawn test
openclaw spawn SERA user-123 --workspace /tmp/test-workspace

# Verify workspace
ls -la /tmp/test-workspace
# Should see: IDENTITY.md, SOUL.md, TOOLS.md, etc.
```

## TODO

- [ ] Install OpenClaw CLI
- [ ] Configure workspace storage
- [ ] Create empleaido spawn templates
- [ ] Implement spawnEmpleaito() function
- [ ] Add database column for workspace_path
- [ ] Create retry mechanism
- [ ] Test automated spawn after payment
