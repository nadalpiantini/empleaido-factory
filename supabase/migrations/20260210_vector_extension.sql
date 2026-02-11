-- EMPLEAIDO FACTORY VECTOR EXTENSION
-- Migration: 20260210_vector_extension
-- Created: Feb 10, 2026
-- Purpose: Enable pgvector extension for semantic search capabilities

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table for storing embeddings for Empleaidos knowledge base
-- This will allow semantic search across Empleaido capabilities and user interactions
CREATE TABLE IF NOT EXISTS ef_knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empleaido_id VARCHAR(50) NOT NULL, -- Reference to the Empleaido
  content TEXT NOT NULL, -- The text content that was embedded
  embedding vector(1536), -- Assuming 1536 dimensions for OpenAI embeddings
  content_type VARCHAR(50), -- 'skill_description', 'faq', 'user_interaction', etc.
  metadata JSONB DEFAULT '{}', -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient similarity search
CREATE INDEX IF NOT EXISTS idx_ef_knowledge_embeddings_empleaido_id
  ON ef_knowledge_embeddings(empleaido_id);

-- Create a vector index for similarity search (requires pgvector 0.6.0+)
-- This index is crucial for fast cosine similarity searches
CREATE INDEX IF NOT EXISTS idx_ef_knowledge_embeddings_embedding
  ON ef_knowledge_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- Create a table for user interaction embeddings
-- This will help personalize the Empleaidos based on user interactions
CREATE TABLE IF NOT EXISTS ef_user_interaction_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adoption_id UUID NOT NULL REFERENCES ef_adoptions(id) ON DELETE CASCADE,
  interaction_text TEXT NOT NULL,
  embedding vector(1536),
  interaction_type VARCHAR(50), -- 'question', 'command', 'feedback', etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user interaction embeddings
CREATE INDEX IF NOT EXISTS idx_ef_user_interaction_embeddings_user_id
  ON ef_user_interaction_embeddings(user_id);

CREATE INDEX IF NOT EXISTS idx_ef_user_interaction_embeddings_adoption_id
  ON ef_user_interaction_embeddings(adoption_id);

-- Create a vector index for user interaction embeddings
CREATE INDEX IF NOT EXISTS idx_ef_user_interaction_embeddings_embedding
  ON ef_user_interaction_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- Function to perform similarity search on knowledge base
CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding vector(1536),
  p_empleaido_id VARCHAR(50) DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  empleaido_id VARCHAR(50),
  content TEXT,
  content_type VARCHAR(50),
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    ke.id,
    ke.empleaido_id,
    ke.content,
    ke.content_type,
    1 - (ke.embedding <=> query_embedding) AS similarity
  FROM ef_knowledge_embeddings ke
  WHERE 1 - (ke.embedding <=> query_embedding) > match_threshold
    AND (p_empleaido_id IS NULL OR ke.empleaido_id = p_empleaido_id)
  ORDER BY ke.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Function to perform similarity search on user interactions
CREATE OR REPLACE FUNCTION search_user_interactions(
  query_embedding vector(1536),
  p_user_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  interaction_text TEXT,
  interaction_type VARCHAR(50),
  similarity FLOAT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql STABLE
AS $$
  SELECT
    uie.id,
    uie.interaction_text,
    uie.interaction_type,
    1 - (uie.embedding <=> query_embedding) AS similarity,
    uie.created_at
  FROM ef_user_interaction_embeddings uie
  WHERE uie.user_id = p_user_id
    AND 1 - (uie.embedding <=> query_embedding) > match_threshold
  ORDER BY uie.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ef_knowledge_embeddings_updated_at
  BEFORE UPDATE ON ef_knowledge_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for knowledge embeddings
ALTER TABLE ef_knowledge_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_user_interaction_embeddings ENABLE ROW LEVEL SECURITY;

-- Users can only access their own interaction embeddings
CREATE POLICY "Users can view own interaction embeddings"
  ON ef_user_interaction_embeddings FOR SELECT
  USING (auth.uid() = user_id);

-- Knowledge base embeddings are publicly readable (can be restricted if needed)
CREATE POLICY "Knowledge embeddings are publicly readable"
  ON ef_knowledge_embeddings FOR SELECT
  USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE ef_knowledge_embeddings TO anon, authenticated;
GRANT ALL ON TABLE ef_user_interaction_embeddings TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;