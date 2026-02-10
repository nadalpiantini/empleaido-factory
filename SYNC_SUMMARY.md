# ✅ Sync System - Resumen de Instalación

## 🎯 Lo que se ha creado

Sistema automático de sincronización entre **sephirot (m1)** y **mini (m2)** que nunca más te dará problemas de merge.

## 📂 Archivos Creados

### Scripts principales
- `.sync/sync.sh` - Script principal de sync (funciona en ambos servidores)
- `.sync/install.sh` - Instalador automático
- `.sync/pre-push` - Hook git que previene conflictos de push
- `.sync/post-merge` - Hook git que notifica después de merge

### Documentación
- `SYNC.md` - Documentación completa del sistema
- `.sync/README.md` - Documentación del directorio .sync
- `.sync/MINI_SETUP.md` - Instrucciones de instalación para mini (m2)

### Configuración
- `~/.zshrc.empleaido-sync` - Aliases para sync (solo en sephirot por ahora)
- `~/.zshrc` - Actualizado para cargar aliases de sync

## ✨ Características

### 🚀 One-command sync
```bash
.sync/sync.sh
```

Hace todo automáticamente:
- Detecta en qué servidor estás
- Verifica si hay cambios pendientes
- Fetch de origin
- Pull o push según lo que necesites
- Auto-merge si hay divergencias
- Muestra estado claro

### 🛡️ Protección automática
- **pre-push hook**: Hace pull automático antes de push si estás behind
- **Working tree check**: No deja sync si tienes cambios sin commitear
- **Auto-merge**: Fusiona branches divergidos automáticamente

### 🎨 Colores claros
- 🟢 Verde = Bien
- 🔴 Rojo = Error (necesita acción)
- 🟡 Amarillo = Advertencia
- 🔵 Azul = Info

## 📊 Estado Actual

### sephirot (m1) - Mac mini/servidor
- ✅ Instalado
- ✅ Hooks funcionando
- ✅ Aliases configurados
- ✅ Probado y validado

### mini (m2) - MacBook Air
- ⏳ Pendiente de instalación
- 📋 Ver instrucciones en `.sync/MINI_SETUP.md`

## 🎯 Uso Recomendado

### Flujo de trabajo diario

#### En mini (m2) - Tu MacBook Air
```bash
# 1. Antes de empezar a trabajar
cd /users/nadalpiantini/dev/empleaido-factory/app
.sync/sync.sh

# 2. Trabajas normalmente
vim some-file.ts
git add .
git commit -m "feat: add feature"

# 3. Después de terminar
.sync/sync.sh
# Esto hace push a origin automáticamente
```

#### En sephirot (m1) - El servidor
```bash
# 1. Traer cambios de mini
sync  # O .sync/sync.sh

# 2. Trabajas
vim other-file.ts
git add .
git commit -m "fix: bug"

# 3. Subir cambios
sync
# Esto hace push a origin automáticamente
```

### Situaciones comunes

#### Ambos servidores modificaron (¡Sin conflictos!)
```bash
# En mini (m2)
.sync/sync.sh
# Output: "Local and remote have diverged... Pulling... ✅"
# Automatically merges and pushes!
```

#### Working tree sucio
```bash
.sync/sync.sh
# Output: "⚠️ You have uncommitted changes!"
# Output: "Please commit or stash them first"

# Solución:
git add .
git commit -m "your message"
.sync/sync.sh
```

## 🔧 Comandos útiles

### Con aliases (sephirot/m1)
```bash
sync          # Sync completo
sync-status   # git status
sync-log      # git log --oneline -5
sync-doc      # Ver documentación
sync-install  # Reinstalar sistema
```

### Sin aliases (mini/m2)
```bash
cd /users/nadalpiantini/dev/empleaido-factory/app
.sync/sync.sh           # Sync
git status              # Status
git log --oneline -5    # Log
cat SYNC.md             # Documentación
```

## 🎓 Conceptos clave

### ¿Cómo funciona?

1. **Auto-detección**: El script sabe si estás en sephirot o mini
2. **Working tree check**: Solo opera si no tienes cambios pendientes
3. **Smart pull/push**:
   - Si local == origin: No hace nada (ya sincronizado)
   - Si local behind origin: Hace pull
   - Si local ahead of origin: Hace push
   - Si divergieron: Hace pull → merge → push

### Git hooks

**pre-push**: Se ejecuta antes de cada push
- Detecta si estás behind
- Hace pull automático si es necesario
- Previene conflictos

**post-merge**: Se ejecuta después de pull/merge
- Muestra resumen de cambios
- Recuerda sync con el otro servidor

## 🚨 Problemas resueltos

### ❌ Antes (sync manual)
```bash
# Confusión constante
git status
git pull
git push
# "Wait, en qué servidor estoy?"
# "¿Tengo que commitear primero?"
# "¿Por qué hay conflictos?"
```

### ✅ Ahora (sync automático)
```bash
.sync/sync.sh
# Un comando, sin pensar, todo automático
```

## 📝 Próximos pasos

1. **En mini (m2)**: Instala el sistema siguiendo `.sync/MINI_SETUP.md`
2. **Prueba**: Haz cambios en mini, sync, verifica en sephirot
3. **Hábito**: Usa sync antes/después de cada sesión de trabajo
4. **Olvida los problemas**: Nunca más tendrás sync hell

## 🎉 Resultado

**Sync simple, rápido, sin errores:**
- ✅ Un comando (`.sync/sync.sh`)
- ✅ Funciona en ambos servidores
- ✅ Auto-merge incluido
- ✅ Protección contra errores
- ✅ Colors y mensajes claros
- ✅ Nunca más confusión

---

**Creado:** 2026-02-10
**Objetivo:** Eliminar sync headaches para siempre
**Status:** ✅ Activo en sephirot, pendiente instalación en mini
