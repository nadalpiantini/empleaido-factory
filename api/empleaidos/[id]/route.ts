/**
 * EMPLEAIDO GET API
 *
 * Returns single Empleaido from catalog
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Load catalog
    const catalogPath = `${process.cwd()}/../catalog/empleaidos.json`;
    const fs = await import('fs');
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    const empleaido = catalogData.find((e: any) => e.id === id);

    if (!empleaido) {
      return NextResponse.json({
        success: false,
        error: 'Empleaido not found'
      }, { status: 404 });
    }

    return NextResponse.json(empleaido);
  } catch (error) {
    console.error('❌ Empleaido GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load Empleaido'
    }, { status: 500 });
  }
}
