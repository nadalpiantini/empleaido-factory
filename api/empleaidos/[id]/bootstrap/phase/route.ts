import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/empleaidos/[id]/bootstrap/phase
 *
 * Get current bootstrap phase details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: empleaidoId } = await params;

    // TODO: Fetch from Supabase
    const phaseData = {
      empleaido_id: empleaidoId,
      current_phase: 1,
      phases: {
        1: {
          name: 'Identity',
          description: 'Configure your Empleaido\'s personality and name',
          completed: true,
        },
        2: {
          name: 'Skills',
          description: 'Select which skills to activate',
          completed: false,
        },
        3: {
          name: 'Preferences',
          description: 'Set communication preferences',
          completed: false,
        },
      },
    };

    return NextResponse.json(phaseData);
  } catch (error) {
    console.error('Phase fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch phase data',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/empleaidos/[id]/bootstrap/phase
 *
 * Advance to next bootstrap phase
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: empleaidoId } = await params;
    const body = await request.json();

    const { phase } = body;
    if (typeof phase !== 'number' || phase < 1 || phase > 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phase. Must be 1, 2, or 3',
        },
        { status: 400 }
      );
    }

    // TODO: Update in Supabase
    return NextResponse.json({
      success: true,
      empleaido_id: empleaidoId,
      current_phase: phase,
      message: `Advanced to phase ${phase}`,
    });
  } catch (error) {
    console.error('Phase update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update phase',
      },
      { status: 500 }
    );
  }
}
