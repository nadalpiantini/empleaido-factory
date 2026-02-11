# ZIV MVP - Complete Customer Flow Implementation

## 🎯 Objective

Implement a complete production-ready customer flow for ZIV (ziv-005), the simplest Empleaido.

## 📋 Current State Analysis

### ✅ What Exists
- Landing page with catalog
- Search and filter functionality
- Onboarding UI components (BootstrapWizard)
- Mock API endpoints for bootstrap
- EmpleaidoCard component with links

### ❌ What's Missing (BROKEN FLOW)
1. **Page `/empleaido/[id]` DOES NOT EXIST** - Link from catalog leads to 404
2. No checkout/payment flow
3. No user authentication/registration
4. Bootstrap endpoints are MOCKS - don't save to database
5. No post-onboarding dashboard for active empleaidos
6. No OpenClaw integration

## 🚀 Implementation Plan

### Phase 1: Fix Broken Links (Critical)
**Goal**: Make the catalog work end-to-end

**Tasks**:
1. ✅ Create `/empleaido/[id]/page.tsx` - Empleaido detail page
   - Show full empleaido profile
   - Display all skills (native + locked)
   - Show pricing tiers
   - Add "ADOPTAR" CTA button
   - Add testimonials/use cases
   - Show FAQ section

2. ✅ Update EmpleaidoCard link if needed
   - Verify link points to correct route

**Success Criteria**: User can click on ZIV from catalog and see full details

---

### Phase 2: Checkout & Registration
**Goal**: Capture user and payment information

**Tasks**:
1. ✅ Create `/checkout/[id]/page.tsx` - Checkout page
   - User registration form (email, password, name)
   - Payment method collection (Stripe integration placeholder)
   - Order summary
   - Terms acceptance

2. ✅ Create `/api/auth/register/route.ts` - Registration API
   - Validate email uniqueness
   - Hash passwords
   - Create user in Supabase
   - Return user session

3. ✅ Create `/api/payments/create-intent/route.ts` - Payment API (Mock)
   - Create Stripe payment intent
   - Return client secret
   - Handle payment confirmation

**Success Criteria**: User can register and "complete purchase"

---

### Phase 3: ZIV-Specific Onboarding
**Goal**: Personalize ZIV to user's needs

**Tasks**:
1. ✅ Create `/empleaido/[id]/onboarding/page.tsx` - ZIV onboarding
   - Use BootstrapWizard component
   - ZIV-specific questions:
     - What are your top 3 productivity goals?
     - What's your typical work schedule?
     - What distractions do you face?
     - How do you prefer to track habits?

2. ✅ Update `/api/empleaidos/[id]/bootstrap/*` - Make them functional
   - Save preferences to Supabase
   - Update empleaido instance
   - Initialize user's workspace

**Success Criteria**: ZIV is personalized to user's productivity needs

---

### Phase 4: Active Empleaido Dashboard
**Goal**: Give user access to their adopted ZIV

**Tasks**:
1. ✅ Create `/dashboard/empleaidos/[id]/page.tsx` - ZIV dashboard
   - Show ZIV's current stats (XP, level, energy, trust)
   - Chat interface with ZIV
   - Active skills display
   - Productivity metrics dashboard
   - Goal tracking visualization

2. ✅ Create `/api/chat/route.ts` - Chat API
   - Connect to LLM (Claude/GPT)
   - Inject ZIV's personality
   - Maintain conversation context
   - Track usage metrics

**Success Criteria**: User can chat with ZIV and see productivity insights

---

### Phase 5: OpenClaw Integration (Optional MVP++)
**Goal**: Spawn ZIV as actual OpenClaw agent

**Tasks**:
1. ⚠️ Create OpenClaw workspace template for ZIV
2. ⚠️ Implement spawn handler
3. ⚠️ Register ZIV in OpenClaw ecosystem
4. ⚠️ Test ZIV execution in OpenClaw

**Note**: This can be Phase 2 - not critical for initial customer flow

---

## 📁 New File Structure

```
app/app/
├── empleaido/
│   └── [id]/
│       └── page.tsx                    ← NEW: Detail page
├── checkout/
│   └── [id]/
│       └── page.tsx                    ← NEW: Checkout page
├── api/
│   ├── auth/
│   │   └── register/
│   │       └── route.ts                ← NEW: Registration
│   ├── payments/
│   │   └── create-intent/
│   │       └── route.ts                ← NEW: Payment intent
│   └── empleaidos/
│       └── [id]/
│           ├── adopt/
│           │   └── route.ts            ← NEW: Adoption API
│           └── bootstrap/
│               ├── preferences/
│               │   └── route.ts        ← UPDATE: Real DB save
│               ├── phase/
│               │   └── route.ts        ← UPDATE: Real DB save
│               ├── complete/
│               │   └── route.ts        ← UPDATE: Real DB save
│               └── status/
│                   └── route.ts        ← UPDATE: Real DB fetch
└── dashboard/
    └── empleaidos/
        └── [id]/
            └── page.tsx                ← UPDATE: Enhanced dashboard
```

---

## 🔄 Complete Customer Flow

```
1. Landing Page (www.empleaido.com)
   ↓
2. Browse Catalog (/catalog)
   ↓
3. View ZIV Details (/empleaido/ziv-005)
   ↓
4. Click "ADOPTAR" → Checkout (/checkout/ziv-005)
   ↓
5. Register + Pay (create account + payment)
   ↓
6. ZIV Onboarding (/empleaido/ziv-005/onboarding)
   - Answer 4-5 productivity questions
   - ZIV adapts to user's needs
   ↓
7. ZIV Dashboard (/dashboard/empleaidos/ziv-005)
   - Chat with ZIV
   - Track goals and habits
   - View productivity insights
   ↓
8. Recurring Monthly Value
   - ZIV sends daily productivity tips
   - Habit tracking reminders
   - Goal progress updates
```

---

## 💰 Revenue Model

**ZIV Base Tier - $49/month**
- Core productivity skills (time management, goals, habits, focus)
- Chat access
- Basic dashboard
- Weekly progress reports

**Upsell Paths**:
- $79/month - Unlock mindfulness coaching
- $99/month - Priority support + advanced analytics
- $199/month - Upgrade to LIOR (strategic business intelligence)

---

## ✅ Definition of Done (MVP)

- [ ] User can navigate from landing → catalog → ZIV details
- [ ] User can register and "purchase" ZIV
- [ ] User completes ZIV onboarding (5 questions)
- [ ] User can chat with ZIV in dashboard
- [ ] User can set goals and track habits
- [ ] All data persists in Supabase
- [ ] Flow is deployed to www.empleaido.com
- [ ] One end-to-end test passes completely

---

## 🎨 Design Notes

**ZIV Brand Colors**:
- Primary: `#F38181` (soft red - accent from catalog)
- Secondary: `#1A434F` (dark blue - factory brand)
- Background: `#F3E4C8` (cream - factory brand)

**ZIV Personality**:
- Friendly and encouraging
- Focus on personal growth
- Practical, actionable advice
- Non-judgmental accountability partner

---

## 🚦 Risk Mitigation

**Technical Risks**:
- Supabase connection issues → Test all DB operations early
- Stripe integration complexity → Start with mock payment
- LLM API costs → Implement rate limiting

**UX Risks**:
- Onboarding too long → Keep it to 5 questions max
- Dashboard too complex → Start with 3 core features
- Chat not useful enough → Use high-quality prompts

---

## 📊 Success Metrics

- Conversion rate: Catalog → Adopt (>5%)
- Onboarding completion rate (>80%)
- DAU/MAU ratio (>30%)
- Chat messages per user per week (>10)
- Retention at day 7 (>60%)

---

**Ready to implement? Start with Phase 1!**
