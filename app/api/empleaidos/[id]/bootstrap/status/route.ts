import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/empleaidos/[id]/bootstrap/status
 *
 * Returns bootstrap completion status for an Empleaido
 * TODO: Integrate with Supabase ef_adoptions table
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: empleaidoId } = await params;

    // TODO: Fetch from Supabase
    // const { data: adoption } = await supabase
    //   .from('ef_adoptions')
    //   .select('bootstrap_phase, bootstrap_completed')
    //   .eq('empleaido_id', empleaidoId)
    //   .single();

    // Mock data for now
    const bootstrapData = {
      empleaido_id: empleaidoId,
      bootstrap_phase: 1, // 1=identity, 2=skills, 3=preferences, 4=complete
      bootstrap_completed: false,
      life: {
        level: 1,
        experience: 0,
        trust: 0.6,
        energy: 100,
      },
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(bootstrapData);
  } catch (error) {
    console.error('Bootstrap status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bootstrap status',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/empleaidos/[id]/bootstrap/status
 *
 * Update bootstrap status for an Empleaido
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: empleaidoId } = await params;
    const body = await request.json();

    // Validate input
    const { phase, completed } = body;
    if (typeof phase !== 'number' && typeof completed !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body. Expected { phase?: number, completed?: boolean }',
        },
        { status: 400 }
      );
    }

    // TODO: Update in Supabase
    // await supabase
    //   .from('ef_adoptions')
    //   .update({
    //     bootstrap_phase: phase,
    //     bootstrap_completed: completed,
    //   })
    //   .eq('empleaido_id', empleaidoId);

    return NextResponse.json({
      success: true,
      empleaido_id: empleaidoId,
      bootstrap_phase: phase || 1,
      bootstrap_completed: completed || false,
    });
  } catch (error) {
    console.error('Bootstrap update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update bootstrap status',
      },
      { status: 500 }
    );
  }
}
