#!/bin/bash

# setup-supabase.sh - Helper script for Supabase setup

echo "🔧 Supabase Setup Helper"
echo "========================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "📝 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "✅ Created .env.local"
  echo "💡 Please edit .env.local and fill in your Supabase credentials"
  echo "🔗 Then run: supabase link --project-ref YOUR_PROJECT_REF"
else
  echo "✅ .env.local already exists"
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI not found"
  echo "💡 Install it with: npm install -g supabase"
  exit 1
fi

echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local and fill in your Supabase credentials"
echo "2. Create a project at https://supabase.com/"
echo "3. Get your project ref from the Supabase dashboard"
echo "4. Link your project:"
echo "   supabase link --project-ref YOUR_PROJECT_REF"
echo "5. Apply migrations:"
echo "   supabase db push"
echo ""
echo "📖 See docs/SUPABASE_SETUP.md for detailed instructions"