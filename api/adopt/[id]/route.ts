/**
 * ADOPTION API ENDPOINT
 *
 * MVP: Processes adoption without payment or auth
 * - Spawns OpenClaw agent (inline implementation)
 * - Returns onboarding URL
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const OPENCLAW_HOME = process.env.OPENCLAW_HOME || path.join(process.env.HOME!, '.openclaw');

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: empleaidoId } = await params;

  try {
    // MVP: Use mock user for validation (no auth required)
    const userId = 'mvp-test-user-' + Date.now();

    console.log(`🧪 MVP Adoption: ${empleaidoId} by ${userId}`);

    // Fetch empleaido from catalog
    const catalogPath = `${process.cwd()}/../catalog/empleaidos.json`;
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    const empleaido = catalogData.find((e: any) => e.id === empleaidoId);

    if (!empleaido) {
      return NextResponse.json({
        success: false,
        error: 'Empleaido not found in catalog'
      }, { status: 404 });
    }

    // Spawn OpenClaw agent (inline)
    const agentId = `empleaido-${empleaido.name.toLowerCase()}-${empleaido.serial}`;
    const workspacePath = path.join(OPENCLAW_HOME, `workspace-${agentId}`);

    // Create workspace
    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath, { recursive: true });
      fs.mkdirSync(path.join(workspacePath, 'memory'), { recursive: true });
    }

    // Generate basic workspace files
    const identityMd = `# ${empleaido.name} · EMPLEAIDO #${empleaido.serial}

## Identity
- **Name**: ${empleaido.name}
- **Serial**: #${empleaido.serial}
- **Role**: ${empleaido.role.main}
- **Tier**: ${empleaido.role.tier}
`;
    fs.writeFileSync(path.join(workspacePath, 'IDENTITY.md'), identityMd);

    const soulMd = `# SOUL - ${empleaido.name}

## Core Directive
I am ${empleaido.name}, Empleaido #${empleaido.serial}.
My role is ${empleaido.role.main} for ${empleaido.role.sub}.
`;
    fs.writeFileSync(path.join(workspacePath, 'SOUL.md'), soulMd);

    // Register in openclaw.json
    const openclawConfig = path.join(OPENCLAW_HOME, 'openclaw.json');
    const config = JSON.parse(fs.readFileSync(openclawConfig, 'utf-8'));

    config.agents.list = config.agents.list.filter((a: any) => a.id !== agentId);
    config.agents.list.push({
      id: agentId,
      name: empleaido.name,
      workspace: workspacePath,
      model: 'claude-opus-4-5',
      identity: {
        name: empleaido.name,
        theme: empleaido.role.main,
        emoji: '🤖',
        serial: empleaido.serial,
      }
    });

    fs.writeFileSync(openclawConfig, JSON.stringify(config, null, 2));

    console.log(`✅ Spawned: ${agentId} at ${workspacePath}`);

    // Return success with onboarding URL
    return NextResponse.json({
      success: true,
      agentId: agentId,
      workspacePath: workspacePath,
      nextSteps: {
        onboardingUrl: `/onboarding/${empleaidoId}`,
        message: `${empleaido.name} is ready! Complete the onboarding wizard to personalize your assistant.`
      }
    });

  } catch (error) {
    console.error('❌ Adoption API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during adoption',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
