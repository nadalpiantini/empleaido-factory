/**
 * DASHBOARD ACTIVITY API
 *
 * GET /api/dashboard/activity
 * Returns activity timeline for dashboard
 */

import { NextResponse } from 'next/server';
import { getActivityTimeline } from '@/lib/supabase-dashboard';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const activities = await getActivityTimeline(limit);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activity timeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity timeline' },
      { status: 500 }
    );
  }
}
