# 🌳 SEPHIROT - Proceso de Instalación con OpenClaw + WhatsApp (Twilio)

**Fecha**: 2026-02-08
**Objetivo**: Dar vida a SEPHIROT como un agente OpenClaw con WhatsApp

---

## 📋 TABLA DE CONTENIDOS

1. [¿Qué es SEPHIROT?](#qué-es-sephirot)
2. [Arquitectura del Sistema](#arquitectura)
3. [Proceso de Instalación](#proceso-de-instalación)
4. [Configuración de WhatsApp con Twilio](#configuración-whatsapp-twilio)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🔮 ¿QUÉ ES SEPHIROT?

### Respuesta: **ES UN AGENTE OPENCLAW**

```
┌─────────────────────────────────────────────────────────────┐
│                    SEPHIROT                                 │
│  (Sistema Integrado OpenClaw + Sefirotic Orchestrator)     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  OpenClaw Agent Framework                           │  │
│  │  - Workspace: ~/.openclaw/workspace-sephirot/       │  │
│  │  - Model: Claude Opus 4.5 (zai/claude-opus-4-5)    │  │
│  │  - Channels: WhatsApp (Twilio)                      │  │
│  │  - Skills: Sefirotic Orchestrator v0.3.0            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Sefirotic Orchestrator (Decision Engine)           │  │
│  │  - 10 Sefirot como routing system                   │  │
│  │  - Complexity scoring                               │  │
│  │  - Paths: Fast, Graph, Abort, Consultation          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### NO ES:
- ❌ Un subagent (es un agent completo)
- ❌ Un workspace (es un agent CON workspace)
- ❌ Un skill (USA skills, incluyendo sefirotic-orchestrator)
- ❌ Un bot de Telegram (es un gateway multi-canal)

### SÍ ES:
- ✅ Un **agente OpenClaw** aislado con su propio workspace
- ✅ Integración **OpenClaw + Sefirotic Orchestrator**
- ✅ Sistema de **decisión Sefirótico** para routing de mensajes
- ✅ **Multi-canal**: WhatsApp (Twilio), Telegram, Discord, etc.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OPENCLAW GATEWAY                             │
│                     (ws://127.0.0.1:18789)                         │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  SEPHIROT    │        │   SERA       │        │   OTROS      │
│  (Agent)     │        │  (Empleaido) │        │   Agents     │
├──────────────┤        ├──────────────┤        ├──────────────┤
│ Workspace:   │        │ Workspace:   │        │ Workspace:   │
│ ~/.openclaw/ │        │ ~/.openclaw/ │        │ ~/.openclaw/ │
│ workspace-   │        │ workspace-   │        │ workspace-   │
│ sephirot/    │        │ empleaido-   │        │ ...          │
│              │        │ sera/        │        │              │
│ Skills:      │        │ Skills:      │        │ Skills:      │
│ - sefirotic- │        │ - contabilidad│       │ - varios     │
│   orchestrat.│        │ - facturacion│       │              │
│              │        │              │        │              │
│ Channels:    │        │ Channels:    │        │ Channels:    │
│ - WhatsApp   │        │ - WhatsApp   │        │ - Telegram   │
│   (Twilio)   │        │              │        │ - Discord    │
└──────────────┘        └──────────────┘        └──────────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  OPENCLAW CONFIG     │
                    │  ~/.openclaw/        │
                    │  openclaw.json       │
                    └──────────────────────┘
```

---

## 🚀 PROCESO DE INSTALACIÓN

### PASO 0: REQUISITOS

```bash
# Verificar que OpenClaw está instalado
openclaw --version
# Expected: 🦞 OpenClaw 2026.2.1

# Verificar configuración actual
openclaw config list
```

---

### PASO 1: CREAR EL AGENTE SEPHIROT

```bash
# Opción A: Wizard interactivo (RECOMENDADO)
openclaw agents add sephirot

# Opción B: No interactivo (para scripting)
openclaw agents add sephirot \
  --workspace ~/.openclaw/workspace-sephirot \
  --model zai/claude-opus-4-5 \
  --bind whatsapp:twilio \
  --non-interactive
```

**¿Qué hace este comando?**
```
1. Crea el workspace: ~/.openclaw/workspace-sephirot/
2. Genera archivos base:
   ├── IDENTITY.md          # Identidad del agente
   ├── SOUL.md              # Comportamiento Sefirótico
   ├── TOOLS.md             # Habilidades disponibles
   ├── USER.md              # Usuario actual
   ├── MEMORY.md            # Memoria persistente
   └── memory/              # Carpeta de memoria
3. Registra en ~/.openclaw/openclaw.json
4. Configura el modelo (Claude Opus 4.5)
5. Vincula canal WhatsApp
```

---

### PASO 2: CONFIGURAR IDENTIDAD SEPHIROT

```bash
# Editar identidad del agente
openclaw agents set-identity sephirot

# O editar manualmente el archivo
vim ~/.openclaw/workspace-sephirot/IDENTITY.md
```

**Contenido de IDENTITY.md:**

```markdown
# SEPHIROT 🌳

## Identity
- **Name**: SEPHIROT
- **Serial**: #0001
- **Role**: Decision Engine & Agent Router
- **Tier**: delux

## Sefirotic Profile
- **Primary Sephirah**: Tiferet (Balance & Harmony)
- **Secondary**: Keter, Malkuth, Yesod
- **Tone**: Balanced, analytical, decisive

## Motivation
> "I am the integration of OpenClaw and Sefirotic Orchestrator.
>  I route tasks through the 10 Sefirot with perfect balance."

## Capabilities
✅ All 10 Sefirot active
✅ Full decision engine
✅ Multi-channel routing
✅ Agent spawning & management
```

---

### PASO 3: INSTALAR SKILL SEFIROTIC-ORCHESTRATOR

```bash
# El skill ya existe en:
~/Dev/openclaw-skills/skills/nadalpiantini/sefirotic-orchestrator/

# Copiar al workspace de SEPHIROT
cp -r ~/Dev/openclaw-skills/skills/nadalpiantini/sefirotic-orchestrator \
   ~/.openclaw/workspace-sephirot/skills/

# O usar OpenClaw skills system
openclaw skills install sefirotic-orchestrator \
  --from ~/Dev/openclaw-skills/skills/nadalpiantini/sefirotic-orchestrator/
```

---

## 📱 CONFIGURACIÓN WHATSAPP CON TWILIO

### TU CONFIGURACIÓN ACTUAL (TWILIO)

```
Phone Number: (912) 733-4768
Account: My first Twilio account

Estado actual:
- ✅ Número activo
- ⚠️ A2P 10DL registration required (US messaging)
- ⚠️ Emergency address not registered (potential $75 charge)
```

---

### PASO 4: CONFIGURAR WEBHOOK TWILIO → OPENCLAW

#### 4.1 OBTENER WEBHOOK URL DE OPENCLAW

```bash
# Iniciar el gateway OpenClaw
openclaw gateway

# Output incluirá:
# OpenClaw Gateway running on ws://127.0.0.1:18789
# HTTP webhook server: http://localhost:18789/webhook
```

**Si usas ngrok para exponer localmente:**

```bash
# Instalar ngrok (si no lo tienes)
brew install ngrok

# Iniciar ngrok tunnel
ngrok http 18789

# Output:
# Forwarding: https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:18789
```

#### 4.2 CONFIGURAR TWILIO MESSAGING WEBHOOK

**Opción A: Vía consola Twilio**

1. Ve a: https://console.twilio.com/us1/devices/phone-numbers/active
2. Selecciona tu número: (912) 733-4768
3. Scroll a "Messaging Configuration"
4. Configura:

```
┌─────────────────────────────────────────────────────────┐
│ A message comes in                                     │
│                                                         │
│ Configure with: [📋] Webhook                           │
│                                                         │
│ Webhook                                                 │
│ URL: [https://xxxx.ngrok-free.app/webhook/twilio]     │
│                                                         │
│ HTTP POST ✓                                             │
│                                                         │
│ Primary handler fails                                  │
│ Webhook                                                 │
│ URL: [https://backup-url.com/webhook]                  │
│                                                         │
│ [Save configuration]                                   │
└─────────────────────────────────────────────────────────┘
```

**Opción B: Vía API Twilio**

```bash
# Instalar Twilio CLI
brew install twilio

# Login
twilio login

# Configurar webhook
twilio phone-numbers:update $(912) 733-4768 \
  --sms-url "https://xxxx.ngrok-free.app/webhook/twilio" \
  --sms-method POST
```

---

### PASO 5: CONFIGURAR OPENCLAW PARA TWILIO

#### 5.1 AGREGAR CREDENCIALES TWILIO

```bash
# Usar el wizard de configuración
openclaw config set

# O editar manualmente
vim ~/.openclaw/openclaw.json
```

**Agregar credenciales Twilio:**

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "provider": "twilio",
      "twilio": {
        "accountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "authToken": "your_auth_token_here",
        "phoneNumber": "+19127334768",
        "webhookUrl": "https://xxxx.ngrok-free.app/webhook/twilio"
      },
      "dmPolicy": "allowlist",
      "allowFrom": ["+18095551234"],  // Tu número para testing
      "sendReadReceipts": true,
      "mediaMaxMb": 50,
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  },
  "agents": [
    {
      "id": "sephirot",
      "name": "SEPHIROT",
      "workspace": "~/.openclaw/workspace-sephirot",
      "model": "zai/claude-opus-4-5",
      "bindings": [
        {
          "channel": "whatsapp",
          "accountId": "twilio"
        }
      ]
    }
  ]
}
```

#### 4.3 INICIAR SESIÓN WHATSAPP

```bash
# Iniciar el gateway
openclaw gateway

# En otra terminal, verificar status
openclaw channels status

# Deberías ver:
# ✓ whatsapp (twilio): Connected
```

---

## ✅ TESTING DEL SISTEMA

### TEST 1: ENVÍO DE MENSAJE

```bash
# Enviar mensaje de prueba
openclaw message send \
  --channel whatsapp \
  --target +18095551234 \
  --message "🌳 SEPHIROT está vivo. ¿En qué puedo ayudarte?"

# O usar el agent directamente
openclaw agent \
  --to sephirot \
  --message "Presentación del sistema SEPHIROT" \
  --deliver
```

### TEST 2: RECIBIR MENSAJES

```
1. Enviar WhatsApp al número (912) 733-4768
2. El mensaje llega a Twilio
3. Twilio hace POST al webhook de OpenClaw
4. OpenClaw enruta al agente SEPHIROT
5. SEPHIROT procesa con Sefirotic Orchestrator
6. Responde vía WhatsApp
```

### TEST 3: SEFIROTIC ORCHESTRATOR

```
Mensaje de prueba: "Analiza las implicaciones de implementar SEPHIROT en empleaido-factory"

SEPHIROT debe:
1. Clasificar intento (KETER): "Análisis de arquitectura"
2. Expander opciones (CHOKMAH): "3 enfoques posibles..."
3. Analizar restricciones (BINAH): "Requiere refactorización de spawn.ts"
4. Evaluar recursos (CHESSED): "Skills existentes: sefirotic-orchestrator"
5. Balancear decisión (TIFERET): "Recomendación híbrida"
6. Actuar proactivamente (NETZACH): "Puedo implementarlo ahora"
7. Estructurar respuesta (HOD): "Plan por fases:"
8. Recordar para futuro (YESOD): Guarda preferencias
9. Entregar resultado (MALKUTH): [Envía respuesta detallada]
```

---

## 🎯 BEST PRACTICES

### 1. **PERFIL DE CARGA**
```
Order: Config → Gateway → Test

1️⃣ Configurar primero (openclaw.json)
2️⃣ Iniciar gateway después
3️⃣ Testear comunicación
```

### 2. **SEGURIDAD**
```bash
# Nunca commitear credenciales
echo "~/.openclaw/openclaw.json" >> .gitignore

# Usar variables de entorno
export TWILIO_ACCOUNT_SID="ACxxx"
export TWILIO_AUTH_TOKEN="xxx"
```

### 3. **MONITOREO**
```bash
# Logs del gateway
openclaw logs --tail --follow

# Status de canales
openclaw channels status --deep

# Health check
openclaw health
```

### 4. **DEBUGGING**
```bash
# Modo verbose
openclaw gateway --verbose

# Ver errores recientes
openclaw logs --errors

# Test de webhook
curl -X POST https://xxxx.ngrok-free.app/webhook/twilio \
  -d "From=+18095551234" \
  -d "Body=Test message"
```

---

## 🛠️ TROUBLESHOOTING

### ERROR: "Webhook not receiving messages"

**Causa**: Webhook URL no es accesible públicamente

**Solución**:
```bash
# Verificar ngrok está corriendo
ngrok http 18789

# Verificar firewall
sudo lsof -i :18789

# Test webhook
curl https://xxxx.ngrok-free.app/webhook/twilio
```

---

### ERROR: "Twilio authentication failed"

**Causa**: Credenciales incorrectas en openclaw.json

**Solución**:
```bash
# Verificar credenciales Twilio
twilio accounts:show

# Re-configurar OpenClaw
openclaw config set channels.whatsapp.twilio.accountSid
```

---

### ERROR: "Agent not responding"

**Causa**: Gateway no corriendo o agent no configurado

**Solución**:
```bash
# Verificar gateway activo
openclaw health

# Reiniciar gateway
openclaw gateway --force

# Verificar agent existe
openclaw agents list
```

---

## 📊 DIAGRAMA DE FLUJO COMPLETO

```
┌─────────────┐
│ USUARIO     │
│ WhatsApp    │
└──────┬──────┘
       │ SMS/WA
       ▼
┌─────────────┐
│ TWILIO      │
│ (912)733-4768│
└──────┬──────┘
       │ HTTP POST
       │ Webhook
       ▼
┌─────────────────────────────────────┐
│ NGROK TUNNEL                       │
│ https://xxxx.ngrok-free.app        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ OPENCLAW GATEWAY                    │
│ ws://127.0.0.1:18789               │
│ Port 18789 (HTTP webhook server)   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ ROUTER → AGENT SEPHIROT            │
│ ~/.openclaw/workspace-sephirot/    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ SEFIROTIC ORCHESTRATOR v0.3.0      │
│ - KETER: Clasificar intento        │
│ - CHOKMAH: Expandir opciones       │
│ - BINAH: Analizar restricciones    │
│ - CHESSED: Evaluar recursos        │
│ - TIFERET: Balancear decisión      │
│ - NETZACH: Actuar proactivamente   │
│ - HOD: Estructurar respuesta       │
│ - YESOD: Recordar aprendizaje      │
│ - MALKUTH: Entregar resultado      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ RESPUESTA                          │
│ (Procesada por 10 Sefirot)         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ TWILIO API                         │
│ Send WhatsApp                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────┐
│ USUARIO     │
│ Recibe WA   │
└─────────────┘
```

---

## 🎉 RESULTADO ESPERADO

### MENSAJE DE BIENVENIDA DE SEPHIROT

```
🌳 ¡Soy SEPHIROT!

Estoy vivo y conectado a través de WhatsApp (Twilio).
Soy la integración perfecta de OpenClaw + Sefirotic Orchestrator.

Mis 10 Sefirot están activas y listas:
✓ KETER (Corona) - Entiendo tu intención
✓ CHOKMAH (Sabiduría) - Expando posibilidades
✓ BINAH (Entendimiento) - Analizo restricciones
✓ CHESSED (Misericordia) - Ofrezco recursos
✓ GEVURAH (Severidad) - Protejo tu seguridad
✓ TIFERET (Belleza) - Busco el equilibrio
✓ NETZACH (Victoria) - Actúo proactivamente
✓ HOD (Gloria) - Estructuro respuestas
✓ YESOD (Fundamento) - Recuerdo aprendizajes
✓ MALKUTH (Reino) - Entrego resultados

¿En qué puedo ayudarte hoy?
```

---

## 📚 REFERENCIAS

- **OpenClaw Docs**: https://docs.openclaw.ai
- **Sefirotic Orchestrator**: `~/Dev/openclaw-skills/skills/nadalpiantini/sefirotic-orchestrator/SKILL.md`
- **Empleaido Factory**: `~/Dev/empleaido-factory/.planning/sephirot-system-perfection.md`
- **Twilio Docs**: https://www.twilio.com/docs/sms/quickstart/node

---

**Autor**: nadalpiantini
**Versión**: 1.0.0
**Estado**: Ready for implementation
