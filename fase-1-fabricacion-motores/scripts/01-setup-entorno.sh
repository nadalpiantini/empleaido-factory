#!/bin/bash

################################################################################
# Script 01: Setup del Entorno de Desarrollo
# Fase 1: Fabricación de Motores
################################################################################

set -e  # Detener en errores

COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${COLOR_BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${COLOR_GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${COLOR_YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${COLOR_RED}[ERROR]${NC} $1"
}

################################################################################
# Paso 1: Verificar prerequisitos
################################################################################

log "Verificando prerequisitos..."

# Python 3.11+
if ! command -v python3 &> /dev/null; then
    error "Python 3 no encontrado. Por favor instala Python 3.11+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | awk '{print $2}')
success "Python encontrado: $PYTHON_VERSION"

# Node.js 20+
if ! command -v node &> /dev/null; then
    error "Node.js no encontrado. Por favor instala Node.js 20+"
    exit 1
fi

NODE_VERSION=$(node --version)
success "Node.js encontrado: $NODE_VERSION"

# pnpm
if ! command -v pnpm &> /dev/null; then
    warn "pnpm no encontrado. Instalando..."
    npm install -g pnpm
fi

PNPM_VERSION=$(pnpm --version)
success "pnpm encontrado: $PNPM_VERSION"

################################################################################
# Paso 2: Crear estructura de directorios
################################################################################

log "Creando estructura de directorios..."

mkdir -p agent-core/{src/{agents,blocks,templates,tools,utils,types},tests/{unit,integration,e2e},docs}
mkdir -p logs

success "Estructura de directorios creada"

################################################################################
# Paso 3: Inicializar proyectos
################################################################################

log "Inicializando proyecto Python (Agent Core)..."

cd agent-core

# Crear pyproject.toml
cat > pyproject.toml << 'EOF'
[tool.poetry]
name = "agent-core"
version = "1.0.0"
description = "Motor base de agentes especializados"
authors = ["Your Name <your.email@example.com>"]

[tool.poetry.dependencies]
python = "^3.11"
langchain = "^0.1.0"
langchain-openai = "^0.0.5"
langchain-anthropic = "^0.1.0"
langgraph = "^0.0.20"
pydantic = "^2.5.0"
python-dotenv = "^1.0.0"

[tool.poetry.dev-dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.21.0"
black = "^23.12.0"
ruff = "^0.1.0"
mypy = "^1.7.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
EOF

# Crear requirements.txt como fallback
cat > requirements.txt << 'EOF'
langchain>=0.1.0
langchain-openai>=0.0.5
langchain-anthropic>=0.1.0
langgraph>=0.0.20
pydantic>=2.5.0
python-dotenv>=1.0.0
pytest>=7.4.0
pytest-asyncio>=0.21.0
EOF

success "Proyecto Python inicializado"

################################################################################
# Paso 4: Crear archivos de configuración
################################################################################

log "Creando archivos de configuración..."

# .env.example
cat > .env.example << 'EOF'
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Database (más adelante)
DATABASE_URL=postgresql://...

# Logging
LOG_LEVEL=INFO
EOF

success "Archivos de configuración creados"

################################################################################
# Paso 5: Instalar dependencias Python
################################################################################

log "Instalando dependencias Python..."

if command -v poetry &> /dev/null; then
    poetry install
else
    warn "Poetry no encontrado, usando pip..."
    pip install -r requirements.txt
fi

success "Dependencias Python instaladas"

################################################################################
# Paso 6: Crear tests de validación
################################################################################

log "Creando tests de validación..."

mkdir -p tests/unit

cat > tests/unit/test_environment.py << 'EOF'
import pytest
import os

def test_openai_key_exists():
    """Verifica que OPENAI_API_KEY esté configurada"""
    api_key = os.getenv('OPENAI_API_KEY')
    assert api_key is not None, "OPENAI_API_KEY no encontrada"
    assert api_key.startswith('sk-'), "OPENAI_API_KEY inválida"

def test_anthropic_key_exists():
    """Verifica que ANTHROPIC_API_KEY esté configurada"""
    api_key = os.getenv('ANTHROPIC_API_KEY')
    assert api_key is not None, "ANTHROPIC_API_KEY no encontrada"
    assert api_key.startswith('sk-ant-'), "ANTHROPIC_API_KEY inválida"

def test_python_version():
    """Verifica versión de Python"""
    import sys
    major, minor = sys.version_info[:2]
    assert (major, minor) >= (3, 11), f"Python 3.11+ requerido, encontrado {major}.{minor}"
EOF

success "Tests de validación creados"

################################################################################
# Paso 7: Ejecutar tests iniciales
################################################################################

log "Ejecutando tests iniciales..."

if command -v poetry &> /dev/null; then
    poetry run pytest tests/unit/test_environment.py -v
else
    pytest tests/unit/test_environment.py -v
fi

success "Tests completados"

################################################################################
# Paso 8: Resumen
################################################################################

cd ..

echo ""
success "═══════════════════════════════════════════════════════"
success "    ENTORNO CONFIGURADO EXITOSAMENTE"
success "═══════════════════════════════════════════════════════"
echo ""
log "Resumen:"
echo "  📁 Directorio: agent-core/"
echo "  🐍 Python: $PYTHON_VERSION"
echo "  📦 Node.js: $NODE_VERSION"
echo "  📎 pnpm: $PNPM_VERSION"
echo ""
warn "Próximos pasos:"
echo "  1. Configurar variables de entorno:"
echo "     cp agent-core/.env.example agent-core/.env"
echo "     # Editar .env con tus API keys"
echo ""
echo "  2. Ejecutar script 02:"
echo "     bash scripts/02-crear-motor-contable.sh"
echo ""
success "¡Setup completado! 🚀"
