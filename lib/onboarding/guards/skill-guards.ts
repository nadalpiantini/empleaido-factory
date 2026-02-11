/**
 * Skill Reliability Guards
 * Pre-execution validation to prevent hallucinations and ensure safety
 */

import { empleaidoSkills } from '@/lib/onboarding/data/empleaido-skills';

export interface SkillExecutionRequest {
  empleaidoId: string;
  skill: string;
  input: any;
  userId: string;
}

export interface SkillValidationResult {
  allowed: boolean;
  reason?: string;
  alternativeSkills?: string[];
}

/**
 * Main skill validation gate
 * ALL skill executions MUST pass through this
 */
export async function validateSkillExecution(
  request: SkillExecutionRequest
): Promise<SkillValidationResult> {
  // 1. Check if skill exists
  const skillRegistry = empleaidoSkills[request.empleaidoId];
  if (!skillRegistry) {
    return {
      allowed: false,
      reason: `Empleaido ${request.empleaidoId} not found`,
    };
  }

  // 2. Check if skill is in registry
  const skillDef = skillRegistry[request.skill];
  if (!skillDef) {
    return {
      allowed: false,
      reason: `Skill "${request.skill}" not found in ${request.empleaidoId}'s registry`,
      alternativeSkills: Object.keys(skillRegistry),
    };
  }

  // 3. Check if skill is locked (upgrade required)
  if (skillDef.status === 'locked') {
    return {
      allowed: false,
      reason: `Skill "${request.skill}" requires upgrade to unlock`,
      alternativeSkills: getUnlockedSkills(skillRegistry),
    };
  }

  // 4. Validate input schema
  const inputValidation = validateInput(request.input, skillDef.inputSchema);
  if (!inputValidation.valid) {
    return {
      allowed: false,
      reason: `Invalid input: ${inputValidation.error}`,
    };
  }

  // 5. Check if critical task (requires user confirmation)
  if (skillDef.critical) {
    return {
      allowed: true,
      reason: 'CRITICAL: Requires user confirmation before saving result',
    };
  }

  // 6. All checks passed
  return { allowed: true };
}

/**
 * Input validation against schema
 */
function validateInput(input: any, schema: any): { valid: boolean; error?: string } {
  if (!schema) {
    return { valid: true }; // No schema defined, allow
  }

  // Required fields check
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in input) || input[field] === null || input[field] === undefined) {
        return {
          valid: false,
          error: `Missing required field: ${field}`,
        };
      }
    }
  }

  // Type check
  if (schema.properties) {
    for (const [field, fieldSchema] of Object.entries(schema.properties)) {
      if (field in input) {
        const type = (fieldSchema as any).type;
        if (type && typeof input[field] !== type) {
          return {
            valid: false,
            error: `Field ${field} must be ${type}, got ${typeof input[field]}`,
          };
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Get list of unlocked (available) skills
 */
function getUnlockedSkills(skillRegistry: any): string[] {
  return Object.entries(skillRegistry)
    .filter(([_, def]: [string, any]) => def.status === 'native')
    .map(([name]) => name);
}

/**
 * Safety rejection response generator
 */
export function generateSafetyRejection(request: SkillExecutionRequest, result: SkillValidationResult): string {
  const empleaidoNames: Record<string, string> = {
    sera: 'SERA',
    kael: 'KAEL',
    nora: 'NORA',
    lior: 'LIOR',
    ziv: 'ZIV',
  };

  const name = empleaidoNames[request.empleaidoId] || 'Tu empleaido';

  if (result.reason?.includes('upgrade')) {
    return `
Lo siento, la habilidad "${request.skill}" requiere un upgrade de tu plan.

**Lo que SÍ puedo hacer:**
${result.alternativeSkills?.map(s => `✅ ${s}`).join('\n')}

**¿Quieres ver las opciones de upgrade?**
    `.trim();
  }

  if (result.reason?.includes('not found')) {
    return `
No tengo la habilidad "${request.skill}" en mi repertoire.

Estoy especializada en:
${result.alternativeSkills?.map(s => `✅ ${s}`).join('\n')}

¿Quieres ayuda con algo de esto?
    `.trim();
  }

  if (result.reason?.includes('Invalid input')) {
    return `
Faltan datos para ejecutar esta tarea:

${result.reason}

Por favor proporciona: ${JSON.stringify(getMissingFields(request.input))}
    `.trim();
  }

  // Default safety rejection
  return `
Lo siento, no puedo ejecutar esa tarea por motivos de seguridad y precisión.

${result.reason}

¿Puedo ayudarte con algo más?
  `.trim();
}

function getMissingFields(input: any): string[] {
  // Simple implementation
  return Object.entries(input)
    .filter(([_, v]) => v === null || v === undefined || v === '')
    .map(([k]) => k);
}

/**
 * Critical task handler
 * For financial/legal tasks requiring confirmation
 */
export async function executeCriticalSkill(
  request: SkillExecutionRequest,
  executeFn: () => Promise<any>
): Promise<{ success: boolean; result?: any; error?: string }> {
  // 1. Execute skill
  const result = await executeFn();

  // 2. Return result for user confirmation
  return {
    success: true,
    result,
    // Caller must show this to user and get confirmation before saving
  };
}

/**
 * Professional disclaimers
 */
export const PROFESSIONAL_DISCLAIMERS = {
  footer: `
---
*Este empleaido es una herramienta de apoyo. No sustituye asesoría profesional certificada.*
  `.trim(),

  legal: '*Para decisiones legales, consulta con un abogado.*',
  financial: '*Para asesoría fiscal completa, consulta con un contador certificado.*',
  dgii: '*Este sistema no tiene representación autorizada ante DGII.*',
};

/**
 * Audit logging for all skill executions
 */
export async function logSkillExecution(
  request: SkillExecutionRequest,
  result: any,
  validation: SkillValidationResult
) {
  // TODO: Implement audit logging to database
  // Table: ef_empleaido_events
  console.log('[AUDIT]', {
    timestamp: new Date().toISOString(),
    empleaidoId: request.empleaidoId,
    userId: request.userId,
    skill: request.skill,
    allowed: validation.allowed,
    reason: validation.reason,
    result: result,
  });
}
