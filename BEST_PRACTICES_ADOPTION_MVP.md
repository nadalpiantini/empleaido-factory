# 🎯 Sprint Adoption MVP - Best Practices Summary

**Compiled**: Feb 8, 2026
**Status**: ✅ Sprint Complete

---

## Quick Reference

### Architecture Patterns

✅ **DO**:
- Inline critical logic for MVP speed
- Explicit component props over objects
- Await params in Next.js 15
- Use `'use client'` for hooks/state
- Write spawn logic in API routes

❌ **DON'T**:
- Complex relative imports
- Pass whole objects to components
- Forget to await params
- Mix client/server patterns
- Over-optimize early

---

## Key Learnings

### 1. Next.js 15 Breaking Changes

```typescript
// ❌ Old way (Next.js 14)
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;  // No await needed
}

// ✅ New way (Next.js 15)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  // MUST await!
}
```

### 2. Module Resolution in App Router

```typescript
// ❌ Brittle relative paths
import { spawn } from '../../../../../openclaw/spawn';

// ✅ Inline for MVP (or use tsconfig paths)
// Write logic directly to avoid import hell
async function spawnInline(empleaido, userId) {
  // ... spawn logic here
}
```

### 3. Client Component Pattern

```typescript
'use client';  // Must be first line

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InteractiveButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/action', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push(data.nextUrl);  // Client-side redirect
      }
    } finally {
      setIsLoading(false);
    }
  };
}
```

### 4. Error Handling Pattern

```typescript
// API Routes
export async function POST(request: NextRequest) {
  try {
    const result = await doSomething();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ Error:', error);  // Emoji for visibility
    return NextResponse.json(
      {
        success: false,
        error: 'Operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Client Components
const [error, setError] = useState<string | null>(null);

const handleAction = async () => {
  setError(null);  // Clear previous
  try {
    await riskyOperation();
  } catch (err) {
    setError(err.message);  // Show error
  }
};

// Render
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded">
    ⚠️ {error}
  </div>
)}
```

### 5. File System Operations

```typescript
import * as fs from 'fs';
import * as path from 'path';

const workspacePath = path.join(OPENCLAW_HOME, `workspace-${agentId}`);

// Create directories safely
if (!fs.existsSync(workspacePath)) {
  fs.mkdirSync(workspacePath, { recursive: true });
}

// Write files atomically
fs.writeFileSync(
  path.join(workspacePath, 'FILE.md'),
  content
);

// Read with error handling
try {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
} catch (error) {
  console.error('Failed to read file:', error);
  return null;
}
```

---

## Testing Checklist

### E2E Testing (Playwright)

```javascript
// Setup
const browser = await chromium.launch({
  headless: false,  // Visible for demos
  slowMo: 1000,     // Slow down
});
const page = await browser.newPage();

// Navigation
await page.goto(url);
await page.waitForLoadState('networkidle');

// Interactions
await page.click('button[type="submit"]');
await page.fill('input[name="email"]', 'test@example.com');

// Waits
await page.waitForSelector('.success-message');
await page.waitForURL('**/dashboard/**');
await page.waitForTimeout(2000);  // Only if needed

// Screenshots
await page.screenshot({
  path: '/tmp/screenshot.png',
  fullPage: true
});

// Cleanup
await browser.close();
```

---

## Common Pitfalls

### 1. Forgetting `'use client'`

**Symptom**: `useState is not defined`
**Fix**: Add `'use client';` at top of file

### 2. Not Awaiting Params

**Symptom**: Type errors on `params.id`
**Fix**: `const { id } = await params;`

### 3. Wrong Import Paths

**Symptom**: `Module not found`
**Fix**: Use inline logic or configure `tsconfig.paths`

### 4. Missing Props

**Symptom**: `Cannot read properties of undefined`
**Fix**: Explicit props, not objects

### 5. Async in UseEffect

**Symptom**: Memory leaks or race conditions
**Fix**: Add cleanup function

```typescript
useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    const data = await fetch(url);
    if (!cancelled) {
      setState(data);
    }
  };

  fetchData();

  return () => { cancelled = true; };
}, [url]);
```

---

## Performance Tips

### 1. Revalidation

```typescript
// Server components - dynamic fetch
const data = await fetch(url, {
  cache: 'no-store'  // Always fresh
});

// Server components - revalidate
const data = await fetch(url, {
  next: { revalidate: 60 }  // Every 60s
});
```

### 2. Client State

```typescript
// Use for frequently changing data
const [data, setData] = useState(null);

// Fetch on mount
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);
```

### 3. Avoid Over-Fetching

```typescript
// ❌ DON'T - Fetch in multiple components
const data1 = await fetch('/api/user');
const data2 = await fetch('/api/user');

// ✅ DO - Fetch once, pass down
const data = await fetch('/api/user');
<ParentComponent data={data} />
```

---

## Debugging Tips

### 1. Console Logging

```typescript
// Use emojis for visibility
console.log('✅ Adoption successful');
console.error('❌ Adoption failed:', error);
console.warn('⚠️ Using fallback');
console.info('ℹ️ Processing request');
```

### 2. Network Tab

```typescript
// Add debug IDs to responses
return NextResponse.json({
  success: true,
  _debug: {
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
  }
});
```

### 3. Error Screenshots

```typescript
try {
  await riskyOperation();
} catch (error) {
  await page.screenshot({ path: '/tmp/ERROR.png' });
  console.error('Error screenshot saved');
  throw error;
}
```

---

## Deployment Checklist

### Before Deploy

- [ ] Remove all mock data
- [ ] Add authentication
- [ ] Configure environment variables
- [ ] Test with production database
- [ ] Enable error tracking
- [ ] Add analytics
- [ ] Set up monitoring
- [ ] Configure CDN for images

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_BASE_URL=https://empleaido-factory.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENCLAW_HOME=/var/www/.openclaw
```

---

## Quick Commands

```bash
# Development
cd ~/Dev/empleaido-factory/app
npm run dev

# Build
npm run build

# Start production
npm start

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Run Playwright test
cd ~/.claude/skills/playwright
node run.js /tmp/test-script.js
```

---

**Compiled from Sprint Adoption MVP**
**Full Report**: `SPRINT_ADOPTION_MVP_REPORT.md`
