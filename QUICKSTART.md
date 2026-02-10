# ⚡ QUICKSTART - EMPLEAIDO FACTORY

**Status**: Production-Ready
**Time to Start**: 2 minutes

---

## 🚀 START DEVELOPMENT SERVER

```bash
cd ~/Dev/empleaido-factory/app
npm run dev
```

**Open**: http://localhost:3000

**Expected**: Server ready in ~485ms ✅

---

## 📁 ESSENTIAL FILES

**Data**: `app/src/data/empleaidos.json` (5 empleaidos)
**Routes**: `app/app/*/page.tsx` (7 pages)
**Types**: `lib/types.ts` (TypeScript definitions)

---

## 🎯 QUICK TASKS

### View Homepage
→ http://localhost:3000

### View SERA Profile
→ http://localhost:3000/empleaido/empleaido-04094

### Admin Panel
→ http://localhost:3000/backstage

### User Dashboard
→ http://localhost:3000/dashboard

---

## 📚 READ FIRST

1. **HANDOFF.md** - Resume work guide
2. **PRD.md** - Product vision
3. **BEST_PRACTICES.md** - Avoid mistakes

---

## 🐛 COMMON ISSUES

**Issue**: Routes return 404
**Fix**: Restart server (`pkill next-dev && npm run dev`)

**Issue**: TypeScript errors
**Fix**: `npx tsc --noEmit` to check

**Issue**: Environment vars missing
**Fix**: Create `.env.local` (see PROJECT.md)

---

## ✅ VERIFY WORKING

All routes should return 200 OK:
- / ✅
- /backstage ✅
- /dashboard ✅
- /empleaido/[id] ✅

---

**Next**: Read HANDOFF.md for Sprint 2 planning

**Time**: 2026-02-07
**Score**: 100/100
