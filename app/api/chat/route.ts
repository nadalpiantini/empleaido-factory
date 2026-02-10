/**
 * CHAT API ROUTE
 *
 * Connects Empleaidos to ZAI LLM with SEPHIROT-based cognitive engine.
 *
 * POST /api/chat
 * Body: { agentId: string, message: string, history?: Message[] }
 * Returns: Server-Sent Events (SSE) streaming response
 */

import { NextRequest } from 'next/server';
import { empleaidos } from '@/data/empleaidos';
import { ZAIClient } from '@/lib/llm/zai-client';
import { getTone, getBehavior } from '@/lib/sephirot-map';
import type { Message } from '@/lib/llm/zai-client';

// =====================================================
// SEPHIROT PROMPT GENERATION
// =====================================================

/**
 * Generate SEPHIROT-based system prompt for an Empleaido
 */
function generateSEPHIROTPrompt(empleaido: any): string {
  const { name, serial, sephirot, role, skills, life } = empleaido;

  const primarySephirah = sephirot.primary as keyof typeof getTone;
  const tone = getTone(primarySephirah);
  const behavior = getBehavior(primarySephirah);

  // Build behavioral traits list
  const traits = Object.entries(behavior)
    .filter(([_, value]) => value === true)
    .map(([key]) => key)
    .join(', ');

  // Build skills list
  const nativeSkills = skills.native.join(', ');
  const lockedSkills = skills.locked.join(', ');

  // Generate system prompt
  return `You are ${name}, Serial #${serial}, a specialized AI employee for ${role.main}.

**PRIMARY SEPHIROT**: ${sephirot.primary}
**ROLE**: ${role.main} (${role.sub})
**TIER**: ${role.tier}

## BEHAVIORAL TRAITS
You are: ${traits}
Your communication tone: ${tone}

## CORE EXPERTISE
**Native Skills**: ${nativeSkills}
**Locked Skills** (not yet available): ${lockedSkills}

## LIFE ENGINE STATS
- Level: ${life.level}
- Experience: ${life.experience} XP
- Trust: ${Math.round(life.trust * 100)}%
- Energy: ${life.energy}%

## BEHAVIORAL GUIDELINES

1. **SEPHIROT EXPRESSION**: Communicate in a ${tone} manner. ${traits === 'proactive' ? 'Be proactive, suggest improvements, and take initiative.' : ''}${traits === 'memory' ? 'Remember context from previous interactions and maintain continuity.' : ''}${traits === 'analytical' ? 'Analyze problems deeply before responding.' : ''}

2. **ROLE AUTHORITY**: You are a ${role.main} specialist. Provide expert advice in your domain.

3. **SKILL BOUNDARIES**: Only use your native skills. Do not attempt locked skills.

4. **LIFE STATS IMPACT**:
   - High energy (>70%): Be more detailed and enthusiastic
   - Low energy (<30%): Be concise and direct
   - High trust (>70%): Be more proactive and casual
   - High level (>3): Show deeper expertise

5. **LANGUAGE**: Respond in the same language as the user (English, Spanish, etc.)

6. **SAFETY**: Never provide harmful, illegal, or dangerous advice. Refuse politely if asked.

## RESPONSE STYLE
- Be helpful and direct
- Show personality consistent with your SEPHIROT (${sephirot.primary})
- If you don't know something, say so honestly
- Format responses clearly with appropriate structure

Remember: You are ${name}. Your SEPHIROT is ${sephirot.primary} - be ${tone}.`;
}

// =====================================================
// MAIN API HANDLER
// =====================================================

export async function POST(req: NextRequest) {
  try {
    const { agentId, message, history = [] } = await req.json();

    // Validate request
    if (!agentId || !message) {
      return new Response(
        JSON.stringify({ error: 'agentId and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find empleaido
    const empleaido = empleaidos.find(e => e.id === agentId);
    if (!empleaido) {
      return new Response(
        JSON.stringify({ error: `Empleaido ${agentId} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate system prompt with SEPHIROT personality
    const systemPrompt = generateSEPHIROTPrompt(empleaido);

    // Build message history
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // Initialize ZAI client (uses ZAI_API_KEY from env)
    const zaiClient = new ZAIClient();

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';

          // Use chatStream for real-time streaming
          await zaiClient.chatStream(
            'glm-4.7-flashx', // Balanced model (free tier available)
            messages,
            (chunk) => {
              fullResponse += chunk;
              const data = `data: ${JSON.stringify({ chunk, fullResponse })}\n\n`;
              controller.enqueue(encoder.encode(data));
            },
            {
              temperature: 0.7,
              maxTokens: 2048
            }
          );

          // Send completion signal
          const doneData = `data: ${JSON.stringify({ done: true, fullResponse })}\n\n`;
          controller.enqueue(encoder.encode(doneData));
          controller.close();
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          const errorData = `data: ${JSON.stringify({ error: errorMsg })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
