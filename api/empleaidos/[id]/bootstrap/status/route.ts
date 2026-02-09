/**
 * BOOTSTRAP STATUS API
 *
 * Gets current onboarding status for an Empleaido
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const empleaidoId = params.id;
    const supabase = createRouteHandlerClient();

    // Get adoption with onboarding status
    const { data: adoption, error } = await supabase
      .from('ef_adoptions')
      .select('*')
      .eq('empleaido_id', empleaidoId)
      .single();

    if (error || !adoption) {
      return NextResponse.json(
        { error: 'Adoption not found' },
        { status: 404 }
      );
    }

    // Get life stats
    const { data: lifeEvents } = await supabase
      .from('ef_life_events')
      .select('xp_gain, event_type, timestamp')
      .eq('empleaido_id', empleaidoId)
      .order('timestamp', { ascending: false });

    // Calculate stats
    const totalXP = lifeEvents?.reduce((sum: number, event: { xp_gain?: number }) => sum + (event.xp_gain || 0), 0) || 0;
    const completedPhases = adoption.onboarding_phase || 0;

    // Get empleaido details
    const { data: empleaido } = await supabase
      .from('ef_empleaidos')
      .select('*')
      .eq('id', empleaidoId)
      .single();

    return NextResponse.json({
      empleaido: {
        id: empleaido.id,
        name: empleaido.name,
        serial: empleaido.serial,
        sephirot: empleaido.sephirot,
        role: empleaido.role,
      },
      onboarding: {
        phase: completedPhases,
        completed: completedPhases >= 5,
        startedAt: adoption.created_at,
        lastUpdate: adoption.updated_at,
        data: adoption.onboarding_data || {},
      },
      user: {
        preferences: adoption.user_preferences || {},
      },
      life: {
        level: empleaido?.level || 1,
        experience: totalXP,
        trust: adoption.trust_score || 0,
        energy: empleaido?.energy || 100,
      },
      progress: {
        phasePercentage: (completedPhases / 5) * 100,
        interactionsToNextPhase: getInteractionsToNextPhase(completedPhases),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getInteractionsToNextPhase(currentPhase: number): number {
  const requirements: Record<number, number> = {
    0: 1,   // Start onboarding with first interaction
    1: 3,   // After awakening, need 3 interactions for phase 2
    2: 5,   // After Sephirot, need 5 interactions for phase 3
    3: 7,   // After user learning, need 7 interactions for phase 4
    4: 10,  // After scope, need 10 interactions for completion
    5: 0,   // Complete!
  };
  return requirements[currentPhase] || 0;
}
