import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Mock response for updating onboarding phase
  // In production, this would update the database
  return NextResponse.json({
    empleaidoId: id,
    onboarding: {
      phase: body.phase || 1,
      data: body.data || {},
    },
  });
}
