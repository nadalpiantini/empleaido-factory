/**
 * Engine Types for Agent Wrapping Platform
 * Type definitions for agent engines created by developers
 */

import { ZAIModel } from '@/lib/llm/zai-client';

// =====================================================
// ENGINE CONFIGURATION
// =====================================================

export interface EngineConfig {
  // Basic info
  name: string;
  slug: string;
  description: string;
  version: string;
  category: EngineCategory;

  // LLM configuration
  llm: LLMAIConfig;

  // Capabilities
  capabilities: EngineCapabilities;

  // Skills the engine provides
  skills: EngineSkill[];

  // Personality/System prompt
  system_prompt: string;

  // Integration points
  integrations: EngineIntegrations;

  // Resource limits
  limits: EngineLimits;
}

export type EngineCategory =
  | 'accounting'
  | 'finance'
  | 'hr'
  | 'marketing'
  | 'operations'
  | 'productivity'
  | 'analytics'
  | 'customer-service'
  | 'general';

export interface LLMAIConfig {
  provider: 'zai' | 'openai' | 'anthropic' | 'custom';
  model: ZAIModel;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string; // For custom providers
}

export interface EngineCapabilities {
  input_types: InputType[];
  output_types: OutputType[];
  streaming: boolean;
  vision: boolean;
  web_search: boolean;
  file_upload: boolean;
}

export type InputType = 'text' | 'file' | 'image' | 'audio' | 'video';
export type OutputType = 'text' | 'json' | 'file' | 'structured';

export interface EngineSkill {
  id: string;
  name: string;
  description: string;
  prompt_template: string;
  required_inputs: string[];
  output_format: 'text' | 'json' | 'file';
  estimated_tokens?: number;
}

export interface EngineIntegrations {
  database: boolean;
  apis: string[];
  tools: string[];
  file_system: boolean;
}

export interface EngineLimits {
  max_concurrent: number;
  timeout_seconds: number;
  cost_per_call: number;
  max_file_size_mb?: number;
}

// =====================================================
// ENGINE DATABASE RECORD
// =====================================================

export interface EngineRecord {
  id: string;
  tenant_id: string;
  developer_id: string;

  // Metadata
  name: string;
  slug: string;
  description: string;
  version: string;
  category: EngineCategory;

  // Configuration (stored as JSONB)
  config: EngineConfig;

  // Status
  status: EngineStatus;
  is_public: boolean;

  // Timestamps
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type EngineStatus = 'draft' | 'published' | 'archived';

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateEngineRequest {
  name: string;
  slug: string;
  description: string;
  category: EngineCategory;
  config: EngineConfig;
}

export interface UpdateEngineRequest {
  name?: string;
  description?: string;
  category?: EngineCategory;
  config?: Partial<EngineConfig>;
  status?: EngineStatus;
  is_public?: boolean;
}

export interface EngineResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  category: EngineCategory;
  status: EngineStatus;
  is_public: boolean;
  developer_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EngineListResponse {
  engines: EngineResponse[];
  total: number;
  page: number;
  per_page: number;
}

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

export interface EngineValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// =====================================================
// ENGINE EXECUTION TYPES
// =====================================================

export interface EngineExecutionContext {
  engine_id: string;
  tenant_id: string;
  user_id: string;
  input: any;
  config?: Record<string, any>;
}

export interface EngineExecutionResult {
  success: boolean;
  output: any;
  error?: string;
  tokens_used?: number;
  cost?: number;
  execution_time_ms: number;
}

// =====================================================
// ENGINE TEMPLATE TYPES
// =====================================================

export interface EngineTemplate {
  id: string;
  name: string;
  description: string;
  category: EngineCategory;
  config: Partial<EngineConfig>;
  is_customizable: boolean;
}

export const PREBUILT_ENGINES: Record<string, EngineTemplate> = {
  accounting: {
    id: 'accounting',
    name: 'Accounting Engine',
    description: 'Automated accounting, invoicing, and financial reports',
    category: 'accounting',
    config: {
      llm: {
        provider: 'zai',
        model: 'glm-4.7-flashx',
        temperature: 0.3,
      },
      capabilities: {
        input_types: ['text', 'file'],
        output_types: ['json', 'structured'],
        streaming: false,
        vision: false,
        web_search: false,
        file_upload: true,
      },
      system_prompt: 'You are an expert accounting assistant...',
    } as Partial<EngineConfig>,
    is_customizable: true,
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing Engine',
    description: 'Content creation, social media, and marketing automation',
    category: 'marketing',
    config: {
      llm: {
        provider: 'zai',
        model: 'glm-4.7',
        temperature: 0.8,
      },
      capabilities: {
        input_types: ['text'],
        output_types: ['text', 'json'],
        streaming: true,
        vision: false,
        web_search: true,
        file_upload: false,
      },
      system_prompt: 'You are a creative marketing expert...',
    } as Partial<EngineConfig>,
    is_customizable: true,
  },

  productivity: {
    id: 'productivity',
    name: 'Productivity Engine',
    description: 'Task management, prioritization, and workflow optimization',
    category: 'productivity',
    config: {
      llm: {
        provider: 'zai',
        model: 'glm-4.7-flashx',
        temperature: 0.5,
      },
      capabilities: {
        input_types: ['text'],
        output_types: ['text', 'json'],
        streaming: false,
        vision: false,
        web_search: false,
        file_upload: false,
      },
      system_prompt: 'You are a productivity coach...',
    } as Partial<EngineConfig>,
    is_customizable: true,
  },
};

// =====================================================
// HELPER TYPES
// =====================================================

export interface EngineFilters {
  category?: EngineCategory;
  status?: EngineStatus;
  is_public?: boolean;
  developer_id?: string;
  search?: string;
}

export interface EngineListOptions {
  page?: number;
  per_page?: number;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'category';
  sort_order?: 'asc' | 'desc';
  filters?: EngineFilters;
}

// =====================================================
// EXPORTS
// =====================================================

export type {
  EngineConfig,
  EngineRecord,
  CreateEngineRequest,
  UpdateEngineRequest,
  EngineResponse,
  EngineListResponse,
  EngineValidationResult,
  EngineExecutionContext,
  EngineExecutionResult,
  EngineTemplate,
  EngineFilters,
  EngineListOptions,
};

export { PREBUILT_ENGINES };
