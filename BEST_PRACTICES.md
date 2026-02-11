# ✨ BEST PRACTICES - EMPLEAIDO FACTORY

**Compiled**: 2026-02-07
**Source**: Sprint 1 Learnings
**Status**: Living Document

---

## 🏗️ ARCHITECTURE BEST PRACTICES

### Multi-Tenant Database

✅ **DO**:
- Use `ef_` prefix on ALL tables
- Enable RLS from day 1
- Test isolation with multiple users
- Document tenant boundaries

❌ **DON'T**:
- Share tables without prefixes
- Skip RLS "temporarily"
- Trust client-side isolation
- Mix tenant data in queries

**Example**:
```sql
-- ✅ Good
CREATE TABLE ef_empleaidos (...)
CREATE POLICY user_isolation ON ef_empleaidos ...

-- ❌ Bad
CREATE TABLE empleaidos (...)  -- No prefix!
-- No RLS policies
```

---

### Next.js 15+ Dynamic Routes

✅ **DO**:
- Use `async` function for dynamic routes
- Await `params` before accessing properties
- Keep function signatures updated

❌ **DON'T**:
- Access `params.id` directly
- Use old sync pattern
- Skip TypeScript warnings

**Example**:
```typescript
// ✅ Good (Next.js 15+)
export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  // Use id...
}

// ❌ Bad (Next.js 14 pattern, breaks in 15+)
export default function Page({
  params
}: {
  params: { id: string }
}) {
  const id = params.id;  // Error!
}
```

---

### Directory Structure

✅ **DO**:
- Use EITHER `app/` OR `src/app/`, not both
- Keep structure flat when possible
- Follow Next.js conventions

❌ **DON'T**:
- Create duplicate `app/` directories
- Mix conventions (pages/ with app/)
- Nest unnecessarily deep

**Example**:
```
✅ Good:
app/
├── app/              # All routes here
└── src/              # Utilities and data

❌ Bad:
app/
├── app/              # Empty!
└── src/app/          # Pages here (Next.js won't find them)
```

---

## 💻 CODE BEST PRACTICES

### TypeScript Strict Mode

✅ **DO**:
- Enable strict mode from day 1
- Fix type errors immediately
- Use explicit types for complex objects
- Leverage inference for simple cases

❌ **DON'T**:
- Use `any` type
- Disable strict mode "temporarily"
- Ignore TypeScript warnings
- Over-annotate simple code

**Example**:
```typescript
// ✅ Good
interface Empleaido {
  id: string;
  name: string;
  life: Life;
}

const empleaido: Empleaido = {...}

// ❌ Bad
const empleaido: any = {...}  // Defeats the purpose!
```

---

### Server Components First

✅ **DO**:
- Default to Server Components
- Add "use client" only when needed
- Fetch data server-side
- Keep client bundles small

❌ **DON'T**:
- Add "use client" everywhere
- Fetch from client when avoidable
- Pass large objects to client
- Mix server/client carelessly

**When to use "use client"**:
- useState, useEffect needed
- Browser APIs required
- Event handlers (onClick, etc.)
- Third-party client components

---

### Import Path Aliases

✅ **DO**:
- Use `@/` for all internal imports
- Configure in tsconfig.json
- Keep paths consistent
- Document custom aliases

❌ **DON'T**:
- Use relative paths (`../../../`)
- Mix relative and aliased imports
- Create too many aliases
- Skip tsconfig configuration

**Example**:
```typescript
// ✅ Good
import empleaidos from '@/data/empleaidos.json';
import { Life } from '@/lib/types';

// ❌ Bad
import empleaidos from '../../../data/empleaidos.json';
```

---

## 🗄️ DATABASE BEST PRACTICES

### Schema Design

✅ **DO**:
- Plan schema before coding
- Use UUIDs for IDs
- Add timestamps (created_at, updated_at)
- Index foreign keys
- Document relationships

❌ **DON'T**:
- Use auto-increment in distributed systems
- Skip indexes on query columns
- Store JSON when relations are better
- Forget migration strategy

**Example**:
```sql
-- ✅ Good
CREATE TABLE ef_empleaidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial INTEGER UNIQUE NOT NULL,
  profile JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_empleaidos_serial ON ef_empleaidos(serial);
```

---

### Row Level Security (RLS)

✅ **DO**:
- Enable RLS on ALL user data tables
- Test policies with different users
- Use simple policies (performance)
- Document policy logic

❌ **DON'T**:
- Disable RLS in production
- Trust client-side checks
- Create overly complex policies
- Skip policy testing

**Example**:
```sql
-- ✅ Good: Simple, effective
CREATE POLICY user_isolation ON ef_adoptions
  FOR ALL
  USING (user_id = auth.uid());

-- ❌ Bad: Too complex, slow
CREATE POLICY complex ON ef_adoptions
  FOR ALL
  USING (
    user_id = auth.uid() AND
    status IN (SELECT ... FROM ... WHERE ...)
  );
```

---

## 🎨 UI/UX BEST PRACTICES

### Tailwind CSS

✅ **DO**:
- Use utility classes
- Create custom classes for repeated patterns
- Follow mobile-first approach
- Use Tailwind config for theme

❌ **DON'T**:
- Write custom CSS when Tailwind exists
- Use `@apply` excessively
- Inline-style when Tailwind has utility
- Override Tailwind with !important

**Example**:
```tsx
// ✅ Good
<div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-2xl font-bold mb-4">Title</h1>
</div>

// ❌ Bad
<div style={{maxWidth: '80rem', margin: '0 auto'}}>
  <h1 style={{fontSize: '1.5rem'}}>Title</h1>
</div>
```

---

### Responsive Design

✅ **DO**:
- Design mobile-first
- Test on real devices
- Use responsive breakpoints
- Optimize images for mobile

❌ **DON'T**:
- Only test on desktop
- Use fixed pixel widths
- Serve huge images to mobile
- Forget touch targets (44px min)

**Breakpoints**:
```typescript
// Tailwind defaults (use these)
sm: 640px   // Tablet portrait
md: 768px   // Tablet landscape
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

---

## 🔧 DEVELOPMENT BEST PRACTICES

### Git Workflow

✅ **DO**:
- Commit frequently with clear messages
- Create feature branches
- Review changes before committing
- Keep commits atomic (one change)

❌ **DON'T**:
- Commit directly to main
- Use vague messages ("fix", "update")
- Commit broken code
- Mix unrelated changes

**Good Commit Messages**:
```bash
✅ Good:
"Fix async params in dynamic routes (Next.js 15+)"
"Add voice generation endpoint for ElevenLabs"
"Update RLS policies for multi-tenant isolation"

❌ Bad:
"fix"
"update stuff"
"wip"
```

---

### Environment Variables

✅ **DO**:
- Use .env.local for secrets
- Add .env.example with placeholders
- Prefix public vars with NEXT_PUBLIC_
- Document required env vars

❌ **DON'T**:
- Commit .env.local to Git
- Hardcode secrets in code
- Expose server secrets to client
- Skip .env.example

**Example**:
```bash
# .env.local (NEVER commit)
SUPABASE_SERVICE_KEY=secret123

# .env.example (commit this)
SUPABASE_SERVICE_KEY=your_service_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url_here
```

---

### Error Handling

✅ **DO**:
- Handle errors gracefully
- Show user-friendly messages
- Log errors server-side
- Provide recovery options

❌ **DON'T**:
- Let errors crash the app
- Show stack traces to users
- Silently swallow errors
- Skip error boundaries

**Example**:
```typescript
// ✅ Good
try {
  const data = await fetchEmpleaido(id);
  return <Profile empleaido={data} />;
} catch (error) {
  console.error('Failed to load empleaido:', error);
  return <ErrorMessage />;
}

// ❌ Bad
const data = await fetchEmpleaido(id);  // Crashes if fails
return <Profile empleaido={data} />;
```

---

## 📝 DOCUMENTATION BEST PRACTICES

### README Files

✅ **DO**:
- Keep README concise (< 200 lines)
- Include quick start instructions
- Link to detailed docs
- Update when project changes

❌ **DON'T**:
- Put everything in README
- Let it get outdated
- Skip installation steps
- Forget to update examples

---

### Code Comments

✅ **DO**:
- Comment WHY, not WHAT
- Document complex algorithms
- Explain non-obvious decisions
- Use JSDoc for public APIs

❌ **DON'T**:
- Comment obvious code
- Write novels in comments
- Leave TODO comments in production
- Skip edge case documentation

**Example**:
```typescript
// ✅ Good: Explains WHY
// Using quadratic formula because XP growth
// needs to slow down at higher levels
const xpNeeded = 100 * level * 1.5;

// ❌ Bad: Explains WHAT (obvious)
// Set xpNeeded to 100 times level times 1.5
const xpNeeded = 100 * level * 1.5;
```

---

### ADRs (Architecture Decision Records)

✅ **DO**:
- Document major decisions
- Include context and alternatives
- Update when decisions change
- Reference in code comments

❌ **DON'T**:
- Skip documentation
- Forget to link from code
- Make decisions without recording
- Delete old ADRs

**Template**:
```markdown
# ADR-XXX: [Decision Title]

## Context
Why this decision is needed...

## Decision
What we decided to do...

## Alternatives Considered
- Option A: ...
- Option B: ...

## Consequences
Positive and negative outcomes...

## Status
Accepted / Deprecated / Superseded by ADR-YYY
```

---

## 🧪 TESTING BEST PRACTICES

### Test Strategy (Future)

✅ **DO**:
- Write tests for critical paths
- Test edge cases
- Keep tests fast
- Mock external services

❌ **DON'T**:
- Skip tests entirely
- Test implementation details
- Make tests flaky
- Couple tests to UI structure

---

### Manual Testing

✅ **DO**:
- Test all routes after changes
- Try edge cases
- Use browser DevTools
- Check different screen sizes

❌ **DON'T**:
- Only test happy path
- Skip mobile testing
- Ignore console errors
- Deploy without testing

---

## 🚀 DEPLOYMENT BEST PRACTICES

### Pre-Deployment Checklist

✅ **DO**:
- [ ] Run `npm run build` successfully
- [ ] Test production build locally
- [ ] Verify environment variables
- [ ] Check database connections
- [ ] Review recent changes

❌ **DON'T**:
- Deploy without building
- Skip env var verification
- Deploy broken builds
- Push to production on Friday

---

### Monitoring

✅ **DO**:
- Set up error tracking (Sentry)
- Monitor performance (Vercel Analytics)
- Track key metrics
- Set up alerts

❌ **DON'T**:
- Deploy blind (no monitoring)
- Ignore error spikes
- Skip performance checks
- React only to user complaints

---

## 🔒 SECURITY BEST PRACTICES

### Authentication

✅ **DO**:
- Use Supabase Auth (built-in security)
- Hash passwords properly
- Implement rate limiting
- Use HTTPS only

❌ **DON'T**:
- Roll your own auth
- Store passwords in plaintext
- Skip CSRF protection
- Trust client-side validation

---

### Data Security

✅ **DO**:
- Validate all inputs
- Sanitize user content
- Use RLS on database
- Implement least privilege

❌ **DON'T**:
- Trust user input
- Skip SQL injection prevention
- Give broad database access
- Expose sensitive data in URLs

---

## 📊 PERFORMANCE BEST PRACTICES

### Optimization

✅ **DO**:
- Use Server Components (faster)
- Optimize images (Next.js Image)
- Minimize bundle size
- Cache static assets

❌ **DON'T**:
- Load everything client-side
- Send unoptimized images
- Include unused dependencies
- Skip lazy loading

---

### Database Performance

✅ **DO**:
- Add indexes on query columns
- Use connection pooling
- Limit query results
- Monitor slow queries

❌ **DON'T**:
- Query without WHERE clause
- Skip indexes
- Load entire tables
- N+1 query patterns

---

## 🎯 PROJECT MANAGEMENT BEST PRACTICES

### Sprint Planning

✅ **DO**:
- Define clear objectives
- Set realistic timelines
- Document decisions
- Review and adapt

❌ **DON'T**:
- Skip planning phase
- Overcommit features
- Ignore blockers
- Forget retrospectives

---

### Documentation

✅ **DO**:
- Document as you build
- Use Edward Honour method
- Keep docs up to date
- Link related documents

❌ **DON'T**:
- Document at the end
- Skip requirements docs
- Let docs drift
- Create orphan documents

---

## 💡 EMPLEAIDO-SPECIFIC BEST PRACTICES

### Sephirot Framework

✅ **DO**:
- Map empleaidos to correct Sephirah
- Use framework for behavioral routing
- Document archetype decisions
- Keep mappings consistent

❌ **DON'T**:
- Use Sephirot as decoration only
- Mix archetypes arbitrarily
- Skip behavioral implications
- Forget the Three Pillars

---

### Life Engine

✅ **DO**:
- Track XP/trust/energy consistently
- Use database functions for calculations
- Test progression formulas
- Balance game mechanics

❌ **DON'T**:
- Calculate client-side only
- Make progression too slow/fast
- Skip edge cases (level 100+)
- Forget energy reset logic

---

### OpenClaw Integration

✅ **DO**:
- Test spawn with 1 empleaido first
- Validate workspace structure
- Keep agent files in sync
- Document spawn process

❌ **DON'T**:
- Spawn all 5 without testing
- Skip workspace validation
- Hardcode agent paths
- Forget to update registry

---

## 📚 RESOURCES

### Official Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind: https://tailwindcss.com/docs

### Edward Honour Method
- PRD structure
- tech-stack.md
- design-notes.md
- requirements.md
- ADR documentation

### Internal Docs
- `/docs/architecture.md`
- `/docs/openclaw-integration.md`
- This file (BEST_PRACTICES.md)

---

## ✅ CHECKLIST FOR NEW FEATURES

Before adding any new feature:

1. **Planning**
   - [ ] Define requirement in requirements.md
   - [ ] Update PRD if scope changes
   - [ ] Document decision in ADR if major

2. **Development**
   - [ ] Follow TypeScript strict mode
   - [ ] Use Server Components by default
   - [ ] Add proper error handling
   - [ ] Test edge cases

3. **Database**
   - [ ] Use ef_ prefix on new tables
   - [ ] Add RLS policies
   - [ ] Create indexes
   - [ ] Add to schema documentation

4. **Documentation**
   - [ ] Update relevant .md files
   - [ ] Add code comments for complex logic
   - [ ] Update PROJECT.md if setup changes

5. **Testing**
   - [ ] Manual test all routes
   - [ ] Check mobile responsiveness
   - [ ] Verify TypeScript compilation
   - [ ] Test with different users (if auth)

---

## 🎓 LEARNING FROM SPRINT 1

### What Worked Well
1. ✅ RALPH Mode for rapid iteration
2. ✅ Edward Honour methodology
3. ✅ TypeScript strict from start
4. ✅ Multi-tenant with ef_ prefix
5. ✅ Complete documentation suite

### What to Improve
1. 🔄 Add tests earlier (Sprint 2)
2. 🔄 Setup staging environment
3. 🔄 Implement error boundaries
4. 🔄 Add loading states
5. 🔄 Setup monitoring from day 1

### Mistakes to Avoid
1. ❌ Don't create duplicate app/ directories
2. ❌ Don't skip Next.js version updates
3. ❌ Don't defer documentation
4. ❌ Don't test only on desktop
5. ❌ Don't commit without building

---

## 🚦 QUALITY GATES

Before considering a feature "done":

- ✅ TypeScript compiles with no errors
- ✅ All routes return expected status codes
- ✅ Mobile responsive tested
- ✅ No console errors in browser
- ✅ Documentation updated
- ✅ RLS policies added (if DB changes)
- ✅ Error handling implemented
- ✅ Performance acceptable (< 2s load)

---

**Last Updated**: 2026-02-07
**Maintained By**: Team Empleaido
**Status**: Living Document (update as you learn)

---

*"Good practices early save hours later."*
