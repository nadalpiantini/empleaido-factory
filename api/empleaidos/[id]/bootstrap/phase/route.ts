/**
 * BOOTSTRAP PHASE API
 *
 * Tracks onboarding phase progress for an Empleaido
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const empleaidoId = params.id;
    const { phase, data } = await request.json();

    const supabase = createRouteHandlerClient();

    // Get current adoption
    const { data: adoption, error: fetchError } = await supabase
      .from('ef_adoptions')
      .select('*')
      .eq('empleaido_id', empleaidoId)
      .single();

    if (fetchError || !adoption) {
      return NextResponse.json(
        { error: 'Adoption not found' },
        { status: 404 }
      );
    }

    // Update onboarding status
    const { error: updateError } = await supabase
      .from('ef_adoptions')
      .update({
        onboarding_phase: phase,
        onboarding_data: {
          ...(adoption.onboarding_data || {}),
          ...data,
          completed_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('empleaido_id', empleaidoId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Log life event for phase completion
    await supabase.from('ef_life_events').insert({
      empleaido_id: empleaidoId,
      user_id: adoption.user_id,
      event_type: 'onboarding_phase_complete',
      phase,
      xp_gain: getPhaseXPGain(phase),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      phase,
      message: getPhaseMessage(phase),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getPhaseXPGain(phase: number): number {
  const xpMap: Record<number, number> = {
    1: 5,   // Awakening
    2: 10,  // Sephirot discovery
    3: 15,  // User learning
    4: 5,   // Skill scope
    5: 50,  // Integration complete
  };
  return xpMap[phase] || 0;
}

function getPhaseMessage(phase: number): string {
  const messages: Record<number, string> = {
    1: '¡Primer contacto completado! Has despertado.',
    2: 'Has descubierto tu Sephirah y cómo afecta tu trabajo.',
    3: 'Has aprendido las preferencias de tu usuario.',
    4: 'Has establecido límites profesionales claros.',
    5: '¡Onboarding completado! Estás listo para trabajar a largo plazo.',
  };
  return messages[phase] || 'Fase completada';
}
