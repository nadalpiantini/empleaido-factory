/**
 * DASHBOARD STATS API
 *
 * GET /api/dashboard/stats
 * Returns overall dashboard statistics
 */

import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/supabase-dashboard';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
