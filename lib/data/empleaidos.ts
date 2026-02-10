/**
 * EMPLEAIDOS DATA
 *
 * Centralized data access for empleaidos.
 * Works in both server and client environments.
 */

// Import JSON directly - Next.js handles this
import empleaidosJson from '../../../data/empleaidos.json'
const empleaidos = empleaidosJson as any[]

export interface Empleaido {
  id: string
  name: string
  tagline: string
  description: string
  emoji: string
  image_url?: string
  sephirot_id: string
  personality: {
    traits: string[]
    communication_style: string
  }
  skills: {
    native: string[]
    locked?: any[]
  }
  pricing?: {
    adoption_fee: number
    monthly_subscription: number
  }
}

/**
 * Get empleaido by ID
 */
export function getEmpleaido(id: string): Empleaido | null {
  const empleaido = (empleaidos as any[]).find((e: any) => e.id === id)
  return empleaido || null
}

/**
 * Get all empleaidos
 */
export function getAllEmpleaidos(): Empleaido[] {
  return empleaidos as Empleaido[]
}

/**
 * Export raw empleaidos for backward compatibility
 */
export { empleaidos }
