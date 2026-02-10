#!/bin/bash

# full-production-setup.sh - Complete CLI setup for empleaido-factory production deployment

set -e  # Exit on any error

echo "🚀 EMPLEAIDO FACTORY - Production Setup"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date +%H:%M:%S)] SUCCESS:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +%H:%M:%S)] WARNING:${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +%H:%M:%S)] ERROR:${NC} $1"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "supabase" ]]; then
    print_error "This script must be run from the empleaido-factory root directory"
    exit 1
fi

print_status "Starting production setup..."

# 1. Check prerequisites
print_status "1. Checking prerequisites..."

# Check if Docker is running (required for Supabase CLI)
if ! docker info >/dev/null 2>&1; then
    print_warning "Docker is not running. Some Supabase CLI features may not work locally."
    print_warning "However, production deployment will still work."
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_warning "Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

print_success "Prerequisites checked"

# 2. Setup environment variables
print_status "2. Setting up environment variables..."

if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local from .env.example..."
    cp .env.example .env.local
    print_success "Created .env.local - please update it with your actual credentials"
else
    print_status ".env.local already exists"
fi

# 3. Install dependencies
print_status "3. Installing dependencies..."
npm ci
print_success "Dependencies installed"

# 4. Run linting
print_status "4. Running code linting..."
if npm run lint; then
    print_success "Code linting passed"
else
    print_warning "Code linting had issues, continuing anyway..."
fi

# 5. Build the application
print_status "5. Building application..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# 6. Setup Supabase (instructions only, as we need user input)
print_status "6. Supabase setup instructions:"
echo "
${YELLOW}Supabase Setup Required:${NC}
1. Create a Supabase account at https://supabase.com/
2. Create a new project in your Supabase dashboard
3. Get your project URL and API keys from the project settings
4. Update your .env.local file with Supabase credentials:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
5. Link your project (replace YOUR_PROJECT_REF with your actual project ref):
   ${BLUE}supabase link --project-ref YOUR_PROJECT_REF${NC}
6. Apply database migrations:
   ${BLUE}supabase db push${NC}
"

# 7. Setup GitHub Actions (instructions only)
print_status "7. GitHub Actions setup instructions:"
echo "
${YELLOW}GitHub Actions Setup Required:${NC}
1. Go to your GitHub repository settings
2. Navigate to 'Secrets and variables' > 'Actions'
3. Add the following repository secrets:
   - VERCEL_TOKEN: Your Vercel token
   - VERCEL_ORG_ID: Your Vercel organization ID
   - VERCEL_PROJECT_ID: Your Vercel project ID
   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key
4. Push to the main branch to trigger deployment
"

# 8. Verify setup files exist
print_status "8. Verifying setup files..."
REQUIRED_FILES=(
    ".github/workflows/deploy.yml"
    "scripts/deploy.sh"
    "scripts/setup-supabase.sh"
    "supabase/migrations/20260210_vector_extension.sql"
    "supabase/config.toml"
    "docs/DEPLOYMENT.md"
    "docs/VECTOR_DATABASE.md"
    "docs/SUPABASE_SETUP.md"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    print_success "All required setup files are present"
else
    print_warning "Missing files:"
    for missing in "${MISSING_FILES[@]}"; do
        echo "  - $missing"
    done
fi

# 9. Summary
print_status "9. Setup summary:"
echo "
${GREEN}✅ Production setup preparation completed!${NC}

${YELLOW}Next steps:${NC}
1. ${BLUE}Edit .env.local${NC} with your actual credentials
2. ${BLUE}Create Supabase project${NC} and get credentials
3. ${BLUE}supabase link --project-ref YOUR_PROJECT_REF${NC}
4. ${BLUE}supabase db push${NC}
5. ${BLUE}Configure GitHub secrets${NC} as described above
6. ${BLUE}git push origin main${NC} to deploy

${YELLOW}Manual deployment:${NC}
${BLUE}./scripts/deploy.sh${NC}

${YELLOW}Supabase setup helper:${NC}
${BLUE}./scripts/setup-supabase.sh${NC}
"

print_success "Production setup script completed!"
echo ""
echo "For detailed instructions, see:"
echo "  - docs/DEPLOYMENT.md"
echo "  - docs/SUPABASE_SETUP.md"
echo "  - README.md"