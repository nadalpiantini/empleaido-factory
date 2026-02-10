/**
 * Empleaido Chat API with Onboarding Integration
 * Handles messages, routes to onboarding or operational mode
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  processOnboardingMessage,
  getOnboardingState,
  type OnboardingPhase,
} from '@/lib/onboarding/phases/state-machine';
import {
  validateSkillExecution,
  logSkillExecution,
  generateSafetyRejection,
} from '@/lib/onboarding/guards/skill-guards';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, empleaidoId, message } = await request.json();

    if (!userId || !empleaidoId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, empleaidoId, message' },
        { status: 400 }
      );
    }

    // 1. Get adoption record
    const { data: adoption, error: adoptionError } = await supabase
      .from('ef_adoptions')
      .select('*')
      .eq('user_id', userId)
      .eq('empleaido_id', empleaidoId.toLowerCase())
      .single();

    if (adoptionError || !adoption) {
      return NextResponse.json(
        { error: 'Adoption not found' },
        { status: 404 }
      );
    }

    // 2. Check onboarding state
    const onboardingState = await getOnboardingState(adoption.id);

    // 3. Route to appropriate handler
    if (!onboardingState || onboardingState.currentPhase !== 'operational') {
      // === ONBOARDING MODE ===
      const result = await processOnboardingMessage(adoption.id, message);

      // Update USER.md if preferences changed
      if (result.shouldUpdateUser) {
        await updateUserPreferences(
          adoption.workspace_path,
          onboardingState?.userPreferences || {}
        );
      }

      return NextResponse.json({
        response: result.response,
        mode: 'onboarding',
        phase: result.newPhase || onboardingState?.currentPhase,
      });
    } else {
      // === OPERATIONAL MODE ===
      return await handleOperationalMessage(adoption, message);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

/**
 * Handle messages in operational mode (after onboarding complete)
 */
async function handleOperationalMessage(adoption: any, message: string) {
  // 1. Classify intent
  const intent = await classifyIntent(message, adoption.empleaido_id);

  // 2. If skill execution, validate first
  if (intent.type === 'skill_execution') {
    const validation = await validateSkillExecution({
      empleaidoId: adoption.empleaido_id,
      skill: intent.skill,
      input: intent.input,
      userId: adoption.user_id,
    });

    if (!validation.allowed) {
      // Log rejection
      await logSkillExecution(
        { empleaidoId: adoption.empleaido_id, skill: intent.skill, input: intent.input, userId: adoption.user_id },
        null,
        validation
      );

      return NextResponse.json({
        response: generateSafetyRejection(
          { empleaidoId: adoption.empleaido_id, skill: intent.skill, input: intent.input, userId: adoption.user_id },
          validation
        ),
        mode: 'operational',
        rejected: true,
      });
    }

    // 3. Execute skill
    const result = await executeSkill(intent.skill, intent.input);

    // 4. Update life stats
    await updateLifeStats(adoption.id, intent.skill, true);

    // 5. Log execution
    await logSkillExecution(
      { empleaidoId: adoption.empleaido_id, skill: intent.skill, input: intent.input, userId: adoption.user_id },
      result,
      { allowed: true }
    );

    return NextResponse.json({
      response: formatSkillResult(result),
      mode: 'operational',
      skillExecuted: intent.skill,
    });
  }

  // 4. General conversation (no skill)
  const response = await generateConversationalResponse(message, adoption);

  return NextResponse.json({
    response,
    mode: 'operational',
  });
}

/**
 * Classify user intent
 */
async function classifyIntent(message: string, empleaidoId: string) {
  // TODO: Implement LLM-based intent classification
  // For now, simple keyword matching

  const lower = message.toLowerCase();

  if (lower.includes('factura') || lower.includes('ncf')) {
    return {
      type: 'skill_execution',
      skill: 'parse_invoice',
      input: { text: message },
    };
  }

  if (lower.includes('itbis') || lower.includes('impuesto')) {
    return {
      type: 'skill_execution',
      skill: 'calculate_itbis',
      input: { query: message },
    };
  }

  return {
    type: 'conversation',
  };
}

/**
 * Execute skill (TODO: Connect to actual skill implementations)
 */
async function executeSkill(skill: string, input: any) {
  // TODO: Implement actual skill execution
  // For now, mock response
  return {
    success: true,
    result: `${skill} executed with input: ${JSON.stringify(input)}`,
  };
}

/**
 * Format skill result for user
 */
function formatSkillResult(result: any): string {
  if (result.success) {
    return `✅ Tarea completada:\n\n${result.result}`;
  }
  return `❌ Hubo un error: ${result.error}`;
}

/**
 * Generate conversational response (no skill)
 */
async function generateConversationalResponse(message: string, adoption: any) {
  // TODO: Connect to OpenClaw agent for real conversation
  // For now, simple echo

  const empleaidoNames: Record<string, string> = {
    sera: 'SERA',
    kael: 'KAEL',
    nora: 'NORA',
    lior: 'LIOR',
    ziv: 'ZIV',
  };

  const name = empleaidoNames[adoption.empleaido_id] || 'Tu empleaido';

  return `Entiendo. ${name} está procesando tu solicitud: "${message}"`;
}

/**
 * Update USER.md with learned preferences
 */
async function updateUserPreferences(workspacePath: string, preferences: any) {
  // TODO: Update USER.md file in OpenClaw workspace
  console.log('Updating USER.md with preferences:', preferences);
}

/**
 * Update life stats after skill execution
 */
async function updateLifeStats(adoptionId: string, skill: string, success: boolean) {
  // TODO: Update XP, Trust, Energy in database
  const xpGain = success ? 10 : 0;
  const trustGain = success ? 0.01 : 0;

  await supabase
    .from('ef_adoptions')
    .update({
      confidence: Math.min(1, supabase.rpc('increment', { value: trustGain })),
    })
    .eq('id', adoptionId);

  console.log(`Life stats updated: +${xpGain} XP, +${trustGain} Trust`);
}
