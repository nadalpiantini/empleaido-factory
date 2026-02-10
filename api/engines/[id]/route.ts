/**
 * Single Engine API Route
 * GET, UPDATE, DELETE individual engines
 */

import { createRouteHandlerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import type { EngineResponse, UpdateEngineRequest } from '@/types/engine';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// =====================================================
// GET /api/engines/[id] - Get single engine
// =====================================================

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createRouteHandlerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('ef_user_profiles')
      .select('id, role, tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Fetch engine
    const { data: engine, error } = await supabase
      .from('ef_engines')
      .select('*, developer:ef_user_profiles!inner(name)')
      .eq('id', id)
      .single();

    if (error || !engine) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }

    // Check access: must be owner, public, or same tenant
    const canAccess =
      engine.developer_id === profile.id ||
      engine.is_public ||
      engine.tenant_id === profile.tenant_id;

    if (!canAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const response: EngineResponse = {
      id: engine.id,
      name: engine.name,
      slug: engine.slug,
      description: engine.description,
      version: engine.version,
      category: engine.category,
      status: engine.status,
      is_public: engine.is_public,
      developer_id: engine.developer_id,
      published_at: engine.published_at,
      created_at: engine.created_at,
      updated_at: engine.updated_at,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Engine GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================================
// PATCH /api/engines/[id] - Update engine
// =====================================================

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createRouteHandlerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('ef_user_profiles')
      .select('id, role, tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Fetch engine to check ownership
    const { data: existing } = await supabase
      .from('ef_engines')
      .select('developer_id, tenant_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }

    // Only developer or admin can update
    if (existing.developer_id !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: UpdateEngineRequest = await req.json();

    // Update engine
    const { data: engine, error } = await supabase
      .from('ef_engines')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Engine update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: EngineResponse = {
      id: engine.id,
      name: engine.name,
      slug: engine.slug,
      description: engine.description,
      version: engine.version,
      category: engine.category,
      status: engine.status,
      is_public: engine.is_public,
      developer_id: engine.developer_id,
      published_at: engine.published_at,
      created_at: engine.created_at,
      updated_at: engine.updated_at,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Engine PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================================
// DELETE /api/engines/[id] - Delete engine
// =====================================================

export async function DELETE(req: NextRequest, context: RouteContext) {
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

    // Check ownership
    const { data: existing } = await supabase
      .from('ef_engines')
      .select('developer_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }

    if (existing.developer_id !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete engine
    const { error } = await supabase.from('ef_engines').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Engine DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
