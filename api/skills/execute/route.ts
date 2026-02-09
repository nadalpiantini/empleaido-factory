/**
 * SKILL EXECUTION API
 *
 * Executes Empleaido skills with full safety checks and reliability framework
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import {
  executeSkillSafely,
  confirmSkillResult,
  generateOutOfScopeResponse,
  generateSafetyRejectionResponse,
  checkSafetyRejection,
  SkillCheckResult,
} from '@/lib/skill-reliability';

export async function POST(request: NextRequest) {
  try {
    const { empleaidoId, userId, skill, inputs, userConfirmed } = await request.json();

    const supabase = createRouteHandlerClient();

    // Get empleaido details
    const { data: empleaido, error: empleaidoError } = await supabase
      .from('ef_empleaidos')
      .select('*')
      .eq('id', empleaidoId)
      .single();

    if (empleaidoError || !empleaido) {
      return NextResponse.json(
        { error: 'Empleaido not found' },
        { status: 404 }
      );
    }

    // Check if this is a confirmation of a critical task
    if (userConfirmed) {
      await confirmSkillResult(empleaidoId, userId, skill, inputs.result);
      return NextResponse.json({
        success: true,
        confirmed: true,
        message: 'Resultado confirmado y guardado',
      });
    }

    // Execute skill with all safety checks
    const result = await executeSkillSafely(
      empleaido,
      userId,
      skill,
      inputs,
      async (skillInputs: Record<string, unknown>) => {
        // This is where the actual skill execution happens
        // For now, we'll simulate it
        return executeSkillImplementation(skill, skillInputs);
      }
    );

    // Handle different result types
    if (!result.success) {
      // Check if it's a safety rejection
      const safetyCheck = checkSafetyRejection(skill);
      if (safetyCheck) {
        return NextResponse.json({
          success: false,
          type: 'safety_rejection',
          message: generateSafetyRejectionResponse(safetyCheck),
          escalation: safetyCheck.escalation,
        });
      }

      // It's an out-of-scope request
      return NextResponse.json({
        success: false,
        type: 'out_of_scope',
        message: result.error,
        suggestion: generateOutOfScopeResponse(
          { result: SkillCheckResult.OUT_OF_SCOPE, reason: result.error || '' },
          empleaido
        ),
      });
    }

    // If successful but requires confirmation
    if (result.requiresConfirmation) {
      return NextResponse.json({
        success: true,
        requiresConfirmation: true,
        result: result.result,
        message: formatVerificationMessage(result.result || {}),
      });
    }

    // Successful execution
    return NextResponse.json({
      success: true,
      result: result.result,
      message: 'Skill ejecutada exitosamente',
    });
  } catch (error) {
    console.error('Skill execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'execution_error',
      },
      { status: 500 }
    );
  }
}

/**
 * Actual skill implementation
 * This would connect to your skill execution logic
 */
async function executeSkillImplementation(
  skill: string,
  inputs: Record<string, unknown>
): Promise<Record<string, unknown>> {
  // Mock implementations for demo purposes
  // In production, this would call your actual skill logic

  switch (skill.toLowerCase()) {
    case 'ocr_facturas':
      return {
        success: true,
        facturas_procesadas: 15,
        total_itbis: 15750,
        detalle: [
          { ncf: 'B0100100001', rnc: '123456789', itbis: 1050 },
          { ncf: 'B0100100002', rnc: '987654321', itbis: 2100 },
        ],
      };

    case 'itbis_mensual':
      return {
        success: true,
        periodo: inputs.periodo || '2026-01',
        total_itbis: 45750,
        facturas: Array.isArray(inputs.facturas) ? inputs.facturas.length : 15,
        desglose: {
          itbis_18: 41250,
          itbis_16: 4500,
        },
      };

    case 'clasificacion_ncf':
      return {
        success: true,
          comprobante: inputs.comprobante,
          tipo: 'Crédito Fiscal',
          regimen: 'Régimen Simplificado',
          valida: true,
        };

    case 'alertas_dgii':
      return {
        success: true,
        alertas: [
          {
            tipo: 'vencimiento',
            fecha: '2026-02-20',
            descripcion: 'Vence plazo para declarar ITBIS mensual',
          },
        ],
      };

    default:
      throw new Error(`Skill not implemented: ${skill}`);
  }
}

function formatVerificationMessage(result: Record<string, unknown>): string {
  return `
He calculado el siguiente resultado:

${JSON.stringify(result, null, 2)}

⚠️ **IMPORTANTE**: Antes de guardar, por favor revisa este resultado.
¿Confirmas que es correcto y puedo guardarlo?
  `.trim();
}
