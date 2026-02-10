import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock response for getting current phase
  return NextResponse.json({
    empleaidoId: id,
    onboarding: {
      phase: 0,
      completed: false,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
  } catch (e) {
    // Body might be empty, that's ok
  }

  // Mock response for updating onboarding phase
  // In production, this would update the database
  return NextResponse.json({
    empleaidoId: id,
    onboarding: {
      phase: 1,
      completed: false,
      data: {},
    },
  });
}
