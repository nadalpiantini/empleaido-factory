/**
 * EMPLEAIDOS DATA
 *
 * Centralized data access for empleaidos.
 * Works in both server and client environments.
 */

// Import JSON directly - use absolute path
import empleaidosJson from '@/data/empleaidos.json'
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON import lacks type info
const empleaidos = empleaidosJson as any as Empleaido[]

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
    locked?: string[]
  }
  pricing?: {
    adoption_fee: number
    monthly_subscription: number
  }
  life?: {
    level: number
    experience: number
    trust: number
    energy: number
  }
}

/**
 * Get empleaido by ID
 */
export function getEmpleaido(id: string): Empleaido | null {
  const empleaido = empleaidos.find((e) => e.id === id)
  return empleaido || null
}

/**
 * Get all empleaidos
 */
export function getAllEmpleaidos(): Empleaido[] {
  return empleaidos
}

/**
 * Export raw empleaidos for backward compatibility
 */
export { empleaidos }
