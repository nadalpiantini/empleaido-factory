#!/bin/bash
#
# Asset Verification Script - EMPLEAIDO FACTORY
# This script verifies all assets exist and meet specs
#

IMAGES_DIR="public/images/empleaidos"
TEXTURES_DIR="public/textures"
ERRORS=0

echo "🔍 Verifying EMPLEAIDO FACTORY assets..."

# ============================================================================
# 1. Verify Mascot States (idle, wave, thinking, celebrating)
# ============================================================================

echo -e "\n📸 Verifying mascot states..."

for state in idle wave thinking celebrating; do
  if [ ! -f "$IMAGES_DIR/$state/empleado-$state.png" ]; then
    echo "  ❌ Missing: $state state"
    ((ERRORS++))
  else
    # Check dimensions
    dimensions=$(identify -format "%wx%h" "$IMAGES_DIR/$state/empleado-$state.png" 2>&1)
    if [[ ! "$dimensions" =~ "400x400" ]]; then
      echo "  ⚠️  Wrong size ($state): $dimensions (expected 400x400)"
      ((ERRORS++))
    else
      echo "  ✅ $state (400x400px)"
    fi
  fi
done

# ============================================================================
# 2. Verify Role Icons (32x32px)
# ============================================================================

echo -e "\n🎯 Verifying role icons..."

roles=("contabilidad" "marketing" "operaciones" "cfo" "productividad" "ux")

for role in "${roles[@]}"; do
  if [ ! -f "$IMAGES_DIR/icons/roles/$role.png" ]; then
    echo "  ❌ Missing: $role icon"
    ((ERRORS++))
  else
    # Check dimensions
    dimensions=$(identify -format "%wx%h" "$IMAGES_DIR/icons/roles/$role.png" 2>&1)
    if [[ ! "$dimensions" =~ "32x32" ]]; then
      echo "  ⚠️  Wrong size ($role): $dimensions (expected 32x32)"
      ((ERRORS++))
    else
      echo "  ✅ $role (32x32px)"
    fi
  fi
done

# ============================================================================
# 3. Verify Textures (512x512px tileable)
# ============================================================================

echo -e "\n🎨 Verifying textures..."

textures=("halftone" "paper-grain" "starfield-bg")

for texture in "${textures[@]}"; do
  if [ ! -f "$TEXTURES_DIR/$texture.png" ]; then
    echo "  ❌ Missing: $texture"
    ((ERRORS++))
  else
    # Check dimensions
    dimensions=$(identify -format "%wx%h" "$TEXTURES_DIR/$texture.png" 2>&1)
    if [[ ! "$dimensions" =~ "512x512" ]]; then
      echo "  ⚠️  Wrong size ($texture): $dimensions (expected 512x512)"
      ((ERRORS++))
    else
      echo "  ✅ $texture (512x512px)"
    fi
  fi
done

# ============================================================================
# 4. Verify Thumbnails (64x64px)
# ============================================================================

echo -e "\n📏 Verifying thumbnails..."

if [ ! -d "$IMAGES_DIR/thumb" ]; then
  echo "  ❌ Missing thumbnails directory"
  ((ERRORS++))
else
  for state in idle wave thinking celebrating; do
    if [ ! -f "$IMAGES_DIR/thumb/empleado-$state.png" ]; then
      echo "  ❌ Missing: $state thumbnail"
      ((ERRORS++))
    else
      dimensions=$(identify -format "%wx%h" "$IMAGES_DIR/thumb/empleado-$state.png" 2>&1)
      if [[ ! "$dimensions" =~ "64x64" ]]; then
        echo "  ⚠️  Wrong size ($state): $dimensions (expected 64x64)"
        ((ERRORS++))
      else
        echo "  ✅ $state thumbnail (64x64px)"
      fi
    fi
  done
fi

# ============================================================================
# 5. Verify Profile Images (320x320px, 640x640px)
# ============================================================================

echo -e "\n👤 Verifying profile images..."

if [ ! -d "$IMAGES_DIR/profile" ]; then
  echo "  ❌ Missing profile directory"
  ((ERRORS++))
else
  # Check base profile
  dimensions=$(identify -format "%wx%h" "$IMAGES_DIR/profile/empleado-base.png" 2>&1)
  if [[ ! "$dimensions" =~ "320x320" ]]; then
    echo "  ⚠️  Wrong size (base profile): $dimensions (expected 320x320)"
    ((ERRORS++))
  else
    echo "  ✅ Base profile (320x320px)"
  fi

  # Check large profile
  if [ -f "$IMAGES_DIR/profile/empleado-large.png" ]; then
    dimensions=$(identify -format "%wx%h" "$IMAGES_DIR/profile/empleado-large.png" 2>&1)
    if [[ ! "$dimensions" =~ "640x640" ]]; then
      echo "  ⚠️  Wrong size (large profile): $dimensions (expected 640x640)"
      ((ERRORS++))
    else
      echo "  ✅ Large profile (640x640px)"
    fi
  fi
fi

# ============================================================================
# 6. Verify Hero Image (1024x576px)
# ============================================================================

echo -e "\n🦸 Verifying hero image..."

if [ -f "$IMAGES_DIR/hero/empleado-hero.png" ]; then
  dimensions=$(identify -format "%wx%h" "$IMAGES_DIR/hero/empleado-hero.png" 2>&1)
  if [[ ! "$dimensions" =~ "1024x576" ]]; then
    echo "  ⚠️  Wrong size (hero): $dimensions (expected 1024x576)"
    ((ERRORS++))
  else
    echo "  ✅ Hero image (1024x576px)"
  fi
else
  echo "  ❌ Missing hero image"
  ((ERRORS++))
fi

# ============================================================================
# 7. Verify Color Profiles
# ============================================================================

echo -e "\n🎨 Verifying color profiles..."

# Check if PNG uses correct color profile
for state in idle wave thinking celebrating; do
  if [ -f "$IMAGES_DIR/$state/empleado-$state.png" ]; then
    profile=$(identify -verbose "$IMAGES_DIR/$state/empleado-$state.png" | grep -i profile 2>&1)
    if [[ ! "$profile" =~ "sRGB" ]]; then
      echo "  ⚠️  No sRGB profile ($state): $profile"
      ((ERRORS++))
    else
      echo "  ✅ sRGB profile ($state)"
    fi
  fi
done

# ============================================================================
# 8. Verify File Sizes
# ============================================================================

echo -e "\n📦 Verifying file sizes..."

for state in idle wave thinking celebrating; do
  if [ -f "$IMAGES_DIR/$state/empleado-$state.png" ]; then
    size=$(stat -f%z "$IMAGES_DIR/$state/empleado-$state.png" 2>&1)
    if [ $size -gt 100000 ]; then
      echo "  ⚠️  Large file ($state): $size bytes (optimize if >100KB)"
      ((ERRORS++))
    else
      echo "  ✅ Optimized ($state: $size bytes)"
    fi
  fi
done

# ============================================================================
# 9. Summary
# ============================================================================

echo -e "\n📊 Asset Verification Summary"
echo "=============================="

if [ $ERRORS -eq 0 ]; then
  echo "✅ All assets verified successfully!"
  echo ""
  echo "Stats:"
  echo "  • 4 mascot states (400x400px)"
  echo "  • 6 role icons (32x32px)"
  echo "  • 3 textures (512x512px)"
  echo "  • 4 thumbnails per state (64x64px)"
  echo "  • 2 profile sizes (320x320px, 640x640px)"
  echo "  • 1 hero image (1024x576px)"
  echo ""
  echo "All files ready for deployment! 🚀"
  exit 0
else
  echo "❌ $ERRORS issues found"
  echo ""
  echo "Please fix the errors above before deploying."
  echo ""
  echo "Suggested fixes:"
  echo "  • Run ./scripts/generate-assets.sh to regenerate missing files"
  echo "  • Use ./scripts/GENERATE_GUIDE.md for manual creation steps"
  echo "  • Check file permissions (chmod +x scripts/*.sh)"
  exit 1
fi
