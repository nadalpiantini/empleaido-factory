import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock response for onboarding status
  // In production, this would fetch from a database
  return NextResponse.json({
    empleaidoId: id,
    onboarding: {
      phase: 0,
      completed: false,
      data: {
        messages: [],
      },
    },
    user: {
      preferences: {
        language: 'spanish',
        formality: 'casual',
        proactivity: 'high',
        communication: 'balanced',
        detailLevel: 'medium',
      },
    },
  });
}
