/**
 * SEFIROTIC ADAPTER
 *
 * Maps Empleaido Sephirot profiles to Sefirotic Orchestrator routing.
 * Defines how each Empleaido should traverse the Tree of Life.
 */

import type { Empleaido } from '../../lib/types';
import type { Sephirah, SephirotBehavior } from '../../lib/types';
import { SEPHIROT_BEHAVIOR } from '../../lib/sephirot-map';

// ============================================
// TYPES
// ============================================

export type PathType = 'fast' | 'graph' | 'abort' | 'consultation' | 'mental';

export interface RoutingProfile {
  empleaidoId: string;
  primarySephirah: Sephirah;
  behavior: SephirotBehavior;
  preferredPath: PathType;
  pillar: 'left' | 'right' | 'middle';
  emphasizedNodes: Sephirah[];
  deemphasizedNodes: Sephirah[];
}

export interface TaskRouting {
  profile: RoutingProfile;
  suggestedPath: PathType;
  traversalOrder: Sephirah[];
  skipNodes: Sephirah[];
  reason: string;
}

// ============================================
// PILLAR MAPPING
// ============================================

const PILLAR_MAP: Record<Sephirah, 'left' | 'right' | 'middle'> = {
  Keter: 'middle',
  Chokmah: 'right',
  Binah: 'left',
  Chesed: 'right',
  Gevurah: 'left',
  Tiferet: 'middle',
  Netzach: 'right',
  Hod: 'left',
  Yesod: 'middle',
  Malkuth: 'middle',
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Build routing profile for an Empleaido
 */
export function buildRoutingProfile(empleaido: Empleaido): RoutingProfile {
  const primary = empleaido.sephirot.primary as Sephirah;
  const behavior = SEPHIROT_BEHAVIOR[primary];
  const pillar = PILLAR_MAP[primary];

  // Determine preferred path based on Sephirah
  let preferredPath: PathType = 'graph';
  if (behavior.proactive) preferredPath = 'graph';
  if (behavior.analytical && !behavior.creative) preferredPath = 'consultation';
  if (behavior.memory) preferredPath = 'graph'; // Memory needs full traversal

  // Determine emphasized/deemphasized nodes
  const emphasizedNodes = getEmphasizedNodes(primary, pillar);
  const deemphasizedNodes = getDeemphasizedNodes(primary, pillar);

  return {
    empleaidoId: empleaido.id,
    primarySephirah: primary,
    behavior,
    preferredPath,
    pillar,
    emphasizedNodes,
    deemphasizedNodes,
  };
}

/**
 * Get routing for a specific task
 */
export function routeTask(
  empleaido: Empleaido,
  taskComplexity: number,
  securityFlag: boolean
): TaskRouting {
  const profile = buildRoutingProfile(empleaido);

  // Security always aborts
  if (securityFlag) {
    return {
      profile,
      suggestedPath: 'abort',
      traversalOrder: ['Keter', 'Gevurah'],
      skipNodes: [],
      reason: 'Security flag triggered - Gevurah abort',
    };
  }

  // Low complexity = fast path
  if (taskComplexity < 45) {
    return {
      profile,
      suggestedPath: 'fast',
      traversalOrder: ['Keter', 'Malkuth'],
      skipNodes: ['Chokmah', 'Binah', 'Chesed', 'Gevurah', 'Tiferet', 'Netzach', 'Hod', 'Yesod'],
      reason: `Low complexity (${taskComplexity}) - direct response`,
    };
  }

  // High complexity = full graph
  const traversalOrder = buildTraversalOrder(profile);
  return {
    profile,
    suggestedPath: 'graph',
    traversalOrder,
    skipNodes: profile.deemphasizedNodes,
    reason: `High complexity (${taskComplexity}) - full sefirotic traversal via ${profile.pillar} pillar`,
  };
}

// ============================================
// HELPERS
// ============================================

function getEmphasizedNodes(primary: Sephirah, pillar: 'left' | 'right' | 'middle'): Sephirah[] {
  const pillarNodes: Record<string, Sephirah[]> = {
    right: ['Chokmah', 'Chesed', 'Netzach'],
    left: ['Binah', 'Gevurah', 'Hod'],
    middle: ['Keter', 'Tiferet', 'Yesod', 'Malkuth'],
  };

  // Always include primary and its pillar
  const nodes = new Set<Sephirah>([primary, ...pillarNodes[pillar]]);

  // Add Tiferet (always central)
  nodes.add('Tiferet');

  return Array.from(nodes);
}

function getDeemphasizedNodes(primary: Sephirah, pillar: 'left' | 'right' | 'middle'): Sephirah[] {
  const oppositePillar: Record<string, Sephirah[]> = {
    right: ['Binah', 'Gevurah', 'Hod'],
    left: ['Chokmah', 'Chesed', 'Netzach'],
    middle: [], // Middle doesn't deemphasize
  };

  return oppositePillar[pillar] || [];
}

function buildTraversalOrder(profile: RoutingProfile): Sephirah[] {
  // Standard traversal with emphasis adjustments
  const standard: Sephirah[] = [
    'Keter',      // 1. Intent classification
    'Gevurah',    // 2. Security check (always)
    'Chokmah',    // 3. Creative expansion
    'Binah',      // 4. Constraint analysis
    'Chesed',     // 5. Skill matching
    'Tiferet',    // 6. Orchestration (central)
    'Netzach',    // 7. Proactive actions
    'Hod',        // 8. Output structure
    'Yesod',      // 9. Memory persistence
    'Malkuth',    // 10. Delivery
  ];

  // For right pillar (expansion), move Chokmah/Chesed earlier
  if (profile.pillar === 'right') {
    return [
      'Keter',
      'Gevurah',    // Security still early
      'Chokmah',    // Emphasized
      'Chesed',     // Emphasized
      'Tiferet',
      'Netzach',    // Emphasized
      'Binah',      // Deemphasized (later)
      'Hod',
      'Yesod',
      'Malkuth',
    ];
  }

  // For left pillar (restriction), move Binah/Gevurah earlier
  if (profile.pillar === 'left') {
    return [
      'Keter',
      'Binah',      // Emphasized
      'Gevurah',    // Emphasized
      'Tiferet',
      'Hod',        // Emphasized
      'Chokmah',    // Deemphasized (later)
      'Chesed',
      'Netzach',
      'Yesod',
      'Malkuth',
    ];
  }

  return standard;
}

// ============================================
// EMPLEAIDO-SPECIFIC PROFILES
// ============================================

/**
 * Pre-defined routing profiles for the 5 founding Empleaidos
 */
export const EMPLEAIDO_PROFILES: Record<string, Partial<RoutingProfile>> = {
  // SERA (Netzach - Right Pillar - Proactive)
  'empleaido-04094': {
    primarySephirah: 'Netzach',
    pillar: 'right',
    preferredPath: 'graph',
    emphasizedNodes: ['Netzach', 'Chesed', 'Chokmah', 'Tiferet'],
  },

  // KAEL (Chesed - Right Pillar - Creative)
  'empleaido-05112': {
    primarySephirah: 'Chesed',
    pillar: 'right',
    preferredPath: 'graph',
    emphasizedNodes: ['Chesed', 'Chokmah', 'Netzach', 'Tiferet'],
  },

  // NORA (Hod - Left Pillar - Structured)
  'empleaido-06201': {
    primarySephirah: 'Hod',
    pillar: 'left',
    preferredPath: 'graph',
    emphasizedNodes: ['Hod', 'Binah', 'Gevurah', 'Tiferet'],
  },

  // LIOR (Binah - Left Pillar - Analytical)
  'empleaido-07333': {
    primarySephirah: 'Binah',
    pillar: 'left',
    preferredPath: 'consultation',
    emphasizedNodes: ['Binah', 'Gevurah', 'Hod', 'Tiferet'],
  },

  // ZIV (Yesod - Middle Pillar - Memory)
  'empleaido-08408': {
    primarySephirah: 'Yesod',
    pillar: 'middle',
    preferredPath: 'graph',
    emphasizedNodes: ['Yesod', 'Tiferet', 'Keter', 'Malkuth'],
  },

  // UXA (Chokmah - Right Pillar - Creative Expansion)
  'empleaido-09523': {
    primarySephirah: 'Chokmah',
    pillar: 'right',
    preferredPath: 'graph',
    emphasizedNodes: ['Chokmah', 'Binah', 'Chesed', 'Tiferet'],
  },
};
