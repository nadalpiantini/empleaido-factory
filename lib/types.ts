/**
 * EMPLEAIDO FACTORY - Type Definitions
 * Canonical contracts for the Empleaido system
 */

// ============================================
// ENUMS
// ============================================

export type Tier = 'base' | 'pro' | 'deluxe';
export type Status = 'active' | 'paused' | 'archived' | 'draft';
export type Accessory = 'none' | 'headband' | 'moustache' | 'badge' | 'glasses' | 'earring';

export type Sephirah =
  | 'Keter'
  | 'Chokmah'
  | 'Binah'
  | 'Chesed'
  | 'Gevurah'
  | 'Tiferet'
  | 'Netzach'
  | 'Hod'
  | 'Yesod'
  | 'Malkuth';

// ============================================
// EMPLEAIDO CORE
// ============================================

export interface Empleaido {
  id: string;                    // empleaido-XXXXX format
  serial: number;                // Display number (e.g., 4094)
  name: string;                  // Human-readable callsign
  status: Status;

  sephirot: {
    primary: Sephirah;
    secondary: Sephirah[];
  };

  role: {
    main: string;                // What user is buying
    sub: string;                 // Target audience
    tier: Tier;
  };

  skills: {
    native: string[];            // Included at adoption
    locked: string[];            // Unlockable
  };

  visual: {
    accessory: Accessory;
    color_accent?: string;       // Hex color
  };

  pricing: {
    monthly_usd: number;
    annual_usd?: number;
  };

  life: EmpleaidoLife;

  identity?: EmpleaidoIdentity;

  meta: {
    created_at: string;
    updated_at?: string;
    version: number;
  };
}

export interface EmpleaidoLife {
  level: number;                 // XP-based level
  experience: number;            // Total XP
  trust: number;                 // 0-1 score
  energy: number;                // 0-100
}

export interface EmpleaidoIdentity {
  motivation: string;            // Why they "care"
  boundaries: string[];          // What they refuse
  safety_rejections: string[];   // Pre-written refusals
}

// ============================================
// ADOPTION
// ============================================

export type AdoptionStatus = 'active' | 'paused' | 'ended';

export interface Adoption {
  id: string;
  user_id: string;
  empleaido_id: string;
  status: AdoptionStatus;
  bond_started_at: string;
  bond_ended_at?: string;
  cycle: number;                 // Billing cycle count
  confidence: number;            // Relationship health 0-1
}

// ============================================
// SEPHIROT BEHAVIOR
// ============================================

export interface SephirotBehavior {
  proactive: boolean;            // Acts without prompting
  structured: boolean;           // Follows rigid patterns
  analytical: boolean;           // Deep analysis focus
  creative: boolean;             // Generative output
  memory: boolean;               // Strong context retention
  protective: boolean;           // Safety-first behavior
  expansive: boolean;            // Broad scope
  restrictive: boolean;          // Narrow, focused scope
}

// ============================================
// SKILL GROUPS
// ============================================

export interface SkillGroup {
  id: string;
  name: string;
  skills: string[];
}

// ============================================
// LIFE ENGINE
// ============================================

export type ActivityType = 'task_completed' | 'session' | 'error' | 'idle';

export interface LifeEvent {
  empleaido_id: string;
  activity: ActivityType;
  timestamp: string;
  xp_delta: number;
  trust_delta: number;
  energy_delta: number;
}
