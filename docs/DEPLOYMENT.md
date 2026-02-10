# Deployment

## Prerequisites

Before deploying, ensure you have:

1. A Supabase account and project
2. Vercel account
3. GitHub repository configured with proper secrets

## GitHub Actions

This project uses GitHub Actions for continuous deployment to Vercel. The workflow is defined in `.github/workflows/deploy.yml`.

### Environment Variables

To deploy successfully, you need to set the following secrets in your GitHub repository:

- `VERCEL_TOKEN` - Your Vercel token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Deployment Process

1. Push to `main` branch triggers production deployment
2. Push to other branches triggers preview deployment
3. Pull requests are built but not deployed automatically

## Supabase Setup

Before deploying, you need to set up your Supabase project:

1. Create a Supabase account at https://supabase.com/
2. Create a new project in your Supabase dashboard
3. Get your project URL and API keys from the project settings
4. Link your local project to the Supabase project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
5. Apply the database migrations:
   ```bash
   supabase db push
   ```

## Manual Deployment

You can also deploy manually using the deployment script:

```bash
./scripts/deploy.sh
```

This script will:
1. Pull the latest changes
2. Install dependencies
3. Run linting
4. Build the application
5. Deploy to Vercel

## Supabase Database Migrations

Database migrations are stored in `supabase/migrations/` and need to be applied manually:

To apply migrations locally:
```bash
supabase db push
```

To create a new migration:
```bash
supabase migration new migration_name
```

See [Supabase Setup](SUPABASE_SETUP.md) for detailed instructions.