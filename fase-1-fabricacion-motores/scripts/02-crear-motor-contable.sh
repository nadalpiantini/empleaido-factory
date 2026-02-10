#!/bin/bash

################################################################################
# Script 02: Crear Motor Contable Base
# Fase 1: Fabricación de Motores
################################################################################

set -e

COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${COLOR_BLUE}[INFO]${NC} $1"; }
success() { echo -e "${COLOR_GREEN}[SUCCESS]${NC} $1"; }
warn() { echo -e "${COLOR_YELLOW}[WARN]${NC} $1"; }

log "Iniciando creación del Motor Contable..."

################################################################################
# Paso 1: Crear estructura de bloques
################################################################################

log "Creando estructura de bloques..."

mkdir -p agent-core/src/blocks/{base,accounting}
mkdir -p agent-core/src/agents
mkdir -p agent-core/src/tools

success "Estructura creada"

################################################################################
# Paso 2: Crear bloque base
################################################################################

log "Creando bloque base..."

cat > agent-core/src/blocks/base/block.py << 'EOF'
"""Bloque base para todos los bloques del sistema."""
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel


class BlockResult(BaseModel):
    """Resultado de ejecutar un bloque."""
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    next_state: Optional[Dict[str, Any]] = None


class Block(ABC):
    """Clase base abstracta para todos los bloques."""

    def __init__(self, block_id: str, block_type: str):
        self.id = block_id
        self.type = block_type

    @abstractmethod
    async def execute(self, state: Dict[str, Any]) -> BlockResult:
        """Ejecutar el bloque con el estado dado."""
        pass

    def validate_config(self, config: Dict[str, Any]) -> bool:
        """Validar configuración del bloque."""
        return True
EOF

success "Bloque base creado"

################################################################################
# Paso 3: Crear bloques contables
################################################################################

log "Creando bloques contables..."

# Input Block
cat > agent-core/src/blocks/accounting/input_block.py << 'EOF'
"""Bloque de entrada para agente contable."""
from typing import Dict, Any
from ..base.block import Block, BlockResult


class AccountingInputBlock(Block):
    """Bloque que recibe y normaliza el input."""

    def __init__(self):
        super().__init__("input", "input")

    async def execute(self, state: Dict[str, Any]) -> BlockResult:
        """Procesar input del usuario."""
        input_text = state.get("input", "")

        if not input_text:
            return BlockResult(
                success=False,
                error="Input vacío"
            )

        return BlockResult(
            success=True,
            data={"processed_input": input_text.strip()},
            next_state={"current_block": self.id}
        )
EOF

# Extract Block
cat > agent-core/src/blocks/accounting/extract_block.py << 'EOF'
"""Bloque de extracción de datos de documentos."""
from typing import Dict, Any
from ..base.block import Block, BlockResult


class ExtractBlock(Block):
    """Bloque que extrae datos de facturas y documentos."""

    def __init__(self):
        super().__init__("extract", "tool")

    async def execute(self, state: Dict[str, Any]) -> BlockResult:
        """Extraer datos del documento."""
        # TODO: Implementar extracción real con LLM
        # Por ahora retorna estructura de ejemplo

        mock_data = {
            "numero_factura": "001-2345",
            "fecha": "2024-07-15",
            "proveedor": "Office Depot",
            "monto_total": 1500.00,
            "iva": 315.00,
            "neto": 1185.00,
            "descripcion": "Suministros de oficina"
        }

        return BlockResult(
            success=True,
            data=mock_data,
            next_state={
                "documents": {
                    "type": "invoice",
                    "data": mock_data
                },
                "current_block": self.id
            }
        )
EOF

# LLM Block
cat > agent-core/src/blocks/accounting/llm_block.py << 'EOF'
"""Bloque LLM para razonamiento contable."""
from typing import Dict, Any
from ..base.block import Block, BlockResult


class AccountingLLMBlock(Block):
    """Bloque LLM especializado en contabilidad."""

    def __init__(self):
        super().__init__("llm", "llm")

    async def execute(self, state: Dict[str, Any]) -> BlockResult:
        """Ejecutar razonamiento contable."""
        # TODO: Implementar llamada real a OpenAI/Anthropic
        # Por ahora retorna asiento de ejemplo

        mock_entry = {
            "fecha": "2024-07-15",
            "descripcion": "Suministros de oficina - Office Depot",
            "debe": [
                {
                    "cuenta": "6100-Suministros",
                    "codigo": "6100",
                    "monto": 1500.00
                }
            ],
            "haber": [
                {
                    "cuenta": "2100-Proveedores",
                    "codigo": "2100",
                    "monto": 1500.00
                }
            ]
        }

        return BlockResult(
            success=True,
            data=mock_entry,
            next_state={
                "entry": mock_entry,
                "current_block": self.id
            }
        )
EOF

# Output Block
cat > agent-core/src/blocks/accounting/output_block.py << 'EOF'
"""Bloque de salida para formatear resultados."""
from typing import Dict, Any
from ..base.block import Block, BlockResult


class AccountingOutputBlock(Block):
    """Bloque que formatea y presenta resultados."""

    def __init__(self):
        super().__init__("output", "output")

    async def execute(self, state: Dict[str, Any]) -> BlockResult:
        """Formatear output para el usuario."""
        entry = state.get("entry")

        if not entry:
            return BlockResult(
                success=False,
                error="No hay asiento para formatear"
            )

        formatted = {
            "exito": True,
            "mensaje": "Asiento contable generado",
            "asiento": entry,
            "visual": self._format_visual(entry)
        }

        return BlockResult(
            success=True,
            data=formatted
        )

    def _format_visual(self, entry: Dict) -> str:
        """Generar representación visual del asiento."""
        lines = [
            "┌" + "─" * 60 + "┐",
            "│" + " " * 20 + "ASIENTO CONTABLE" + " " * 24 + "│",
            "├" + "─" * 60 + "┤",
            f"│ Fecha: {entry['fecha']} " + " " * 39 + "│",
            f"│ Descripción: {entry['descripcion'][:50]} " + " " * (9 - len(entry['descripcion'][:50])) + "│",
            "├" + "─" * 60 + "┤",
            "│ DÉBITO" + " " * 50 + "│",
        ]

        for debit in entry.get("debe", []):
            lines.append(f"│  {debit['cuenta']}: ${debit['monto']:.2f}" + " " * (28 - len(debit['cuenta'])) + "│")

        lines.append("├" + "─" * 60 + "┤")
        lines.append("│ HABER" + " " * 50 + "│")

        for credit in entry.get("haber", []):
            lines.append(f"│  {credit['cuenta']}: ${credit['monto']:.2f}" + " " * (28 - len(credit['cuenta'])) + "│")

        lines.append("└" + "─" * 60 + "┘")

        return "\n".join(lines)
EOF

success "Bloques contables creados"

################################################################################
# Paso 4: Crear Agente Contable
################################################################################

log "Creando Agente Contable..."

cat > agent-core/src/agents/accounting_agent.py << 'EOF'
"""Agente de Contabilidad - Implementación principal."""
from typing import Dict, Any, List
from ..blocks.accounting.input_block import AccountingInputBlock
from ..blocks.accounting.extract_block import ExtractBlock
from ..blocks.accounting.llm_block import AccountingLLMBlock
from ..blocks.accounting.output_block import AccountingOutputBlock


class AccountingAgent:
    """Agente especializado en contabilidad."""

    def __init__(self):
        self.blocks = {
            "input": AccountingInputBlock(),
            "extract": ExtractBlock(),
            "llm": AccountingLLMBlock(),
            "output": AccountingOutputBlock()
        }
        self.connections = [
            ("input", "extract"),
            ("extract", "llm"),
            ("llm", "output")
        ]

    async def execute(self, input_text: str) -> Dict[str, Any]:
        """Ejecutar el agente con el input dado."""
        # Estado inicial
        state = {
            "input": input_text,
            "messages": [],
            "context": {},
            "metadata": {
                "start_time": None,
                "tokens_used": 0,
                "current_block": ""
            }
        }

        # Ejecutar bloques en secuencia
        for from_block, to_block in self.connections:
            block = self.blocks[to_block]
            result = await block.execute(state)

            if not result.success:
                return {
                    "success": False,
                    "error": result.error,
                    "block": to_block
                }

            # Actualizar estado
            if result.next_state:
                state.update(result.nextState)

        # Retornar resultado final
        output_block = self.blocks["output"]
        final_result = await output_block.execute(state)

        return {
            "success": final_result.success,
            "data": final_result.data
        }


# Función de conveniencia para usar el agente
async def process_invoice(invoice_text: str) -> Dict[str, Any]:
    """Procesar factura y generar asiento contable."""
    agent = AccountingAgent()
    return await agent.execute(invoice_text)
EOF

success "Agente Contable creado"

################################################################################
# Paso 5: Crear tests
################################################################################

log "Creando tests..."

cat > agent-core/tests/unit/test_accounting_agent.py << 'EOF'
"""Tests para el Agente Contable."""
import pytest
import sys
sys.path.insert(0, 'agent-core/src')

from agents.accounting_agent import AccountingAgent, process_invoice


@pytest.mark.asyncio
async def test_agent_initialization():
    """Test que el agente se inicializa correctamente."""
    agent = AccountingAgent()
    assert agent.blocks is not None
    assert len(agent.blocks) == 4
    assert "input" in agent.blocks
    assert "output" in agent.blocks


@pytest.mark.asyncio
async def test_process_simple_invoice():
    """Test procesamiento de factura simple."""
    result = await process_invoice("Factura de Office Depot por $1,500")

    assert result is not None
    assert "success" in result


@pytest.mark.asyncio
async def test_agent_with_empty_input():
    """Test que el agente maneja input vacío."""
    agent = AccountingAgent()
    result = await agent.execute("")

    assert result["success"] == False
    assert "error" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
EOF

success "Tests creados"

################################################################################
# Paso 6: Crear script de demo
################################################################################

log "Creando script de demo..."

cat > agent-core/demo.py << 'EOF'
"""Demo del Agente Contable."""
import asyncio
import sys
sys.path.insert(0, 'src')

from agents.accounting_agent import process_invoice


async def main():
    """Ejecutar demo."""
    print("🤖 Agente Contable - Demo")
    print("=" * 60)
    print()

    # Ejemplo 1: Factura simple
    print("📄 Ejemplo 1: Factura simple")
    print("-" * 60)

    invoice_text = """
    Factura: 001-2345
    Proveedor: Office Depot
    Fecha: 15/07/2024
    Monto: $1,500.00
    Descripción: Suministros de oficina
    """

    result = await process_invoice(invoice_text)

    if result["success"]:
        print(result["data"]["visual"])
        print()
        print("✅ Asiento generado exitosamente")
    else:
        print(f"❌ Error: {result.get('error')}")

    print()
    print("=" * 60)
    print("Demo completado")


if __name__ == "__main__":
    asyncio.run(main())
EOF

success "Script de demo creado"

################################################################################
# Paso 7: Ejecutar tests
################################################################################

log "Ejecutando tests..."

cd agent-core

if command -v poetry &> /dev/null; then
    poetry run pytest tests/unit/test_accounting_agent.py -v
else
    python -m pytest tests/unit/test_accounting_agent.py -v
fi

cd ..

success "Tests completados"

################################################################################
# Resumen
################################################################################

echo ""
success "═══════════════════════════════════════════════════════"
success "    MOTOR CONTABLE CREADO"
success "═══════════════════════════════════════════════════════"
echo ""
log "Resumen:"
echo "  ✅ Bloques base creados"
echo "  ✅ Bloques contables creados"
echo "  ✅ Agente contable implementado"
echo "  ✅ Tests creados y pasando"
echo "  ✅ Demo script creado"
echo ""
warn "Próximos pasos:"
echo "  1. Ejecutar demo:"
echo "     cd agent-core && python demo.py"
echo ""
echo "  2. Implementar integración real con OpenAI:"
echo "     - Editar agent-core/src/blocks/accounting/extract_block.py"
echo "     - Editar agent-core/src/blocks/accounting/llm_block.py"
echo ""
echo "  3. Ejecutar script 03:"
echo "     bash scripts/03-crear-motor-usuarios.sh"
echo ""
success "¡Motor Contable listo! 🚀"
