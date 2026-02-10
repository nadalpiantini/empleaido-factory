export interface Empleaido {
  id: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  image_url?: string;
  sephirot_id: string;
  personality: {
    traits: string[];
    communication_style: string;
  };
  skills: {
    native: string[];
    locked?: any[];
  };
  pricing?: {
    adoption_fee?: number;
    monthly_subscription?: number;
  };
}
