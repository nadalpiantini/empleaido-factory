-- EMPLEAIDO FACTORY - Supabase Schema
-- Prefijo: ef_ (empleaidofactory_)

-- ============================================
-- EMPLEAIDOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ef_empleaidos (
  id TEXT PRIMARY KEY,
  serial INTEGER UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ef_empleaidos_serial ON ef_empleaidos(serial);
CREATE INDEX idx_ef_empleaidos_status ON ef_empleaidos((data->>'status'));
CREATE INDEX idx_ef_empleaidos_tier ON ef_empleaidos((data->'role'->>'tier'));

-- ============================================
-- ADOPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ef_adoptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  empleaido_id TEXT NOT NULL REFERENCES ef_empleaidos(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'ended')),
  bond_started_at TIMESTAMP DEFAULT NOW(),
  bond_ended_at TIMESTAMP,
  cycle INTEGER DEFAULT 1,
  confidence NUMERIC(3,2) DEFAULT 0.60,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ef_adoptions_user ON ef_adoptions(user_id);
CREATE INDEX idx_ef_adoptions_empleaido ON ef_adoptions(empleaido_id);
CREATE INDEX idx_ef_adoptions_status ON ef_adoptions(status);

-- ============================================
-- EVENTS TABLE (Timeline)
-- ============================================
CREATE TABLE IF NOT EXISTS ef_empleaido_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleaido_id TEXT NOT NULL REFERENCES ef_empleaidos(id) ON DELETE CASCADE,
  adoption_id UUID REFERENCES ef_adoptions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('spawn', 'greeting', 'task', 'level_up', 'idle', 'error')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ef_events_empleaido ON ef_empleaido_events(empleaido_id);
CREATE INDEX idx_ef_events_adoption ON ef_empleaido_events(adoption_id);
CREATE INDEX idx_ef_events_created ON ef_empleaido_events(created_at DESC);

-- ============================================
-- LIFE EVENTS TABLE (XP tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS ef_life_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleaido_id TEXT NOT NULL REFERENCES ef_empleaidos(id) ON DELETE CASCADE,
  activity TEXT NOT NULL CHECK (activity IN ('task_completed', 'session', 'error', 'idle')),
  xp_delta INTEGER DEFAULT 0,
  trust_delta NUMERIC(4,3) DEFAULT 0,
  energy_delta INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ef_life_empleaido ON ef_life_events(empleaido_id);
CREATE INDEX idx_ef_life_created ON ef_life_events(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE ef_empleaidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_adoptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_empleaido_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_life_events ENABLE ROW LEVEL SECURITY;

-- Public can read all empleaidos
CREATE POLICY ef_empleaidos_public_read ON ef_empleaidos
  FOR SELECT USING (true);

-- Users can only see their own adoptions
CREATE POLICY ef_adoptions_user_read ON ef_adoptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY ef_adoptions_user_insert ON ef_adoptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see events for their adoptions
CREATE POLICY ef_events_user_read ON ef_empleaido_events
  FOR SELECT USING (
    adoption_id IN (
      SELECT id FROM ef_adoptions WHERE user_id = auth.uid()
    )
  );

-- Users can only see life events for their empleaidos
CREATE POLICY ef_life_user_read ON ef_life_events
  FOR SELECT USING (
    empleaido_id IN (
      SELECT empleaido_id FROM ef_adoptions WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update empleaido life stats
CREATE OR REPLACE FUNCTION ef_apply_activity(
  p_empleaido_id TEXT,
  p_activity TEXT,
  p_xp_delta INTEGER,
  p_trust_delta NUMERIC,
  p_energy_delta INTEGER
)
RETURNS JSONB AS $$
DECLARE
  current_data JSONB;
  new_xp INTEGER;
  new_level INTEGER;
  new_trust NUMERIC;
  new_energy INTEGER;
BEGIN
  -- Get current data
  SELECT data INTO current_data FROM ef_empleaidos WHERE id = p_empleaido_id;

  -- Calculate new stats
  new_xp := (current_data->'life'->>'experience')::INTEGER + p_xp_delta;
  new_level := FLOOR(new_xp / 100) + 1;
  new_trust := GREATEST(0, LEAST(1, (current_data->'life'->>'trust')::NUMERIC + p_trust_delta));
  new_energy := GREATEST(0, LEAST(100, (current_data->'life'->>'energy')::INTEGER + p_energy_delta));

  -- Update empleaido
  UPDATE ef_empleaidos
  SET data = jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              data,
              '{life,experience}', to_jsonb(new_xp)
            ),
            '{life,level}', to_jsonb(new_level)
          ),
          '{life,trust}', to_jsonb(new_trust)
        ),
        '{life,energy}', to_jsonb(new_energy)
      ),
      updated_at = NOW()
  WHERE id = p_empleaido_id;

  -- Log life event
  INSERT INTO ef_life_events (empleaido_id, activity, xp_delta, trust_delta, energy_delta)
  VALUES (p_empleaido_id, p_activity, p_xp_delta, p_trust_delta, p_energy_delta);

  RETURN jsonb_build_object(
    'level', new_level,
    'experience', new_xp,
    'trust', new_trust,
    'energy', new_energy
  );
END;
$$ LANGUAGE plpgsql;
