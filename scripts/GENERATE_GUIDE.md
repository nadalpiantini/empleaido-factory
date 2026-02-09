# Asset Generation Guide - EMPLEAIDO FACTORY

## Quick Start (Requires ImageMagick)

This script uses ImageMagick to generate PNG assets automatically.

### Install ImageMagick

**macOS:**
```bash
brew install imagemagick
```

**Ubuntu/Debian:**
```bash
sudo apt-get install imagemagick
```

**Windows:**
Download from: https://imagemagick.org/script/download.php

### Run the Script

```bash
cd /Users/nadalpiantini/Dev/empleaido-factory/app
./scripts/generate-assets.sh
```

The script will generate all assets in `public/images/empleaidos/` and `public/textures/`.

## Alternative: Manual Asset Creation

If ImageMagick doesn't work for you, create these assets manually or use AI tools:

### Step 1: Create Mascot States (4 PNGs)

**Use this prompt in your AI image generator:**

```
"Create a retro 50s pulp sci-fi robot character, 400x400px PNG with transparent background.
Colors: #0E3A41 (shadow), #1A434F (body), #F3E4C8 (light), #5ED3D0 (LED accent).
Style: Carved metal appearance, thick black outlines (2px), no gradients, halftone dot effects.
Expression: [NEUTRAL/WAVE/THINKING/CELEBRATING]"
```

**Save as:**
- `public/images/empleaidos/idle/empleado-base.png`
- `public/images/empleaidos/wave/empleado-wave.png`
- `public/images/empleaidos/thinking/empleado-thinking.png`
- `public/images/empleaidos/celebrating/empleado-celebrating.png`

### Step 2: Create Role Icons (32x32px)

**For each role, generate:**

```
"Retro 50s pulp cartoon icon, 32x32px PNG, transparent background.
Icon: [DOCUMENT/MICROPHONE/FOLDER/DOLLAR/STOPWATCH/BRUSH]
Style: Carved metal, thick black outline (1px), tri-tone colors (#0E3A41, #1A434F, #F3E4C8, #5ED3D0)."
```

**Save to:**
- `public/images/empleaidos/icons/roles/contabilidad.png`
- `public/images/empleaidos/icons/roles/marketing.png`
- `public/images/empleaidos/icons/roles/operaciones.png`
- `public/images/empleaidos/icons/roles/cfo.png`
- `public/images/empleaidos/icons/roles/productividad.png`
- `public/images/empleaidos/icons/roles/ux.png`

### Step 3: Create Textures (512x512px tileable)

**Use these filters/tools:**

**Halftone Pattern:**
```bash
createhalftone.sh 512 512 5 # 5 = dot density
save: public/textures/halftone.png
```

**Paper Grain:**
- Use "Film Grain" or "Noise" filter at 10% opacity
- Save as: `public/textures/paper-grain.png`

**Starfield:**
- Black background (#0E3A41)
- White dots of various sizes (1-3px)
- 50-60 stars spread across 1920x1080
- Save as: `public/textures/starfield-bg.png`

### Step 4: Create Resolutions

**Create thumbnails (100x100px):**
```bash
for state in idle wave thinking celebrating; do
  cp $IMAGES_DIR/${state}/empleado-${state}.png $IMAGES_DIR/thumb/empleado-${state}.png
  resize 100x100
  sharpen
  enhance
  save
```

**Profile sizes:**
- 320x320px: `public/images/empleaidos/profile/empleado-base.png`
- 640x640px: `public/images/empleaidos/profile/empleado-large.png`

### Step 5: Verify Assets

**Run verification script:**
```bash
./scripts/verify-assets.sh
```

**Checklist:**
- [ ] 4 mascot states (idle, wave, thinking, celebrating)
- [ ] 6 role icons (contabilidad, marketing, operaciones, cfo, productividad, ux)
- [ ] 3 textures (halftone, paper grain, starfield)
- [ ] 4 thumbnails per state
- [ ] 2 profile sizes
- [ ] 1 hero image

## Step 4: Online Resources

### Free Texture Libraries
- **Textures.com**: Free halftone patterns
- **CC0 Textures**: Paper grain textures
- **Texturelabs.org**: Starfield backgrounds

### AI Generation Tools
- **Midjourney**: Use "retro 50s pulp sci-fi" in prompt
- **DALL-E 2**: Style reference with tri-tone colors
- **Stable Diffusion**: Use "halftone pattern" + "thick outlines"

### Icon Generators
- **Icones8**: Custom 32x32 icons
- **IconScout**: Pulp sci-fi icon pack
- **FontAwesome**: Custom icon with custom CSS

## Step 5: Integration

### Update Component References

**NavigationBar:**
```javascript
// Update placeholder with actual images
<div className="w-12 h-12 bg-cyan rounded-full">
  <img src="/images/empleaidos/idle/empleado-base.png" alt="Empleado" />
</div>
```

**HeroSection:**
```javascript
// Replace placeholder with hero image
<img src="/images/empleaidos/hero/empleado-hero.png" alt="Empleado Hero" />
```

**EmpleaidoCard:**
```javascript
// Update image references
if (imageUrl) {
  <img src={`/images/empleaidos/profile/${id}.png`} />
} else {
  <span>{getRoleEmoji(role.main)}</span>
}
```

### Test the Integration

```bash
npm run dev
# Navigate to http://localhost:3000
# Verify all images load correctly
# Check responsive breakpoints
# Test hover effects
# Verify glow effects
```

### Build for Production

```bash
npm run build
# Check /out directory for generated assets
# Verify no 404s in build log
# Check size of images (optimize if >100KB each)
```

## Troubleshooting

### Issue: Images not loading
- Check path: `/images/...` vs `/public/images/...`
- Verify dimensions match spec
- Check console for 404 errors
- Ensure PNG format (not WebP)

### Issue: Glow effects not visible
- Check CSS: `box-shadow: 0 0 20px rgba(94, 211, 208, 0.45)`
- Verify `:hover` states
- Check z-index layering
- Ensure parent has `position: relative`

### Issue: Halftone not visible
- Check opacity: 0.05 - 0.20 (5-20%)
- Verify `mix-blend-mode: multiply`
- Check file path to texture PNG
- Ensure background color contrast

## Next Steps

1. **Deploy Assets**: Upload to hosting platform
2. **Optimize**: Compress with tools like TinyPNG
3. **Document**: Add to README.md
4. **Verify**: Test in production environment
5. **Iterate**: Update based on user feedback

## Contact

For questions or support:
- Open issue on GitHub
- Tag: @empleaido-factory
- Email: support@empleaido.io
