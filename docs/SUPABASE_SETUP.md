# Supabase Setup Instructions

## Prerequisites

1. Create a Supabase account at https://supabase.com/
2. Create a new project in your Supabase dashboard
3. Get your project URL and API keys from the project settings

## Setup Steps

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

3. Link your local project to the Supabase project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

   Replace `YOUR_PROJECT_REF` with your actual project reference from the Supabase dashboard.

4. Apply the database migrations:
   ```bash
   supabase db push
   ```

## Troubleshooting

If you get Docker errors, make sure Docker is running on your system.

If you get "Cannot find project ref" errors, make sure you've linked your project with:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```