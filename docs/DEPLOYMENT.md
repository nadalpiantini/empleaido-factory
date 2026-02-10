# Deployment

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

Database migrations are stored in `supabase/migrations/` and are applied automatically when you deploy to Vercel.

To apply migrations locally:
```bash
supabase db push
```

To create a new migration:
```bash
supabase migration new migration_name
```