/**
 * Publish Engine API Route
 * POST /api/engines/[id]/publish - Publish engine to marketplace
 */

import { createRouteHandlerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createRouteHandlerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('ef_user_profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Check permission
    if (profile.role !== 'developer' && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get engine
    const { data: engine } = await supabase
      .from('ef_engines')
      .select('*')
      .eq('id', id)
      .single();

    if (!engine) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }

    // Check ownership
    if (engine.developer_id !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot publish already published engines
    if (engine.status === 'published') {
      return NextResponse.json({ error: 'Engine already published' }, { status: 400 });
    }

    // Publish engine
    const { data: updated, error } = await supabase
      .from('ef_engines')
      .update({
        status: 'published',
        is_public: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Engine publish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
