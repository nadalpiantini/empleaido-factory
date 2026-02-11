#!/bin/bash

# deploy.sh - Deployment script for empleaido-factory

echo "🚀 Starting deployment process for Empleaido Factory..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️  Warning: You are not on the main branch. Current branch: $CURRENT_BRANCH"
  echo "💡 Consider merging to main before production deployment."
fi

# Ensure we have the latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running code linting..."
npm run lint

# Run build
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed! Aborting deployment."
  exit 1
fi

# Deploy to Vercel
echo "🚢 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed successfully!"