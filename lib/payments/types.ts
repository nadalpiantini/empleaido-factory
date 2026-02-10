/**
 * Payment System Types
 * Type definitions for checkout and payment flow
 */

export type EmpleaidoId = 'SERA' | 'KAEL' | 'NORA' | 'LIOR' | 'ZIV';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type PaymentProvider = 'stripe' | 'paypal' | 'custom';

export interface EmpleaidoPricing {
  id: EmpleaidoId;
  name: string;
  role: string;
  price: number; // in cents
  currency: 'USD' | 'EUR' | 'DOP';
  description: string;
}

export interface CheckoutSession {
  id: string;
  empleaidoId: EmpleaidoId;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  checkoutUrl?: string;
}

export interface PaymentMetadata {
  empleaido_id: string;
  user_id: string;
  adoption_id?: string;
  timestamp: string;
}

export interface WebhookEvent {
  type: string;
  data: {
    object: any;
  };
  metadata: PaymentMetadata;
}

export interface AdoptionRecord {
  id: string;
  user_id: string;
  empleaido_id: string;
  status: PaymentStatus;
  checkout_session_id?: string;
  amount: number;
  currency: string;
  bond_started_at?: string;
  bond_ended_at?: string;
  cycle: number;
  confidence: number; // 0-1
}

/**
 * Empleaido pricing configuration
 * TODO: Fetch from database or config file
 */
export const EMPLEAIDO_PRICING: Record<EmpleaidoId, EmpleaidoPricing> = {
  SERA: {
    id: 'SERA',
    name: 'SERA #4094',
    role: 'Contabilidad RD',
    price: 49900, // $499.00 USD
    currency: 'USD',
    description: 'Experta en facturación electrónica, cálculo de ITBIS y cumplimiento DGII',
  },
  KAEL: {
    id: 'KAEL',
    name: 'KAEL #1823',
    role: 'Marketing Digital',
    price: 49900,
    currency: 'USD',
    description: 'Especialista en publicidad social media, content strategy y analytics',
  },
  NORA: {
    id: 'NORA',
    name: 'NORA #2756',
    role: 'Customer Success',
    price: 39900,
    currency: 'USD',
    description: 'Gestiona relaciones con clientes, onboarding y retención',
  },
  LIOR: {
    id: 'LIOR',
    name: 'LIOR #8129',
    role: 'Operations & Logistics',
    price: 59900,
    currency: 'USD',
    description: 'Optimiza procesos, supply chain y eficiencia operativa',
  },
  ZIV: {
    id: 'ZIV',
    name: 'ZIV #3647',
    role: 'Legal & Compliance',
    price: 54900,
    currency: 'USD',
    description: 'Contratos, términos de servicio y cumplimiento regulatorio',
  },
};
