# Backstage UI Notes

## Overview

The Backstage is the **admin interface (Factory)** where Empleaidos are created, edited, and managed.

## Screens

### 1. Fabrica - Listado

**Purpose**: Dashboard view of all Empleaidos

**Elements**:
- Button: `+ Crear Empleaido`
- Grid of cards (3 columns on desktop)
- Filters: Rol / Tier / Estado

**Card Layout**:
```
┌──────────────────────────┐
│  SERA · #04094           │
│  Contabilidad RD         │
│  Tier: Deluxe            │
│  Estado: 🟢 Activo       │
│  Sephirah: Netzach       │
│  Nivel: 1 · XP: 0        │
│                          │
│  [ Editar ] [ Preview ]  │
└──────────────────────────┘
```

### 2. Crear / Editar Empleaido

**Purpose**: Form to define all Empleaido attributes

**Sections**:

#### Identidad
- Nombre de llamado (text)
- ID (auto, readonly)
- Estado inicial (dropdown)

#### Arquitectura Mental
- Sephirah dominante (dropdown)
- Sephirot secundarias (multi-select, max 2)

#### Rol Comercial
- Rol principal (text)
- Subrol / audiencia (text)
- Tier (radio: Base / Pro / Deluxe)

#### Genetica de Skills
- Skills nativos (checkboxes by domain)
- Skills bloqueados (checkboxes, grayed)

#### Rasgo Visual
- Accesorio (dropdown: none, headband, moustache, badge, glasses, earring)
- Color accent (color picker)

#### Pricing
- Precio mensual USD (number)
- Precio anual USD (number, optional)

#### Identidad Narrativa
- Motivacion (textarea)
- Limites (tags)
- Rechazos de seguridad (tags)

#### Debug Panel
- JSON preview (collapsible)

### 3. Preview Tienda

**Purpose**: See exactly what the customer sees

**Layout**:
```
┌─────────────────────────────────────┐
│  SERA · EMPLEAIDO #04094            │
│  Contabilidad RD — Deluxe           │
│                                     │
│  "Te cuida del fisco aunque         │
│   tu te olvides."                   │
│                                     │
│  ✔ Incluye:                         │
│  - OCR Facturas                     │
│  - ITBIS Mensual                    │
│  - Clasificacion NCF                │
│  - Alertas DGII                     │
│                                     │
│  🔒 Desbloqueable:                  │
│  - Planeacion Fiscal                │
│  - ISR Anual                        │
│                                     │
│  Precio: $49.99 / mes               │
│                                     │
│  [ Adoptar Empleaido ]              │
└─────────────────────────────────────┘
```

## Technical Notes

- Framework: Next.js 15 + TypeScript + Tailwind
- State: React useState (local JSON for v1)
- API: `/api/catalog` for read, `/api/catalog/write` for persist
- No auth in v1 (add Supabase Auth later)

## UX Principles

1. **Creador siente poder**: Not filling forms, creating entities
2. **Todo visible**: No hidden states, JSON debug always available
3. **Cambios inmediatos**: Edit → Save → See result
4. **Preview = Reality**: What you see in Preview is what customer gets
