import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock response for checking completion status
  return NextResponse.json({
    empleaidoId: id,
    onboarding: {
      phase: 5,
      completed: false,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock response for completing onboarding
  // In production, this would update the database
  return NextResponse.json({
    empleaidoId: id,
    onboarding: {
      phase: 5,
      completed: true,
      completedAt: new Date().toISOString(),
    },
    user: {
      preferences: {},
    },
    success: true,
  });
}
