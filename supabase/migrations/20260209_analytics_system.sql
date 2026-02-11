-- EMPLEAIDO FACTORY - ANALYTICS & COST TRACKING
-- Migration: 20260209_analytics_system
-- Purpose: Analytics, cost tracking, and monitoring for Agent Wrapping Platform

-- =====================================================
-- PHASE 1: ANALYTICS EVENTS
-- =====================================================

-- Table: ef_analytics_events
-- Event tracking for analytics and monitoring
CREATE TABLE IF NOT EXISTS ef_analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES ef_deployments(id) ON DELETE CASCADE,

  -- Event details
  event_type VARCHAR(50) NOT NULL, -- agent_execution, user_interaction, error, etc.
  event_name VARCHAR(100),
  properties JSONB DEFAULT '{}',

  -- Context
  user_id UUID REFERENCES ef_user_profiles(id) ON DELETE SET NULL,
  session_id UUID,

  -- Timestamp
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ef_analytics_events_tenant ON ef_analytics_events(tenant_id);
CREATE INDEX idx_ef_analytics_events_deployment ON ef_analytics_events(deployment_id);
CREATE INDEX idx_ef_analytics_events_type ON ef_analytics_events(event_type);
CREATE INDEX idx_ef_analytics_events_timestamp ON ef_analytics_events(timestamp DESC);

-- =====================================================
-- PHASE 2: USAGE METRICS
-- =====================================================

-- Table: ef_usage_metrics
-- Daily aggregated metrics per deployment
CREATE TABLE IF NOT EXISTS ef_usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deployment_id UUID NOT NULL REFERENCES ef_deployments(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,

  -- Time period
  date DATE NOT NULL,

  -- Usage counts
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,

  -- Token usage
  total_tokens INTEGER DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,

  -- Costs
  total_cost DECIMAL(10,4) DEFAULT 0.00,

  -- Performance
  avg_response_time_ms INTEGER,
  p95_response_time_ms INTEGER,
  p99_response_time_ms INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(deployment_id, date)
);

CREATE INDEX idx_ef_usage_metrics_deployment ON ef_usage_metrics(deployment_id);
CREATE INDEX idx_ef_usage_metrics_tenant ON ef_usage_metrics(tenant_id);
CREATE INDEX idx_ef_usage_metrics_date ON ef_usage_metrics(date DESC);

-- =====================================================
-- PHASE 3: COST TRACKING
-- =====================================================

-- Table: ef_costs
-- Detailed cost tracking per engine/model
CREATE TABLE IF NOT EXISTS ef_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES ef_deployments(id) ON DELETE CASCADE,
  engine_id UUID REFERENCES ef_engines(id) ON DELETE CASCADE,

  -- Time period
  date DATE NOT NULL,

  -- LLM Provider
  provider VARCHAR(50) NOT NULL, -- zai, openai, anthropic, etc.
  model VARCHAR(100) NOT NULL, -- glm-4.7, glm-4.7-flashx, etc.

  -- Usage
  tokens_used INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,

  -- Cost
  cost DECIMAL(10,4) NOT NULL DEFAULT 0.00,

  -- Request count
  request_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(deployment_id, engine_id, date, model)
);

CREATE INDEX idx_ef_costs_tenant ON ef_costs(tenant_id);
CREATE INDEX idx_ef_costs_deployment ON ef_costs(deployment_id);
CREATE INDEX idx_ef_costs_engine ON ef_costs(engine_id);
CREATE INDEX idx_ef_costs_date ON ef_costs(date DESC);
CREATE INDEX idx_ef_costs_provider ON ef_costs(provider);

-- =====================================================
-- PHASE 4: SUPPORT SYSTEM
-- =====================================================

-- Table: ef_support_tickets
-- Customer support tickets
CREATE TABLE IF NOT EXISTS ef_support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES ef_tenants(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES ef_deployments(id) ON DELETE CASCADE,

  -- Ticket details
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,

  -- Categorization
  category VARCHAR(50), -- billing, technical, feature_request, bug
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),

  -- People
  created_by UUID NOT NULL REFERENCES ef_user_profiles(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES ef_user_profiles(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ef_support_tickets_tenant ON ef_support_tickets(tenant_id);
CREATE INDEX idx_ef_support_tickets_deployment ON ef_support_tickets(deployment_id);
CREATE INDEX idx_ef_support_tickets_status ON ef_support_tickets(status);
CREATE INDEX idx_ef_support_tickets_priority ON ef_support_tickets(priority);
CREATE INDEX idx_ef_support_tickets_created_by ON ef_support_tickets(created_by);

-- Table: ef_support_ticket_comments
-- Comments on support tickets
CREATE TABLE IF NOT EXISTS ef_support_ticket_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES ef_support_tickets(id) ON DELETE CASCADE,

  -- Comment details
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- True for internal notes, False for customer-visible

  -- Author
  author_id UUID NOT NULL REFERENCES ef_user_profiles(id) ON DELETE SET NULL,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ef_support_ticket_comments_ticket ON ef_support_ticket_comments(ticket_id);
CREATE INDEX idx_ef_support_ticket_comments_created ON ef_support_ticket_comments(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE ef_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_support_ticket_comments ENABLE ROW LEVEL SECURITY;

-- ANALYTICS EVENTS POLICIES
CREATE POLICY "Users can view analytics in their tenant"
  ON ef_analytics_events FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "System can insert analytics events"
  ON ef_analytics_events FOR INSERT
  WITH CHECK (true);

-- USAGE METRICS POLICIES
CREATE POLICY "Users can view usage metrics in their tenant"
  ON ef_usage_metrics FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

-- COSTS POLICIES
CREATE POLICY "Users can view costs in their tenant"
  ON ef_costs FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

-- SUPPORT TICKETS POLICIES
CREATE POLICY "Users can view own tickets"
  ON ef_support_tickets FOR SELECT
  USING (
    created_by = auth.uid()
    OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can create tickets"
  ON ef_support_tickets FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own tickets"
  ON ef_support_tickets FOR UPDATE
  USING (created_by = auth.uid());

-- SUPPORT TICKET COMMENTS POLICIES
CREATE POLICY "Users can view comments on accessible tickets"
  ON ef_support_ticket_comments FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM ef_support_tickets
      WHERE created_by = auth.uid()
      OR tenant_id = (SELECT tenant_id FROM ef_user_profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can create comments on own tickets"
  ON ef_support_ticket_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND ticket_id IN (
      SELECT id FROM ef_support_tickets WHERE created_by = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Record agent execution with cost tracking
CREATE OR REPLACE FUNCTION record_agent_execution(
  p_deployment_id UUID,
  p_engine_id UUID,
  p_model VARCHAR,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_success BOOLEAN,
  p_response_time_ms INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_tenant_id UUID;
  v_date DATE;
  v_cost DECIMAL(10,4);
  v_metrics_id UUID;
BEGIN
  -- Get tenant from deployment
  SELECT tenant_id INTO v_tenant_id
  FROM ef_deployments
  WHERE id = p_deployment_id;

  -- Calculate cost (Z.ai pricing as of Feb 2026)
  v_date := CURRENT_DATE;

  -- Z.ai GLM-4.7: $0.6 input / $2.2 output per 1M tokens
  -- Z.ai GLM-4.7-FlashX: $0.07 input / $0.4 output per 1M tokens
  -- Z.ai GLM-4.7-Flash: FREE
  CASE
    WHEN p_model = 'glm-4.7' THEN
      v_cost := (p_input_tokens * 0.6 / 1000000) + (p_output_tokens * 2.2 / 1000000);
    WHEN p_model = 'glm-4.7-flashx' THEN
      v_cost := (p_input_tokens * 0.07 / 1000000) + (p_output_tokens * 0.4 / 1000000);
    WHEN p_model = 'glm-4.7-flash' THEN
      v_cost := 0;
    ELSE
      v_cost := (p_input_tokens * 0.6 / 1000000) + (p_output_tokens * 2.2 / 1000000); -- Default to GLM-4.7 pricing
  END CASE;

  -- Update or insert daily usage metrics
  INSERT INTO ef_usage_metrics (
    deployment_id,
    tenant_id,
    date,
    total_requests,
    successful_requests,
    failed_requests,
    total_tokens,
    input_tokens,
    output_tokens,
    total_cost,
    avg_response_time_ms
  )
  VALUES (
    p_deployment_id,
    v_tenant_id,
    v_date,
    1,
    CASE WHEN p_success THEN 1 ELSE 0 END,
    CASE WHEN NOT p_success THEN 1 ELSE 0 END,
    p_input_tokens + p_output_tokens,
    p_input_tokens,
    p_output_tokens,
    v_cost,
    p_response_time_ms
  )
  ON CONFLICT (deployment_id, date) DO UPDATE SET
    total_requests = ef_usage_metrics.total_requests + 1,
    successful_requests = ef_usage_metrics.successful_requests +
      CASE WHEN p_success THEN 1 ELSE 0 END,
    failed_requests = ef_usage_metrics.failed_requests +
      CASE WHEN NOT p_success THEN 1 ELSE 0 END,
    total_tokens = ef_usage_metrics.total_tokens + p_input_tokens + p_output_tokens,
    input_tokens = ef_usage_metrics.input_tokens + p_input_tokens,
    output_tokens = ef_usage_metrics.output_tokens + p_output_tokens,
    total_cost = ef_usage_metrics.total_cost + v_cost,
    avg_response_time_ms = (
      ef_usage_metrics.avg_response_time_ms * ef_usage_metrics.total_requests + p_response_time_ms
    ) / (ef_usage_metrics.total_requests + 1),
    updated_at = NOW()
  RETURNING id INTO v_metrics_id;

  -- Update or insert cost breakdown
  INSERT INTO ef_costs (
    tenant_id,
    deployment_id,
    engine_id,
    date,
    provider,
    model,
    tokens_used,
    input_tokens,
    output_tokens,
    cost,
    request_count
  )
  VALUES (
    v_tenant_id,
    p_deployment_id,
    p_engine_id,
    v_date,
    'zai',
    p_model,
    p_input_tokens + p_output_tokens,
    p_input_tokens,
    p_output_tokens,
    v_cost,
    1
  )
  ON CONFLICT (deployment_id, engine_id, date, model) DO UPDATE SET
    tokens_used = ef_costs.tokens_used + p_input_tokens + p_output_tokens,
    input_tokens = ef_costs.input_tokens + p_input_tokens,
    output_tokens = ef_costs.output_tokens + p_output_tokens,
    cost = ef_costs.cost + v_cost,
    request_count = ef_costs.request_count + 1;

  RETURN v_metrics_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get cost breakdown for a deployment
CREATE OR REPLACE FUNCTION get_deployment_cost_breakdown(
  p_deployment_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  date DATE,
  engine_id UUID,
  model VARCHAR,
  tokens_used BIGINT,
  cost DECIMAL(10,4),
  request_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.date,
    c.engine_id,
    c.model,
    c.tokens_used::BIGINT,
    c.cost,
    c.request_count
  FROM ef_costs c
  WHERE c.deployment_id = p_deployment_id
    AND (p_start_date IS NULL OR c.date >= p_start_date)
    AND (p_end_date IS NULL OR c.date <= p_end_date)
  ORDER BY c.date DESC, c.model;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS
-- =====================================================

-- View: Daily cost summary per tenant
CREATE OR REPLACE VIEW vw_tenant_daily_costs AS
SELECT
  tenant_id,
  date,
  COUNT(DISTINCT deployment_id) as active_deployments,
  SUM(tokens_used) as total_tokens,
  SUM(cost) as total_cost,
  SUM(request_count) as total_requests
FROM ef_costs
GROUP BY tenant_id, date
ORDER BY date DESC;

-- View: Top 10 most expensive deployments
CREATE OR REPLACE VIEW vw_top_expensive_deployments AS
SELECT
  d.id,
  d.name,
  d.tenant_id,
  t.name as tenant_name,
  SUM(c.cost) as total_cost,
  SUM(c.tokens_used) as total_tokens,
  SUM(c.request_count) as total_requests
FROM ef_deployments d
JOIN ef_costs c ON c.deployment_id = d.id
JOIN ef_tenants t ON t.id = d.tenant_id
WHERE c.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY d.id, d.name, d.tenant_id, t.name
ORDER BY total_cost DESC
LIMIT 10;

-- View: Support ticket summary
CREATE OR REPLACE VIEW vw_support_ticket_summary AS
SELECT
  tenant_id,
  category,
  status,
  priority,
  COUNT(*) as ticket_count,
  AVG(EXTRACT(EPOCH FROM (COALESCE(resolved_at, updated_at) - created_at))/3600) as avg_hours_to_resolution
FROM ef_support_tickets
GROUP BY tenant_id, category, status, priority;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Apply updated_at trigger to support tickets
CREATE TRIGGER trigger_update_support_tickets_updated_at
  BEFORE UPDATE ON ef_support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- GRANTS
-- =====================================================

GRANT SELECT ON vw_tenant_daily_costs TO authenticated;
GRANT SELECT ON vw_top_expensive_deployments TO authenticated;
GRANT SELECT ON vw_support_ticket_summary TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Analytics and cost tracking system created';
  RAISE NOTICE 'Functions available: record_agent_execution(), get_deployment_cost_breakdown()';
END $$;
