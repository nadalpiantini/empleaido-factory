/**
 * SUPABASE CLIENT HELPERS
 *
 * Utility functions for interacting with Supabase
 * Handles ef_adoptions, ef_life_events, ef_skill_executions
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service client (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// TYPES
// =====================================================

export interface Adoption {
  id: string;
  user_id: string;
  empleaido_id: string;
  agent_id: string;
  workspace_path: string;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  adopted_at: string;
  bootstrap_phase: number;
  bootstrap_completed: boolean;
  bootstrap_completed_at?: string;
  preferences: Record<string, any>;
}

export interface LifeEvent {
  id: string;
  adoption_id: string;
  event_type: string;
  event_data: Record<string, any>;
  xp_gain: number;
  trust_change: number;
  energy_change: number;
  level_after: number;
  xp_after: number;
  trust_after: number;
  energy_after: number;
  created_at: string;
}

export interface SkillExecution {
  id: string;
  adoption_id: string;
  skill_id: string;
  skill_name: string;
  params: Record<string, any>;
  status: 'success' | 'failed' | 'timeout';
  output?: string;
  error_message?: string;
  duration_ms: number;
  execution_time: string;
  xp_gained: number;
  trust_increase: number;
  energy_cost: number;
}

export interface LifeStats {
  level: number;
  xp: number;
  trust: number;
  energy: number;
}

// =====================================================
// ADOPTION FUNCTIONS
// =====================================================

/**
 * Create a new adoption record
 */
export async function createAdoption(data: {
  user_id: string;
  empleaido_id: string;
  agent_id: string;
  workspace_path: string;
}): Promise<Adoption> {
  const { data: adoption, error } = await supabase
    .from('ef_adoptions')
    .insert({
      user_id: data.user_id,
      empleaido_id: data.empleaido_id,
      agent_id: data.agent_id,
      workspace_path: data.workspace_path,
      status: 'pending',
      bootstrap_phase: 1,
      bootstrap_completed: false,
    })
    .select()
    .single();

  if (error) throw error;
  return adoption;
}

/**
 * Get adoption by empleaido ID
 */
export async function getAdoptionByEmpleaidoId(empleaidoId: string, userId: string): Promise<Adoption | null> {
  const { data, error } = await supabase
    .from('ef_adoptions')
    .select('*')
    .eq('empleaido_id', empleaidoId)
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get adoption with life stats
 */
export async function getAdoptionWithStats(adoptionId: string): Promise<Adoption & { stats: LifeStats } | null> {
  // Get adoption
  const { data: adoption, error: adoptionError } = await supabase
    .from('ef_adoptions')
    .select('*')
    .eq('id', adoptionId)
    .single();

  if (adoptionError || !adoption) return null;

  // Get latest life stats
  const { data: stats } = await supabase
    .from('ef_life_events')
    .select('level_after, xp_after, trust_after, energy_after')
    .eq('adoption_id', adoptionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    ...adoption,
    stats: stats || {
      level: 1,
      xp: 0,
      trust: 0.60,
      energy: 100,
    },
  };
}

/**
 * Update bootstrap status
 */
export async function updateBootstrapStatus(
  adoptionId: string,
  phase: number,
  preferences?: Record<string, any>
): Promise<void> {
  const updateData: any = {
    bootstrap_phase: phase,
    bootstrap_completed: phase >= 5,
  };

  if (phase >= 5) {
    updateData.bootstrap_completed_at = new Date().toISOString();
  }

  if (preferences) {
    updateData.preferences = preferences;
  }

  const { error } = await supabase
    .from('ef_adoptions')
    .update(updateData)
    .eq('id', adoptionId);

  if (error) throw error;
}

/**
 * Complete bootstrap and activate adoption
 */
export async function completeBootstrap(adoptionId: string): Promise<void> {
  const { error } = await supabase
    .from('ef_adoptions')
    .update({
      status: 'active',
      bootstrap_phase: 5,
      bootstrap_completed: true,
      bootstrap_completed_at: new Date().toISOString(),
    })
    .eq('id', adoptionId);

  if (error) throw error;
}

// =====================================================
// LIFE EVENTS FUNCTIONS
// =====================================================

/**
 * Record a life event (XP, trust, energy changes)
 */
export async function recordLifeEvent(data: {
  adoption_id: string;
  event_type: string;
  event_data?: Record<string, any>;
  xp_gain?: number;
  trust_change?: number;
  energy_change?: number;
}): Promise<LifeEvent> {
  // Get current stats
  const { data: currentStats } = await supabase
    .from('ef_life_events')
    .select('level_after, xp_after, trust_after, energy_after')
    .eq('adoption_id', data.adoption_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const baseStats = currentStats || {
    level_after: 1,
    xp_after: 0,
    trust_after: 0.60,
    energy_after: 100,
  };

  // Calculate new stats
  const newXp = baseStats.xp_after + (data.xp_gain || 0);
  const newLevel = Math.floor(newXp / 100) + 1;
  const newTrust = Math.max(0, Math.min(1, baseStats.trust_after + (data.trust_change || 0)));
  const newEnergy = Math.max(0, Math.min(100, baseStats.energy_after + (data.energy_change || 0)));

  // Insert life event
  const { data: event, error } = await supabase
    .from('ef_life_events')
    .insert({
      adoption_id: data.adoption_id,
      event_type: data.event_type,
      event_data: data.event_data || {},
      xp_gain: data.xp_gain || 0,
      trust_change: data.trust_change || 0,
      energy_change: data.energy_change || 0,
      level_after: newLevel,
      xp_after: newXp,
      trust_after: newTrust,
      energy_after: newEnergy,
    })
    .select()
    .single();

  if (error) throw error;
  return event;
}

/**
 * Get recent life events for an adoption
 */
export async function getLifeEvents(adoptionId: string, limit = 10): Promise<LifeEvent[]> {
  const { data, error } = await supabase
    .from('ef_life_events')
    .select('*')
    .eq('adoption_id', adoptionId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// =====================================================
// SKILL EXECUTIONS FUNCTIONS
// =====================================================

/**
 * Record a skill execution
 */
export async function recordSkillExecution(data: {
  adoption_id: string;
  skill_id: string;
  skill_name: string;
  params?: Record<string, any>;
  status: 'success' | 'failed' | 'timeout';
  output?: string;
  error_message?: string;
  duration_ms: number;
  xp_gained: number;
  trust_increase: number;
  energy_cost: number;
}): Promise<SkillExecution> {
  const { data: execution, error } = await supabase
    .from('ef_skill_executions')
    .insert({
      adoption_id: data.adoption_id,
      skill_id: data.skill_id,
      skill_name: data.skill_name,
      params: data.params || {},
      status: data.status,
      output: data.output,
      error_message: data.error_message,
      duration_ms: data.duration_ms,
      xp_gained: data.xp_gained,
      trust_increase: data.trust_increase,
      energy_cost: data.energy_cost,
    })
    .select()
    .single();

  if (error) throw error;

  // Also record as life event
  await recordLifeEvent({
    adoption_id: data.adoption_id,
    event_type: 'skill_execution',
    event_data: {
      skill_id: data.skill_id,
      skill_name: data.skill_name,
      execution_id: execution.id,
    },
    xp_gain: data.xp_gained,
    trust_change: data.trust_increase,
    energy_change: -data.energy_cost,
  });

  return execution;
}

/**
 * Get skill executions for an adoption
 */
export async function getSkillExecutions(adoptionId: string, limit = 20): Promise<SkillExecution[]> {
  const { data, error } = await supabase
    .from('ef_skill_executions')
    .select('*')
    .eq('adoption_id', adoptionId)
    .order('execution_time', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// =====================================================
// USER STATS FUNCTIONS
// =====================================================

/**
 * Get user stats
 */
export async function getUserStats(userId: string): Promise<Record<string, any> | null> {
  const { data, error } = await supabase
    .from('ef_user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Get all active empleaidos for a user
 */
export async function getUserEmpleaidos(userId: string): Promise<(Adoption & { stats: LifeStats })[]> {
  const { data: adoptions, error } = await supabase
    .from('ef_adoptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('adopted_at', { ascending: false });

  if (error) throw error;

  // Get stats for each adoption
  const empleaidosWithStats = await Promise.all(
    (adoptions || []).map(async (adoption) => {
      const { data: stats } = await supabase
        .from('ef_life_events')
        .select('level_after, xp_after, trust_after, energy_after')
        .eq('adoption_id', adoption.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        ...adoption,
        stats: stats || {
          level: 1,
          xp: 0,
          trust: 0.60,
          energy: 100,
        },
      };
    })
  );

  return empleaidosWithStats;
}
