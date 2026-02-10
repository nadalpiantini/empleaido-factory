import { NextRequest, NextResponse } from 'next/server';
import { getSkillLabel } from '@/lib/skills';
import empleaidos from '@/data/empleaidos.json';
import { executeOpenClawSkill, isAgentReady } from '../../../../lib/openclaw';

/**
 * POST /api/skills/execute
 *
 * Execute a specific skill for an Empleaido
 * Body: { empleaido_id: string, skill_id: string, params?: any }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { empleaido_id, skill_id, params = {} } = body;

    if (!empleaido_id || !skill_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: empleaido_id, skill_id',
        },
        { status: 400 }
      );
    }

    // Find Empleaido
    const empleaido = empleaidos.find((e) =>
      e.id === empleaido_id ||
      e.serial.toString() === empleaido_id ||
      empleaido_id.includes(e.serial.toString().padStart(5, '0'))
    );

    if (!empleaido) {
      return NextResponse.json(
        {
          success: false,
          error: `Empleaido ${empleaido_id} not found`,
        },
        { status: 404 }
      );
    }

    // Check if skill exists in native or locked
    const allSkills = [...empleaido.skills.native, ...empleaido.skills.locked];

    if (!allSkills.includes(skill_id)) {
      return NextResponse.json(
        {
          success: false,
          error: `Skill ${skill_id} not found for ${empleaido.name}`,
          available_skills: allSkills,
        },
        { status: 400 }
      );
    }

    // Check if skill is locked
    if (empleaido.skills.locked.includes(skill_id as typeof empleaido.skills.native[number])) {
      return NextResponse.json(
        {
          success: false,
          error: `Skill ${skill_id} is locked. Increase trust level to unlock.`,
          skill_status: 'locked',
          required_level: getRequiredLevel(skill_id),
        },
        { status: 403 }
      );
    }

    // Check if agent is ready
    const agentReady = await isAgentReady(empleaido_id);
    if (!agentReady) {
      return NextResponse.json(
        {
          success: false,
          error: `Empleaido ${empleaido.name} is not ready. Please complete onboarding first.`,
          agent_status: 'not_ready',
        },
        { status: 503 }
      );
    }

    // Execute skill via OpenClaw agent
    const executionResult = await executeOpenClawSkill(empleaido_id, skill_id, params);

    if (!executionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: executionResult.error || 'Skill execution failed',
          execution_time: executionResult.execution_time,
        },
        { status: 500 }
      );
    }

    const result = {
      skill_id,
      skill_name: getSkillLabel(skill_id as typeof empleaido.skills.native[number]),
      empleaido: empleaido.name,
      execution_time: new Date().toISOString(),
      duration_ms: executionResult.execution_time,
      status: 'success',
      output: executionResult.output,
      xp_gained: executionResult.xp_gained,
      trust_increase: executionResult.trust_increase,
      energy_cost: executionResult.energy_cost,
    };

    // Update life stats in Supabase
    // TODO: Re-enable after fixing Supabase client initialization
    // try {
    //   const { recordSkillExecution, getAdoptionByEmpleaidoId } = await import('../../../../../lib/supabase');
    //   const userId = 'mvp-test-user-' + empleaido_id;
    //   const adoption = await getAdoptionByEmpleaidoId(empleaido_id, userId);
    //   if (adoption) {
    //     await recordSkillExecution({
    //       adoption_id: adoption.id,
    //       skill_id,
    //       skill_name: result.skill_name,
    //       params,
    //       status: 'success',
    //       output: result.output,
    //       duration_ms: result.duration_ms,
    //       xp_gained: result.xp_gained,
    //       trust_increase: result.trust_increase,
    //       energy_cost: result.energy_cost,
    //     });
    //     console.log(`✅ Skill recorded in Supabase: ${skill_id}`);
    //   }
    // } catch (error) {
    //   console.error('⚠️ Failed to record skill execution:', error);
    // }

    console.log(`✅ Skill executed: ${skill_id} by ${empleaido.name} (${result.duration_ms}ms)`);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Skill execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Skill execution failed',
      },
      { status: 500 }
    );
  }
}

function getRequiredLevel(_skillId: string): number {
  // TODO: Implement skill unlock logic based on skill domain and difficulty
  return 5;
}

/**
 * GET /api/skills/execute
 *
 * Get available skills for an Empleaido
 * Query: ?empleaido_id=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empleaido_id = searchParams.get('empleaido_id');

    if (!empleaido_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing query parameter: empleaido_id',
        },
        { status: 400 }
      );
    }

    // Find Empleaido
    const empleaido = empleaidos.find((e) =>
      e.id === empleaido_id ||
      e.serial.toString() === empleaido_id ||
      empleaido_id.includes(e.serial.toString().padStart(5, '0'))
    );

    if (!empleaido) {
      return NextResponse.json(
        {
          success: false,
          error: `Empleaido ${empleaido_id} not found`,
        },
        { status: 404 }
      );
    }

    // Return available skills with metadata
    const skills = {
      native: empleaido.skills.native.map((skillId) => ({
        id: skillId,
        name: getSkillLabel(skillId),
        status: 'available',
      })),
      locked: empleaido.skills.locked.map((skillId) => ({
        id: skillId,
        name: getSkillLabel(skillId),
        status: 'locked',
        unlock_at_level: getRequiredLevel(skillId),
      })),
    };

    return NextResponse.json({
      success: true,
      empleaido_id: empleaido.id,
      empleaido_name: empleaido.name,
      skills,
    });
  } catch (error) {
    console.error('Skills fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch skills',
      },
      { status: 500 }
    );
  }
}
