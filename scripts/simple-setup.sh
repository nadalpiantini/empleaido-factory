#!/bin/bash

# simple-setup.sh - Simple CLI setup for empleaido-factory without build step

set -e  # Exit on any error

echo "🚀 EMPLEAIDO FACTORY - Simple CLI Setup"
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

print_status "Starting simple setup..."

# 1. Check prerequisites
print_status "1. Checking prerequisites..."

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

# 4. Verify setup files exist
print_status "4. Verifying setup files..."
REQUIRED_FILES=(
    ".github/workflows/deploy.yml"
    "scripts/deploy.sh"
    "scripts/setup-supabase.sh"
    "scripts/full-production-setup.sh"
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

# 5. Summary
print_status "5. Setup summary:"
echo "
${GREEN}✅ Simple setup completed!${NC}

${YELLOW}Next steps:${NC}
1. ${BLUE}Edit .env.local${NC} with your actual credentials
2. ${BLUE}Create Supabase project${NC} and get credentials
3. ${BLUE}supabase link --project-ref YOUR_PROJECT_REF${NC}
4. ${BLUE}supabase db push${NC}
5. ${BLUE}Configure GitHub secrets${NC} as described in docs/DEPLOYMENT.md
6. ${BLUE}git push origin main${NC} to deploy

${YELLOW}Available scripts:${NC}
- ${BLUE}./scripts/deploy.sh${NC} - Manual deployment
- ${BLUE}./scripts/setup-supabase.sh${NC} - Supabase setup helper
- ${BLUE}./scripts/full-production-setup.sh${NC} - Complete setup (may have build issues)

${YELLOW}Documentation:${NC}
- ${BLUE}docs/DEPLOYMENT.md${NC} - Deployment guide
- ${BLUE}docs/SUPABASE_SETUP.md${NC} - Supabase setup guide
- ${BLUE}docs/VECTOR_DATABASE.md${NC} - Vector database integration
- ${BLUE}README.md${NC} - Project overview
"

print_success "Simple setup script completed!"
echo ""
echo "For detailed instructions, see the documentation files in the docs/ directory."