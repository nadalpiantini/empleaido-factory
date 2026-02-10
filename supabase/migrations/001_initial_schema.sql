-- EMPLEAIDO FACTORY SUPABASE SCHEMA
-- Migration: 001_initial_schema
-- Created: Feb 9, 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: ef_adoptions
-- Tracks user adoptions of Empleaidos
-- =====================================================
CREATE TABLE IF NOT EXISTS ef_adoptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  empleaido_id VARCHAR(50) NOT NULL, -- e.g., 'empleaido-04094'
  agent_id VARCHAR(100) NOT NULL, -- e.g., 'empleaido-sera-4094'
  workspace_path TEXT NOT NULL,

  -- Adoption metadata
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, active, suspended, terminated
  adopted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Onboarding status
  bootstrap_phase INTEGER DEFAULT 1 CHECK (bootstrap_phase BETWEEN 1 AND 5),
  bootstrap_completed BOOLEAN DEFAULT FALSE,
  bootstrap_completed_at TIMESTAMP WITH TIME ZONE,

  -- User preferences from onboarding
  preferences JSONB DEFAULT '{}', -- {language, formality, proactivity, communication, detailLevel}

  -- Indexes
  CONSTRAINT ef_adoptions_unique_user_empleaido UNIQUE (user_id, empleaido_id)
);

CREATE INDEX idx_ef_adoptions_user_id ON ef_adoptions(user_id);
CREATE INDEX idx_ef_adoptions_empleaido_id ON ef_adoptions(empleaido_id);
CREATE INDEX idx_ef_adoptions_status ON ef_adoptions(status);

-- =====================================================
-- TABLE: ef_life_events
-- Tracks all events that affect Empleaido life stats
-- =====================================================
CREATE TABLE IF NOT EXISTS ef_life_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  adoption_id UUID NOT NULL REFERENCES ef_adoptions(id) ON DELETE CASCADE,

  -- Event details
  event_type VARCHAR(50) NOT NULL, -- skill_execution, interaction, level_up, trust_milestone, etc.
  event_data JSONB DEFAULT '{}',

  -- Life stat changes
  xp_gain INTEGER DEFAULT 0,
  trust_change DECIMAL(3,2) DEFAULT 0.00, -- Can be negative
  energy_change INTEGER DEFAULT 0,

  -- Resulting stats (cumulative)
  level_after INTEGER DEFAULT 1,
  xp_after INTEGER DEFAULT 0,
  trust_after DECIMAL(3,2) DEFAULT 0.60,
  energy_after INTEGER DEFAULT 100,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_ef_life_events_adoption_id ON ef_life_events(adoption_id);
CREATE INDEX idx_ef_life_events_event_type ON ef_life_events(event_type);
CREATE INDEX idx_ef_life_events_created_at ON ef_life_events(created_at DESC);

-- =====================================================
-- TABLE: ef_skill_executions
-- Tracks all skill executions by Empleaidos
-- =====================================================
CREATE TABLE IF NOT EXISTS ef_skill_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  adoption_id UUID NOT NULL REFERENCES ef_adoptions(id) ON DELETE CASCADE,

  -- Skill details
  skill_id VARCHAR(50) NOT NULL,
  skill_name VARCHAR(100) NOT NULL,

  -- Execution details
  params JSONB DEFAULT '{}',
  status VARCHAR(20) NOT NULL, -- success, failed, timeout
  output TEXT,
  error_message TEXT,

  -- Performance metrics
  duration_ms INTEGER NOT NULL,
  execution_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Rewards/costs
  xp_gained INTEGER DEFAULT 0,
  trust_increase DECIMAL(3,2) DEFAULT 0.00,
  energy_cost INTEGER DEFAULT 0,

  -- Indexes
  CONSTRAINT ef_skill_executions_check_status CHECK (status IN ('success', 'failed', 'timeout'))
);

CREATE INDEX idx_ef_skill_executions_adoption_id ON ef_skill_executions(adoption_id);
CREATE INDEX idx_ef_skill_executions_skill_id ON ef_skill_executions(skill_id);
CREATE INDEX idx_ef_skill_executions_status ON ef_skill_executions(status);
CREATE INDEX idx_ef_skill_executions_execution_time ON ef_skill_executions(execution_time DESC);

-- =====================================================
-- TABLE: ef_user_stats
-- Aggregate stats per user
-- =====================================================
CREATE TABLE IF NOT EXISTS ef_user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Adoption stats
  total_adoptions INTEGER DEFAULT 0,
  active_empleaidos INTEGER DEFAULT 0,

  -- Cumulative stats
  total_xp INTEGER DEFAULT 0,
  average_trust DECIMAL(3,2) DEFAULT 0.00,
  total_skill_executions INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to update user_stats on life_events
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ef_user_stats (user_id, total_adoptions, active_empleaidos, total_xp, average_trust, total_skill_executions, updated_at)
  SELECT
    a.user_id,
    COUNT(DISTINCT a.id),
    COUNT(DISTINCT CASE WHEN a.status = 'active' THEN a.id END) FILTER (WHERE a.status = 'active'),
    COALESCE(SUM(le.xp_gain), 0),
    COALESCE(AVG(le.trust_after), 0.60),
    COALESCE(COUNT(CASE WHEN le.event_type = 'skill_execution' THEN 1 END), 0),
    NOW()
  FROM ef_adoptions a
  LEFT JOIN ef_life_events le ON le.adoption_id = a.id
  WHERE a.user_id = (SELECT user_id FROM ef_adoptions WHERE id = NEW.adoption_id)
  ON CONFLICT (user_id) DO UPDATE SET
    total_adoptions = EXCLUDED.total_adoptions,
    active_empleaidos = EXCLUDED.active_empleaidos,
    total_xp = EXCLUDED.total_xp,
    average_trust = EXCLUDED.average_trust,
    total_skill_executions = EXCLUDED.total_skill_executions,
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats
AFTER INSERT ON ef_life_events
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE ef_adoptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_life_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_skill_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_user_stats ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see their own data
CREATE POLICY "Users can view own adoptions"
  ON ef_adoptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adoptions"
  ON ef_adoptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own adoptions"
  ON ef_adoptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own life_events"
  ON ef_life_events FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM ef_adoptions WHERE id = adoption_id));

CREATE POLICY "Users can view own skill_executions"
  ON ef_skill_executions FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM ef_adoptions WHERE id = adoption_id));

CREATE POLICY "Users can view own stats"
  ON ef_user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get current life stats for an adoption
CREATE OR REPLACE FUNCTION get_adoption_stats(p_adoption_id UUID)
RETURNS TABLE (
  level INTEGER,
  xp INTEGER,
  trust DECIMAL(3,2),
  energy INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(le.level_after, 1) as level,
    COALESCE(le.xp_after, 0) as xp,
    COALESCE(le.trust_after, 0.60) as trust,
    COALESCE(le.energy_after, 100) as energy
  FROM ef_life_events le
  WHERE le.adoption_id = p_adoption_id
  ORDER BY le.created_at DESC
  LIMIT 1;

  -- If no events, return defaults
  IF NOT FOUND THEN
    SELECT 1, 0, 0.60, 100;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS
-- =====================================================

-- View: Active empleaidos with current stats
CREATE OR REPLACE VIEW vw_active_empleaidos AS
SELECT
  a.id,
  a.user_id,
  a.empleaido_id,
  a.agent_id,
  a.status,
  a.bootstrap_phase,
  a.bootstrap_completed,
  a.preferences,
  s.level as current_level,
  s.xp as current_xp,
  s.trust as current_trust,
  s.energy as current_energy,
  a.adopted_at
FROM ef_adoptions a
LEFT JOIN LATERAL get_adoption_stats(a.id) s ON true
WHERE a.status = 'active';

-- View: Recent skill executions
CREATE OR REPLACE VIEW vw_recent_skill_executions AS
SELECT
  se.id,
  se.adoption_id,
  a.empleaido_id,
  se.skill_id,
  se.skill_name,
  se.status,
  se.duration_ms,
  se.execution_time,
  se.xp_gained,
  se.energy_cost
FROM ef_skill_executions se
JOIN ef_adoptions a ON a.id = se.adoption_id
ORDER BY se.execution_time DESC
LIMIT 50;

-- =====================================================
-- SEED DATA (for testing)
-- =====================================================

-- Insert a test user stats record (will be updated by triggers)
INSERT INTO ef_user_stats (user_id, total_adoptions, active_empleaidos, total_xp, average_trust, total_skill_executions)
VALUES
  ('00000000-0000-0000-0000-000000000000', 0, 0, 0, 0.60, 0)
ON CONFLICT (user_id) DO NOTHING;
