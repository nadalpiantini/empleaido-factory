-- =====================================================
-- EMPLEAIDO FACTORY - DASHBOARD & VIRTUAL OFFICE TABLES
-- =====================================================

-- Departments Table (for Virtual Office)
CREATE TABLE IF NOT EXISTS ef_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  icon VARCHAR(50) NOT NULL DEFAULT 'building',
  color VARCHAR(20) NOT NULL DEFAULT '#3b82f6',
  description TEXT,
  active_members INTEGER DEFAULT 0,
  active_tasks INTEGER DEFAULT 0,
  efficiency INTEGER DEFAULT 0 CHECK (efficiency BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Log Table (for Dashboard Timeline)
CREATE TABLE IF NOT EXISTS ef_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleaido_id VARCHAR(50) NOT NULL,
  empleaido_name VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target VARCHAR(255),
  activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('task', 'levelup', 'skill', 'achievement')),
  department_id UUID REFERENCES ef_departments(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_empleaido ON ef_activity_log(empleaido_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON ef_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON ef_activity_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_department ON ef_activity_log(department_id);

-- =====================================================
-- INSERT DEFAULT DEPARTMENTS
-- =====================================================

INSERT INTO ef_departments (name, slug, icon, color, description, active_members, active_tasks, efficiency)
VALUES
  ('Human Resources', 'hr', 'users', '#ec4899', 'Manage team members, payroll, and culture', 12, 8, 94),
  ('Operations', 'operations', 'settings', '#3b82f6', 'Streamline workflows and processes', 24, 15, 89),
  ('Finance', 'finance', 'dollar-sign', '#22c55e', 'Budget, accounting, and financial planning', 6, 4, 97),
  ('Marketing', 'marketing', 'megaphone', '#a855f7', 'Brand, campaigns, and growth', 18, 22, 85),
  ('Technology', 'technology', 'laptop', '#06b6d4', 'Infrastructure, development, and innovation', 15, 18, 92),
  ('Innovation', 'innovation', 'lightbulb', '#eab308', 'R&D, new products, and experiments', 9, 12, 88)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE ef_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_activity_log ENABLE ROW LEVEL SECURITY;

-- Departments: Everyone can read, only service role can write
CREATE POLICY "Departments are readable by everyone"
  ON ef_departments FOR SELECT
  USING (true);

CREATE POLICY "Only service role can modify departments"
  ON ef_departments FOR ALL
  USING (auth.role() = 'service_role');

-- Activity Log: Everyone can read, only authenticated users can write
CREATE POLICY "Activity log is readable by everyone"
  ON ef_activity_log FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert activity"
  ON ef_activity_log FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only service role can update/delete activity"
  ON ef_activity_log FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- FUNCTIONS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON ef_departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTION: LOG ACTIVITY
-- =====================================================

CREATE OR REPLACE FUNCTION log_activity(
  p_empleaido_id VARCHAR,
  p_empleaido_name VARCHAR,
  p_action VARCHAR,
  p_target VARCHAR DEFAULT NULL,
  p_activity_type VARCHAR DEFAULT 'task',
  p_department_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO ef_activity_log (
    empleaido_id,
    empleaido_name,
    action,
    target,
    activity_type,
    department_id,
    metadata
  )
  VALUES (
    p_empleaido_id,
    p_empleaido_name,
    p_action,
    p_target,
    p_activity_type,
    p_department_id,
    p_metadata
  )
  RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEW: DASHBOARD SUMMARY
-- =====================================================

CREATE OR REPLACE VIEW ef_dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM ef_adoptions WHERE status = 'active') as active_empleaidos,
  (SELECT ROUND(AVG(energy_after)) FROM ef_life_events WHERE created_at > NOW() - INTERVAL '7 days') as avg_energy,
  (SELECT COUNT(*) FROM ef_skill_executions WHERE execution_time::date = CURRENT_DATE) as tasks_today,
  (SELECT COUNT(*) FROM ef_adoptions WHERE status = 'active' AND adopted_at > NOW() - INTERVAL '24 hours') as in_production;
