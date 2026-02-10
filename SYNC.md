# Empleaido Factory - Sync System

**Automatic sync between sephirot (m1) and mini (m2)**

## 🚀 Quick Start

### One-command sync (works on both servers)
```bash
.sync/sync.sh
```

### Sync with specific branch
```bash
.sync/sync.sh feature/dashboard-virtual-office
```

## 📋 How It Works

1. **Auto-detect server** - Knows if you're on sephirot (m1) or mini (m2)
2. **Check working tree** - Prevents sync if you have uncommitted changes
3. **Smart pull/push** - Only does what's needed
4. **Auto-merge** - Handles diverged branches automatically

## 🛡️ Safety Features

- ✅ Checks for uncommitted changes before syncing
- ✅ Fetches latest from origin before any operation
- ✅ Auto-merges when branches have diverged
- ✅ Shows clear status at every step
- ✅ Color-coded output (easy to read)

## 📖 Common Workflows

### Normal workflow (both servers in sync)
```bash
# On mini (m2) - work on something
vim some-file.ts
git add .
git commit -m "feat: add feature"

# Sync
.sync/sync.sh
# Output: "Pushing changes to origin... ✅"

# On sephirot (m1) - get the changes
.sync/sync.sh
# Output: "Pulling changes from origin... ✅"
```

### Both servers modified (auto-merge)
```bash
# On mini (m2) - committed changes
.sync/sync.sh
# Output: "Local and remote have diverged... Pulling... ✅"

# Automatically merges and pushes!
# No manual intervention needed
```

### Working tree dirty (prevented)
```bash
# You have uncommitted changes
.sync/sync.sh
# Output: "⚠️ You have uncommitted changes!"
# Output: "Please commit or stash them first"

# Fix it
git add .
git commit -m "your message"
.sync/sync.sh
# Now it works!
```

## 🔧 Git Hooks

### pre-push (auto-pull before push)
Prevents push conflicts by automatically pulling if you're behind origin.

```bash
# Auto-installed with sync.sh
# Triggers on: git push
```

### post-merge (notification)
Shows summary and reminds you to sync with the other server.

```bash
# Auto-installed with sync.sh
# Triggers on: git pull, git merge
```

## 🎯 Best Practices

### 1. Always sync before starting work
```bash
cd /users/nadalpiantini/dev/empleaido-factory/app  # or /Users/nadalpiantini/Dev/...
.sync/sync.sh
```

### 2. Always sync after finishing work
```bash
git add .
git commit -m "your message"
.sync/sync.sh
```

### 3. Trust the script
- The script knows what to do
- Don't manually pull/push unless necessary
- If script errors, read the message carefully

## 📂 Server Names

| Server | Hostname | Role | Path |
|--------|----------|------|------|
| sephirot | m1 | Main server | `/Users/nadalpiantini/Dev/empleaido-factory/app` |
| mini | m2 | MacBook Air | `/users/nadalpiantini/dev/empleaido-factory/app` |

## ⚠️ Troubleshooting

### "Not in git repository"
```bash
# You're in the wrong directory
cd /users/nadalpiantini/dev/empleaido-factory/app  # mini
# or
cd /Users/nadalpiantini/Dev/empleaido-factory/app  # sephirot
```

### "You have uncommitted changes"
```bash
# Check what's pending
git status

# Options:
# 1. Commit the changes
git add .
git commit -m "your message"

# 2. Stash temporarily
git stash
.sync/sync.sh
git stash pop
```

### "Local and remote have diverged"
```bash
# Don't worry, script handles it automatically
# Just run .sync/sync.sh again
```

### Hook not executing
```bash
# Make sure hooks are executable
chmod +x .sync/pre-push
chmod +x .sync/post-merge

# Reinstall
cd /Users/nadalpiantini/Dev/empleaido-factory/app
.sync/sync.sh --install-hooks
```

## 🎓 Understanding Git Sync

### Normal state
```
sephirot (m1) ←→ origin ←→ mini (m2)
     ✅            ✅          ✅
```

### After working on mini
```
sephirot (m1) ←→ origin ←→ mini (m2)
     ❌            ←→          ✅ (new commit)
```

### After sync on mini
```
sephirot (m1) ←→ origin ←→ mini (m2)
     ❌            ✅ (updated)  ✅
```

### After sync on sephirot
```
sephirot (m1) ←→ origin ←→ mini (m2)
     ✅ (updated)  ✅          ✅
```

## 💡 Pro Tips

1. **Create an alias** - Add to your `~/.zshrc`:
   ```bash
   alias sync='cd /users/nadalpiantini/dev/empleaido-factory/app && .sync/sync.sh'
   ```

2. **Make it a habit** - Run sync before/after every work session

3. **Trust the colors**:
   - 🟢 Green = Good
   - 🔴 Red = Error (needs action)
   - 🟡 Yellow = Warning (attention needed)
   - 🔵 Blue = Info (what's happening)

4. **Check status anytime**:
   ```bash
   git status
   git log --oneline -5
   ```

---

**Created:** 2026-02-10
**Purpose:** Eliminate sync headaches between sephirot (m1) and mini (m2)
**Status:** ✅ Active
