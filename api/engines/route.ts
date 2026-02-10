/**
 * Engine Registry API Routes
 * CRUD operations for agent engines
 */

import { createRouteHandlerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import type {
  CreateEngineRequest,
  EngineResponse,
  EngineListResponse,
  EngineValidationResult,
} from '@/types/engine';
import { hasPermission } from '@/lib/auth/permissions';

// =====================================================
// GET /api/engines - List engines
// =====================================================

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const isPublic = searchParams.get('is_public');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Get user profile
    const { data: profile } = await supabase
      .from('ef_user_profiles')
      .select('id, role, tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Build query
    let query = supabase
      .from('ef_engines')
      .select('*, developer:ef_user_profiles!inner(name)', { count: 'exact' });

    // Filters: User can see their own engines + public engines + same tenant
    const orConditions = `or=(developer_id.eq.${profile.id},is_public.eq.true,tenant_id.eq.${profile.tenant_id})`;
    query = query.or(orConditions);

    if (category) {
      query = query.eq('category', category);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (isPublic !== null) {
      query = query.eq('is_public', isPublic === 'true');
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Pagination and sorting
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    const { data: engines, error, count } = await query;

    if (error) {
      console.error('Error fetching engines:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: EngineListResponse = {
      engines: engines || [],
      total: count || 0,
      page,
      per_page: perPage,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Engines GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST /api/engines - Create engine
// =====================================================

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('ef_user_profiles')
      .select('id, role, tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Check permission
    if (!hasPermission(profile.role as any, 'engine:create')) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body: CreateEngineRequest = await req.json();

    // Validate input
    const validation = validateEngineConfig(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Check if slug already exists in tenant
    const { data: existing } = await supabase
      .from('ef_engines')
      .select('id')
      .eq('tenant_id', profile.tenant_id)
      .eq('slug', body.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Engine with this slug already exists in your workspace' },
        { status: 409 }
      );
    }

    // Create engine
    const { data: engine, error } = await supabase
      .from('ef_engines')
      .insert({
        tenant_id: profile.tenant_id,
        developer_id: profile.id,
        name: body.name,
        slug: body.slug,
        description: body.description,
        version: '1.0.0',
        category: body.category,
        config: body.config,
        status: 'draft',
        is_public: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating engine:', error);
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

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Engines POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// VALIDATION HELPER
// =====================================================

function validateEngineConfig(
  config: CreateEngineRequest
): EngineValidationResult {
  const errors: any[] = [];
  const warnings: any[] = [];

  // Name validation
  if (!config.name || config.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 3 characters',
      code: 'INVALID_NAME',
    });
  }

  // Slug validation
  const slugRegex = /^[a-z0-9-]+$/;
  if (!config.slug || !slugRegex.test(config.slug)) {
    errors.push({
      field: 'slug',
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
      code: 'INVALID_SLUG',
    });
  }

  // Description validation
  if (!config.description || config.description.length < 10) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 10 characters',
      code: 'INVALID_DESCRIPTION',
    });
  }

  // Config validation
  if (!config.config) {
    errors.push({
      field: 'config',
      message: 'Engine configuration is required',
      code: 'CONFIG_REQUIRED',
    });
  } else {
    // LLM config
    if (!config.config.llm) {
      errors.push({
        field: 'llm',
        message: 'LLM configuration is required',
        code: 'LLM_REQUIRED',
      });
    }

    // System prompt
    if (!config.config.system_prompt || config.config.system_prompt.length < 20) {
      errors.push({
        field: 'system_prompt',
        message: 'System prompt must be at least 20 characters',
        code: 'INVALID_SYSTEM_PROMPT',
      });
    }

    // Skills
    if (!config.config.skills || config.config.skills.length === 0) {
      warnings.push({
        field: 'skills',
        message: 'Engine has no skills defined',
        code: 'NO_SKILLS',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
