/**
 * Z.ai (Zhipu AI) Client for Agent Wrapping Platform
 * Official SDK: https://github.com/zhipuai/zhipuai-sdk-nodejs-v4
 *
 * Models supported:
 * - GLM-4.7: Premium model ($0.6 input / $2.2 output per 1M tokens)
 * - GLM-4.7-FlashX: Balanced speed/cost ($0.07 input / $0.4 output per 1M tokens)
 * - GLM-4.7-Flash: FREE for development
 * - GLM-4.6V: Vision model ($0.3 input / $0.9 output per 1M tokens)
 */

import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type ZAIModel =
  | 'glm-4.7'
  | 'glm-4.7-flashx'
  | 'glm-4.7-flash'
  | 'glm-4.6'
  | 'glm-4.6v'
  | 'glm-4.6v-flash';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: Tool[];
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

export interface ChatResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface VisionOptions {
  temperature?: number;
  max_tokens?: number;
}

export interface VisionResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string | Array<{ type: string; image_url?: string; text?: string }>;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ImageGenerationOptions {
  size?: '1024x1024' | '768x1344' | '864x1152' | '1344x768' | '1152x864';
  model?: 'cogview-4' | 'cogview-3';
}

export interface ImageGenerationResponse {
  created: number;
  data: Array<{
    url: string;
    b64_json?: string;
  }>;
}

export interface EmbeddingOptions {
  model?: 'embedding-3' | 'embedding-2';
}

export interface EmbeddingResponse {
  model: string;
  data: Array<{
    index: number;
    embedding: number[];
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SearchResult {
  title: string;
  link: string;
  description: string;
}

// =====================================================
// Z.AI CLIENT CLASS
// =====================================================

export class ZAIClient {
  private client: ZhipuAI;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ZAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ZAI_API_KEY is required. Set it in environment variables or pass to constructor.');
    }

    this.client = new ZhipuAI({
      apiKey: this.apiKey,
    });
  }

  // =====================================================
  // CHAT COMPLETION
  // =====================================================

  /**
   * Send chat completion request to Z.ai
   * @param model - Z.ai model to use
   * @param messages - Array of chat messages
   * @param options - Additional options (temperature, max_tokens, etc.)
   * @returns Chat response with usage statistics
   */
  async chat(
    model: ZAIModel,
    messages: Message[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p,
        max_tokens: options.max_tokens ?? 2048,
        stream: options.stream ?? false,
        tools: options.tools,
      });

      return response as ChatResponse;
    } catch (error) {
      throw new ZAIError(`Chat completion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Stream chat completion (for real-time responses)
   * @param model - Z.ai model to use
   * @param messages - Array of chat messages
   * @param onChunk - Callback for each chunk
   * @param options - Additional options
   */
  async chatStream(
    model: ZAIModel,
    messages: Message[],
    onChunk: (chunk: string) => void,
    options: Omit<ChatOptions, 'stream'> = {}
  ): Promise<ChatResponse> {
    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2048,
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          onChunk(content);
        }
      }

      // Return final response (approximate)
      return {
        id: 'stream-' + Date.now(),
        created: Date.now() / 1000,
        model,
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: fullContent },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
      };
    } catch (error) {
      throw new ZAIError(`Chat stream failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // =====================================================
  // VISION / MULTIMODAL
  // =====================================================

  /**
   * Send vision request with images
   * @param images - Array of image URLs or base64 data
   * @param prompt - Text prompt
   * @param model - Vision model (default: glm-4.6v)
   * @param options - Additional options
   */
  async vision(
    images: string[],
    prompt: string,
    model: 'glm-4.6v' | 'glm-4.6v-flash' = 'glm-4.6v',
    options: VisionOptions = {}
  ): Promise<VisionResponse> {
    try {
      const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
        { type: 'text', text: prompt },
      ];

      for (const image of images) {
        if (image.startsWith('http://') || image.startsWith('https://')) {
          content.push({
            type: 'image_url',
            image_url: { url: image },
          });
        } else {
          // Assume base64
          content.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${image}` },
          });
        }
      }

      const response = await this.client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: content as any }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2048,
      });

      return response as VisionResponse;
    } catch (error) {
      throw new ZAIError(`Vision request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // =====================================================
  // IMAGE GENERATION
  // =====================================================

  /**
   * Generate images using CogView model
   * @param prompt - Image generation prompt
   * @param options - Generation options (size, model)
   */
  async generateImage(
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<ImageGenerationResponse> {
    try {
      const response = await this.client.images.generations({
        model: options.model ?? 'cogview-4',
        prompt,
        size: options.size ?? '1024x1024',
      });

      return response as ImageGenerationResponse;
    } catch (error) {
      throw new ZAIError(`Image generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // =====================================================
  // EMBEDDINGS
  // =====================================================

  /**
   * Generate embeddings for text
   * @param input - Text to embed (string or array of strings)
   * @param options - Embedding options (model)
   */
  async generateEmbeddings(
    input: string | string[],
    options: EmbeddingOptions = {}
  ): Promise<EmbeddingResponse> {
    try {
      const response = await this.client.embeddings.create({
        model: options.model ?? 'embedding-3',
        input,
      });

      return response as EmbeddingResponse;
    } catch (error) {
      throw new ZAIError(`Embedding generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // =====================================================
  // WEB SEARCH (BUILT-IN TOOL)
  // =====================================================

  /**
   * Perform web search using Z.ai's built-in web search tool
   * Note: This requires the tool to be enabled in the API call
   * @param query - Search query
   * @param numResults - Number of results to return (default: 5)
   */
  async webSearch(query: string, numResults: number = 5): Promise<SearchResult[]> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'glm-4.7',
        messages: [
          {
            role: 'system',
            content: `You are a web search assistant. Search for information and return results in JSON format with title, link, and description fields. Return exactly ${numResults} results.`,
          },
          {
            role: 'user',
            content: `Search for: ${query}. Return results as a JSON array with objects containing {title, link, description}.`,
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'web_search',
              description: 'Search the web for current information',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search query',
                  },
                },
                required: ['query'],
              },
            },
          },
        ],
        temperature: 0.3,
      });

      // Parse the response to extract search results
      const content = response.choices[0]?.message?.content || '[]';
      try {
        // Try to parse JSON from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as SearchResult[];
        }
      } catch {
        // If parsing fails, return empty array
      }

      return [];
    } catch (error) {
      throw new ZAIError(`Web search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Get model info and capabilities
   */
  getModelInfo(model: ZAIModel): {
    name: string;
    contextWindow: number;
    inputCost: number;
    outputCost: number;
    supportsVision: boolean;
    supportsTools: boolean;
  } {
    const models: Record<ZAIModel, {
      name: string;
      contextWindow: number;
      inputCost: number;
      outputCost: number;
      supportsVision: boolean;
      supportsTools: boolean;
    }> = {
      'glm-4.7': {
        name: 'GLM-4.7',
        contextWindow: 128000,
        inputCost: 0.6,
        outputCost: 2.2,
        supportsVision: false,
        supportsTools: true,
      },
      'glm-4.7-flashx': {
        name: 'GLM-4.7-FlashX',
        contextWindow: 128000,
        inputCost: 0.07,
        outputCost: 0.4,
        supportsVision: false,
        supportsTools: true,
      },
      'glm-4.7-flash': {
        name: 'GLM-4.7-Flash',
        contextWindow: 128000,
        inputCost: 0,
        outputCost: 0,
        supportsVision: false,
        supportsTools: true,
      },
      'glm-4.6': {
        name: 'GLM-4.6',
        contextWindow: 128000,
        inputCost: 0.6,
        outputCost: 2.2,
        supportsVision: false,
        supportsTools: true,
      },
      'glm-4.6v': {
        name: 'GLM-4.6V',
        contextWindow: 8000,
        inputCost: 0.3,
        outputCost: 0.9,
        supportsVision: true,
        supportsTools: false,
      },
      'glm-4.6v-flash': {
        name: 'GLM-4.6V-Flash',
        contextWindow: 8000,
        inputCost: 0,
        outputCost: 0,
        supportsVision: true,
        supportsTools: false,
      },
    };

    return models[model] || models['glm-4.7'];
  }
}

// =====================================================
// ERROR CLASS
// =====================================================

export class ZAIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ZAIError';
  }
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default ZAIClient;
