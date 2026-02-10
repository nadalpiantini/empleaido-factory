# Mini (m2) Setup Instructions

**Para instalar el sistema de sync en tu MacBook Air (mini/m2)**

## 📋 Pasos de Instalación

### 1. Actualizar el repo
```bash
cd /users/nadalpiantini/dev/empleaido-factory/app
git pull origin feature/dashboard-virtual-office
```

### 2. Ejecutar el instalador
```bash
.sync/install.sh
```

### 3. Verificar la instalación
```bash
# Ver que el alias funciona
which sync

# Probar el sync
.sync/sync.sh
```

### 4. Agregar aliases a tu zshrc (opcional pero recomendado)

Si quieres los aliases de sync (comandos cortos), agrega esto a tu `~/.zshrc`:

```bash
# ---- Empleaido Factory Sync --------------------------------------
if [ -f ~/.zshrc.empleaido-sync ]; then
  source ~/.zshrc.empleaido-sync
fi
```

Luego crea el archivo `~/.zshrc.empleaido-sync`:

```bash
# Empleaido Factory Sync Aliases
alias sync='cd /users/nadalpiantini/dev/empleaido-factory/app && .sync/sync.sh'
alias sync-status='cd /users/nadalpiantini/dev/empleaido-factory/app && git status'
alias sync-log='cd /users/nadalpiantini/dev/empleaido-factory/app && git log --oneline -5'
```

Recarga tu zshrc:
```bash
source ~/.zshrc
```

## ✅ Verificación

Después de instalar, verifica que todo funciona:

```bash
# Debería mostrar el sync completado
.sync/sync.sh
```

Output esperado:
```
🔄 Empleaido Factory Sync
================================

🖥️  Current server: MacBook-Air.local
🌿 Current branch: feature/dashboard-virtual-office
✅ Working tree clean

📥 Fetching from origin...
✅ Already up to date with origin

📊 Current status:
## feature/dashboard-virtual-office...origin/feature/dashboard-virtual-office

✨ Sync complete!
Both sephirot (m1) and mini (m2) are now in sync
```

## 🎯 Uso Diario

### Antes de empezar a trabajar
```bash
cd /users/nadalpiantini/dev/empleaido-factory/app
.sync/sync.sh
```

### Después de terminar de trabajar
```bash
git add .
git commit -m "tu mensaje"
.sync/sync.sh
```

### Con aliases (si los configuraste)
```bash
sync  # Hace sync automáticamente
```

## 🔧 Troubleshooting

### "Not in git repository"
```bash
# Estás en el directorio equivocado
cd /users/nadalpiantini/dev/empleaido-factory/app
.sync/sync.sh
```

### "You have uncommitted changes"
```bash
# Tienes cambios sin commitear
git status
git add .
git commit -m "tu mensaje"
.sync/sync.sh
```

### Hook no funciona
```bash
# Reinstalar hooks
.sync/install.sh
```

---

**Estado actual:**
- ✅ sephirot (m1): Instalado y funcionando
- ⏳ mini (m2): Pendiente de instalación

**Fecha:** 2026-02-10
