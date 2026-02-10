export interface Empleaido {
  id: string;
  serial: number;
  name: string;
  status: 'active' | 'inactive' | 'adopted';
  sephirot: {
    primary: string;
    secondary?: string[];
  };
  role: {
    main: string;
    sub: string;
    tier: 'base' | 'pro' | 'deluxe';
  };
  skills: {
    native: string[];
    locked: string[];
  };
  visual: {
    accessory?: string;
    color_accent?: string;
  };
  pricing: {
    monthly_usd: number;
    annual_usd?: number;
  };
  life: {
    level: number;
    experience: number;
    trust: number;
    energy: number;
  };
  identity: {
    motivation?: string;
    boundaries?: string[];
    safety_rejections?: string[];
  };
  meta: {
    created_at: string;
    version: number;
  };
}