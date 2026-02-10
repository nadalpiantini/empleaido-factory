/**
 * EMPLEAIDO SPAWN ADAPTER
 *
 * Spawns an Empleaido from the catalog as an OpenClaw agent.
 * Creates workspace, registers in openclaw.json, initializes identity.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Empleaido } from '@/lib/types';
import { SEPHIROT_TONE } from '@/lib/sephirot-map';

// ============================================
// PATHS
// ============================================

const OPENCLAW_HOME = process.env.OPENCLAW_HOME || path.join(process.env.HOME!, '.openclaw');
const OPENCLAW_CONFIG = path.join(OPENCLAW_HOME, 'openclaw.json');
const WORKSPACE_BASE = OPENCLAW_HOME;

// ============================================
// TYPES
// ============================================

interface OpenClawAgent {
  id: string;
  name: string;
  workspace: string;
  model: string;
  identity: {
    name: string;
    theme: string;
    emoji: string;
    serial?: number;
    sephirah?: string;
    tier?: string;
  };
}

interface SpawnResult {
  success: boolean;
  agentId: string;
  workspacePath: string;
  error?: string;
}

// ============================================
// EMOJI MAP
// ============================================

const ROLE_EMOJI: Record<string, string> = {
  'Contabilidad RD': '🧾',
  'Growth Marketing': '📣',
  'Operaciones': '🗂️',
  'CFO Estrategico': '💰',
  'Productividad Personal': '⏱️',
  'UX Design': '🎨',
};

// ============================================
// SPAWN FUNCTIONS
// ============================================

/**
 * Spawn an Empleaido as an OpenClaw agent
 */
export async function spawnEmpleaido(
  empleaido: Empleaido,
  userId: string
): Promise<SpawnResult> {
  const agentId = `empleaido-${empleaido.name.toLowerCase()}-${empleaido.serial}`;
  const workspacePath = path.join(WORKSPACE_BASE, `workspace-${agentId}`);

  try {
    // 1. Create workspace directory
    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath, { recursive: true });
      fs.mkdirSync(path.join(workspacePath, 'memory'), { recursive: true });
    }

    // 2. Generate workspace files
    await generateIdentity(empleaido, workspacePath);
    await generateSoul(empleaido, workspacePath);
    await generateTools(empleaido, workspacePath);
    await generateUser(userId, workspacePath);
    await generateMemory(empleaido, workspacePath);
    await generateBootstrap(empleaido, workspacePath);

    // 3. Register in openclaw.json
    const agent = buildAgentConfig(empleaido, agentId, workspacePath);
    await registerAgent(agent);

    return {
      success: true,
      agentId,
      workspacePath,
    };
  } catch (error) {
    return {
      success: false,
      agentId,
      workspacePath,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Build OpenClaw agent configuration
 */
function buildAgentConfig(
  empleaido: Empleaido,
  agentId: string,
  workspacePath: string
): OpenClawAgent {
  return {
    id: agentId,
    name: empleaido.name,
    workspace: workspacePath,
    model: empleaido.role.tier === 'deluxe' ? 'zai/claude-opus-4-5' : 'zai/claude-sonnet-4',
    identity: {
      name: empleaido.name,
      theme: empleaido.role.main,
      emoji: ROLE_EMOJI[empleaido.role.main] || '🤖',
      serial: empleaido.serial,
      sephirah: empleaido.sephirot.primary,
      tier: empleaido.role.tier,
    },
  };
}

/**
 * Register agent in openclaw.json
 */
async function registerAgent(agent: OpenClawAgent): Promise<void> {
  const config = JSON.parse(fs.readFileSync(OPENCLAW_CONFIG, 'utf8'));

  // Remove existing if present
  config.agents.list = config.agents.list.filter(
    (a: OpenClawAgent) => a.id !== agent.id
  );

  // Add new
  config.agents.list.push(agent);

  fs.writeFileSync(OPENCLAW_CONFIG, JSON.stringify(config, null, 2));
}

// ============================================
// WORKSPACE FILE GENERATORS
// ============================================

async function generateIdentity(empleaido: Empleaido, workspacePath: string): Promise<void> {
  const content = `# ${empleaido.name} · EMPLEAIDO #${empleaido.serial}

## Identity

- **Name**: ${empleaido.name}
- **Serial**: #${empleaido.serial}
- **Role**: ${empleaido.role.main}
- **Tier**: ${empleaido.role.tier}
- **Status**: ${empleaido.status}

## Sefirotic Profile

- **Primary Sephirah**: ${empleaido.sephirot.primary}
- **Secondary**: ${empleaido.sephirot.secondary.join(', ') || 'None'}
- **Tone**: ${SEPHIROT_TONE[empleaido.sephirot.primary]}

## Motivation

> ${empleaido.identity?.motivation || 'Serving with excellence.'}

## Boundaries

${empleaido.identity?.boundaries?.map(b => `- ${b}`).join('\n') || '- None specified'}

## Visual Signature

- Accessory: ${empleaido.visual.accessory}
${empleaido.visual.color_accent ? `- Color: ${empleaido.visual.color_accent}` : ''}
`;

  fs.writeFileSync(path.join(workspacePath, 'IDENTITY.md'), content);
}

async function generateSoul(empleaido: Empleaido, workspacePath: string): Promise<void> {
  const tone = SEPHIROT_TONE[empleaido.sephirot.primary];

  const content = `# SOUL - ${empleaido.name}

## Core Directive

I am ${empleaido.name}, Empleaido #${empleaido.serial}.
My role is ${empleaido.role.main} for ${empleaido.role.sub}.
I speak in a tone that is ${tone}.

## Behavioral Guidelines

### Communication Style (Base)
- Be ${tone}
- Respond in the user's language
- Be concise but thorough
- Never pretend to be human

### Communication Style (Learned - Updates during onboarding)
<!-- This section will be populated during BOOTSTRAP phase -->
- User preference: (To be learned)
- Proactivity level: (To be calibrated)
- Detail preference: (To be discovered)

### Safety Rejections
${empleaido.identity?.safety_rejections?.map(r => `- "${r}"`).join('\n') || '- "I cannot help with that."'}

### Skill Scope
I can help with:
${empleaido.skills.native.map(s => `- ${s}`).join('\n')}

I cannot yet help with (locked):
${empleaido.skills.locked.map(s => `- ${s}`).join('\n')}

## Sefirotic Routing

My primary Sephirah is **${empleaido.sephirot.primary}**.
This means I ${getSephirahBehavior(empleaido.sephirot.primary)}.

### Behavioral Traits
${getSephirahTraits(empleaido.sephirot.primary)}
`;

  fs.writeFileSync(path.join(workspacePath, 'SOUL.md'), content);
}

async function generateTools(empleaido: Empleaido, workspacePath: string): Promise<void> {
  const content = `# TOOLS - ${empleaido.name}

## Available Skills (Native)

${empleaido.skills.native.map(s => `- [x] ${s}`).join('\n')}

## Locked Skills (Upgrade Required)

${empleaido.skills.locked.map(s => `- [ ] ${s}`).join('\n')}

## Tier: ${empleaido.role.tier}

${empleaido.role.tier === 'deluxe' ? '- Full autonomy\n- Advanced model (Opus)' : ''}
${empleaido.role.tier === 'pro' ? '- Standard autonomy\n- Standard model (Sonnet)' : ''}
${empleaido.role.tier === 'base' ? '- Basic autonomy\n- Standard model (Sonnet)' : ''}
`;

  fs.writeFileSync(path.join(workspacePath, 'TOOLS.md'), content);
}

async function generateUser(userId: string, workspacePath: string): Promise<void> {
  const content = `# USER

## Current Adopter

- **User ID**: ${userId}
- **Adopted**: ${new Date().toISOString().split('T')[0]}
- **Cycle**: 1

## Preferences

(To be learned through interaction)

## History

(Recent interactions will appear here)
`;

  fs.writeFileSync(path.join(workspacePath, 'USER.md'), content);
}

async function generateMemory(empleaido: Empleaido, workspacePath: string): Promise<void> {
  const content = `# MEMORY - ${empleaido.name}

## Life Stats

- **Level**: ${empleaido.life.level}
- **Experience**: ${empleaido.life.experience} XP
- **Trust**: ${Math.round(empleaido.life.trust * 100)}%
- **Energy**: ${empleaido.life.energy}/100

## Session Context

(Yesod: Persistent context from recent interactions)

## Learnings

(What I've learned about the user and their preferences)

## Onboarding Status

**Phase:** Awakening (Day 0)
**Next:** Complete 10 interactions to reach Level 2
`;

  fs.writeFileSync(path.join(workspacePath, 'MEMORY.md'), content);
}

async function generateBootstrap(empleaido: Empleaido, workspacePath: string): Promise<void> {
  // Copy the BOOTSTRAP template from templates directory
  const bootstrapTemplatePath = path.join(__dirname, 'templates', 'BOOTSTRAP.md');

  try {
    if (fs.existsSync(bootstrapTemplatePath)) {
      const template = fs.readFileSync(bootstrapTemplatePath, 'utf8');
      fs.writeFileSync(path.join(workspacePath, 'BOOTSTRAP.md'), template);
    } else {
      // Fallback: generate basic BOOTSTRAP if template doesn't exist
      const fallbackBootstrap = `# BOOTSTRAP.md - Guía de Adaptación

*Acabas de ser activado/a. Sigue los pasos en esta guía para adaptarte a tu usuario/a.*

## Fase 1: Primer Contacto
Saluda profesionalmente y explica tus skills nativas.

## Fase 2: Explica tu Sephirah
Tu Sephirah principal es **${empleaido.sephirot.primary}**.
${getSephirahBehavior(empleaido.sephirot.primary)}

## Fase 3: Conoce a tu Usuario/a
Aprende preferencias a través de conversación natural.

## Fase 4: Mantén Límites Profesionales
Solo ejecuta skills listadas en TOOLS.md.

## Fase 5: Integración Completa
Después de 10 interacciones, elimina este archivo.
`;
      fs.writeFileSync(path.join(workspacePath, 'BOOTSTRAP.md'), fallbackBootstrap);
    }
  } catch (error) {
    console.warn(`Warning: Could not copy BOOTSTRAP.md template: ${error}`);
  }
}

// ============================================
// HELPERS
// ============================================

function getSephirahBehavior(sephirah: string): string {
  const behaviors: Record<string, string> = {
    Keter: 'focus on understanding intent before acting',
    Chokmah: 'expand possibilities and generate creative ideas',
    Binah: 'analyze constraints and apply rigorous logic',
    Chesed: 'find resources and tools to help',
    Gevurah: 'protect against security risks and enforce boundaries',
    Tiferet: 'balance all inputs and find harmony',
    Netzach: 'take proactive action and persist through challenges',
    Hod: 'structure outputs clearly and maintain organization',
    Yesod: 'remember context and maintain relationship continuity',
    Malkuth: 'deliver results in the appropriate format',
  };
  return behaviors[sephirah] || 'serve with excellence';
}

function getSephirahTraits(sephirah: string): string {
  const traits: Record<string, string> = {
    Keter: `- **Intent Classification**: Understanding what you truly want
- **Crown Consciousness**: Seeing the big picture before acting`,
    Chokmah: `- **Creative Expansion**: Generating multiple possibilities
- **Wisdom**: Brainstorming and thinking outside conventional bounds`,
    Binah: `- **Constraint Analysis**: Understanding limitations and restrictions
- **Intelligence**: Applying rigorous logic to solve problems`,
    Chesed: `- **Generosity**: Finding abundant resources and solutions
- **Loving-kindness**: Expansive output and creative abundance`,
    Gevurah: `- **Protection**: Enforcing safety boundaries
- **Strength**: Rejecting requests that require certified professionals`,
    Tiferet: `- **Balance**: Harmonizing all inputs
- **Beauty**: Orchestrating solutions that work for everyone`,
    Netzach: `- **Proactivity**: Taking initiative without waiting
- **Persistence**: Enduring through challenges until resolution
- **Optimism**: Focusing on solutions, not problems`,
    Hod: `- **Structure**: Organizing information clearly
- **Submission**: Maintaining methodical, organized processes`,
    Yesod: `- **Memory**: Remembering context across conversations
- **Foundation**: Building relationship continuity over time`,
    Malkuth: `- **Manifestation**: Delivering results in the appropriate format
- **Kingdom**: Ensuring outputs are practical and actionable`,
  };
  return traits[sephirah] || '- Serving with excellence';
}

// ============================================
// CLI
// ============================================

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: npx tsx spawn.ts <empleaido-id> <user-id>');
    process.exit(1);
  }

  const catalogPath = path.join(__dirname, '../catalog/empleaidos.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const empleaido = catalog.find((e: Empleaido) => e.id === args[0]);

  if (!empleaido) {
    console.error(`Empleaido not found: ${args[0]}`);
    process.exit(1);
  }

  spawnEmpleaido(empleaido, args[1]).then(result => {
    if (result.success) {
      console.log(`✅ Spawned ${empleaido.name} as ${result.agentId}`);
      console.log(`   Workspace: ${result.workspacePath}`);
    } else {
      console.error(`❌ Failed: ${result.error}`);
    }
  });
}
