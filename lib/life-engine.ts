/**
 * LIFE ENGINE
 *
 * Manages Empleaido evolution based on real-world activity.
 * XP, levels, trust, and energy are the core metrics.
 */

import type { Empleaido, EmpleaidoLife, ActivityType, LifeEvent } from './types';

// ============================================
// CONSTANTS
// ============================================

const XP_PER_LEVEL = 100;
const MAX_LEVEL = 50;
const MAX_TRUST = 1.0;
const MIN_TRUST = 0.0;
const MAX_ENERGY = 100;
const MIN_ENERGY = 0;

const XP_GAINS: Record<ActivityType, number> = {
  task_completed: 20,
  session: 5,
  error: -5,
  idle: 0,
};

const TRUST_DELTAS: Record<ActivityType, number> = {
  task_completed: 0.02,
  session: 0.01,
  error: -0.03,
  idle: -0.01,
};

const ENERGY_COSTS: Record<ActivityType, number> = {
  task_completed: -10,
  session: -5,
  error: -15,
  idle: 5, // Regeneration
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Apply an activity to an Empleaido's life stats
 */
export function applyActivity(
  empleaido: Empleaido,
  activity: ActivityType
): Empleaido {
  const xpGain = XP_GAINS[activity];
  const trustDelta = TRUST_DELTAS[activity];
  const energyDelta = ENERGY_COSTS[activity];

  const newXp = Math.max(0, empleaido.life.experience + xpGain);
  const newLevel = Math.min(MAX_LEVEL, Math.floor(newXp / XP_PER_LEVEL) + 1);
  const newTrust = clamp(empleaido.life.trust + trustDelta, MIN_TRUST, MAX_TRUST);
  const newEnergy = clamp(empleaido.life.energy + energyDelta, MIN_ENERGY, MAX_ENERGY);

  return {
    ...empleaido,
    life: {
      level: newLevel,
      experience: newXp,
      trust: round(newTrust, 2),
      energy: newEnergy,
    },
  };
}

/**
 * Create a life event record for logging
 */
export function createLifeEvent(
  empleaido_id: string,
  activity: ActivityType
): LifeEvent {
  return {
    empleaido_id,
    activity,
    timestamp: new Date().toISOString(),
    xp_delta: XP_GAINS[activity],
    trust_delta: TRUST_DELTAS[activity],
    energy_delta: ENERGY_COSTS[activity],
  };
}

/**
 * Calculate level from XP
 */
export function xpToLevel(xp: number): number {
  return Math.min(MAX_LEVEL, Math.floor(xp / XP_PER_LEVEL) + 1);
}

/**
 * Calculate XP needed for next level
 */
export function xpForNextLevel(currentXp: number): number {
  const currentLevel = xpToLevel(currentXp);
  if (currentLevel >= MAX_LEVEL) return 0;
  return (currentLevel * XP_PER_LEVEL) - currentXp;
}

/**
 * Get progress percentage to next level
 */
export function levelProgress(xp: number): number {
  const xpInLevel = xp % XP_PER_LEVEL;
  return Math.round((xpInLevel / XP_PER_LEVEL) * 100);
}

/**
 * Initialize life stats for a new Empleaido
 */
export function initializeLife(): EmpleaidoLife {
  return {
    level: 1,
    experience: 0,
    trust: 0.6,
    energy: 100,
  };
}

/**
 * Check if Empleaido has enough energy for an activity
 */
export function canPerformActivity(
  empleaido: Empleaido,
  activity: ActivityType
): boolean {
  const cost = Math.abs(ENERGY_COSTS[activity]);
  return empleaido.life.energy >= cost;
}

/**
 * Regenerate energy (called periodically)
 */
export function regenerateEnergy(life: EmpleaidoLife, amount: number = 10): EmpleaidoLife {
  return {
    ...life,
    energy: Math.min(MAX_ENERGY, life.energy + amount),
  };
}

// ============================================
// UTILITIES
// ============================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
