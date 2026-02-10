#!/bin/bash

# Empleaido Factory - Sephirot E2E Tests (Headed Mode)
# This script launches Playwright with visible browser window

cd "$(dirname "$0")"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🔯 SEPHIROT - Empleaido Factory E2E Tests              ║"
echo "║   Launching agents with VISIBLE browser...               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if dev server is running
echo "🔍 Checking if dev server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Dev server is running"
else
    echo "⚠️  WARNING: Dev server may not be running at http://localhost:3000"
    echo "   Start it with: cd ../app && bun run dev"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🚀 Starting Sephirot Orchestration Engine..."
echo "   - Browser: VISIBLE (headed mode)"
echo "   - Base URL: http://localhost:3000"
echo "   - Screenshot: ON"
echo "   - Video Recording: ON"
echo ""

# Run with headed mode
HEADED=true BASE_URL=http://localhost:3000 node sephirot.js

echo ""
echo "✅ Testing completed!"
echo "📁 Check ./reports for detailed bug reports"
echo "📸 Check ./screenshots for screenshots"
echo "🎥 Check ./videos for session recordings"
