import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const preferences = await request.json();

  // Mock response for saving user preferences
  // In production, this would update the database
  return NextResponse.json({
    empleaidoId: id,
    user: {
      preferences: preferences || {},
    },
  });
}
