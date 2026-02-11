/**
 * SEPHIROT BEHAVIOR MAP
 *
 * Maps each Sephirah to operational behavior traits.
 * This is the bridge between identity and runtime routing.
 *
 * Reference: Sephirot as product architecture (not just aesthetic)
 * - Keter: Intent classification
 * - Chokmah/Binah: Expansion vs restriction
 * - Gevurah: Safety gate (SHIELD)
 * - Yesod: Memory/persistence
 * - Malkuth: Output delivery
 */

import type { Sephirah, SephirotBehavior } from './types';

export const SEPHIROT_BEHAVIOR: Record<Sephirah, SephirotBehavior> = {
  Keter: {
    proactive: false,
    structured: false,
    analytical: true,
    creative: false,
    memory: false,
    protective: false,
    expansive: true,
    restrictive: false,
  },
  Chokmah: {
    proactive: true,
    structured: false,
    analytical: false,
    creative: true,
    memory: false,
    protective: false,
    expansive: true,
    restrictive: false,
  },
  Binah: {
    proactive: false,
    structured: true,
    analytical: true,
    creative: false,
    memory: true,
    protective: false,
    expansive: false,
    restrictive: true,
  },
  Chesed: {
    proactive: true,
    structured: false,
    analytical: false,
    creative: true,
    memory: false,
    protective: false,
    expansive: true,
    restrictive: false,
  },
  Gevurah: {
    proactive: false,
    structured: true,
    analytical: false,
    creative: false,
    memory: false,
    protective: true,
    expansive: false,
    restrictive: true,
  },
  Tiferet: {
    proactive: false,
    structured: true,
    analytical: true,
    creative: true,
    memory: false,
    protective: false,
    expansive: false,
    restrictive: false,
  },
  Netzach: {
    proactive: true,
    structured: false,
    analytical: false,
    creative: false,
    memory: false,
    protective: false,
    expansive: true,
    restrictive: false,
  },
  Hod: {
    proactive: false,
    structured: true,
    analytical: true,
    creative: false,
    memory: false,
    protective: false,
    expansive: false,
    restrictive: true,
  },
  Yesod: {
    proactive: false,
    structured: false,
    analytical: false,
    creative: false,
    memory: true,
    protective: false,
    expansive: false,
    restrictive: false,
  },
  Malkuth: {
    proactive: false,
    structured: true,
    analytical: false,
    creative: false,
    memory: false,
    protective: false,
    expansive: false,
    restrictive: false,
  },
};

/**
 * Human-readable descriptions for each Sephirah
 */
export const SEPHIROT_DESCRIPTIONS: Record<Sephirah, string> = {
  Keter: 'Intent classification — what is the user really trying to do?',
  Chokmah: 'Creative expansion — hypothesis generation, brainstorming',
  Binah: 'Constraint analysis — restriction, validation, understanding',
  Chesed: 'Generosity — expansive output, creative abundance',
  Gevurah: 'Safety gate — refusal logic, SHIELD protection',
  Tiferet: 'Balance — orchestration, harmonizing inputs',
  Netzach: 'Persistence — proactive behavior, endurance',
  Hod: 'Structure — organization, methodical approach',
  Yesod: 'Memory — persistence, relationship continuity',
  Malkuth: 'Manifestation — output delivered to real world',
};

/**
 * Tone modifiers for greetings and communication
 */
export const SEPHIROT_TONE: Record<Sephirah, string> = {
  Keter: 'perceptivo y directo',
  Chokmah: 'creativo e inspirador',
  Binah: 'analitico y profundo',
  Chesed: 'calido y generoso',
  Gevurah: 'firme y protector',
  Tiferet: 'equilibrado y armonioso',
  Netzach: 'proactivo y optimista',
  Hod: 'claro y estructurado',
  Yesod: 'memorioso y consistente',
  Malkuth: 'practico y ejecutor',
};

/**
 * Get behavior traits for an Empleaido based on primary Sephirah
 */
export function getBehavior(sephirah: Sephirah): SephirotBehavior {
  return SEPHIROT_BEHAVIOR[sephirah];
}

/**
 * Get communication tone based on Sephirah
 */
export function getTone(sephirah: Sephirah): string {
  return SEPHIROT_TONE[sephirah];
}
