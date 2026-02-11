# EMPLEAIDO MASCOT — MASTER PROMPT SYSTEM

## Quick Reference

| Model | Prefix | Notes |
|-------|--------|-------|
| Midjourney v6 | `/imagine prompt:` | Add `--ar 3:2 --s 250 --style raw` |
| SDXL | Direct prompt | CFG 8-12, Steps 30-40 |
| Flux | Direct prompt | Use guidance 3.5-4 |
| DALL-E 3 | Direct prompt | Vivid mode recommended |

---

## MASTER PROMPT v1.0

```
STYLE & ERA
1950s Japanese sci-fi manga × mid-century American pulp comic fusion. Bold black line-art, thick outlines, dynamic diagonal motion lines, explosive star-bursts, exaggerated perspective. Heavy vintage halftone dot shading + subtle aged paper grain. Retro optimism only — never dystopian.

COLOR SYSTEM (STRICT — NO DEVIATION)
Tri-tonal only, flat comic shading (no gradients):
- Shadows: #0E3A41 (deep dark teal-blue)
- Midtones: #1A434F (rich teal)
- Highlights: #F3E4C8 (warm aqua-cream)
- Accent (LED only): #5ED3D0 soft cyan glow
Every surface uses 2–3 tones max with visible screen-tone texture.

CHARACTER — EMPLEAIDO BOT
Chibi robot mascot, 60% head / 40% body, total height ≈ 1.2–1.4 heads.
- Head: rounded-square speech-bubble shape with tiny tail bottom-left
- Face: recessed LED panel (≈5% depth), always smiling
- Eyes: rounded LED dots
- Mouth: simple curved LED line
- Antenna: single, short, topped with glowing cyan sphere
- Body: cylindrical torso, stubby segmented limbs, mitten fists, rounded boots
- Body color: midtone #1A434F
- LED / antenna glow: #5ED3D0

EFFECTS & TEXTURE
- Vintage halftone dots: 4px + 10px, mis-registered 15°
- Paper-grain overlay: 10% Soft Light
- Optional outer glow on LED accents: #5ED3D0, 30px, 55% opacity
- No realistic lighting, no specular — flat comic shading only

MOTION LANGUAGE
Exaggerated diagonal speed-lines, foreshortened limbs, spiral framing, impact bursts with sharp spokes. Energetic, heroic optimism in every pose.

MOOD
Playful heroism, upbeat, inspirational. Nostalgia of Astro Boy / classic Mega Man energy. Clean, friendly, iconic.
```

---

## NEGATIVE PROMPT (Always Include)

```
photo realism, gradients, multicolor palettes, extra hues, text, typography, watermark, emojis, UI overlays, complex HUDs, glitch, cyberpunk neon, dystopian mood, gritty textures, helmets, glass domes, sad expressions, neutral expressions, reflections, chrome, excessive detail, modern sci-fi aesthetics
```

---

## POSE VARIATIONS

### 1. IDLE / STANDING (Default)
```
[MASTER PROMPT]
Empleaido bot standing confidently, slight tilt, one arm raised in friendly wave. Subtle glow from antenna sphere. Clean starfield backdrop with distant ringed planet.
```

### 2. WAVING HELLO
```
[MASTER PROMPT]
Empleaido bot waving enthusiastically, open smile expression, antenna sphere pulsing bright. Dynamic curved motion lines behind raised arm. Welcoming pose.
```

### 3. THINKING / PROCESSING
```
[MASTER PROMPT]
Empleaido bot in thinking pose, one mitten hand touching chin area, focused smile expression. Antenna sphere glowing steadily. Small gear or lightbulb icons floating nearby. Contemplative but positive energy.
```

### 4. WORKING / TYPING
```
[MASTER PROMPT]
Empleaido bot at retro floating console, hands on holographic keyboard, focused smile. Speed lines indicating productivity. Antenna sphere bright. Multiple floating task icons around workspace.
```

### 5. CELEBRATING / SUCCESS
```
[MASTER PROMPT]
Empleaido bot in victory pose, both arms raised, open smile expression, jump with slight lift off ground. Explosive star-burst behind. Confetti-like geometric shapes. Maximum energy and joy.
```

### 6. SUPPORTIVE / ERROR CONTEXT
```
[MASTER PROMPT]
Empleaido bot in reassuring pose, slight forward lean, hands together, warm smile. Soft glow. Calm, supportive energy. No alarm symbols — just gentle presence.
```

---

## SCENE VARIATIONS

### OUTER SPACE OFFICE
```
[MASTER PROMPT]
Setting: "Outer-space office" metaphor. Starfield backdrop, ringed planet in corner, floating asteroids as tasks with icons etched into rocks (clock, envelope, spreadsheet, dollar). Floating hologram panels with retro-space aesthetic.
```

### CONTROL ROOM
```
[MASTER PROMPT]
Setting: Retro mission control room. Banks of rounded CRT monitors, analog dials, toggle switches. Warm lighting from screens. 1950s NASA meets manga aesthetic.
```

### LAUNCHPAD
```
[MASTER PROMPT]
Setting: Rocket launchpad scene. Streamlined retro rocket in background, steam/smoke clouds, dramatic upward perspective. Hero pose in foreground. Dawn/sunset warm light.
```

---

## MIDJOURNEY v6 SYNTAX

```
/imagine prompt: 1950s Japanese sci-fi manga × mid-century American pulp comic fusion, chibi robot mascot called Empleaido, 60% head 40% body ratio, rounded-square speech-bubble head with tail bottom-left, recessed LED face always smiling, single antenna with glowing cyan sphere, cylindrical torso stubby limbs mitten fists rounded boots, tri-tonal flat comic shading only shadows #0E3A41 midtones #1A434F highlights #F3E4C8 accent LED #5ED3D0, vintage halftone dots 4px+10px mis-registered 15 degrees, paper grain overlay, bold black outlines, dynamic diagonal motion lines, retro optimism Astro Boy Mega Man energy, [POSE], [SETTING] --ar 3:2 --s 250 --style raw --no photo realism gradients multicolor text watermark emoji glitch cyberpunk dystopian sad neutral chrome modern
```

---

## SDXL / FLUX SYNTAX

```
(masterpiece, best quality:1.2), 1950s Japanese sci-fi manga style, mid-century American pulp comic fusion, chibi robot mascot, (60 percent head 40 percent body:1.3), rounded-square speech-bubble head with small tail bottom-left, recessed LED face panel, (always smiling positive expression:1.4), rounded LED dot eyes, simple curved LED mouth, single short antenna topped with (glowing cyan sphere #5ED3D0:1.2), cylindrical torso, stubby segmented limbs, mitten fists, rounded boots, body color #1A434F, (tri-tonal flat comic shading:1.3), shadows #0E3A41, midtones #1A434F, highlights #F3E4C8, (vintage halftone dots:1.2), paper grain texture, bold black outlines, (retro optimism:1.2), Astro Boy aesthetic, Mega Man energy, [POSE], [SETTING]

Negative prompt: photo, realism, 3d render, gradients, multicolor, rainbow, text, typography, watermark, emoji, UI, HUD, glitch, cyberpunk, neon, dystopian, gritty, helmet, glass dome, sad, neutral, frown, reflections, chrome, excessive detail, modern sci-fi, anime, realistic lighting
```

---

## CAMPAIGN TEMPLATES

### ONBOARDING SERIES
1. Wave hello → "Welcome!"
2. Thinking → "Let me figure this out..."
3. Working → "On it!"
4. Celebrating → "Done!"

### ERROR/SUPPORT SERIES
1. Supportive → "Something went wrong, but I'm here"
2. Thinking → "Let me check..."
3. Working → "Fixing now..."
4. Celebrating → "All good!"

### DASHBOARD STATES
| State | Pose | Expression |
|-------|------|------------|
| Idle | Standing | Standard smile |
| Loading | Thinking | Focused smile |
| Processing | Working | Focused smile |
| Success | Celebrating | Open smile |
| Error | Supportive | Warm smile |

---

## QUALITY CHECKLIST

Before accepting generated image:

- [ ] Tri-tonal palette only (no extra colors)
- [ ] Halftone visible
- [ ] Speech-bubble head shape
- [ ] Antenna with cyan glow
- [ ] Positive expression
- [ ] No text/watermarks
- [ ] Retro aesthetic (not modern)
- [ ] Clean black outlines
