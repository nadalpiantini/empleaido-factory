# Conexión empleaido.com ↔ empleaido-factory

## Estado Actual
✅ Landing de empleaido.com replicado en `/empleaido-com`
✅ Logo descargado y agregado
✅ Colores y fuentes configuradas
✅ Diseño idéntico al original

## Opciones de Conexión

### Opción 1: Vercel Redirect (RECOMENDADO) ⭐
**Ventajas:**
- Más rápido y fácil
- Mejor SEO (redirección 301)
- Mantiene empleaido.com en la URL

**Pasos:**
1. Agregar dominio en Vercel: `empleaido.com`
2. Configurar DNS:
   ```
   A @ 76.76.21.21  (Vercel)
   A www 76.76.21.21
   ```
3. En Vercel → Settings → Domains:
   - Agregar `empleaido.com`
   - Agregar `www.empleaido.com`
4. Configurar redirecciones:
   - `empleaido.com` → `empleaido-factory.vercel.app`
   - `www.empleaido.com` → `empleaido-factory.vercel.app`

**Resultado:** Visitar `empleaido.com` muestra el landing de empleaido-factory

---

### Opción 2: Next.js Rewrites (MUY FÁCIL)
**Ventajas:**
- No requiere configuración de DNS
- Múltiples rutas posibles
- Flexibilidad total

**Configuración en `next.config.mjs`:**
```javascript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/empleaido-com',
        destination: '/empleaido-com',
      },
    ]
  },
}
```

**Resultado:**
- `empleaido-factory.vercel.app` → landing factory
- `empleaido-factory.vercel.app/empleaido-com` → landing empleaido.com

---

### Opción 3: Cloudflare Workers (PROXY)
**Ventajas:**
- Mantiene empleaido.com como origen
- Zero downtime
- Cache avanzado

**Configuración:**
```javascript
// cloudflare-worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Si es empleaido.com, usar factory
    if (url.hostname === 'empleaido.com') {
      url.hostname = 'empleaido-factory.vercel.app';
      return fetch(url.toString(), request);
    }

    return fetch(request);
  }
}
```

---

### Opción 4: Subdominio (SIMPLE)
**Ventajas:**
- Fácil de configurar
- Separación clara

**Pasos:**
1. Configurar DNS:
   ```
   CNAME factory  empleaido-factory.vercel.app
   ```
2. Resultado:
   - `empleaido.com` → landing original
   - `factory.empleaido.com` → empleaido-factory

---

## Recomendación 🎯

**Usar Opción 1 (Vercel Redirect)** porque:
1. Es la más simple
2. Mejor para SEO
3. Gratis con Vercel
4. Configuración de 5 minutos

## Pasos para Implementar Opción 1

```bash
# 1. En Vercel Dashboard:
Settings → Domains → Add Domain
- Enter: empleaido.com
- Enter: www.empleaido.com

# 2. Configurar DNS en tu proveedor:
A @ 76.76.21.21
A www 76.76.21.21

# 3. Esperar validación de SSL (automático)

# 4. Configurar redirects en Vercel:
Settings → Domains → empleaido.com → Redirects
From: empleaido.com/*
To: https://empleaido-factory.vercel.app/:s*/
Status: 301 (Permanent)
```

## Testing

```bash
# Test localmente
npm run dev
# Visitar: http://localhost:3000/empleaido-com

# Test en producción (después del deploy)
curl -I https://empleaido.com
# Debe devolver: 301 → empleaido-factory.vercel.app
```

## Estado del Deploy

**Pendiente:**
- [ ] Deployar cambios a Vercel
- [ ] Configurar dominio en Vercel
- [ ] Actualizar DNS
- [ ] Configurar redirects
- [ ] Verificar SSL
- [ ] Test final

## Siguiente Paso

¿Quieres que:
1. **Hagamos deploy ahora** y configuremos la conexión?
2. **Primero terminemos de arreglar** los errores del build?
3. **Veamos otras opciones** de conexión?
