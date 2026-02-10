/**
 * VECTOR STORE UTILITIES
 *
 * Provides semantic search and persistence for Empleaido knowledge base
 * and user interaction history using pgvector in Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import { ZAIClient } from '../llm/zai-client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const zai = new ZAIClient();

export interface VectorMatch {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity: number;
}

/**
 * Add content to knowledge base vector store
 */
export async function addKnowledgeEmbedding(
  empleaidoId: string,
  content: string,
  contentType: 'skill_description' | 'faq' | 'user_interaction' | string,
  metadata: Record<string, any> = {}
) {
  const { data: { data: [{ embedding }] } } = await zai.generateEmbeddings(content);

  const { error } = await supabase.from('ef_knowledge_embeddings').insert({
    empleaido_id: empleaidoId,
    content,
    embedding,
    content_type: contentType,
    metadata,
  });

  if (error) throw error;
}

/**
 * Add user interaction to vector store
 */
export async function addUserInteractionEmbedding(
  userId: string,
  adoptionId: string,
  interactionText: string,
  interactionType: 'question' | 'command' | 'feedback' | string = 'question',
  metadata: Record<string, any> = {}
) {
  const { data: { data: [{ embedding }] } } = await zai.generateEmbeddings(interactionText);

  const { error } = await supabase.from('ef_user_interaction_embeddings').insert({
    user_id: userId,
    adoption_id: adoptionId,
    interaction_text: interactionText,
    embedding,
    interaction_type: interactionType,
    metadata,
  });

  if (error) throw error;
}

/**
 * Search knowledge base using semantic similarity
 */
export async function searchKnowledge(
  query: string,
  empleaidoId?: string,
  threshold = 0.7,
  count = 5
): Promise<VectorMatch[]> {
  const { data: { data: [{ embedding }] } } = await zai.generateEmbeddings(query);

  const { data, error } = await supabase.rpc('search_knowledge_base', {
    query_embedding: embedding,
    p_empleaido_id: empleaidoId,
    match_threshold: threshold,
    match_count: count,
  });

  if (error) throw error;

  return data.map((item: any) => ({
    id: item.id,
    content: item.content,
    metadata: {}, // RPC only returns content and type currently
    similarity: item.similarity,
  }));
}

/**
 * Search recent user interactions using semantic similarity
 */
export async function searchUserInteractions(
  userId: string,
  query: string,
  threshold = 0.7,
  count = 5
): Promise<VectorMatch[]> {
  const { data: { data: [{ embedding }] } } = await zai.generateEmbeddings(query);

  const { data, error } = await supabase.rpc('search_user_interactions', {
    query_embedding: embedding,
    p_user_id: userId,
    match_threshold: threshold,
    match_count: count,
  });

  if (error) throw error;

  return data.map((item: any) => ({
    id: item.id,
    content: item.interaction_text,
    metadata: {
        type: item.interaction_type,
        created_at: item.created_at
    },
    similarity: item.similarity,
  }));
}
