-- EMPLEAIDO FACTORY - MULTI-TENANT MIGRATION
-- Migration: 20260209_multi_tenant_schema
-- Purpose: Transform single-tenant platform into multi-tenant Agent Wrapping Platform
-- Strategy: Add tenant_id to existing tables, create new tenant-aware tables

-- =====================================================
-- PHASE 1: TENANT MANAGEMENT
-- =====================================================

-- Table: ef_tenants
-- Organizations/companies that use the platform
CREATE TABLE IF NOT EXISTS ef_tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for tenant lookups
CREATE INDEX idx_ef_tenants_slug ON ef_tenants(slug);
CREATE INDEX idx_ef_tenants_plan ON ef_tenants(plan);

-- Create default system tenant
INSERT INTO ef_tenants (id, name, slug, plan, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Empleaido Factory System',
  'system',
  'enterprise',
  '{"is_system": true, "max_users": null, "max_agents": null}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Table: ef_user_profiles
-- Extended user information with roles and tenant association
CREATE TABLE IF NOT EXISTS ef_user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('developer', 'user', 'customer', 'admin')),
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_ef_user_profiles_tenant ON ef_user_profiles(tenant_id);
CREATE INDEX idx_ef_user_profiles_role ON ef_user_profiles(role);

-- Insert existing auth.users into ef_user_profiles with system tenant
INSERT INTO ef_user_profiles (id, email, name, role, tenant_id)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', email) as name,
  'user' as role,
  '00000000-0000-0000-0000-000000000001'::uuid as tenant_id
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  updated_at = NOW();

-- Table: ef_teams
-- Teams within a tenant for collaboration
CREATE TABLE IF NOT EXISTS ef_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES ef_user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ef_teams_tenant ON ef_teams(tenant_id);

-- Table: ef_team_members
-- Team membership with role-based permissions
CREATE TABLE IF NOT EXISTS ef_team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES ef_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ef_user_profiles(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_ef_team_members_team ON ef_team_members(team_id);
CREATE INDEX idx_ef_team_members_user ON ef_team_members(user_id);

-- =====================================================
-- PHASE 2: ENGINE REGISTRY
-- =====================================================

-- Table: ef_engines
-- Reusable agent engines created by developers
CREATE TABLE IF NOT EXISTS ef_engines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL REFERENCES ef_user_profiles(id) ON DELETE CASCADE,

  -- Engine metadata
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  version VARCHAR(20) DEFAULT '1.0.0',
  category VARCHAR(50) DEFAULT 'general', -- contabilidad, finanzas, rrhh, marketing, etc.

  -- Engine configuration
  config JSONB NOT NULL DEFAULT '{}', -- LLM settings, capabilities, etc.
  system_prompt TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_public BOOLEAN DEFAULT FALSE,

  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_ef_engines_tenant ON ef_engines(tenant_id);
CREATE INDEX idx_ef_engines_developer ON ef_engines(developer_id);
CREATE INDEX idx_ef_engines_status ON ef_engines(status);
CREATE INDEX idx_ef_engines_category ON ef_engines(category);
CREATE INDEX idx_ef_engines_public ON ef_engines(is_public) WHERE is_public = TRUE;

-- Table: ef_engine_skills
-- Individual skills within an engine
CREATE TABLE IF NOT EXISTS ef_engine_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engine_id UUID NOT NULL REFERENCES ef_engines(id) ON DELETE CASCADE,

  name VARCHAR(100) NOT NULL,
  description TEXT,
  prompt_template TEXT NOT NULL,
  required_inputs JSONB DEFAULT '[]', -- Array of required input fields
  output_format VARCHAR(20) DEFAULT 'text' CHECK (output_format IN ('text', 'json', 'file')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ef_engine_skills_engine ON ef_engine_skills(engine_id);

-- =====================================================
-- PHASE 3: AGENT ASSEMBLIES
-- =====================================================

-- Table: ef_agent_assemblies
-- User-created agents composed of multiple engines
CREATE TABLE IF NOT EXISTS ef_agent_assemblies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ef_user_profiles(id) ON DELETE CASCADE,

  name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Composition: Array of engine IDs with their configurations
  engines JSONB NOT NULL DEFAULT '[]', -- [{engine_id, config, enabled}]
  connections JSONB DEFAULT '[]', -- [{from: {engine_id, output}, to: {engine_id, input}}]

  -- Global configuration
  config JSONB DEFAULT '{}',
  system_prompt TEXT,

  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  is_public BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ef_agent_assemblies_tenant ON ef_agent_assemblies(tenant_id);
CREATE INDEX idx_ef_agent_assemblies_user ON ef_agent_assemblies(user_id);
CREATE INDEX idx_ef_agent_assemblies_status ON ef_agent_assemblies(status);

-- =====================================================
-- PHASE 4: DEPLOYMENTS
-- =====================================================

-- Table: ef_deployments
-- Deployed agent applications for end customers
CREATE TABLE IF NOT EXISTS ef_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assembly_id UUID NOT NULL REFERENCES ef_agent_assemblies(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES ef_user_profiles(id) ON DELETE SET NULL,

  -- Deployment details
  name VARCHAR(100) NOT NULL,
  url VARCHAR(255), -- Deployed URL
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),

  -- Configuration
  config JSONB DEFAULT '{}',

  -- Deployment metadata
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ef_deployments_assembly ON ef_deployments(assembly_id);
CREATE INDEX idx_ef_deployments_tenant ON ef_deployments(tenant_id);
CREATE INDEX idx_ef_deployments_customer ON ef_deployments(customer_id);
CREATE INDEX idx_ef_deployments_status ON ef_deployments(status);

-- =====================================================
-- PHASE 5: ADD TENANT_ID TO EXISTING TABLES
-- =====================================================

-- Add tenant_id to ef_adoptions
ALTER TABLE ef_adoptions
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES ef_tenants(id) ON DELETE CASCADE;

-- Backfill: Set all existing adoptions to system tenant
UPDATE ef_adoptions
SET tenant_id = '00000000-0000-0000-0000-000000000001'::uuid
WHERE tenant_id IS NULL;

-- Make tenant_id NOT NULL (after backfill)
ALTER TABLE ef_adoptions
ALTER COLUMN tenant_id SET NOT NULL;

CREATE INDEX idx_ef_adoptions_tenant ON ef_adoptions(tenant_id);

-- Add tenant_id to other existing tables if needed
-- Note: ef_life_events and ef_skill_executions don't need tenant_id
-- because they're already scoped through adoption_id which has tenant_id

-- =====================================================
-- PHASE 6: ROW LEVEL SECURITY (RLS) UPDATES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE ef_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_engine_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_agent_assemblies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_deployments ENABLE ROW LEVEL SECURITY;

-- TENANTS POLICIES
-- Service role can do anything
CREATE POLICY "Service role full access to tenants"
  ON ef_tenants FOR ALL
  USING (current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role');

-- USER PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON ef_user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON ef_user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in same tenant"
  ON ef_user_profiles FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

-- TEAMS POLICIES
CREATE POLICY "Team members can view their teams"
  ON ef_teams FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Team members can view team members"
  ON ef_team_members FOR SELECT
  USING (
    team_id IN (
      SELECT id FROM ef_teams
      WHERE tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
    )
  );

-- ENGINES POLICIES
CREATE POLICY "Developers can view own engines"
  ON ef_engines FOR SELECT
  USING (
    developer_id = auth.uid()
    OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Developers can create engines in their tenant"
  ON ef_engines FOR INSERT
  WITH CHECK (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
    AND developer_id = auth.uid()
  );

CREATE POLICY "Developers can update own engines"
  ON ef_engines FOR UPDATE
  USING (developer_id = auth.uid());

CREATE POLICY "Anyone can view public engines"
  ON ef_engines FOR SELECT
  USING (is_public = true);

-- ENGINE SKILLS POLICIES
CREATE POLICY "Users can view skills for accessible engines"
  ON ef_engine_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ef_engines
      WHERE ef_engines.id = ef_engine_skills.engine_id
      AND (
        ef_engines.developer_id = auth.uid()
        OR ef_engines.is_public = true
        OR ef_engines.tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
      )
    )
  );

-- AGENT ASSEMBLIES POLICIES
CREATE POLICY "Users can view own assemblies"
  ON ef_agent_assemblies FOR SELECT
  USING (
    user_id = auth.uid()
    OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can create assemblies in their tenant"
  ON ef_agent_assemblies FOR INSERT
  WITH CHECK (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update own assemblies"
  ON ef_agent_assemblies FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view public assemblies"
  ON ef_agent_assemblies FOR SELECT
  USING (is_public = true);

-- DEPLOYMENTS POLICIES
CREATE POLICY "Customers can view own deployments"
  ON ef_deployments FOR SELECT
  USING (
    customer_id = auth.uid()
    OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Tenants can manage their deployments"
  ON ef_deployments FOR ALL
  USING (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

-- UPDATE EXISTING RLS POLICIES FOR TENANT ISOLATION

-- Drop existing ef_adoptions policies
DROP POLICY IF EXISTS "Users can view own adoptions" ON ef_adoptions;
DROP POLICY IF EXISTS "Users can insert own adoptions" ON ef_adoptions;
DROP POLICY IF EXISTS "Users can update own adoptions" ON ef_adoptions;

-- Create new tenant-aware policies for ef_adoptions
CREATE POLICY "Users can view adoptions in their tenant"
  ON ef_adoptions FOR SELECT
  USING (
    user_id = auth.uid()
    OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert adoptions in their tenant"
  ON ef_adoptions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own adoptions"
  ON ef_adoptions FOR UPDATE
  USING (user_id = auth.uid());

-- Update ef_life_events policies for tenant awareness
DROP POLICY IF EXISTS "Users can view own life_events" ON ef_life_events;

CREATE POLICY "Users can view life_events in their tenant"
  ON ef_life_events FOR SELECT
  USING (
    adoption_id IN (
      SELECT id FROM ef_adoptions
      WHERE user_id = auth.uid()
      OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
    )
  );

-- Update ef_skill_executions policies for tenant awareness
DROP POLICY IF EXISTS "Users can view own skill_executions" ON ef_skill_executions;

CREATE POLICY "Users can view skill_executions in their tenant"
  ON ef_skill_executions FOR SELECT
  USING (
    adoption_id IN (
      SELECT id FROM ef_adoptions
      WHERE user_id = auth.uid()
      OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
    )
  );

-- Update ef_user_stats policies for tenant awareness
DROP POLICY IF EXISTS "Users can view own stats" ON ef_user_stats;

CREATE POLICY "Users can view stats in their tenant"
  ON ef_user_stats FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM ef_user_profiles
      WHERE ef_user_profiles.id = auth.uid()
      AND ef_user_profiles.tenant_id = (
        SELECT tenant_id FROM ef_user_profiles WHERE ef_user_profiles.user_id = ef_user_stats.user_id
      )
    )
  );

-- =====================================================
-- PHASE 7: HELPER FUNCTIONS
-- =====================================================

-- Function: Get user's tenant
CREATE OR REPLACE FUNCTION get_user_tenant(p_user_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN SELECT tenant_id FROM ef_user_profiles WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user has permission
CREATE OR REPLACE FUNCTION has_permission(p_user_id UUID, p_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_role VARCHAR(20);
BEGIN
  SELECT role INTO v_role FROM ef_user_profiles WHERE id = p_user_id;

  -- Developer permissions
  IF p_permission = 'engine:create' AND v_role IN ('developer', 'admin') THEN
    RETURN TRUE;
  END IF;

  IF p_permission = 'engine:publish' AND v_role IN ('developer', 'admin') THEN
    RETURN TRUE;
  END IF;

  -- User permissions
  IF p_permission = 'agent:create' AND v_role IN ('user', 'developer', 'admin') THEN
    RETURN TRUE;
  END IF;

  IF p_permission = 'agent:deploy' AND v_role IN ('user', 'developer', 'admin') THEN
    RETURN TRUE;
  END IF;

  -- Customer permissions
  IF p_permission = 'deployment:view' AND v_role IN ('customer', 'user', 'developer', 'admin') THEN
    RETURN TRUE;
  END IF;

  -- Admin permissions
  IF v_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS
-- =====================================================

-- View: Tenant summary with user and engine counts
CREATE OR REPLACE VIEW vw_tenant_summary AS
SELECT
  t.id,
  t.name,
  t.slug,
  t.plan,
  COUNT(DISTINCT up.id) as user_count,
  COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'published') as published_engine_count,
  COUNT(DISTINCT aa.id) FILTER (WHERE aa.status = 'active') as active_agent_count,
  COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'active') as active_deployment_count,
  t.created_at
FROM ef_tenants t
LEFT JOIN ef_user_profiles up ON up.tenant_id = t.id
LEFT JOIN ef_engines e ON e.tenant_id = t.id
LEFT JOIN ef_agent_assemblies aa ON aa.tenant_id = t.id
LEFT JOIN ef_deployments d ON d.tenant_id = t.id
GROUP BY t.id, t.name, t.slug, t.plan, t.created_at;

-- View: User's accessible engines (tenant + public)
CREATE OR REPLACE VIEW vw_accessible_engines AS
SELECT
  e.*,
  up.name as developer_name,
  CASE
    WHEN e.developer_id = auth.uid() THEN true
    ELSE false
  END as is_owner
FROM ef_engines e
JOIN ef_user_profiles up ON up.id = e.developer_id
WHERE
  e.is_public = true
  OR e.tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  OR e.developer_id = auth.uid();

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER trigger_update_tenants_updated_at
  BEFORE UPDATE ON ef_tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_user_profiles_updated_at
  BEFORE UPDATE ON ef_user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_teams_updated_at
  BEFORE UPDATE ON ef_teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_engines_updated_at
  BEFORE UPDATE ON ef_engines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_agent_assemblies_updated_at
  BEFORE UPDATE ON ef_agent_assemblies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant usage on sequences (if any)
-- (handled by UUID defaults)

-- Grant select on system tables to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Multi-tenant migration completed successfully';
  RAISE NOTICE 'System tenant created: 00000000-0000-0000-0000-000000000001';
  RAISE NOTICE 'Existing users assigned to system tenant';
  RAISE NOTICE 'RLS policies updated for tenant isolation';
END $$;
