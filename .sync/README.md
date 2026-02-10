# Empleaido Factory Sync System

**Automatic synchronization between sephirot (m1) and mini (m2)**

## 📁 Files

- `sync.sh` - Main sync script
- `install.sh` - Installation script
- `pre-push` - Git hook (auto-pull before push)
- `post-merge` - Git hook (notification after merge)

## 🚀 Quick Start

### First time setup (run on BOTH servers)
```bash
.sync/install.sh
```

### Daily usage
```bash
.sync/sync.sh
```

## 📖 Full Documentation

See `SYNC.md` in the repo root for complete documentation.

## 🔧 How it works

1. Auto-detects which server you're on
2. Checks for uncommitted changes
3. Fetches latest from origin
4. Intelligently pulls or pushes as needed
5. Auto-merges diverged branches
6. Shows clear status at every step

## ✨ Features

- ✅ Automatic server detection
- ✅ Safety checks (prevents data loss)
- ✅ Color-coded output
- ✅ Smart merge handling
- ✅ Git hooks for automation
- ✅ Works on both sephirot and mini

---

**Status:** ✅ Installed and active
**Last updated:** 2026-02-10
