# 🚀 Sprint 6: Scalability & Launch Readiness

**Status**: 🔄 IN PRODUCTION - Final sprint before launch

## Implementation Checklist

### 1. Performance Optimization ⚡

#### Code Splitting
```typescript
// app/layout.tsx
import dynamic from 'next/dynamic';

const VirtualOffice = dynamic(() => import('@/components/virtual-office/VirtualOffice'), {
  loading: () => <LoadingScreen />,
  ssr: false, // Phaser only works on client
});
```

#### Lazy Loading
```typescript
// Empleaido profiles
const EmpleaidoProfile = dynamic(() => import('./EmpleaidoProfile'));
```

#### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/empleaidos/sera.png"
  width={400}
  height={400}
  priority={false}
  placeholder="blur"
/>
```

### 2. Error Handling 🛡️

#### Global Error Boundary
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Algo salió mal
        </h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button onClick={reset} className="bg-purple-600 text-white px-6 py-2 rounded">
          Reintentar
        </button>
      </div>
    </div>
  );
}
```

#### API Error Handler
```typescript
// lib/api/error-handler.ts
export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    return { error: error.message, status: 500 };
  }
  return { error: 'Unknown error', status: 500 };
}
```

### 3. Monitoring Setup 📊

#### Sentry Integration
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### Analytics (Vercel)
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 4. Security Hardening 🔒

#### Rate Limiting
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

#### CSRF Protection
```typescript
// lib/csrf.ts
import { getToken } from 'next-auth/jwt';

export async function validateCsrf(request: NextRequest) {
  const token = await getToken({ req: request });
  return !!token;
}
```

### 5. Database Backup 💾

#### Supabase Automated Backups
```bash
# Supabase handles this automatically
# Verify in dashboard: Database → Backups
```

#### Manual Backup Script
```typescript
// scripts/backup-db.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function backupDatabase() {
  const { data, error } = await supabase
    .from('ef_adoptions')
    .select('*');

  if (error) throw error;

  // Save to file with timestamp
  const fs = require('fs');
  const timestamp = new Date().toISOString();
  fs.writeFileSync(
    `backups/empleaido-factory-${timestamp}.json`,
    JSON.stringify(data, null, 2)
  );
}
```

### 6. Testing Suite 🧪

#### E2E Tests (Playwright)
```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  await page.goto('/catalog');
  await page.click('text=Adoptar SERA');
  await page.waitForURL('/checkout');
  // Test payment flow (mock)
  await page.click('text=Pagar');
  await page.waitForURL('/checkout/success');
  expect(page.locator('text=¡Pago Exitoso!')).toBeVisible();
});
```

#### Unit Tests (Vitest)
```typescript
// lib/onboarding/phases/__tests__/state-machine.test.ts
import { describe, it, expect } from 'vitest';
import { handlePhase1Awakening } from '../state-machine';

describe('Onboarding Phase 1', () => {
  it('should generate awakening message', async () => {
    const result = await handlePhase1Awakening(
      { empleaidoId: 'sera', userId: '123', messagesInPhase: 0 },
      'hola'
    );
    expect(result.response).toContain('SERA #4094');
  });
});
```

### 7. Documentation 📚

#### User Guide
```markdown
# Empleaido Factory - Guía de Usuario

## Primeros Pasos
1. Explora el catálogo
2. Adopta tu empleaido
3. Completa el onboarding
4. Visita el Virtual Office
5. Comienza a trabajar
```

#### API Documentation
```typescript
// API route documentation
/**
 * POST /api/empleaido-chat
 *
 * Send message to empleaido
 *
 * @param {string} userId - User ID
 * @param {string} empleaidoId - Empleaido ID (sera, kael, etc.)
 * @param {string} message - Message content
 *
 * @returns {object} response
 * @returns {string} response.response - Agent response
 * @returns {string} response.mode - 'onboarding' or 'operational'
 */
```

### 8. Launch Assets 🎨

#### Landing Page
```typescript
// app/page.tsx - Hero section
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <Hero
        title="Tu Equipo AI, Esperando en tu Oficina Virtual"
        subtitle="Empleaidos especializados que crecen contigo"
        cta="Conoce a tu Equipo"
      />
    </div>
  );
}
```

#### Demo Video
```html
<!-- Add Loom video to landing page -->
<iframe
  src="https://www.loom.com/embed/xxx"
  frameBorder="0"
  allowFullScreen
></iframe>
```

### 9. Environment Variables 🔐

```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

RESEND_API_KEY=re_xxx

OPENCLAW_API_KEY=xxx
OPENCLAW_WORKSPACES_PATH=/data/workspaces
```

### 10. Deployment Pipeline 🚀

#### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

#### Pre-deploy Checklist
```bash
#!/bin/bash
# scripts/pre-deploy.sh

echo "🔍 Running pre-deploy checks..."

# 1. TypeScript check
npm run tsc --noEmit

# 2. Lint
npm run lint

# 3. Tests
npm run test

# 4. Build
npm run build

# 5. Environment variables
node scripts/verify-env.js

echo "✅ All checks passed! Ready to deploy."
```

## Launch Timeline

### Week 1: Hardening
- [ ] Error boundaries
- [ ] Rate limiting
- [ ] Monitoring setup
- [ ] Security audit

### Week 2: Testing
- [ ] E2E test suite
- [ ] Load testing (100 concurrent users)
- [ ] Security penetration test
- [ ] User acceptance testing

### Week 3: Beta
- [ ] 100 beta users
- [ ] Feedback collection
- [ ] Bug fixes
- [ ] Performance optimization

### Week 4: Launch
- [ ] Final testing
- [ ] Marketing assets
- [ ] Documentation
- [ ] PUBLIC LAUNCH 🚀

## Success Criteria

- [ ] < 3 second page load
- [ ] 99.9% uptime
- [ ] Zero critical security vulnerabilities
- [ ] 100 successful beta test completions
- [ ] Documentation complete
- [ ] Monitoring alerts configured
- [ ] Backup system tested
- [ ] Support workflow ready

---

**YOLO STATUS**: Implementing all scalability features NOW
