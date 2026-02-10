/**
 * Virtual Office Type Definitions
 */

import type { GameObjects } from 'phaser';

/**
 * Empleaido NPC - AI Employee in virtual office
 */
export interface EmpleaidoNPC {
  id: string;
  name: string;
  department: string;
  role: string;
  tier: 'base' | 'pro' | 'deluxe';
  specialty: string[];

  // Visual properties
  sprite: string;
  position: { x: number; y: number };
  office: string;

  // Behavior state
  behavior: NPCBehavior;
  lifeEngine: LifeEngineStats;

  // Chat configuration
  chat: ChatConfig;
}

/**
 * NPC Behavior States
 */
export interface NPCBehavior {
  idle: AnimationConfig;
  working: AnimationConfig;
  greeting: AnimationConfig;
  thinking: AnimationConfig;
}

export interface AnimationConfig {
  type: 'breathing' | 'typing' | 'calculating' | 'gesture';
  speed: number;
}

/**
 * Life Engine Stats (from Empleaido Factory)
 */
export interface LifeEngineStats {
  level: number;
  xp: number;
  xpToNext: number;
  trust: number; // 0-100
  energy: number; // 0-100
}

/**
 * Chat Configuration
 */
export interface ChatConfig {
  proximityThreshold: number; // Distance in pixels to trigger chat
  welcomeMessage: string;
  voiceEnabled: boolean; // Phase 2 feature
}

/**
 * NPC Visual State (for rendering)
 */
export interface NPCState {
  gameObject: GameObjects.Sprite;
  nameText: GameObjects.Text;
  statusIndicator: GameObjects.Graphics;
  interactionZone: GameObjects.Zone;
  isInteracting: boolean;
  lastInteraction: number;
}

/**
 * Office Layout Configuration
 */
export interface OfficeLayout {
  width: number;
  height: number;
  tileSize: number;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  entrance: { x: number; y: number };
  empleaidoId?: string; // NPC assigned to this room
}

/**
 * Player State
 */
export interface PlayerState {
  id: string;
  position: { x: number; y: number };
  currentRoom?: string;
  interactingWith?: string; // empleaidoId
  isChatting: boolean;
}

/**
 * Chat Message
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'npc';
  content: string;
  timestamp: number;
  isTyping?: boolean;
}
