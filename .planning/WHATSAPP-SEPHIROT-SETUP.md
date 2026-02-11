# 📱 WHATSAPP + SEPHIROT INTEGRATION GUIDE

Complete guide to connect Sephirot (OpenClaw) to WhatsApp via Twilio.

---

## ✅ ARCHITECTURE OVERVIEW

```
┌──────────────┐
│   WhatsApp   │ User sends message
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Twilio    │ (+19127334768) - Receives WhatsApp
└──────┬───────┘
       │ Webhook POST
       ▼
┌──────────────────────────────────────┐
│  Next.js API Route                   │
│  /api/webhooks/twilio/route.ts      │
└──────┬───────────────────────────────┘
       │ WebSocket message
       ▼
┌──────────────────────────────────────┐
│  OpenClaw Gateway                    │
│  ws://127.0.0.1:18789               │
└──────┬───────────────────────────────┘
       │ Routes to agent
       ▼
┌──────────────────────────────────────┐
│  SEPHIROT Agent                      │
│  ~/.openclaw/workspace-sephirot     │
│  (10 Sefirot processing)            │
└──────┬───────────────────────────────┘
       │ Response
       ▼
┌──────────────┐
│   Twilio     │ Sends WhatsApp response
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   WhatsApp   │ User receives response
└──────────────┘
```

---

## 📋 PREREQUISITES

### Already Configured ✅
- [x] OpenClaw Gateway running (port 18789)
- [x] Sephirot agent created and active
- [x] Ngrok tunnel running (https://bd3e-74-244-193-84.ngrok-free.app)
- [x] Next.js app structure ready
- [x] Twilio phone number purchased: (+1912) 733-4768

### Need Configuration ⚠️
- [ ] Twilio credentials (Account SID, Auth Token)
- [ ] Twilio webhook URL configuration
- [ ] Environment variables setup
- [ ] Development server running

---

## 🔧 STEP 1: GET TWILIO CREDENTIALS (1 minute)

1. **Go to Twilio Console**: https://console.twilio.com/us1/settings
2. **Copy your credentials**:
   ```
   ACCOUNT SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   AUTH TOKEN:  your_auth_token_here
   ```
3. **Keep them secure** - Never commit to git!

---

## 🔧 STEP 2: CONFIGURE ENVIRONMENT VARIABLES (30 seconds)

Edit `/Users/nadalpiantini/Dev/empleaido-factory/app/.env.local`:

```bash
# Replace these with your actual Twilio credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ← PASTE YOUR SID
TWILIO_AUTH_TOKEN=your_auth_token_here                  ← PASTE YOUR TOKEN
TWILIO_PHONE_NUMBER=+19127334768
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
```

---

## 🔧 STEP 3: START DEVELOPMENT SERVER (10 seconds)

```bash
cd /Users/nadalpiantini/Dev/empleaido-factory/app
npm run dev
```

The server will start on `http://localhost:3000`

---

## 🔧 STEP 4: CONFIGURE TWILIO WEBHOOK (2 minutes)

### Option A: With Ngrok (Recommended for testing)

1. **Make sure ngrok is running**:
   ```bash
   ngrok http 3000
   ```

2. **Copy your ngrok URL** (e.g., `https://abcd1234.ngrok-free.app`)

3. **Configure Twilio webhook**:
   - Go to: https://console.twilio.com/us1/phonenumbers/incoming
   - Find: `(912) 733-4768`
   - Scroll to: **"Messaging Configuration"**
   - Configure:
     ```
     Configure with: [Webhook ▼]
     URL: https://abcd1234.ngrok-free.app/api/webhooks/twilio
     [✓] HTTP POST
     ```
   - Click **[SAVE]**

### Option B: Production URL (when deployed)

```
URL: https://empleaido.com/api/webhooks/twilio
```

---

## 🔧 STEP 5: VERIFY OPENCLAW GATEWAY (5 seconds)

```bash
# Check if OpenClaw Gateway is running
lsof -i :18789

# You should see output like:
# COMMAND   PID    USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
# node    89027 user   23u  IPv4 0x12345      0t0  TCP localhost:18789 (LISTEN)
```

If not running, start it:
```bash
openclaw gateway
```

---

## 📱 STEP 6: TEST WHATSAPP INTEGRATION

### Test 1: Send Message from WhatsApp

1. **Open WhatsApp** on your phone
2. **Send message to**: `(912) 733-4768`
3. **Type**: `Hola SEPHIROT`
4. **Expected response**:
   ```
   🌳 ¡Soy SEPHIROT!

   Estoy vivo y conectado.
   Soy la integración de OpenClaw + Sefirotic Orchestrator.

   Mis 10 Sefirot están activas:
   ✓ KETER (Entiendo tu intención)
   ✓ CHOKMAH (Expando posibilidades)
   ✓ BINAH (Analizo restricciones)
   ✓ CHESSED (Ofrezco recursos)
   ✓ GEVURAH (Protejo tu seguridad)
   ✓ TIFERET (Busco el equilibrio)
   ✓ NETZACH (Actúo proactivamente)
   ✓ HOD (Estructuro respuestas)
   ✓ YESOD (Recuerdo aprendizajes)
   ✓ MALKUTH (Entrego resultados)

   ¿En qué puedo ayudarte hoy?
   ```

### Test 2: Check Logs

```bash
# Terminal 1: Next.js dev server logs
cd /Users/nadalpiantini/Dev/empleaido-factory/app
npm run dev

# Terminal 2: OpenClaw Gateway logs
openclaw logs --tail --follow
```

Look for:
```
✅ OpenClaw Gateway connected
📱 Received WhatsApp message from whatsapp:+18095551234
📨 Message: Hola SEPHIROT
🌳 Sephirot response: ¡Soy SEPHIROT!...
✅ Response sent to whatsapp:+18095551234
```

---

## 🎯 SEPHIROT CAPABILITIES

Once connected, Sephirot can help with:

- **Decision Making**: Process complex decisions through 10 Sefirot
- **Task Routing**: Route tasks to appropriate Empleaidos
- **Security Checks**: Gevurah validates all requests
- **Creative Expansion**: Chokmah brainstorms possibilities
- **Resource Matching**: Chesed finds relevant skills
- **Memory Persistence**: Yesod remembers context

### Example Conversations

```
You: "Ayúdame a decidir si lanzar este producto"

Sephirot: [Processes through Keter → Chokmah → Binah → ... → Malkuth]
"Analizaré tu decisión a través de mis 10 Sefirot:

KETER: Entiendo que necesitas evaluar un lanzamiento de producto.
CHOKMAH: Opciones: lanzar ahora, esperar, pivotar, cancelar...
BINAH: Restricciones: presupuesto, mercado, competencia...
[Continues through all 10 Sefirot]

Recomendación: [Balanced insight from Tiferet]"
```

---

## 🛠️ TROUBLESHOOTING

### Issue: "OpenClaw Gateway not connected"

**Solution**:
```bash
# Start OpenClaw Gateway
openclaw gateway

# Verify it's running
lsof -i :18789
```

### Issue: "Twilio webhook timeout"

**Solution**:
- Check ngrok is running: `ngrok http 3000`
- Verify webhook URL in Twilio console
- Check Next.js dev server is running: `npm run dev`

### Issue: "WhatsApp Service not configured"

**Solution**:
- Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` in `.env.local`
- Restart dev server after changing env variables
- Check Twilio credentials are valid

### Issue: "No response from Sephirot"

**Solution**:
```bash
# Check OpenClaw agent status
openclaw agents list | grep sephirot

# View Sephirot logs
openclaw logs sephirot --tail --follow

# Restart Sephirot agent if needed
openclaw agent restart sephirot
```

### Issue: "TwiML parsing error"

**Solution**:
- Verify webhook endpoint returns `Content-Type: text/xml`
- Check response XML is valid
- Look for errors in Next.js server logs

---

## 📊 MONITORING & DEBUGGING

### Real-time Logs

```bash
# Terminal 1: Next.js API routes
cd /Users/nadalpiantini/Dev/empleaido-factory/app
npm run dev

# Terminal 2: OpenClaw Gateway
openclaw logs --tail --follow

# Terminal 3: ngrok (for webhook debugging)
ngrok http 3000 --log=stdout
```

### Check OpenClaw Status

```bash
# List all agents
openclaw agents list

# Check agent details
openclaw agents inspect sephirot

# View agent workspace
ls -la ~/.openclaw/workspace-sephirot
```

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Update `OPENCLAW_GATEWAY_URL` to production WebSocket URL
- [ ] Configure production Twilio webhook URL (empleaido.com)
- [ ] Set up ngrok or production tunnel for OpenClaw Gateway
- [ ] Test full flow with production URLs
- [ ] Set up monitoring and error alerts
- [ ] Configure rate limiting (Twilio API limits)
- [ ] Add error handling for Gateway disconnections
- [ ] Set up logging aggregation

---

## 📚 FILES CREATED

```
empleaido-factory/app/
├── lib/
│   ├── openclaw-client.ts       ✅ OpenClaw Gateway WebSocket client
│   └── whatsapp-service.ts      ✅ Twilio WhatsApp API service
└── app/api/webhooks/
    └── twilio/
        └── route.ts             ✅ Twilio webhook endpoint
```

---

## 🎉 SUCCESS INDICATORS

You'll know everything is working when:

1. ✅ OpenClaw Gateway shows: `✅ OpenClaw Gateway connected`
2. ✅ Next.js dev server running on port 3000
3. ✅ Ngrok tunnel active and accessible
4. ✅ Twilio webhook configured to ngrok URL
5. ✅ WhatsApp message receives Sephirot response
6. ✅ Logs show full message flow: WhatsApp → Twilio → Next.js → OpenClaw → Sephirot

---

## 📞 SUPPORT

If something doesn't work:

1. Check logs in all three terminals
2. Verify environment variables are set correctly
3. Confirm OpenClaw Gateway is running
4. Test Twilio credentials manually
5. Check ngrok tunnel is active
6. Review Sephirot agent logs

---

**CREATED**: 2026-02-10
**STATUS**: Ready for testing
**NEXT STEP**: Configure Twilio credentials and send first WhatsApp message
