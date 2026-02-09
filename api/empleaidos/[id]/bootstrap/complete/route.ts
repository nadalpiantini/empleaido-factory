/**
 * BOOTSTRAP COMPLETE API
 *
 * Marks onboarding as complete and deletes BOOTSTRAP.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const empleaidoId = params.id;
    const supabase = createRouteHandlerClient();

    // Get adoption
    const { data: adoption, error: fetchError } = await supabase
      .from('ef_adoptions')
      .select('empleaido_serial, user_id')
      .eq('empleaido_id', empleaidoId)
      .single();

    if (fetchError || !adoption) {
      return NextResponse.json(
        { error: 'Adoption not found' },
        { status: 404 }
      );
    }

    // Mark onboarding complete
    const { error: updateError } = await supabase
      .from('ef_adoptions')
      .update({
        onboarding_phase: 5,
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('empleaido_id', empleaidoId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Delete BOOTSTRAP.md from workspace
    const workspacePath = join(
      process.env.HOME || '',
      '.openclaw',
      `workspace-empleaido-${empleaidoId}-${adoption.empleaido_serial}`
    );

    const bootstrapPath = join(workspacePath, 'BOOTSTRAP.md');

    if (existsSync(bootstrapPath)) {
      unlinkSync(bootstrapPath);
    }

    // Award completion XP and Level Up
    await supabase.from('ef_life_events').insert({
      empleaido_id: empleaidoId,
      user_id: adoption.user_id,
      event_type: 'onboarding_complete',
      xp_gain: 100,
      level_gain: 1,
      timestamp: new Date().toISOString(),
    });

    // Update empleaido level to 2
    await supabase
      .from('ef_empleaidos')
      .update({ level: 2 })
      .eq('id', empleaidoId);

    // Get final stats
    const { data: lifeEvents } = await supabase
      .from('ef_life_events')
      .select('xp_gain')
      .eq('empleaido_id', empleaidoId);

    const totalXP = lifeEvents?.reduce((sum: number, e: { xp_gain?: number }) => sum + (e.xp_gain || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      message: '¡Onboarding completado! 🎉',
      empleaido: {
        level: 2,
        experience: totalXP,
      },
      celebration: {
        title: '¡Adaptación Completa!',
        message: 'Has completado tu periodo de adaptación y estás listo para trabajar a largo plazo.',
        stats: {
          phase: 5,
          xp: totalXP,
          level: 2,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
