/**
 * Cost Tracker for Z.ai (Zhipu AI) Models
 *
 * Pricing as of February 2026:
 * - GLM-4.7: $0.6 input / $2.2 output per 1M tokens
 * - GLM-4.7-FlashX: $0.07 input / $0.4 output per 1M tokens
 * - GLM-4.7-Flash: FREE
 * - GLM-4.6V: $0.3 input / $0.9 output per 1M tokens
 * - GLM-4.6V-Flash: FREE
 */

import { ZAIModel } from '../llm/zai-client';

// =====================================================
// PRICING CONSTANTS
// =====================================================

export const ZAI_MODEL_COSTS: Record<ZAIModel, { input: number; output: number }> = {
  'glm-4.7': { input: 0.6, output: 2.2 },
  'glm-4.7-flashx': { input: 0.07, output: 0.4 },
  'glm-4.7-flash': { input: 0, output: 0 },
  'glm-4.6': { input: 0.6, output: 2.2 },
  'glm-4.6v': { input: 0.3, output: 0.9 },
  'glm-4.6v-flash': { input: 0, output: 0 },
};

// Additional costs per API call type
export const ZAI_ADDITIONAL_COSTS = {
  web_search: 0.01, // $0.01 per web search use
  image_generation_cogview4: 0.01, // $0.01 per image
  image_generation_cogview3: 0.005, // $0.005 per image
};

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface CostBreakdown {
  model: ZAIModel;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_cost: number;
  output_cost: number;
  total_cost: number;
}

export interface CostReport {
  requests: number;
  total_tokens: number;
  total_cost: number;
  average_cost_per_request: number;
  by_model: Record<ZAIModel, CostBreakdown>;
}

// =====================================================
// COST CALCULATION FUNCTIONS
// =====================================================

/**
 * Calculate cost for a specific model and token usage
 * @param model - Z.ai model
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @returns Cost in USD
 */
export function calculateCost(
  model: ZAIModel,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = ZAI_MODEL_COSTS[model];
  const inputCost = (inputTokens * pricing.input) / 1_000_000;
  const outputCost = (outputTokens * pricing.output) / 1_000_000;
  return inputCost + outputCost;
}

/**
 * Calculate detailed cost breakdown
 * @param model - Z.ai model
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @returns Detailed cost breakdown
 */
export function calculateCostBreakdown(
  model: ZAIModel,
  inputTokens: number,
  outputTokens: number
): CostBreakdown {
  const pricing = ZAI_MODEL_COSTS[model];
  const inputCost = (inputTokens * pricing.input) / 1_000_000;
  const outputCost = (outputTokens * pricing.output) / 1_000_000;

  return {
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: inputTokens + outputTokens,
    input_cost: inputCost,
    output_cost: outputCost,
    total_cost: inputCost + outputCost,
  };
}

/**
 * Calculate cost from token usage object (from API response)
 * @param model - Z.ai model
 * @param usage - Token usage from API response
 * @returns Cost in USD
 */
export function calculateCostFromUsage(
  model: ZAIModel,
  usage: TokenUsage
): number {
  // Note: Z.ai returns prompt_tokens (input) and completion_tokens (output)
  return calculateCost(model, usage.prompt_tokens, usage.completion_tokens);
}

/**
 * Estimate cost before making an API call
 * Useful for budget checking and user warnings
 * @param model - Z.ai model
 * @param inputText - Input text to estimate
 * @param estimatedOutputRatio - Estimated output/input ratio (default: 0.75)
 * @returns Estimated cost in USD
 */
export function estimateCost(
  model: ZAIModel,
  inputText: string,
  estimatedOutputRatio: number = 0.75
): number {
  // Rough estimation: ~1 token per 4 characters for Chinese, ~1 token per 4 characters for English
  const estimatedInputTokens = Math.ceil(inputText.length / 4);
  const estimatedOutputTokens = Math.ceil(estimatedInputTokens * estimatedOutputRatio);

  return calculateCost(model, estimatedInputTokens, estimatedOutputTokens);
}

/**
 * Estimate tokens from text
 * @param text - Input text
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  // Rough estimation: ~1 token per 4 characters
  return Math.ceil(text.length / 4);
}

// =====================================================
// COST TRACKER CLASS
// =====================================================

export class CostTracker {
  private modelUsage: Map<ZAIModel, { tokens: number; cost: number; requests: number }>;

  constructor() {
    this.modelUsage = new Map();
    // Initialize with zero values for all models
    Object.keys(ZAI_MODEL_COSTS).forEach((model) => {
      this.modelUsage.set(model as ZAIModel, { tokens: 0, cost: 0, requests: 0 });
    });
  }

  /**
   * Track a single API call
   * @param model - Z.ai model used
   * @param inputTokens - Input tokens
   * @param outputTokens - Output tokens
   */
  trackCall(model: ZAIModel, inputTokens: number, outputTokens: number): void {
    const current = this.modelUsage.get(model) || { tokens: 0, cost: 0, requests: 0 };
    const cost = calculateCost(model, inputTokens, outputTokens);

    this.modelUsage.set(model, {
      tokens: current.tokens + inputTokens + outputTokens,
      cost: current.cost + cost,
      requests: current.requests + 1,
    });
  }

  /**
   * Track usage from API response
   * @param model - Z.ai model used
   * @param usage - Token usage from API response
   */
  trackUsage(model: ZAIModel, usage: TokenUsage): void {
    this.trackCall(model, usage.prompt_tokens, usage.completion_tokens);
  }

  /**
   * Get total cost across all models
   */
  getTotalCost(): number {
    let total = 0;
    this.modelUsage.forEach((data) => {
      total += data.cost;
    });
    return total;
  }

  /**
   * Get total tokens across all models
   */
  getTotalTokens(): number {
    let total = 0;
    this.modelUsage.forEach((data) => {
      total += data.tokens;
    });
    return total;
  }

  /**
   * Get total requests across all models
   */
  getTotalRequests(): number {
    let total = 0;
    this.modelUsage.forEach((data) => {
      total += data.requests;
    });
    return total;
  }

  /**
   * Generate detailed cost report
   */
  generateReport(): CostReport {
    const byModel: Record<string, CostBreakdown> = {};
    let totalTokens = 0;
    let totalCost = 0;
    let totalRequests = 0;

    this.modelUsage.forEach((data, model) => {
      if (data.requests > 0) {
        const pricing = ZAI_MODEL_COSTS[model];
        // Estimate input/output split (roughly 60/40)
        const inputTokens = Math.round(data.tokens * 0.6);
        const outputTokens = Math.round(data.tokens * 0.4);

        byModel[model] = {
          model,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: data.tokens,
          input_cost: (inputTokens * pricing.input) / 1_000_000,
          output_cost: (outputTokens * pricing.output) / 1_000_000,
          total_cost: data.cost,
        };

        totalTokens += data.tokens;
        totalCost += data.cost;
        totalRequests += data.requests;
      }
    });

    return {
      requests: totalRequests,
      total_tokens: totalTokens,
      total_cost: totalCost,
      average_cost_per_request: totalRequests > 0 ? totalCost / totalRequests : 0,
      by_model: byModel as Record<ZAIModel, CostBreakdown>,
    };
  }

  /**
   * Reset all tracking data
   */
  reset(): void {
    this.modelUsage.forEach((_, model) => {
      this.modelUsage.set(model, { tokens: 0, cost: 0, requests: 0 });
    });
  }

  /**
   * Get cost for a specific model
   * @param model - Z.ai model
   */
  getModelCost(model: ZAIModel): number {
    return this.modelUsage.get(model)?.cost || 0;
  }

  /**
   * Check if cost exceeds budget
   * @param budget - Maximum allowed budget in USD
   */
  exceedsBudget(budget: number): boolean {
    return this.getTotalCost() > budget;
  }

  /**
   * Get percentage of budget used
   * @param budget - Total budget in USD
   */
  getBudgetPercentage(budget: number): number {
    if (budget === 0) return 0;
    return Math.min((this.getTotalCost() / budget) * 100, 100);
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format cost as USD string
 * @param cost - Cost in USD
 * @param decimals - Number of decimal places (default: 4)
 */
export function formatCost(cost: number, decimals: number = 4): string {
  return `$${cost.toFixed(decimals)}`;
}

/**
 * Format token count with commas
 * @param tokens - Number of tokens
 */
export function formatTokens(tokens: number): string {
  return tokens.toLocaleString();
}

/**
 * Get model display name
 * @param model - Z.ai model
 */
export function getModelDisplayName(model: ZAIModel): string {
  const names: Record<ZAIModel, string> = {
    'glm-4.7': 'GLM-4.7 (Premium)',
    'glm-4.7-flashx': 'GLM-4.7-FlashX (Balanced)',
    'glm-4.7-flash': 'GLM-4.7-Flash (Free)',
    'glm-4.6': 'GLM-4.6',
    'glm-4.6v': 'GLM-4.6V (Vision)',
    'glm-4.6v-flash': 'GLM-4.6V-Flash (Free Vision)',
  };
  return names[model] || model;
}

/**
 * Get recommended model for use case
 * @param useCase - Use case description
 */
export function getRecommendedModel(useCase: string): ZAIModel {
  const lowerUse = useCase.toLowerCase();

  // Development/testing - use free tier
  if (lowerUse.includes('dev') || lowerUse.includes('test') || lowerUse.includes('debug')) {
    return 'glm-4.7-flash';
  }

  // Production - use premium
  if (lowerUse.includes('prod') || lowerUse.includes('production')) {
    return 'glm-4.7';
  }

  // Cost-sensitive - use flashx
  if (lowerUse.includes('cheap') || lowerUse.includes('budget') || lowerUse.includes('cost')) {
    return 'glm-4.7-flashx';
  }

  // Vision/multimodal
  if (lowerUse.includes('vision') || lowerUse.includes('image') || lowerUse.includes('picture')) {
    return 'glm-4.6v';
  }

  // Default to balanced option
  return 'glm-4.7-flashx';
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default CostTracker;
