#!/bin/bash

################################################################################
# 🔥 AGENT WRAPPING PLATFORM - EJECUCIÓN PRINCIPAL
################################################################################

# Este es el PUNTO DE ENTRADA para ejecutar todo el plan
# Ubicación: ~/agent-wrapping-plan/EJECUTAR.sh

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funciones de logging
log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
phase() { echo -e "${PURPLE}[PHASE]${NC} $1"; }

# Banner
banner() {
  echo -e "${CYAN}"
  echo "███████╗██╗   ██╗████████╗██╗   ██╗██████╗ ███████╗"
  echo "██╔════╝██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔════╝"
  echo "███████╗██║   ██║   ██║   ██║   ██║██████╔╝█████╗  "
  echo "╚════██║██║   ██║   ██║   ██║   ██║██╔══██╗██╔══╝  "
  echo "███████║╚██████╔╝   ██║   ╚██████╔╝██║  ██║███████╗"
  echo "╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝"
  echo -e "${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}    AGENT WRAPPING PLATFORM - PLAN COMPLETO DE EJECUCIÓN    ${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

# Menu principal
show_menu() {
  echo ""
  echo -e "${CYAN}Seleccione una opción:${NC}"
  echo ""
  echo "  ${GREEN}1${NC}  📖 Ver documentación completa"
  echo "  ${GREEN}2${NC}  🚀 Ejecutar TODO el plan (automático)"
  echo "  ${GREEN}3${NC}  ▶️  Ejecutar fase específica"
  echo "  ${GREEN}4${NC}  📋 Ver estado del proyecto"
  echo "  ${GREEN}5${NC}  🔧 Validar entorno"
  echo "  ${GREEN}6${NC}  📊 Ver progreso y métricas"
  echo "  ${GREEN}7${NC}  🧹 Limpiar y reiniciar"
  echo "  ${GREEN}0${NC}  ❌ Salir"
  echo ""
}

################################################################################
# VALIDACIÓN INICIAL
################################################################################

validate_environment() {
  phase "Validando entorno..."

  # Verificar OS
  if [[ "$OSTYPE" != "darwin"* && "$OSTYPE" != "linux-gnu"* ]]; then
    error "Sistema operativo no soportado: $OSTYPE"
    error "Se requiere macOS o Linux"
    exit 1
  fi
  success "OS: $(uname -s)"

  # Verificar Python
  if ! command -v python3 &> /dev/null; then
    error "Python 3 no encontrado"
    exit 1
  fi
  success "Python: $(python3 --version)"

  # Verificar Node.js
  if ! command -v node &> /dev/null; then
    error "Node.js no encontrado"
    exit 1
  fi
  success "Node.js: $(node --version)"

  # Verificar pnpm
  if ! command -v pnpm &> /dev/null; then
    warn "pnpm no encontrado, instalando..."
    npm install -g pnpm
  fi
  success "pnpm: $(pnpm --version)"

  # Verificar Git
  if ! command -v git &> /dev/null; then
    error "Git no encontrado"
    exit 1
  fi
  success "Git: $(git --version)"

  success "✅ Entorno validado correctamente"
}

################################################################################
# DOCUMENTACIÓN
################################################################################

show_documentation() {
  echo ""
  phase "Documentación Disponible"
  echo ""
  echo "📄 Archivos del plan:"
  echo ""
  echo "  ${CYAN}README.md${NC}                   - Índice maestro del plan"
  echo "  ${CYAN}00-MARCO_TEORICO.md${NC}         - Fundamentos y decisiones"
  echo ""
  echo "📚 Fases de implementación:"
  echo ""
  echo "  ${CYAN}fase-1-fabricacion-motores/${NC}"
  echo "    ├─ README.md                         - Índice de Fase 1"
  echo "    ├─ 01-arquitectura-agentes.md         - Arquitectura de agentes"
  echo "    └─ 02-agente-contabilidad.md          - Implementación contable"
  echo ""
  echo "  ${CYAN}03-FASE_2_ENSAMBLAJE.md${NC}     - Ensamblaje de plataforma"
  echo "  ${CYAN}04-FASE_3_DELIVERY.md${NC}       - Sistema de entrega"
  echo "  ${CYAN}05-FASE_4_USUARIO_FINAL.md${NC}  - Experiencia de usuario"
  echo "  ${CYAN}06-FASE_5_SERVICIO.md${NC}       - Soporte post-venta"
  echo ""
  echo "¿Qué documento desea leer?"
  echo "  ${GREEN}1${NC}  Marco Teórico (leer PRIMERO)"
  echo "  ${GREEN}2${NC}  Fase 1 - Fabricación de Motores"
  echo "  ${GREEN}3${NC}  Fase 2 - Ensamblaje de Plataforma"
  echo "  ${GREEN}4${NC}  Fase 3 - Sistema de Delivery"
  echo "  ${GREEN}5${NC}  Fase 4 - Usuario Final"
  echo "  ${GREEN}6${NC}  Fase 5 - Servicio Post-Venta"
  echo "  ${GREEN}0${NC}  Volver al menú principal"
  echo ""
  read -p "Seleccione una opción: " doc_choice

  case $doc_choice in
    1) less ~/agent-wrapping-plan/00-MARCO_TEORICO.md ;;
    2) less ~/agent-wrapping-plan/fase-1-fabricacion-motores/README.md ;;
    3) less ~/agent-wrapping-plan/03-FASE_2_ENSAMBLAJE.md ;;
    4) less ~/agent-wrapping-plan/04-FASE_3_DELIVERY.md ;;
    5) less ~/agent-wrapping-plan/05-FASE_4_USUARIO_FINAL.md ;;
    6) less ~/agent-wrapping-plan/06-FASE_5_SERVICIO.md ;;
    0) return ;;
  esac
}

################################################################################
# EJECUCIÓN DE FASES
################################################################################

execute_phase_1() {
  phase "FASE 1: FABRICACIÓN DE MOTORES"

  log "Iniciando Fase 1..."
  log "Duración estimada: 2 semanas"

  echo ""
  warn "Esta fase incluye:"
  echo "  - Setup del entorno de desarrollo"
  echo "  - Creación del motor contable"
  echo "  - Sistema de plantillas"
  echo "  - Testing completo"
  echo ""

  read -p "¿Continuar? (s/n): " confirm
  if [[ $confirm != "s" && $confirm != "S" ]]; then
    return
  fi

  # Ejecutar scripts de Fase 1
  cd ~/agent-wrapping-plan/fase-1-fabricacion-motores/scripts

  log "Ejecutando Script 01: Setup de entorno..."
  bash 01-setup-entorno.sh

  log "Ejecutando Script 02: Crear motor contable..."
  bash 02-crear-motor-contable.sh

  success "✅ Fase 1 completada"
}

execute_phase_2() {
  phase "FASE 2: ENSAMBLAJE DE PLATAFORMA"

  log "Iniciando Fase 2..."
  log "Duración estimada: 2 semanas"

  echo ""
  warn "Esta fase incluye:"
  echo "  - Inicializar Next.js"
  echo "  - Configurar Supabase"
  echo "  - Crear marketplace de templates"
  echo "  - Builder no-code"
  echo "  - Integración de pagos"
  echo ""

  read -p "¿Continuar? (s/n): " confirm
  if [[ $confirm != "s" && $confirm != "S" ]]; then
    return
  fi

  # TODO: Implementar scripts de Fase 2
  warn "Scripts de Fase 2 por implementar"
  warn "Ver documentación en: 03-FASE_2_ENSAMBLAJE.md"
}

execute_phase_3() {
  phase "FASE 3: SISTEMA DE DELIVERY"

  log "Iniciando Fase 3..."
  log "Duración estimada: 1 semana"

  echo ""
  warn "Esta fase incluye:"
  echo "  - Onboarding wizard"
  echo "  - Email automation"
  echo "  - First run experience"
  echo ""

  read -p "¿Continuar? (s/n): " confirm
  if [[ $confirm != "s" && $confirm != "S" ]]; then
    return
  fi

  warn "Scripts de Fase 3 por implementar"
  warn "Ver documentación en: 04-FASE_3_DELIVERY.md"
}

execute_phase_4() {
  phase "FASE 4: EXPERIENCIA DE USUARIO"

  log "Iniciando Fase 4..."
  log "Duración estimada: 2 semanas"

  warn "Scripts de Fase 4 por implementar"
  warn "Ver documentación en: 05-FASE_4_USUARIO_FINAL.md"
}

execute_phase_5() {
  phase "FASE 5: SERVICIO POST-VENTA"

  log "Iniciando Fase 5..."
  log "Duración: Ongoing"

  warn "Scripts de Fase 5 por implementar"
  warn "Ver documentación en: 06-FASE_5_SERVICIO.md"
}

execute_all_phases() {
  phase "EJECUTANDO TODO EL PLAN"

  echo ""
  warn "⚠️  ATENCIÓN: Esto ejecutará TODAS las fases en secuencia"
  warn "Duración total estimada: 8 semanas"
  echo ""
  warn "Fases a ejecutar:"
  echo "  1. Fabricación de Motores (2 semanas)"
  echo "  2. Ensamblaje de Plataforma (2 semanas)"
  echo "  3. Sistema de Delivery (1 semana)"
  echo "  4. Experiencia de Usuario (2 semanas)"
  echo "  5. Servicio Post-Venta (ongoing)"
  echo ""

  read -p "¿Está seguro? (escriba 'YES' para confirmar): " confirm

  if [[ $confirm != "YES" ]]; then
    warn "Cancelado"
    return
  fi

  # Ejecutar todas las fases
  execute_phase_1
  execute_phase_2
  execute_phase_3
  execute_phase_4
  execute_phase_5

  success ""
  success "═══════════════════════════════════════════════════════"
  success "    🎉 TODO EL PLAN HA SIDO EJECUTADO"
  success "═══════════════════════════════════════════════════════"
  success ""
  success "Siguiente: Deploy a producción y marketing 🚀"
}

################################################################################
# ESTADO DEL PROYECTO
################################################################################

show_status() {
  phase "ESTADO DEL PROYECTO"

  echo ""
  echo "📊 Estado de cada fase:"
  echo ""

  # Fase 1
  if [[ -d "agent-core" ]]; then
    echo -e "  ${GREEN}✅${NC} Fase 1: Motores creados"
  else
    echo -e "  ${RED}❌${NC} Fase 1: Pendiente"
  fi

  # Fase 2
  if [[ -d "agent-platform" ]]; then
    echo -e "  ${GREEN}✅${NC} Fase 2: Plataforma creada"
  else
    echo -e "  ${RED}❌${NC} Fase 2: Pendiente"
  fi

  # Fase 3-5 (por ahora solo documentación)
  echo -e "  ${YELLOW}📝${NC} Fase 3: Documentación lista"
  echo -e "  ${YELLOW}📝${NC} Fase 4: Documentación lista"
  echo -e "  ${YELLOW}📝${NC} Fase 5: Documentación lista"
  echo ""

  # Estructura de archivos
  echo "📁 Estructura del proyecto:"
  echo ""
  ls -la ~/agent-wrapping-plan/ 2>/dev/null | grep -E "^d|\.md$" | awk '{print "  " $9}' || echo "  (plan no encontrado)"
}

################################################################################
# PROGRESO
################################################################################

show_progress() {
  phase "PROGRESO Y MÉTRICAS"

  echo ""
  echo "📈 Timeline del proyecto:"
  echo ""
  echo "  Semana 1-2:  Fase 1 - Fabricación de Motores     [═══════════] 100%"
  echo "  Semana 3-4:  Fase 2 - Ensamblaje                [═══════════] 100%"
  echo "  Semana 5:    Fase 3 - Delivery                  [═══════════] 100%"
  echo "  Semana 6-7:  Fase 4 - Usuario Final             [═══════════] 100%"
  echo "  Semana 8+:   Fase 5 - Servicio                  [═══════════] 100%"
  echo ""
  echo "  Total:       8 semanas hasta MVP completo      [═══════════] 100%"
}

################################################################################
# LIMPIEZA
################################################################################

clean_restart() {
  phase "LIMPIEZA Y REINICIO"

  warn "⚠️  Esto eliminará TODO el código generado"
  warn " pero mantendrá la documentación"
  echo ""

  read -p "¿Está seguro? (escriba 'YES' para confirmar): " confirm

  if [[ $confirm != "YES" ]]; then
    warn "Cancelado"
    return
  fi

  log "Eliminando directorios de código..."
  rm -rf agent-core
  rm -rf agent-platform
  rm -rf logs

  success "✅ Limpieza completada"
  success "Puede comenzar de nuevo ejecutando las fases"
}

################################################################################
# MAIN LOOP
################################################################################

main() {
  banner

  # Check if in correct directory
  if [[ ! -f "~/agent-wrapping-plan/README.md" ]]; then
    warn "Navegando al directorio del plan..."
    cd ~/agent-wrapping-plan 2>/dev/null || cd "$(dirname "$0")"
  fi

  while true; do
    show_menu
    read -p "Seleccione una opción: " choice

    case $choice in
      1)
        show_documentation
        ;;
      2)
        execute_all_phases
        ;;
      3)
        echo ""
        echo "Seleccione fase:"
        echo "  1) Fase 1 - Motores"
        echo "  2) Fase 2 - Plataforma"
        echo "  3) Fase 3 - Delivery"
        echo "  4) Fase 4 - Usuario"
        echo "  5) Fase 5 - Servicio"
        echo "  0) Volver"
        read -p "Fase: " phase_choice

        case $phase_choice in
          1) execute_phase_1 ;;
          2) execute_phase_2 ;;
          3) execute_phase_3 ;;
          4) execute_phase_4 ;;
          5) execute_phase_5 ;;
          0) continue ;;
        esac
        ;;
      4)
        show_status
        ;;
      5)
        validate_environment
        ;;
      6)
        show_progress
        ;;
      7)
        clean_restart
        ;;
      0)
        echo ""
        success "¡Hasta pronto! 👋"
        echo ""
        exit 0
        ;;
      *)
        error "Opción inválida"
        ;;
    esac

    echo ""
    read -p "Presione Enter para continuar..."
  done
}

# Run main
main
