#!/bin/bash
#
# EMPLEAIDO FACTORY - Asset Generation Script
# This script uses ImageMagick to generate PNG assets from SVG specs
#

# Colors
SHADOW="#0E3A41"
MID="#1A434F"
LIGHT="#F3E4C8"
CYAN="#5ED3D0"

# Sizes
CARD_SIZE="400x400"
ICON_SIZE="32x32"
THUMB_SIZE="64x64"
PROFILE_SIZE="320x320"
PROFILE_LARGE="640x640"

# Directories
IMAGES_DIR="public/images/empleaidos"
TEXTURES_DIR="public/textures"

# Create directories
mkdir -p $IMAGES_DIR/{idle,wave,thinking,celebrating}
mkdir -p $IMAGES_DIR/icons/{roles,sephirot,skills}
mkdir -p $TEXTURES_DIR
mkdir -p $IMAGES_DIR/{thumb,profile,hero}

# ============================================================================
# 1. GENERATE EMPLEAIDO MASCOT STATES (Placeholder)
# ============================================================================

echo "Creating placeholder mascot states..."

# Create a default avatar base
cat > /tmp/avatar-base.txt <<EOF
<!-- SVG Base Template for Empleado States -->
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="400" fill="$MID"/>

  <!-- Character -->
  <circle cx="200" cy="150" r="60" fill="$LIGHT" stroke="$MID" stroke-width="4"/>
  <circle cx="200" cy="260" r="90" fill="$LIGHT" stroke="$MID" stroke-width="4"/>

  <!-- Face -->
  <circle cx="175" cy="135" r="5" fill="$SHADOW"/>
  <circle cx="225" cy="135" r="5" fill="$SHADOW"/>
  <path d="M 175 165 Q 200 185 225 165" stroke="$SHADOW" stroke-width="3" fill="none"/>

  <!-- Accent -->
  <rect x="50" y="50" width="60" height="20" fill="$CYAN" rx="10"/>
</svg>
EOF

# Generate idle state
convert -background transparent -size $CARD_SIZE \
  svg:/tmp/avatar-base.txt \
  $IMAGES_DIR/idle/empleado-base.png

echo "  ✓ Empleado Base (Idle)"

# ============================================================================
# 2. GENERATE ROLE ICONS (Carved metal style with effects)
# ============================================================================

echo -e "\nGenerating role icons..."

# Contabilidad RD 🧾
convert -size $ICON_SIZE -background transparent \
  -fill $LIGHT -stroke $SHADOW -strokewidth 2 \
  -draw "rectangle 8,12 24,20" \
  -draw "rectangle 8,20 24,28" \
  -draw "line 12,16 20,16" \
  -draw "line 12,24 20,24" \
  -stroke $CYAN -strokewidth 1 \
  -draw "line 5,8 7,10" -draw "line 7,8 9,10" \
  -draw "line 23,22 25,24" -draw "line 25,22 27,24" \
  $IMAGES_DIR/icons/roles/contabilidad.png

echo "  ✓ Contabilidad RD"

# Growth Marketing 📣
convert -size $ICON_SIZE -background transparent \
  -fill $LIGHT -stroke $SHADOW -strokewidth 2 \
  "roundrectangle 10,8 22,24 4,4" \
  -fill $SHADOW -draw "circle 16,16 16,14" \
  -stroke $CYAN -strokewidth 1 \
  "path 'M 8,16 Q 2,12 6,16'" "path 'M 8,16 Q 2,20 6,16'" \
  "path 'M 24,16 Q 30,12 26,16'" "path 'M 24,16 Q 30,20 26,16'" \
  $IMAGES_DIR/icons/roles/marketing.png

echo "  ✓ Growth Marketing"

# Operaciones 🗂️
convert -size $ICON_SIZE -background transparent \
  -fill $LIGHT -stroke $SHADOW -strokewidth 2 \
  -draw "rectangle 8,8 24,14" \
  -draw "rectangle 8,14 24,20" \
  -draw "rectangle 8,20 24,26" \
  -draw "circle 16,11 16,9" \
  -draw "circle 16,17 16,15" \
  -draw "circle 16,23 16,21" \
  -stroke $CYAN -strokewidth 1 \
  -fill $CYAN -pointsize 4 -annotate +1+27 "···" \
  $IMAGES_DIR/icons/roles/operaciones.png

echo "  ✓ Operaciones"

# CFO Estrategico 💰
convert -size $ICON_SIZE -background transparent \
  -fill $LIGHT -stroke $SHADOW -strokewidth 2 \
  -draw "ellipse 16,16 12,12 0,360" \
  -fill $SHADOW -draw "text 14,20 '$'" \
  -stroke $CYAN -strokewidth 1 \
  -draw "arc 8,8 24,24 45,135" -draw "arc 8,8 24,24 225,315" \
  $IMAGES_DIR/icons/roles/cfo.png

echo "  ✓ CFO"

# Productividad Personal ⏱️
convert -size $ICON_SIZE -background transparent \
  -fill $LIGHT -stroke $SHADOW -strokewidth 2 \
  -draw "circle 16,16 16,8" \
  -fill $SHADOW -draw "circle 16,16 16,6" \
  -fill transparent -draw "circle 16,16 16,12" \
  -stroke $CYAN -strokewidth 1 \
  -draw "line 16,16 16,10" -draw "line 16,16 22,18" -draw "line 16,16 10,18" \
  -motion-blur 0x2+90 \
  $IMAGES_DIR/icons/roles/productividad.png

echo "  ✓ Productividad Personal"

# UX Design 🎨
convert -size $ICON_SIZE -background transparent \
  -fill $LIGHT -stroke $SHADOW -strokewidth 2 \
  -draw "roundrectangle 12,8 20,24 4,4" \
  -draw "path 'M 12,24 Q 8,26 12,30'" \
  -fill $CYAN -pointsize 3 \
  -annotate +4+12 "·" -annotate +12+12 "·" -annotate +20+12 "·" \
  -stroke $CYAN -strokewidth 0 \
  -annotate +6+18 "." -annotate +14+18 "." -annotate +22+18 "." \
  $IMAGES_DIR/icons/roles/ux.png

echo "  ✓ UX Design"

# ============================================================================
# 3. GENERATE TEXTURES (Tileable)
# ============================================================================

echo -e "\nGenerating textures..."

# Halftone pattern (512x512 tileable)
convert -size 512x512 xc:transparent \
  -fill $SHADOW -background transparent \
  -sparse-color Barycentric "0,0 $SHADOW,511,511 $SHADOW" \
  -ordered-dither o4x4 \
  -threshold 50% \
  $TEXTURES_DIR/halftone.png

echo "  ✓ Halftone Pattern"

# Paper grain (512x512 tileable)
convert -size 512x512 xc:transparent \
  -fill $LIGHT -background transparent \
  -sparse-color Barycentric "0,0 $LIGHT,511,511 $LIGHT" \
  -noise gaussian \
  -gaussian-blur 0.5 \
  -modulate 100,50 \
  $TEXTURES_DIR/paper-grain.png

echo "  ✓ Paper Grain"

# Starfield background (1920x1080)
convert -size 1920x1080 xc:$SHADOW \
  -fill white -pointsize 3 \
  -draw "point 100,100" -draw "point 300,200" -draw "point 500,150" \
  -draw "point 800,300" -draw "point 1200,250" -draw "point 1600,350" \
  -fill white -pointsize 2 \
  -draw "point 150,500" -draw "point 350,450" -draw "point 550,400" \
  -draw "point 850,550" -draw "point 1250,500" -draw "point 1650,600" \
  -fill white -pointsize 4 \
  -draw "point 200,700" -draw "point 400,750" -draw "point 600,700" \
  -draw "point 900,850" -draw "point 1300,800" -draw "point 1700,900" \
  $TEXTURES_DIR/starfield-bg.png

echo "  ✓ Starfield Background"

# ============================================================================
# 4. GENERATE THUMBNAILS & AVATARS
# ============================================================================

echo -e "\nGenerating thumbnails and avatars..."

# Thumbnails for cards
for state in idle wave thinking celebrating; do
  convert $IMAGES_DIR/idle/empleado-base.png \
    -resize $THUMB_SIZE \
    $IMAGES_DIR/thumb/empleado-${state}.png

  echo "  ✓ Thumb: $state"
done

# Profile images
convert $IMAGES_DIR/idle/empleado-base.png \
  -resize $PROFILE_SIZE \
  $IMAGES_DIR/profile/empleado-base.png

echo "  ✓ Profile Base"

# Large profile for detail pages
convert $IMAGES_DIR/idle/empleado-base.png \
  -resize $PROFILE_LARGE \
  $IMAGES_DIR/profile/empleado-large.png

echo "  ✓ Profile Large"

# Hero image (1024x576)
convert -size 1024x576 xc:transparent \
  \( $IMAGES_DIR/idle/empleado-base.png -resize 256x256 -gravity west -geometry +50-0 \) \
  -composite \
  -fill $LIGHT -font helvetica-bold -pointsize 48 -gravity northwest \
  -annotate +384+120 "EMPLEADO" \
  -annotate +384+180 "FACTORY" \
  -fill $CYAN -pointsize 24 \
  -annotate +384+240 "Collectible AI Employees" \
  $IMAGES_DIR/hero/empleado-hero.png

echo "  ✓ Hero Image"

# ============================================================================
# 5. GENERATE STATE VARIATIONS
# ============================================================================

echo -e "\nGenerating state variations..."

# Wave state (add wave animation)
convert $IMAGES_DIR/idle/empleado-base.png \
  -background transparent \
  -distort SRT 0 \
  -wave 2x32 \
  $IMAGES_DIR/wave/empleado-wave.png

echo "  ✓ Wave State"

# Thinking state (add motion blur, thinking lines)
convert $IMAGES_DIR/idle/empleado-base.png \
  -motion-blur 0x2+90 \
  -stroke $CYAN -strokewidth 2 \
  -draw "line 180,80 220,60" \
  -draw "line 175,85 225,65" \
  $IMAGES_DIR/thinking/empleado-thinking.png

echo "  ✓ Thinking State"

# Celebrating state (add stars, sparkles, joy lines)
convert $IMAGES_DIR/idle/empleado-base.png \
  -stroke $CYAN -strokewidth 0 \
  -draw "circle 150,70 150,72" \
  -draw "circle 250,70 250,72" \
  -draw "circle 120,120 120,124" \
  -draw "circle 280,120 280,124" \
  -draw "circle 200,150 200,154" \
  -stroke $WARNING -strokewidth 0 \
  -draw "point 200,80" -draw "point 180,90" -draw "point 220,90" \
  $IMAGES_DIR/celebrating/empleado-celebrating.png

echo "  ✓ Celebrating State"

# ============================================================================
# SUMMARY
# ============================================================================

echo -e "\n✅ Asset generation complete!"
echo ""
echo "Assets created:"
echo "  • 4 mascot states (idle, wave, thinking, celebrating)"
echo "  • 6 role icons (contabilidad, marketing, operaciones, cfo, productividad, ux)"
echo "  • 3 textures (halftone, paper grain, starfield)"
echo "  • 4 thumbnails per state"
echo "  • 2 profile sizes"
echo "  • 1 hero image"
echo ""
echo "Location: $IMAGES_DIR, $TEXTURES_DIR"
echo ""
echo "Usage:"
echo "  • Place these in your public/assets directory"
echo "  • Copy them to your hosting platform"
echo "  • Access them via /images/empleidos/... path"
</content>