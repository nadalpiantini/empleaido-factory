# Especificaciones de Assets Visuales - EMPLEAIDO FACTORY

## Personaje Empleaido - 4 Estados (Style: 50s Pulp Sci-Fi)

### Estado 1: **IDLE**
- **Dimensión**: 400x400px (cuadrado)
- **Estilo**: Posición neutral, sonrisa estándar
- **Colores**: Tri-tonal palette (#0E3A41, #1A434F, #F3E4C8, #5ED3D0)
- **Bordes**: Negro grueso visible (2px outline)
- **Fondo**: Transparente
- **Expresión**: Calm, professional, confident
- **Postura**: Standing straight, arms at sides

### Estado 2: **WAVE**
- **Dimensión**: 400x400px (cuadrado)
- **Estilo**: Mano levantada saludando
- **Colores**: Tri-tonal palette (#0E3A41, #1A434F, #F3E4C8, #5ED3D0)
- **Bordes**: Negro grueso visible (2px outline)
- **Fondo**: Transparente
- **Expresión**: Friendly, welcoming
- **Postura**: One arm raised in greeting

### Estado 3: **THINKING**
- **Dimensión**: 400x400px (cuadrado)
- **Estilo**: Mano en barbilla, thinking pose
- **Colores**: Tri-tonal palette (#0E3A41, #1A434F, #F3E4C8, #5ED3D0)
- **Bordes**: Negro grueso visible (2px outline)
- **Fondo**: Transparente
- **Expresión**: Contemplative, processing
- **Postura**: Hand on chin, eyes looking up/right
- **Efectos**: Motion lines radiating from head

### Estado 4: **CELEBRATING**
- **Dimensión**: 400x400px (cuadrado)
- **Estilo**: Manos levantadas, celebrando
- **Colores**: Tri-tonal palette (#0E3A41, #1A434F, #F3E4C8, #5ED3D0)
- **Bordes**: Negro grueso visible (2px outline)
- **Fondo**: Transparente
- **Expresión**: Joyful, triumphant
- **Postura**: Arms raised, stars/sparkles around

## Íconos Grabados - Roles de Empleaidos (32x32px)

### Contabilidad RD 🧾
- Estilo: Icono grabado en metal
- Forma: Documento con líneas
- Efectos: Rayas de movimiento
- Bordes: Negros gruesos

### Growth Marketing 📣
- Estilo: Icono grabado en metal
- Forma: Megáfono con ondas
- Efectos: Brillo en el borde superior
- Bordes: Negros gruesos

### Operaciones 🗂️
- Estilo: Icono grabado en metal
- Forma: Carpeta organizada
- Efectos: Halftone en el centro
- Bordes: Negros gruesos

### CFO Estrategico 💰
- Estilo: Icono grabado en metal
- Forma: Moneda con símbolo $
- Efectos: Brillo metálico en el borde
- Bordes: Negros gruesos

### Productividad Personal ⏱️
- Estilo: Icono grabado en metal
- Forma: Reloj con engranajes
- Efectos: Motion blur en las manecillas
- Bordes: Negros gruesos

### UX Design 🎨
- Estilo: Icono grabado en metal
- Forma: Pincel con paleta
- Efectos: Paint splatter en los bordes
- Bordes: Negros gruesos

## Texturas (Tileable)

### Halftone Pattern (512x512px tileable)
- **Patrón**: Puntos circulares en grid
- **Color**: Negro puro sobre transparente
- **Densidad**: 4px grid (4px space entre puntos)
- **Uso**: Overlay en cards, backgrounds

### Paper Grain (512x512px tileable)
- **Estilo**: Texture de papel viejo
- **Opacidad**: 10-12% overlay
- **Color**: Blanco/dorado vintage
- **Efecto**: Film grain, vintage paper feel

### Starfield Background (1920x1080px)
- **Estrellas**: Puntos blancos varios tamaños
- **Densidad**: 50-60 estrellas
- **Categorías**:
  - Estrellas pequeñas (1px) - 60%
  - Estrellas medianas (2px) - 30%
  - Estrellas grandes (3px) - 10%
- **Background**: #0E3A41 sólido

## Mockups Visuales

### 1. Hero Section Mockup
- **Dimensión**: 1920x1080px
- **Layout**: 16:9 ratio
- **Fondo**: Starfield + paper grain
- **Mascot**: Empleado idle grande (left 40%)
- **Copy**: Panel derecho (right 60%)
- **Decoración**: Sparkles, glow effects
- **Tipografía**: Bebas Neue 48px, 28px

### 2. Catalog Grid Mockup
- **Dimensión**: 1920x1080px
- **Grid**: 3 columnas, 2+ filas
- **Cards**: Each 400x600px with halftone
- **Badge**: DELUXE starburst visible
- **Borders**: 4px black outline
- **Background**: #1A434F with halftone overlay

### 3. Profile Page Mockup
- **Dimensión**: 1920x1080px
- **Layout**: 3:2 ratio
- **Left**: Empleado thinking (640px width)
- **Right**: Profile panel (1280px width)
- **Tabs**: 4 tabs (Skills, Evolución, etc.)
- **Borders**: 2px shadows, 4px dividers

### 4. Value Props Mockup
- **Dimensión**: 1920x1080px
- **Grid**: 3 columnas
- **Cards**: Rotated slightly (-2°, 0°, +2°)
- **Icons**: Grabbados en metal (80x80px)
- **Background**: #1A434F sólido
- **Decoración**: Zigzag border top

## Paleta de Colores Exacta

### Tri-Tonal Base (Nunca Romper)
- **Sombra**: #0E3A41 (backgrounds, shadows)
- **Medio**: #1A434F (cards, panels, navigation)
- **Luz**: #F3E4C8 (texto principal, botones)

### Accent Tecnológico
- **LED Cyan**: #5ED3D0 (hover states, glows, accents)
- **LED Cyan Dim**: rgba(94, 211, 208, 0.15)
- **LED Cyan Glow**: rgba(94, 211, 208, 0.45)

### Estados de UI
- **Success**: #4ADE80 (verde tech)
- **Warning**: #FBBF24 (ámbar)
- **Error**: #F87171 (rojo tech)

## Specs de Textura

### Paper Grain Overlay
- **Opacity**: 0.08 - 0.12 (8-12%)
- **Blend Mode**: Overlay o Multiply
- **Size**: Fixed, no repeat

### Halftone Pattern
- **Opacity**: 0.05 - 0.20 (5-20%)
- **Blend Mode**: Multiply
- **Tile**: Repeat if necesario

### Starfield Background
- **Opacity**: 1.0 (100%)
- **Blend Mode**: Normal
- **Position**: Fixed (no scroll parallax)

## Diseño de UI Elements

### Cards
- **Border**: 4px black outline
- **Shadow**: 6px 6px 0 #0E3A41
- **Radius**: 0 (cuadrados perfectos)
- **Hover**: Glow cyan (0 0 20px rgba(94, 211, 208, 0.45))

### Buttons
- **Border**: 4px black outline
- **Padding**: md (16px) vertical, lg (24px) horizontal
- **Hover**: Border cambia a cyan (#5ED3D0)
- **Glow**: 0 0 20px cyan (opcional)

### Typography System

#### Display (Bebas Neue)
- **Mega**: 48px / 1.2 line-height
- **Huge**: 36px / 1.2 line-height
- **Large**: 28px / 1.2 line-height
- **Medium**: 20px / 1.2 line-height

#### Body (IBM Plex Sans)
- **XLarge**: 16px / 1.5 line-height
- **Large**: 14px / 1.5 line-height
- **Medium**: 12px / 1.5 line-height

### Animation Specs

#### LED Pulse
```css
animation: led-pulse 2s ease-in-out infinite;
@keyframes led-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

#### Glow Hover
```css
transition: box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
box-shadow: 0 0 20px rgba(94, 211, 208, 0.45);
```

## Export Specifications

### PNG Assets
- **Format**: PNG-24 (true color with transparency)
- **Resolution**: 400x400px (personajes), 32x32px (íconos)
- **Background**: Transparente
- **Color Profile**: sRGB

### SVG Assets
- **Format**: SVG 1.1
- **Optimization**: Sin optimización para edición
- **Styling**: Inline CSS (no classes externas)
- **Color**: CurrentColor para tematización

### Texture Files
- **Format**: PNG-24 (tileable)
- **Compression**: Sin compresión
- **Color**: Grayscale para overlay
- **Blend Mode**: Compatible con CSS mix-blend-mode

This spec document provides complete visual guidelines for implementing the EMPLEAIDO FACTORY design system.
</file_path>