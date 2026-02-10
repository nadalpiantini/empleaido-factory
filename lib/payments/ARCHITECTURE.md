# 💳 Payment System Architecture

**Status**: ROADMAP READY - Implementation pending business decision

## Flow Architecture

```
User clicks "Adoptar" in Catalog
    ↓
Checkout Page (/checkout?empleaido=SERA)
    ↓
Create Checkout Session (/api/checkout)
    ↓
Stripe Payment Form (hosted by Stripe)
    ↓
Payment Success → Webhook (/api/stripe-webhook)
    ↓
Trigger Automated Spawn (lib/openclaw/spawn.ts)
    ↓
Update Adoption Status (active)
    ↓
Send Welcome Email (lib/email/welcome.ts)
    ↓
Success Page (/checkout/success)
    ↓
Redirect to Dashboard
```

## Components to Implement

### 1. Checkout Flow
- **File**: `app/checkout/page.tsx`
- **Purpose**: User lands here after clicking "Adoptar"
- **TODO**: Integrate Stripe Checkout SDK
- **TODO**: Validate user authentication
- **TODO**: Pass metadata to payment processor

### 2. Checkout Session API
- **File**: `app/api/checkout/route.ts`
- **Purpose**: Create payment session
- **TODO**: Call Stripe checkout.sessions.create()
- **TODO**: Store pending adoption in DB
- **TODO**: Return checkout URL

### 3. Webhook Handler
- **File**: `app/api/stripe-webhook/route.ts`
- **Purpose**: Process payment success
- **TODO**: Verify webhook signature
- **TODO**: Update adoption status → active
- **TODO**: Trigger spawn automation
- **TODO**: Send welcome email

### 4. Automated Spawn
- **File**: `lib/openclaw/spawn.ts`
- **Purpose**: Trigger empleaido activation
- **TODO**: Call OpenClaw CLI or API
- **TODO**: Create workspace directory
- **TODO**: Store workspace reference in DB

### 5. Welcome Email
- **File**: `lib/email/welcome.ts`
- **Purpose**: Send onboarding email
- **TODO**: Integrate Resend/SendGrid
- **TODO**: Create HTML email template
- **TODO**: Include dashboard and virtual office links

## Database Schema Required

```sql
-- Add to ef_adoptions table
ALTER TABLE ef_adoptions
ADD COLUMN checkout_session_id TEXT UNIQUE,
ADD COLUMN amount DECIMAL(10,2),
ADD COLUMN currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN payment_method VARCHAR(50),
ADD COLUMN bond_started_at TIMESTAMPTZ,
ADD COLUMN cycle INTEGER DEFAULT 1;
```

## Environment Variables Needed

```bash
# Payment Provider (choose one)
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Alternative: PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Email Service
RESEND_API_KEY=re_...
# or SENDGRID_API_KEY=SG._

# App URLs
NEXT_PUBLIC_SITE_URL=https://empleaido.factory
```

## Dependencies to Install

```bash
# Stripe
npm install stripe @stripe/stripe-js

# Alternative: PayPal
npm install @paypal/paypal-js

# Email
npm install resend

# Webhook verification
npm install crypto-js
```

## Implementation Order

When ready to implement:

1. **Setup** - Install dependencies, configure env vars
2. **Database** - Add columns to ef_adoptions
3. **Checkout** - Implement checkout page + session creation
4. **Webhook** - Implement payment success handler
5. **Spawn** - Connect OpenClaw automation
6. **Email** - Implement welcome email service
7. **Testing** - Test payment flow end-to-end

## Security Considerations

- Webhook signature verification (MUST)
- Idempotency for webhook retries (MUST)
- Rate limiting on checkout endpoint
- Secure storage of secret keys
- PCI compliance if handling card data directly (use Stripe Checkout to avoid)

## Testing Checklist

- [ ] User can click "Adoptar" → checkout page
- [ ] Checkout page creates session → redirects to payment
- [ ] Payment success → webhook triggers
- [ ] Webhook → spawn automation → workspace created
- [ ] Welcome email sends
- [ ] Success page displays
- [ ] Dashboard shows new empleaido
- [ ] Payment failure handled gracefully
- [ ] Webhook retry works (idempotency)
