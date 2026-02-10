// Type definitions matching app/lib/types.ts
export type Tier = 'base' | 'pro' | 'deluxe';
export type Status = 'active' | 'paused' | 'archived' | 'draft';

export interface Empleaido {
  id: string;
  serial: number;
  name: string;
  status: Status;
  sephirot: {
    primary: string;
    secondary: string[];
  };
  role: {
    main: string;
    sub: string;
    tier: Tier;
  };
  skills: {
    native: string[];
    locked: string[];
  };
  visual: {
    accessory: string;
    color_accent: string;
  };
  pricing: {
    monthly_usd: number;
    annual_usd: number;
  };
  life: {
    level: number;
    experience: number;
    trust: number;
    energy: number;
  };
  meta: {
    created_at: string;
    version: number;
  };
  identity?: {
    motivation?: string;
    boundaries?: string[];
    safety_rejections?: string[];
    serial?: {
      number: number;
      batch: string;
    };
  };
}
