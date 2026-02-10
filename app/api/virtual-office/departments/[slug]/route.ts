/**
 * VIRTUAL OFFICE DEPARTMENT DETAIL API
 *
 * GET /api/virtual-office/departments/[slug]
 * Returns department details and activity
 */

import { NextResponse } from 'next/server';
import { getDepartmentBySlug, getDepartmentActivity } from '@/lib/supabase-dashboard';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const department = await getDepartmentBySlug(slug);

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    // Get recent activity for this department
    const activity = await getDepartmentActivity(department.id, 10);

    return NextResponse.json({
      ...department,
      recent_activity: activity,
    });
  } catch (error) {
    console.error('Error fetching department details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department details' },
      { status: 500 }
    );
  }
}
