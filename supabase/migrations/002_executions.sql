-- =====================================================
-- AGENT EXECUTION LOGS TABLE
-- =====================================================
-- Purpose: Track all agent executions for analytics, billing, and rate limiting
-- Created: 2026-02-10
-- =====================================================

CREATE TABLE IF NOT EXISTS ef_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empleaido_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  output TEXT,
  cost DECIMAL(10, 4) DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate executions (same input within 1 minute)
  UNIQUE (user_id, empleaido_id, input, created_at)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_executions_user_date ON ef_executions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_executions_empleaido_date ON ef_executions(empleaido_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_executions_user_today ON ef_executions(user_id) WHERE created_at >= CURRENT_DATE;

-- Row Level Security
ALTER TABLE ef_executions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own executions
CREATE POLICY "Users can view own executions"
ON ef_executions FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own executions
CREATE POLICY "Users can insert own executions"
ON ef_executions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE ef_executions IS 'Logs of all agent executions with cost and usage tracking';
COMMENT ON COLUMN ef_executions.empleaido_id IS 'ID of the empleaido that was executed';
COMMENT ON COLUMN ef_executions.user_id IS 'User who initiated the execution';
COMMENT ON COLUMN ef_executions.input IS 'User input/prompt to the agent';
COMMENT ON COLUMN ef_executions.output IS 'Agent response/output';
COMMENT ON COLUMN ef_executions.cost IS 'Cost in USD of this execution (for billing)';
COMMENT ON COLUMN ef_executions.tokens_used IS 'Number of LLM tokens consumed';
COMMENT ON COLUMN ef_executions.duration_ms IS 'Execution time in milliseconds';
