/**
 * OPENCLAW BRIDGE
 *
 * Executes skills through OpenClaw agents
 * Handles workspace communication and prompt injection
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

const OPENCLAW_HOME = process.env.OPENCLAW_HOME || path.join(process.env.HOME!, '.openclaw');

interface SkillExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  xp_gained: number;
  trust_increase: number;
  energy_cost: number;
  execution_time: number;
}

/**
 * Execute a skill through an OpenClaw agent
 */
export async function executeOpenClawSkill(
  empleaidoId: string,
  skillId: string,
  params: Record<string, any> = {}
): Promise<SkillExecutionResult> {
  const startTime = Date.now();

  try {
    // 1. Resolve agent ID from empleaido ID
    const agentId = await resolveAgentId(empleaidoId);
    if (!agentId) {
      throw new Error(`Agent not found for empleaido: ${empleaidoId}`);
    }

    // 2. Get workspace path
    const workspacePath = path.join(OPENCLAW_HOME, `workspace-${agentId}`);
    if (!fs.existsSync(workspacePath)) {
      throw new Error(`Workspace not found: ${workspacePath}`);
    }

    // 3. Build skill prompt
    const skillPrompt = buildSkillPrompt(skillId, params);

    // 4. Create temporary task file in workspace
    const taskFile = path.join(workspacePath, 'TASK.md');
    const taskContent = `# Active Task

**Skill:** ${skillId}
**Params:** ${JSON.stringify(params, null, 2)}

## Instruction
${skillPrompt}

## Context
Execute this task using your available tools and capabilities.
Return the result in a structured format.
`;
    fs.writeFileSync(taskFile, taskContent);

    // 5. Execute OpenClaw command with the task
    const command = `cd "${workspacePath}" && claude-mem do "${skillPrompt}"`;

    const { stdout, stderr } = await execAsync(command, {
      timeout: 120000, // 2 minutes
      env: {
        ...process.env,
        CLAUDE_CONTEXT_FILE: path.join(workspacePath, 'TASK.md')
      }
    });

    const executionTime = Date.now() - startTime;

    // 6. Parse result
    if (stderr && !stdout) {
      throw new Error(`OpenClaw execution failed: ${stderr}`);
    }

    // 7. Calculate rewards based on execution
    const baseXP = 20;
    const timeBonus = Math.max(0, 100 - Math.floor(executionTime / 1000)); // Bonus for speed
    const xpGained = baseXP + timeBonus;

    const trustIncrease = 0.05;
    const energyCost = 10;

    // 8. Cleanup task file
    try {
      fs.unlinkSync(taskFile);
    } catch (e) {
      // Ignore cleanup errors
    }

    return {
      success: true,
      output: stdout.trim(),
      xp_gained: xpGained,
      trust_increase: trustIncrease,
      energy_cost: energyCost,
      execution_time: executionTime,
    };

  } catch (error) {
    const executionTime = Date.now() - startTime;

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      xp_gained: 0,
      trust_increase: 0,
      energy_cost: 5, // Small cost even for failure
      execution_time: executionTime,
    };
  }
}

/**
 * Resolve agent ID from empleaido catalog
 */
async function resolveAgentId(empleaidoId: string): Promise<string | null> {
  try {
    // Load openclaw.json to find the agent
    const configPath = path.join(OPENCLAW_HOME, 'openclaw.json');
    if (!fs.existsSync(configPath)) {
      return null;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    // Find agent by empleaido ID
    const agent = config.agents.list.find((a: any) =>
      a.id.includes(empleaidoId) ||
      a.identity?.serial?.toString() === empleaidoId.replace(/\D/g, '')
    );

    return agent?.id || null;
  } catch (error) {
    console.error('Error resolving agent ID:', error);
    return null;
  }
}

/**
 * Build skill-specific prompt
 */
function buildSkillPrompt(skillId: string, params: Record<string, any>): string {
  const skillPrompts: Record<string, string> = {
    // Contabilidad RD skills
    'ocr_facturas': 'Process the provided invoice images and extract key data: amount, date, supplier, NCF type, and ITBIS. Present results in a structured table format.',
    'itbis_mensual': 'Calculate monthly ITBIS (tax) summary. List all ITBIS paid (crédito fiscal) and ITBIS collected (débito fiscal). Calculate net payable or refundable amount.',
    'clasificacion_ncf': 'Analyze the provided invoice and classify its NCF (Comprobante Fiscal) type according to DGII regulations. Explain the classification criteria.',
    'alertas_dgii': 'Check DGII deadlines and generate alerts for upcoming tax filings, payments, or requirements based on the current date.',

    // Growth Marketing skills
    'plan_contenido': 'Create a content calendar for social media. Include post themes, captions, hashtags, and optimal posting times. Target the specified audience.',
    'publicacion_rrss': 'Generate engaging social media post content for the specified platform and topic. Include hooks, body content, and call-to-action.',
    'metricas_basicas': 'Analyze basic social media metrics. Calculate engagement rate, reach, impressions, and growth trends. Provide actionable insights.',

    // Operaciones skills
    'organizacion_docs': 'Organize the provided documents into a logical folder structure. Suggest file naming conventions and categorization.',
    'checklists': 'Create comprehensive checklists for the specified process. Include all necessary steps, responsible parties, and verification points.',

    // CFO Estrategico skills
    'flujo_caja': 'Analyze cash flow statement. Identify inflows, outflows, and net position. Highlight trends and potential issues.',
    'proyecciones': 'Generate financial projections based on provided data. Include revenue, expenses, and profitability forecasts for the specified period.',
    'alertas_financieras': 'Monitor financial metrics and alert on anomalies, trends, or thresholds that require attention.',

    // Productividad Personal skills
    'agenda': 'Organize the provided schedule into an optimized agenda. Prioritize tasks, allocate time blocks, and identify conflicts.',
    'recordatorios': 'Create reminder system for tasks and appointments. Include timing and priority levels.',
    'priorizacion': 'Analyze the task list and prioritize based on urgency, importance, and dependencies. Suggest optimal execution order.',

    // UX Design skills
    'problem_reframing': 'Reframe the provided problem statement from a UX perspective. Identify user needs, pain points, and opportunity areas.',
    'mental_model_alignment': 'Analyze and align user mental models with system design. Identify gaps and recommend improvements.',
    'information_architecture': 'Structure information architecture for the provided content. Organize hierarchy, navigation, and content relationships.',
    'actions_affordances': 'Design clear actions and affordances for the specified interface. Ensure discoverability and usability.',
  };

  const basePrompt = skillPrompts[skillId] || `Execute the skill: ${skillId}`;

  // Add params to prompt if provided
  if (Object.keys(params).length > 0) {
    const paramsText = Object.entries(params)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
    return `${basePrompt}\n\nParameters:\n${paramsText}`;
  }

  return basePrompt;
}

/**
 * Get agent workspace path
 */
export async function getAgentWorkspace(empleaidoId: string): Promise<string | null> {
  const agentId = await resolveAgentId(empleaidoId);
  if (!agentId) return null;

  const workspacePath = path.join(OPENCLAW_HOME, `workspace-${agentId}`);
  return fs.existsSync(workspacePath) ? workspacePath : null;
}

/**
 * Check if agent is ready
 */
export async function isAgentReady(empleaidoId: string): Promise<boolean> {
  const workspace = await getAgentWorkspace(empleaidoId);
  if (!workspace) return false;

  const requiredFiles = ['IDENTITY.md', 'SOUL.md'];
  return requiredFiles.every(file => fs.existsSync(path.join(workspace, file)));
}
