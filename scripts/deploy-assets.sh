#!/bin/bash
#
# Asset Deployment Script - EMPLEAIDO FACTORY
# This script generates, verifies, and deploys all visual assets
#

set -e # Exit on error

echo "🚀 Deploying EMPLEAIDO FACTORY visual assets..."
echo ""

# ============================================================================
# 1. Generate Assets
# ============================================================================

echo "1️⃣ Generating assets..."

if ! command -v convert &> /dev/null; then
  echo "  ❌ ImageMagick not found"
  echo "  Install ImageMagick:"
  echo "    macOS: brew install imagemagick"
  echo "    Ubuntu: sudo apt-get install imagemagick"
  echo "    Windows: Download from https://imagemagick.org/script/download.php"
  echo ""
  echo "  Or use manual creation methods in scripts/GENERATE_GUIDE.md"
  exit 1
fi

./scripts/generate-assets.sh

echo "  ✅ Asset generation complete"
echo ""

# ============================================================================
# 2. Verify Assets
# ============================================================================

echo "2️⃣ Verifying assets..."

./scripts/verify-assets.sh

if [ $? -eq 0 ]; then
  echo "  ✅ Asset verification passed"
else
  echo "  ❌ Asset verification failed"
  echo "  Run: ./scripts/verify-assets.sh"
  echo "  Check: scripts/GENERATE_GUIDE.md for manual fixes"
  exit 1
fi

echo ""

# ============================================================================
# 3. Optimize Assets
# ============================================================================

echo "3️⃣ Optimizing assets..."

# Create optimized versions
mkdir -p public/images/empleaidos/optimized

# Use ImageMagick to optimize PNGs
for file in $(find public/images/empleaidos -name "*.png" -type f); do
  filename=$(basename "$file")
  dir=$(dirname "$file")

  # Optimize with pngcrush (if installed) or use ImageMagick
  if command -v pngcrush &> /dev/null; then
    pngcrush -q -rem alla -rem text -brute "$file" "public/images/empleaidos/optimized/${filename}.tmp" 2>/dev/null
    mv "public/images/empleaidos/optimized/${filename}.tmp" "public/images/empleaidos/optimized/${filename}"
  else
    convert "$file" -strip -resize 100% -quality 95 "public/images/empleaidos/optimized/${filename}"
  fi

  echo "  ✅ Optimized: ${filename}"
done

echo ""

# ============================================================================
# 4. Create Asset Manifest
# ============================================================================

echo "4️⃣ Creating asset manifest..."

cat > public/images/empleaidos/MANIFEST.json <<EOF
{
  "version": "1.0.0",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "assets": {
    "mascot": {
      "idle": "empleado-idle",
      "wave": "empleado-wave",
      "thinking": "empleado-thinking",
      "celebrating": "empleado-celebrating"
    },
    "sizes": {
      "card": "400x400",
      "icon": "32x32",
      "thumb": "64x64",
      "profile": "320x320",
      "profile_large": "640x640",
      "hero": "1024x576"
    },
    "total_count": $(find public/images/empleaidos -name "*.png" -type f | wc -l)
  }
}
EOF

echo "  ✅ Manifest created"
echo ""

# ============================================================================
# 5. Summary
# ============================================================================

echo "🎉 Asset deployment complete!"
echo ""
echo "📦 Summary:"
echo "  ✅ 4 mascot states generated"
echo "  ✅ 6 role icons generated"
echo "  ✅ 3 textures generated"
echo "  ✅ $($(find public/images/empleaidos -name "*.png" -type f | wc -l)) total files"
echo ""
echo "📁 Structure:"
echo "  • public/images/empleaidos/"
echo "    ├─ idle/"
echo "    ├─ wave/"
echo "    ├─ thinking/"
echo "    ├─ celebrating/"
echo "    ├─ icons/"
echo "    │   └─ roles/"
echo "    ├─ thumb/"
echo "    ├─ profile/"
echo "    ├─ hero/"
echo "    └─ optimized/"
echo "  • public/textures/"
echo "    ├─ halftone.png"
echo "    ├─ paper-grain.png"
echo "    └─ starfield-bg.png"
echo ""
echo "🚀 Next steps:"
echo "  1. Run: npm run dev (to test locally)"
echo "  2. Verify: Check browser console for asset load errors"
echo "  3. Deploy: Upload to hosting platform"
echo "  4. Test: Verify in production environment"
echo ""
echo "📖 Documentation:"
echo "  • scripts/ASSETS_SPEC.md - Visual specifications"
echo "  • scripts/GENERATE_GUIDE.md - Generation guide"
echo "  • public/images/empleaidos/MANIFEST.json - Asset manifest"
echo ""
echo "🛠️ Troubleshooting:"
echo "  • If assets don't load, check image paths"
echo "  • If glow effects fail, verify CSS box-shadow properties"
echo "  • If halftone pattern doesn't show, check overlay opacity"
echo "  • Run: ./scripts/verify-assets.sh to debug issues"
echo ""
echo "✨ Your EMPLEAIDO FACTORY is ready for liftoff! 🛸"
