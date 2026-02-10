import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock response for getting preferences
  return NextResponse.json({
    empleaidoId: id,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let preferences = {};
  try {
    preferences = await request.json();
  } catch (e) {
    // Body might be empty, that's ok
  }

  // Mock response for saving user preferences
  // In production, this would update the database
  return NextResponse.json({
    empleaidoId: id,
    user: {
      preferences: preferences || {},
    },
  });
}
