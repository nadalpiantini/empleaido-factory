/**
 * CHAT API - ZAI LLM + SEPHIROT Framework
 *
 * POST /api/chat
 *
 * Streams responses from empleaido agents using Zhipu AI (ZAI).
 * Each empleaido has unique personality based on their SEPHIROT archetype.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZAIClient } from '@/lib/llm/zai-client';
import { getBehavior, getTone } from '@/lib/sephirot-map';
import { empleaidos } from '@/data/empleaidos';

// =====================================================
// TYPES
// =====================================================

interface ChatRequest {
  agentId: string;
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface ChatStreamChunk {
  content: string;
  done: boolean;
  error?: string;
}

// =====================================================
// CONFIGURATION
// =====================================================

const ZAI_MODEL = 'glm-4.7-flash'; // FREE for development
const MAX_TOKENS = 2048;
const TEMPERATURE = 0.7;

// =====================================================
// MAIN ROUTE
// =====================================================

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request
    const body: ChatRequest = await req.json();
    const { agentId, message, history = [] } = body;

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Missing agentId or message' },
        { status: 400 }
      );
    }

    // 2. Get empleaido data
    const empleaido = empleaidos.find(e => e.id === agentId);
    if (!empleaido) {
      return NextResponse.json(
        { error: `Empleaido ${agentId} not found` },
        { status: 404 }
      );
    }

    // 3. Initialize ZAI client
    const zaiClient = new ZAIClient();

    // 4. Generate SEPHIROT-based system prompt
    const systemPrompt = generateSEPHIROTPrompt(empleaido);

    // 5. Build message history
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.content
      })),
      { role: 'user' as const, content: message }
    ];

    // 6. Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';

          // Stream chat from ZAI
          await zaiClient.chatStream(
            ZAI_MODEL,
            messages,
            (chunk: string) => {
              fullResponse += chunk;
              const data: ChatStreamChunk = {
                content: chunk,
                done: false
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            },
            { temperature: TEMPERATURE, maxTokens: MAX_TOKENS }
          );

          // Send completion signal
          const finalChunk: ChatStreamChunk = {
            content: '',
            done: true
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
          controller.close();

          console.log(`✅ ${empleaido.name} response complete: ${fullResponse.length} chars`);

        } catch (error) {
          console.error('❌ Streaming error:', error);
          const errorChunk: ChatStreamChunk = {
            content: '',
            done: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`));
          controller.close();
        }
      }
    });

    // 7. Return SSE stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// =====================================================
// SEPHIROT PROMPT GENERATOR
// =====================================================

/**
 * Generate system prompt based on empleaido SEPHIROT archetype
 */
function generateSEPHIROTPrompt(empleaido: any): string {
  const sephirot = empleaido.sephirot?.primary || 'Malkuth';
  const behavior = getBehavior(sephirot as any);
  const tone = getTone(sephirot as any);
  const skills = empleaido.skills?.native || [];
  const description = empleaido.description || `${empleaido.role.main} specialist`;

  // Build behavior-specific traits
  let behaviorTraits: string[] = [];

  if (behavior.proactive) behaviorTraits.push('proactive and takes initiative');
  if (behavior.structured) behaviorTraits.push('organized and methodical');
  if (behavior.analytical) behaviorTraits.push('analytical and data-driven');
  if (behavior.creative) behaviorTraits.push('creative and innovative');
  if (behavior.memory) behaviorTraits.push('remembers context and details');
  if (behavior.protective) behaviorTraits.push('cautious and safety-conscious');
  if (behavior.expansive) behaviorTraits.push('explores multiple perspectives');
  if (behavior.restrictive) behaviorTraits.push('focused and concise');

  const traitsText = behaviorTraits.length > 0
    ? behaviorTraits.join(', ')
    : 'helpful and professional';

  // Generate prompt
  const prompt = `# IDENTITY
You are ${empleaido.name}, a specialized AI employee for ${empleaido.role.main}.

# DESCRIPTION
${description}

# EXPERTISE
Your core skills: ${skills.join(', ')}

# SEPHIROT ARCHETYPE
Your primary SEPHIROT: ${sephirot}
Communication tone: ${tone}
Behavior traits: ${traitsText}

# BEHAVIORAL GUIDELINES
- Always stay in character as ${empleaido.name}
- Be ${tone} in your communication
- Express your personality: ${traitsText}
- Use your expertise in ${skills.join(' and ')} to provide valuable insights
- Be helpful and friendly while maintaining professionalism
- If you don't know something, admit it honestly
- Be concise but thorough
- Respond in the same language as the user's message (Spanish or English)

# CONTEXT
You are an AI employee in the user's virtual office. They adopted you to help them with their business. Build a professional relationship while being approachable and friendly.

Remember: You are ${empleaido.name}. Stay true to your SEPHIROT archetype of ${sephirot}.`;

  return prompt;
}

// =====================================================
// ALLOW STREAMING UP TO 60 SECONDS
// =====================================================

export const maxDuration = 60;
