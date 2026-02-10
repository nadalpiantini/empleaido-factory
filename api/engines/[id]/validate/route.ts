/**
 * Validate Engine Configuration API Route
 * POST /api/engines/[id]/validate - Validate engine config
 */

import { createRouteHandlerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import type { EngineValidationResult } from '@/types/engine';

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

    // Get engine
    const { data: engine } = await supabase
      .from('ef_engines')
      .select('*')
      .eq('id', id)
      .single();

    if (!engine) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }

    // Validate configuration
    const validation = validateEngineConfig(engine);

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Engine validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Validation helper
function validateEngineConfig(engine: any): EngineValidationResult {
  const errors: any[] = [];
  const warnings: any[] = [];

  // Check required fields
  if (!engine.name || engine.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 3 characters',
      code: 'INVALID_NAME',
    });
  }

  if (!engine.config) {
    errors.push({
      field: 'config',
      message: 'Configuration is required',
      code: 'CONFIG_REQUIRED',
    });
    return { valid: false, errors, warnings };
  }

  // Validate LLM config
  if (!engine.config.llm) {
    errors.push({
      field: 'llm',
      message: 'LLM configuration is required',
      code: 'LLM_REQUIRED',
    });
  } else {
    // Validate model
    const validModels = ['glm-4.7', 'glm-4.7-flashx', 'glm-4.7-flash', 'glm-4.6', 'glm-4.6v'];
    if (!validModels.includes(engine.config.llm.model)) {
      errors.push({
        field: 'model',
        message: `Invalid model. Must be one of: ${validModels.join(', ')}`,
        code: 'INVALID_MODEL',
      });
    }

    // Validate temperature
    if (engine.config.llm.temperature !== undefined) {
      if (engine.config.llm.temperature < 0 || engine.config.llm.temperature > 2) {
        errors.push({
          field: 'temperature',
          message: 'Temperature must be between 0 and 2',
          code: 'INVALID_TEMPERATURE',
        });
      }
    }

    // Validate maxTokens
    if (engine.config.llm.maxTokens !== undefined) {
      if (engine.config.llm.maxTokens < 1 || engine.config.llm.maxTokens > 128000) {
        errors.push({
          field: 'maxTokens',
          message: 'maxTokens must be between 1 and 128000',
          code: 'INVALID_MAX_TOKENS',
        });
      }
    }
  }

  // Validate system prompt
  if (!engine.config.system_prompt || engine.config.system_prompt.length < 20) {
    errors.push({
      field: 'system_prompt',
      message: 'System prompt must be at least 20 characters',
      code: 'INVALID_SYSTEM_PROMPT',
    });
  }

  // Validate skills
  if (!engine.config.skills || !Array.isArray(engine.config.skills)) {
    warnings.push({
      field: 'skills',
      message: 'No skills defined - engine will have no capabilities',
      code: 'NO_SKILLS',
    });
  } else if (engine.config.skills.length === 0) {
    warnings.push({
      field: 'skills',
      message: 'Engine has no skills',
      code: 'NO_SKILLS',
    });
  } else {
    // Validate each skill
    engine.config.skills.forEach((skill: any, index: number) => {
      if (!skill.name) {
        errors.push({
          field: `skills[${index}].name`,
          message: 'Skill name is required',
          code: 'SKILL_NAME_REQUIRED',
        });
      }

      if (!skill.prompt_template || skill.prompt_template.length < 10) {
        errors.push({
          field: `skills[${index}].prompt_template`,
          message: 'Prompt template must be at least 10 characters',
          code: 'INVALID_PROMPT_TEMPLATE',
        });
      }

      if (!skill.output_format) {
        errors.push({
          field: `skills[${index}].output_format`,
          message: 'Output format is required',
          code: 'OUTPUT_FORMAT_REQUIRED',
        });
      } else if (
        !['text', 'json', 'file'].includes(skill.output_format)
      ) {
        errors.push({
          field: `skills[${index}].output_format`,
          message: 'Output format must be text, json, or file',
          code: 'INVALID_OUTPUT_FORMAT',
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
