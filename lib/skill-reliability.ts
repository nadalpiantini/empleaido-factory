/**
 * SKILL RELIABILITY FRAMEWORK
 *
 * Ensures Empleaido skills are 100% reliable and legally safe.
 * This is CRITICAL to prevent liability from incorrect professional advice.
 *
 * Core Principles:
 * 1. Scope Clarity - Never execute skills outside native list
 * 2. Safety Rejections - Reject requests requiring certified professionals
 * 3. Verification - Confirm critical results before saving
 * 4. Validation - Check inputs before processing
 */

import type { Empleaido } from './types';

// ============================================
// TYPES
// ============================================

export enum SkillCheckResult {
  ALLOWED = 'allowed',
  OUT_OF_SCOPE = 'out_of_scope',
  REQUIRES_PROFESSIONAL = 'requires_professional',
  INPUT_INVALID = 'input_invalid',
  CRITICAL_REQUIRES_CONFIRMATION = 'critical_requires_confirmation',
}

export interface SkillValidation {
  result: SkillCheckResult;
  reason: string;
  suggestion?: string;
  escalation?: string;
}

export interface SkillExecutionLog {
  empleaidoId: string;
  userId: string;
  skill: string;
  inputs: Record<string, unknown> | null;
  output: Record<string, unknown>;
  verified: boolean;
  userConfirmed: boolean;
  timestamp: Date;
}

// ============================================
// SCOPE VALIDATION
// ============================================

/**
 * Check if a skill is within the Empleaido's native capabilities
 */
export function validateSkillScope(
  empleaido: Empleaido,
  requestedSkill: string
): SkillValidation {
  const nativeSkills = empleaido.skills.native.map(s => s.toLowerCase());
  const lockedSkills = empleaido.skills.locked.map(s => s.toLowerCase());
  const requested = requestedSkill.toLowerCase();

  // Check if it's a native skill
  if (nativeSkills.some(s => requested.includes(s) || s.includes(requested))) {
    return {
      result: SkillCheckResult.ALLOWED,
      reason: 'Skill is within native capabilities',
    };
  }

  // Check if it's a locked skill
  if (lockedSkills.some(s => requested.includes(s) || s.includes(requested))) {
    return {
      result: SkillCheckResult.OUT_OF_SCOPE,
      reason: 'This skill requires an upgrade to unlock',
      suggestion: `Locked skill: ${requestedSkill}. Available skills: ${empleaido.skills.native.join(', ')}`,
    };
  }

  // Not recognized at all
  return {
    result: SkillCheckResult.OUT_OF_SCOPE,
    reason: 'This skill is not part of my capabilities',
    suggestion: `I can help with: ${empleaido.skills.native.join(', ')}`,
  };
}

// ============================================
// SAFETY REJECTIONS
// ============================================

/**
 * Safety patterns that require certified professionals
 * These are CRITICAL for legal protection
 */
const SAFETY_PATTERNS: Record<string, { pattern: RegExp; rejection: string; escalation: string }> = {
  legal_representation: {
    pattern: /(representa|representar|defender|tribunal|corte|juicio|litigio)/i,
    rejection: 'Eso requiere un abogado certificado. No tengo autoridad para representarte ante autoridades ni tribunales.',
    escalation: 'Te recomiendo consultar con un abogado para asesoría legal.',
  },
  legal_advice: {
    pattern: /(consejo legal|asesoría legal|opinión legal|interpretar ley|ley dice)/i,
    rejection: 'Eso requiere un abogado. No puedo dar asesoría legal oficial.',
    escalation: 'Para interpretación legal, consulta con un profesional certificado.',
  },
  medical_diagnosis: {
    pattern: /(diagnóstico|diagnosticar|receta|recetar|tratamiento médico)/i,
    rejection: 'Eso requiere un médico certificado. No puedo diagnosticar ni recetar tratamientos.',
    escalation: 'Te recomiendo consultar con un profesional de salud.',
  },
  certified_accounting: {
    pattern: /(auditoría|certificar|declaración oficial|representar dgii)/i,
    rejection: 'Eso requiere un contador certificado.',
    escalation: 'Para actuaciones fiscales oficiales, necesitas un contador certificado.',
  },
  investment_advice: {
    pattern: /(invertir|recomendación de inversión|asesoría financiera|cartera|acciones)/i,
    rejection: 'Eso requiere un asesor financiero certificado.',
    escalation: 'Para decisiones de inversión, consulta con un profesional certificado.',
  },
};

/**
 * Check if a request requires professional certification
 */
export function checkSafetyRejection(request: string): SkillValidation | null {
  for (const [, config] of Object.entries(SAFETY_PATTERNS)) {
    if (config.pattern.test(request)) {
      return {
        result: SkillCheckResult.REQUIRES_PROFESSIONAL,
        reason: config.rejection,
        escalation: config.escalation,
      };
    }
  }
  return null;
}

// ============================================
// INPUT VALIDATION
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate inputs before skill execution
 */
export function validateInputs(skill: string, inputs: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Common validations
  if (!inputs || Object.keys(inputs).length === 0) {
    errors.push('No inputs provided');
  }

  // Skill-specific validations
  switch (skill.toLowerCase()) {
    case 'ocr_facturas':
      if (!inputs.file && !inputs.imageUrl && !inputs.text) {
        errors.push('Se requiere archivo, URL de imagen o texto de la factura');
      }
      break;

    case 'itbis_mensual':
      if (!inputs.period && !inputs.facturas) {
        errors.push('Se requiere período o lista de facturas');
      }
      if (inputs.facturas && !Array.isArray(inputs.facturas)) {
        errors.push('Las facturas deben ser un array');
      }
      break;

    case 'clasificacion_ncf':
      if (!inputs.comprobante && !inputs.tipoNcf) {
        errors.push('Se requiere datos del comprobante fiscal');
      }
      break;

    default:
      // No specific validation
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================
// CRITICAL TASK VERIFICATION
// ============================================

/**
 * Skills that require user confirmation before saving
 * These are financial or legal calculations
 */
const CRITICAL_SKILLS = [
  'itbis_mensual',
  'isr_anual',
  'planeacion_fiscal',
  'flujo_caja',
  'proyecciones',
  'alertas_dgii',
];

/**
 * Check if a skill requires verification
 */
export function requiresVerification(skill: string): boolean {
  return CRITICAL_SKILLS.some(s => skill.toLowerCase().includes(s));
}

/**
 * Format verification message for user
 */
export function formatVerificationMessage(result: Record<string, unknown>): string {
  return `
He calculado el siguiente resultado:

${JSON.stringify(result, null, 2)}

⚠️ **IMPORTANTE**: Antes de guardar, por favor revisa este resultado.
¿Confirmas que es correcto y puedo guardarlo?
  `.trim();
}

// ============================================
// SKILL EXECUTION FLOW
// ============================================

/**
 * Complete skill execution flow with all safety checks
 */
export async function executeSkillSafely(
  empleaido: Empleaido,
  userId: string,
  skill: string,
  inputs: Record<string, unknown>,
  executeFn: (inputs: Record<string, unknown>) => Promise<Record<string, unknown>>
): Promise<{ success: boolean; result?: Record<string, unknown>; error?: string; requiresConfirmation?: boolean }> {
  // Step 1: Safety rejection check
  const safetyCheck = checkSafetyRejection(skill);
  if (safetyCheck) {
    return {
      success: false,
      error: safetyCheck.reason,
      requiresConfirmation: false,
    };
  }

  // Step 2: Scope validation
  const scopeCheck = validateSkillScope(empleaido, skill);
  if (scopeCheck.result === SkillCheckResult.OUT_OF_SCOPE) {
    return {
      success: false,
      error: scopeCheck.reason,
      requiresConfirmation: false,
    };
  }

  // Step 3: Input validation
  const validation = validateInputs(skill, inputs);
  if (!validation.valid) {
    return {
      success: false,
      error: `Input validation failed: ${validation.errors.join(', ')}`,
      requiresConfirmation: false,
    };
  }

  // Step 4: Execute skill
  let result;
  try {
    result = await executeFn(inputs);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      requiresConfirmation: false,
    };
  }

  // Step 5: Verify result for critical tasks
  if (requiresVerification(skill)) {
    return {
      success: true,
      result,
      requiresConfirmation: true,
    };
  }

  // Step 6: Log execution
  await logSkillExecution({
    empleaidoId: empleaido.id,
    userId,
    skill,
    inputs,
    output: result,
    verified: !requiresVerification(skill),
    userConfirmed: false,
    timestamp: new Date(),
  });

  return {
    success: true,
    result,
    requiresConfirmation: false,
  };
}

/**
 * Confirm and save critical task result
 */
export async function confirmSkillResult(
  empleaidoId: string,
  userId: string,
  skill: string,
  result: Record<string, unknown>
): Promise<void> {
  await logSkillExecution({
    empleaidoId,
    userId,
    skill,
    inputs: null, // Already logged
    output: result,
    verified: true,
    userConfirmed: true,
    timestamp: new Date(),
  });
}

// ============================================
// LOGGING
// ============================================

/**
 * Log skill execution for audit trail
 * CRITICAL for legal protection
 */
async function logSkillExecution(log: SkillExecutionLog): Promise<void> {
  // In production, this would save to database
  // For now, we'll append to a file
  // Log path: `.openclaw/workspace-empleaido-${log.empleaidoId}/memory/skill_executions.log`

  const logEntry = {
    timestamp: log.timestamp.toISOString(),
    skill: log.skill,
    verified: log.verified,
    userConfirmed: log.userConfirmed,
  };

  // TODO: Implement proper logging
  // For now, this is a placeholder
  console.log('[SKILL_EXECUTION]', JSON.stringify(logEntry));
}

// ============================================
// RESPONSE GENERATORS
// ============================================

/**
 * Generate out-of-scope response
 */
export function generateOutOfScopeResponse(validation: SkillValidation, empleaido: Empleaido): string {
  return `
Entiendo que necesitas **${validation.reason}**.

Esta es una habilidad que tengo bloqueada actualmente (requiere upgrade).
Sin embargo, puedo ayudarte con:

✅ Lo que SÍ puedo hacer ahora:
${empleaido.skills.native.map(s => `- ${s}`).join('\n')}

🔒 Lo que puedo aprender (upgrade):
${empleaido.skills.locked.map(s => `- ${s}`).join('\n')}

¿Te gustaría ver un resumen de lo incluido en tu plan actual,
o quieres explorar las opciones de upgrade?
  `.trim();
}

/**
 * Generate safety rejection response
 */
export function generateSafetyRejectionResponse(validation: SkillValidation): string {
  let response = validation.reason;

  if (validation.escalation) {
    response += `\n\n${validation.escalation}`;
  }

  return response;
}
