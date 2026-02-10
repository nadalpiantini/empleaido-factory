# Supabase Setup Guide

This project uses Supabase for data persistence. Follow these steps to set it up.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be ready (2-3 minutes)

## 2. Get Your Credentials

Go to: https://supabase.com/dashboard/project/_/settings/api

Copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 3. Update .env.local

```bash
# Replace these with your actual credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 4. Run Migrations

### Option A: Using Supabase Dashboard (Recommended for setup)

1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/001_dashboard_virtual_office.sql`
3. Paste and run it

### Option B: Using CLI

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## 5. Verify Setup

Test that everything works:

```bash
# Run the dev server
npm run dev

# Visit these URLs:
# - http://localhost:3000/dashboard
# - http://localhost:3000/virtual-office
```

## 6. Tables Created

After migration, you'll have these tables:

- **ef_departments** - Virtual Office departments
- **ef_activity_log** - Activity timeline for dashboard
- **ef_adoptions** - Empleaido adoptions (existing)
- **ef_life_events** - Life events/stats (existing)
- **ef_skill_executions** - Skill execution logs (existing)

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Overall statistics
- `GET /api/dashboard/activity?limit=10` - Activity timeline

### Virtual Office
- `GET /api/virtual-office/departments` - All departments
- `GET /api/virtual-office/departments/[slug]` - Department details

## Troubleshooting

### "Permission denied" errors
- Make sure you've run the migrations
- Check that RLS policies are created

### "Table not found" errors
- Run the migration SQL again
- Verify table names in Supabase dashboard

### Auth errors
- Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set for server operations

## Mock Data Fallback

If Supabase is not configured, the app will use mock data:
- 6 departments with stats
- Sample activity timeline
- Dashboard statistics

This allows development without immediate Supabase setup.
