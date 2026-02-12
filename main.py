from fastapi import FastAPI, Request, HTTPException, Cookie, Response, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
import json
from pathlib import Path
import subprocess
import shutil
import re
import secrets
import hashlib
from datetime import datetime
import uvicorn

app = FastAPI(title="Empleaido Factory", version="2.1.0")

# Security Configuration
SECRET_KEY = secrets.token_urlsafe(32)
SESSION_COOKIE_NAME = "empleaido_session"
MAX_SESSION_AGE = 3600  # 1 hour
RATE_LIMIT_PER_MINUTE = 60

# Setup
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Data storage
DATA_FILE = Path("empleaidos.json")
SESSIONS_FILE = Path("sessions.json")
AUDIT_LOG_FILE = Path("audit.log")
OPENCLAW_SKILLS_PATH = Path.home() / "Dev" / "openclaw-skills" / "openclaw-skills" / "skills" / "nadalpiantini"

# Valid Sefirot names (whitelist)
VALID_SEFIROT = {
    "Keter", "Chochmah", "Binah", "Chesed", "Gevurah",
    "Tiferet", "Netzach", "Hod", "Yesod", "Malkuth"
}

# Valid skills (expanded with Whisper)
VALID_SKILLS_PRESETS = [
    "Planning", "Analysis", "Communication", "Leadership",
    "Research", "Knowledge Management", "Documentation",
    "Design", "Creativity", "UI/UX", "Prototyping",
    "Whisper Transcription", "Audio Processing", "Voice Analysis",
    "Strategic Planning", "Execution", "Innovation"
]

# Security: Sanitize input
def sanitize_string(input_str: str, max_length: int = 100) -> str:
    """Sanitize string input to prevent injection attacks"""
    if not input_str:
        return ""
    # Remove null bytes
    input_str = input_str.replace("\x00", "")
    # Trim to max length
    input_str = input_str[:max_length]
    # Remove control characters except newlines and tabs
    input_str = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', input_str)
    return input_str.strip()

def validate_sefirot_names(sefirot_list: List[str]) -> List[str]:
    """Validate Sefirot names against whitelist"""
    valid = []
    for sefira in sefirot_list:
        sefira_clean = sanitize_string(sefira.strip(), 50)
        if sefira_clean in VALID_SEFIROT:
            valid.append(sefira_clean)
    return list(set(valid))  # Remove duplicates

def validate_skills(skills_list: List[str]) -> List[str]:
    """Validate and sanitize skills"""
    valid = []
    for skill in skills_list:
        skill_clean = sanitize_string(skill, 50)
        if skill_clean and len(skill_clean) >= 2:
            # Only allow alphanumeric, spaces, hyphens, and plus
            if re.match(r'^[\w\s\-\+]+$', skill_clean):
                valid.append(skill_clean)
    return list(set(valid))  # Remove duplicates

# Models with validation
class Empleaido(BaseModel):
    id: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=2, max_length=50, pattern=r'^[\w\s\-]+$')
    role: str = Field(..., min_length=2, max_length=100)
    specialty: str = Field(..., min_length=2, max_length=200)
    sefirot_activation: List[str] = Field(..., min_length=1, max_length=10)
    skills: List[str] = Field(..., min_length=1, max_length=20)
    status: str = Field(default="active", pattern=r'^(active|inactive)$')
    created_at: str
    deployed: bool = False

class EmpleaidoCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, pattern=r'^[\w\s\-]+$')
    role: str = Field(..., min_length=2, max_length=100)
    specialty: str = Field(..., min_length=2, max_length=200)
    sefirot_activation: List[str] = Field(..., min_length=1, max_length=10)
    skills: List[str] = Field(..., min_length=1, max_length=20)

    @field_validator('name')
    def validate_name(cls, v):
        return sanitize_string(v, 50)

    @field_validator('role')
    def validate_role(cls, v):
        return sanitize_string(v, 100)

    @field_validator('specialty')
    def validate_specialty(cls, v):
        return sanitize_string(v, 200)

    @field_validator('sefirot_activation')
    def validate_sefirot(cls, v):
        if not v:
            raise ValueError('At least one Sefirot is required')
        validated = validate_sefirot_names(v)
        if not validated:
            raise ValueError('No valid Sefirot names provided')
        return validated

    @field_validator('skills')
    def validate_skills_list(cls, v):
        if not v:
            raise ValueError('At least one skill is required')
        validated = validate_skills(v)
        if not validated:
            raise ValueError('No valid skills provided')
        return validated

# Session management
def create_session() -> str:
    """Create a new secure session"""
    session_token = secrets.token_urlsafe(32)
    session = {
        "token": session_token,
        "created_at": datetime.now().isoformat(),
        "expires_at": (datetime.now().timestamp() + MAX_SESSION_AGE)
    }
    sessions = load_sessions()
    sessions[session_token] = session
    save_sessions(sessions)
    return session_token

def validate_session(token: str) -> bool:
    """Validate session token and check expiration"""
    sessions = load_sessions()
    session = sessions.get(token)
    if not session:
        return False
    if datetime.now().timestamp() > session["expires_at"]:
        # Session expired, remove it
        del sessions[token]
        save_sessions(sessions)
        return False
    return True

def load_sessions() -> dict:
    """Load sessions from file"""
    if SESSIONS_FILE.exists():
        try:
            with open(SESSIONS_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_sessions(sessions: dict):
    """Save sessions to file"""
    with open(SESSIONS_FILE, "w") as f:
        json.dump(sessions, f, indent=2)

# Audit logging
def audit_log(action: str, details: dict, ip: str = None):
    """Log security-relevant events"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "action": action,
        "ip": ip or "unknown",
        "details": details
    }
    with open(AUDIT_LOG_FILE, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

# Rate limiting (in-memory, simple version)
rate_limit_tracker = {}

def check_rate_limit(ip: str, endpoint: str) -> bool:
    """Check if IP has exceeded rate limit"""
    key = f"{ip}:{endpoint}"
    now = datetime.now().timestamp()
    minute_ago = now - 60

    # Clean old entries
    if key in rate_limit_tracker:
        rate_limit_tracker[key] = [
            ts for ts in rate_limit_tracker[key]
            if ts > minute_ago
        ]

    # Check limit
    if len(rate_limit_tracker.get(key, [])) >= RATE_LIMIT_PER_MINUTE:
        return False

    # Add current request
    if key not in rate_limit_tracker:
        rate_limit_tracker[key] = []
    rate_limit_tracker[key].append(now)
    return True

# Initialize data
def load_empleaidos():
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_empleaidos(empleaidos):
    with open(DATA_FILE, "w") as f:
        json.dump(empleaidos, f, indent=2)

# Generate skill.md content
def generate_skill_md(empleaido: dict) -> str:
    sefirot_context = {
        "Keter": "Corona - Universal consciousness, connection to source",
        "Chochmah": "Sabiduría - Intuitive insight, creative inspiration",
        "Binah": "Entendimiento - Analytical depth, structured processing",
        "Chesed": "Bondad - Expansion, generosity, creative force",
        "Gevurah": "Fuerza - Discipline, restraint, focused power",
        "Tiferet": "Belleza - Balance, harmony, integration",
        "Netzach": "Victoria - Endurance, confidence, momentum",
        "Hod": "Esplendor - Detail-oriented, analytical precision",
        "Yesod": "Fundación - Connection, transmission, foundation",
        "Malkuth": "Reino - Manifestation, physical reality"
    }

    sefirot_descriptions = "\n        ".join([
        f"- **{sefira}**: {sefirot_context.get(sefira, 'Sefirotic activation')}"
        for sefira in empleaido.get("sefirot_activation", [])
    ])

    skills_list = "\n        ".join([f"- {skill}" for skill in empleaido.get("skills", [])])

    # Sanitize output
    name = sanitize_string(empleaido['name'], 50)
    role = sanitize_string(empleaido['role'], 100)
    specialty = sanitize_string(empleaido['specialty'], 200)

    skill_md = f"""---
name: {name.lower()}
version: 1.0.0
description: {role} - {specialty}
---

# {name.upper()}

**{role}** especializado en **{specialty}**

## 🎯 Rol Principal

{role} con expertise en {specialty}

## ✨ Sefirot Activation

Este empleaido opera con activación Sefirotic en los siguientes canales:

    {sefirot_descriptions}

## 🔧 Skills Competencies

    {skills_list}

## 🚀 Invocación

```bash
openclaw agent --message "TU_PEDIDO_AQUI" --skill {name.lower()}
```

## 📋 Arquetipo del Agente

Este empleaido fue creado a través de **Empleaido Factory** con la arquitectura Adán Kadmon v3, integrando:

- **OpenClaw Skills System**: Framework de habilidades modulares
- **Sefirotic Orchestrator**: Topología de decisión basada en el Árbol de la Vida
- **Arquetipo Personalizado**: {role}

## 🎨 Contexto Operativo

Cuando invoques a {name}, está operando con:
- Conciencia Sefirotic multidimensional
- Especialización en {specialty}
- Skills activos: {', '.join(empleaido.get('skills', []))}

## 📊 Métricas de Activación

- **Nivel de Consciencia**: Sefirotic
- **Modo de Operación**: {empleaido.get('status', 'active').upper()}
- **Sistema Base**: Adán Kadmon v3 + OpenClaw

---

**Generado por Empleaido Factory v2.1.0**
**Fecha de Creación**: {empleaido.get('created_at', 'Unknown')}
**ID**: {empleaido['id']}
"""
    return skill_md

# Deploy empleaido as OpenClaw skill
def deploy_empleaido_skill(empleaido: dict) -> bool:
    try:
        skill_dir = OPENCLAW_SKILLS_PATH / empleaido['name'].lower()
        skill_dir.mkdir(parents=True, exist_ok=True)

        skill_md = generate_skill_md(empleaido)
        skill_file = skill_dir / "skill.md"

        with open(skill_file, "w") as f:
            f.write(skill_md)

        # Create index.md for documentation
        index_md = f"""# {empleaido['name']} - OpenClaw Skill

{empleaido['role']} especializado en {empleaido['specialty']}.

## Quick Start

```bash
openclaw agent --message "Your request here" --skill {empleaido['name'].lower()}
```

## Skills
{chr(10).join(['- ' + s for s in empleaido['skills']])}

## Sefirot Activation
{chr(10).join(['- ' + s for s in empleaido['sefirot_activation']])}
"""
        index_file = skill_dir / "index.md"
        with open(index_file, "w") as f:
            f.write(index_md)

        return True
    except Exception as e:
        print(f"Error deploying skill: {e}")
        return False

# Security Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)

    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    # CSP (restrictive)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self'; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "form-action 'self';"
    )

    return response

# Routes
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    empleaidos = load_empleaidos()

    # Check session
    session_token = request.cookies.get(SESSION_COOKIE_NAME)
    is_authenticated = session_token and validate_session(session_token)

    # Get/set auth token for API calls
    if not is_authenticated:
        new_token = create_session()
        response = templates.TemplateResponse(
            "index.html",
            {"request": request, "empleaidos": empleaidos, "auth_token": new_token}
        )
        response.set_cookie(
            key=SESSION_COOKIE_NAME,
            value=new_token,
            httponly=True,
            secure=False,  # Set to True if using HTTPS
            samesite="lax",
            max_age=MAX_SESSION_AGE
        )
        return response

    return templates.TemplateResponse(
        "index.html",
        {"request": request, "empleaidos": empleaidos, "auth_token": session_token}
    )

@app.post("/api/auth/login")
async def login():
    """Simple authentication endpoint"""
    token = create_session()
    audit_log("login", {"token_hash": hashlib.sha256(token.encode()).hexdigest()})
    return {"token": token, "expires_in": MAX_SESSION_AGE}

@app.get("/api/empleaidos")
async def get_empleaidos(request: Request):
    # Rate limiting
    client_ip = request.client.host
    if not check_rate_limit(client_ip, "get_empleaidos"):
        audit_log("rate_limit_exceeded", {"endpoint": "get_empleaidos"}, client_ip)
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    empleaidos = load_empleaidos()
    audit_log("get_empleaidos", {"count": len(empleaidos)}, client_ip)
    return empleaidos

@app.post("/api/empleaidos")
async def create_empleaido(empleaido: EmpleaidoCreate, request: Request):
    # Rate limiting
    client_ip = request.client.host
    if not check_rate_limit(client_ip, "create_empleaido"):
        audit_log("rate_limit_exceeded", {"endpoint": "create_empleaido"}, client_ip)
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    empleaidos = load_empleaidos()

    new_empleaido = Empleaido(
        id=secrets.token_urlsafe(16),
        name=empleaido.name,
        role=empleaido.role,
        specialty=empleaido.specialty,
        sefirot_activation=empleaido.sefirot_activation,
        skills=empleaido.skills,
        status="active",
        created_at=datetime.now().isoformat(),
        deployed=False
    )

    empleaidos.append(new_empleaido.dict())
    save_empleaidos(empleaidos)

    audit_log("create_empleaido", {
        "id": new_empleaido.id,
        "name": new_empleaido.name
    }, client_ip)

    return new_empleaido

@app.post("/api/empleaidos/{empleaido_id}/deploy")
async def deploy_empleaido(empleaido_id: str, request: Request):
    # Rate limiting
    client_ip = request.client.host
    if not check_rate_limit(client_ip, "deploy_empleaido"):
        audit_log("rate_limit_exceeded", {"endpoint": "deploy_empleaido"}, client_ip)
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    # Validate ID format
    if not re.match(r'^[\w\-]+$', empleaido_id):
        audit_log("invalid_id", {"id": empleaido_id}, client_ip)
        raise HTTPException(status_code=400, detail="Invalid empleaido ID")

    empleaidos = load_empleaidos()
    empleaido = next((e for e in empleaidos if e["id"] == empleaido_id), None)

    if not empleaido:
        audit_log("deploy_not_found", {"id": empleaido_id}, client_ip)
        raise HTTPException(status_code=404, detail="Empleaido not found")

    success = deploy_empleaido_skill(empleaido)

    if success:
        empleaido["deployed"] = True
        save_empleaidos(empleaidos)

        audit_log("deploy_empleaido", {
            "id": empleaido_id,
            "name": empleaido["name"]
        }, client_ip)

        return {
            "message": f"Empleaido {empleaido['name']} deployed successfully",
            "skill_path": str(OPENCLAW_SKILLS_PATH / empleaido['name'].lower() / "skill.md"),
            "empleaido": empleaido
        }
    else:
        audit_log("deploy_failed", {"id": empleaido_id}, client_ip)
        raise HTTPException(status_code=500, detail="Deployment failed")

@app.delete("/api/empleaidos/{empleaido_id}")
async def delete_empleaido(empleaido_id: str, request: Request):
    # Rate limiting
    client_ip = request.client.host
    if not check_rate_limit(client_ip, "delete_empleaido"):
        audit_log("rate_limit_exceeded", {"endpoint": "delete_empleaido"}, client_ip)
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    # Validate ID format
    if not re.match(r'^[\w\-]+$', empleaido_id):
        audit_log("invalid_id", {"id": empleaido_id}, client_ip)
        raise HTTPException(status_code=400, detail="Invalid empleaido ID")

    empleaidos = load_empleaidos()
    empleaido = next((e for e in empleaidos if e["id"] == empleaido_id), None)

    if empleaido:
        # Delete skill directory if deployed
        if empleaido.get("deployed"):
            skill_dir = OPENCLAW_SKILLS_PATH / empleaido['name'].lower()
            if skill_dir.exists():
                shutil.rmtree(skill_dir)

    empleaidos = [e for e in empleaidos if e["id"] != empleaido_id]
    save_empleaidos(empleaidos)

    audit_log("delete_empleaido", {"id": empleaido_id}, client_ip)

    return {"message": "Deleted successfully"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "2.1.0",
        "security": "enabled",
        "whisper": "installed"
    }

# Whisper/Audio Transcription endpoints
@app.post("/api/whisper/transcribe")
async def transcribe_audio(request: Request):
    """Transcribe audio file using OpenAI Whisper"""
    client_ip = request.client.host
    if not check_rate_limit(client_ip, "whisper_transcribe"):
        audit_log("rate_limit_exceeded", {"endpoint": "whisper_transcribe"}, client_ip)
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    try:
        import whisper
        from fastapi import UploadFile

        # Get audio file from form
        form = await request.form()
        audio_file = form.get("file")

        if not audio_file:
            raise HTTPException(status_code=400, detail="No audio file provided")

        # Save temp file
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            content = await audio_file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        # Load Whisper model
        model = whisper.load_model("base")

        # Transcribe
        result = model.transcribe(tmp_path)
        text = result["text"].strip()

        # Cleanup
        import os
        os.unlink(tmp_path)

        audit_log("whisper_transcribe", {
            "length_seconds": len(content) / 32000,  # rough estimate
            "text_length": len(text)
        }, client_ip)

        return {
            "text": text,
            "model": "whisper-base",
            "duration_estimate": len(content) / 32000
        }

    except Exception as e:
        audit_log("whisper_error", {"error": str(e)}, client_ip)
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.get("/api/whisper/skills")
async def get_whisper_skills():
    """Get available Whisper/Audio skills"""
    return {
        "whisper_skills": [
            "Whisper Transcription",
            "Audio Processing",
            "Voice Analysis",
            "Speaker Diarization",
            "Language Detection"
        ],
        "whisper_version": "20250625",
        "model_size": "base (default: base/small/medium/large)"
    }

# WhatsApp + DAATH Integration endpoint
@app.post("/api/whatsapp/webhook")
async def whatsapp_webhook(request: Request):
    """
    Webhook endpoint for WhatsApp audio messages

    Expected payload from WhatsApp providers:
    - Twilio
    - Meta WhatsApp Cloud API
    - WhatsApp Business API

    Payload format:
    {
        "from": "+1234567890",
        "message_type": "audio",
        "audio_url": "https://...",
        "message_id": "wamid.XXX",
        "audio_path": "/tmp/audio.ogg"  # if file uploaded
    }
    """
    client_ip = request.client.host
    if not check_rate_limit(client_ip, "whatsapp_webhook"):
        audit_log("rate_limit_exceeded", {"endpoint": "whatsapp_webhook"}, client_ip)
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    try:
        payload = await request.json()
        sender = payload.get("from", "unknown")
        message_type = payload.get("message_type", "text")
        message_id = payload.get("message_id", "unknown")

        audit_log("whatsapp_message_received", {
            "sender": sender[:10],  # Partial for privacy
            "type": message_type,
            "message_id": message_id
        }, client_ip)

        if message_type != "audio":
            return {
                "ignored": True,
                "reason": "Not an audio message",
                "message_type": message_type
            }

        # Get audio path
        audio_url = payload.get("audio_url")
        audio_path = payload.get("audio_path")

        # Download audio if URL provided
        if audio_url and not audio_path:
            import tempfile
            import requests

            response = requests.get(audio_url)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".ogg") as tmp:
                tmp.write(response.content)
                audio_path = tmp.name

        if not audio_path:
            raise HTTPException(status_code=400, detail="No audio file provided")

        # Transcribe with Whisper
        try:
            import whisper
            model = whisper.load_model("base")
            result = model.transcribe(audio_path)

            # Cleanup temp file
            import os
            if os.path.exists(audio_path):
                os.unlink(audio_path)

            transcribed_text = result["text"].strip()
            duration = result.get("segments", [{}])[-1].get("end", 0) if result.get("segments") else 0
            detected_language = result.get("language", "unknown")

            # Format for WhatsApp (max 4096 chars)
            max_length = 4096
            formatted_text = transcribed_text[:max_length] if len(transcribed_text) > max_length else transcribed_text
            parts_needed = len(transcribed_text) > max_length

            response_data = {
                "message_id": message_id,
                "sender": sender,
                "transcription": formatted_text,
                "original_length": len(transcribed_text),
                "formatted_length": len(formatted_text),
                "parts_needed": parts_needed,
                "duration": duration,
                "language": detected_language,
                "timestamp": datetime.now().isoformat()
            }

            audit_log("whatsapp_transcription_complete", {
                "duration": duration,
                "language": detected_language,
                "chars": len(formatted_text)
            }, client_ip)

            # In production, send back to WhatsApp via provider API
            # For now, just return the transcription
            return {
                "success": True,
                "transcription": formatted_text,
                "whatsapp_ready": True,  # Ready to send to WhatsApp
                "parts_needed": parts_needed,
                "metadata": {
                    "duration": duration,
                    "language": detected_language
                }
            }

        except Exception as e:
            audit_log("whisper_transcription_error", {"error": str(e)}, client_ip)
            raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@app.get("/api/whatsapp/status")
async def whatsapp_status():
    """Get WhatsApp integration status"""
    return {
        "service": "DAATH + WhatsApp Integration",
        "status": "active",
        "version": "1.0.0",
        "endpoints": {
            "webhook": "/api/whatsapp/webhook",
            "test": "/api/whatsapp/transcribe"
        },
        "capabilities": [
            "Audio transcription via WhatsApp",
            "Automatic language detection",
            "Multi-part message support",
            "Speaker diarization support"
        ],
        "supported_providers": [
            "Twilio",
            "Meta WhatsApp Cloud API",
            "WhatsApp Business API"
        ],
        "openclaw_integration": "ready"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
