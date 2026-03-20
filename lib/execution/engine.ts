/**
 * AGENT EXECUTION ENGINE
 *
 * Executes Empleaido agents via OpenClaw with rate limiting, logging, and life engine integration.
 */

import { createRouteHandlerClient } from '@/lib/supabase-server'
import { applyActivity } from '@/lib/life-engine'
import { getEmpleaido } from '@/lib/data/empleaidos'
import type { Empleaido as FullEmpleaido } from '@/lib/types'

// ============================================
// TYPES
// ============================================

export interface ExecutionRequest {
  agentId: string
  userId: string
  input: string
  context?: Record<string, unknown>
}

export interface ExecutionResult {
  output: string
  cost: number
  tokens_used: number
  duration_ms: number
  timestamp: string
}

export interface ExecutionLog {
  id: string
  empleaido_id: string
  user_id: string
  input: string
  output: string
  cost: number
  tokens_used: number
  duration_ms: number
  created_at: string
}

// ============================================
// RATE LIMITING (Free tier: 100/day, Pro: 1000/day)
// ============================================

const TIER_LIMITS = {
  free: 100,
  pro: 1000,
  unlimited: Infinity,
}

async function checkRateLimit(userId: string, tier: string = 'free'): Promise<boolean> {
  const supabase = createRouteHandlerClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('ef_executions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())

  const limit = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free
  return (count || 0) < limit
}

// ============================================
// AGENT EXECUTION
// ============================================

/**
 * Main execution function - runs an empleaido agent
 */
export async function executeEmpleaido(request: ExecutionRequest): Promise<ExecutionResult> {
  const supabase = createRouteHandlerClient()
  // 1. Verify user exists
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== request.userId) {
    throw new Error('Unauthorized')
  }

  // 2. Get empleaido
  const empleaido = await getEmpleaido(request.agentId)
  if (!empleaido) {
    throw new Error('Empleaido not found')
  }

  // 3. Check if user has adopted this empleaido (skip for demo mode)
  // In production: verify adoption status
  // const { data: adoption } = await supabase
  //   .from('ef_adoptions')
  //   .select('*')
  //   .eq('user_id', request.userId)
  //   .eq('empleaido_id', request.agentId)
  //   .single()

  // 4. Check rate limits
  const canExecute = await checkRateLimit(request.userId, 'free') // Default to free tier
  if (!canExecute) {
    throw new Error('Daily limit exceeded. Upgrade to Pro for more executions.')
  }

  // 5. Check energy
  if (empleaido.life && empleaido.life.energy < 10) {
    throw new Error('Empleaido needs rest. Energy too low.')
  }

  // 6. Execute agent via mock implementation (OpenClaw integration TODO)
  const result = await mockAgentExecution(request.agentId, request.input, empleaido)

  // 7. Update life stats
  if (empleaido.life) {
    await applyActivity(empleaido as unknown as FullEmpleaido, 'task_completed')
  }

  // 8. Log execution for analytics
  await logExecution({
    empleaido_id: request.agentId,
    user_id: request.userId,
    input: request.input,
    output: result.output,
    cost: result.cost,
    tokens_used: result.tokens_used,
    duration_ms: result.duration_ms,
  })

  return {
    ...result,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Mock agent execution - Replace with actual OpenClaw integration
 */
async function mockAgentExecution(
  agentId: string,
  input: string,
  _empleaido: unknown
): Promise<Omit<ExecutionResult, 'timestamp'>> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

  // Generate contextual response based on empleaido personality
  const responses = generateResponse(agentId, input, _empleaido)

  return {
    output: responses,
    cost: 0.001 + Math.random() * 0.002, // Mock cost
    tokens_used: Math.floor(50 + Math.random() * 200),
    duration_ms: 500 + Math.floor(Math.random() * 1000),
  }
}

/**
 * Generate contextual response based on empleaido
 */
function generateResponse(agentId: string, input: string, _empleaido: unknown): string {
  const lowerInput = input.toLowerCase()

  // SERA - Accounting specialist
  if (agentId === 'sera-001') {
    if (lowerInput.includes('factura') || lowerInput.includes('invoice')) {
      return `📊 Como tu especialista contable, entiendo que necesitas ayuda con esa factura. Para procesarla correctamente, necesito que me proporciones: el NCF, el monto, y la fecha de emisión. Una vez que tenga estos datos, puedo ayudarte a categorizarla y registrarla en tu sistema contable.`
    }
    if (lowerInput.includes('impuesto') || lowerInput.includes('tax')) {
      return `💰 Los impuestos son fundamentales para el cumplimiento fiscal. ¿Necesitas ayuda con cálculo de ITBIS, retenciones en la fuente, o preparación de declaraciones mensuales? Estoy aquí para asegurarte de que todo esté correcto con la DGII.`
    }
    return `📈 Hola, soy SERA, tu especialista en contabilidad. Entiendo tu consulta: "${input}". Puedo ayudarte con facturas, gastos, reportes financieros, y cumplimiento tributario. ¿Podrías darme más detalles sobre lo que necesitas?`
  }

  // KAEL - Marketing specialist
  if (agentId === 'kael-002') {
    if (lowerInput.includes('campaña') || lowerInput.includes('campaign')) {
      return `🎯 Excelente iniciativa para tu campaña de marketing. Para maximizar tu ROI, necesito entender: tu público objetivo, presupuesto, y los canales que planeas utilizar. Con esta información, puedo diseñar una estrategia efectiva para ti.`
    }
    if (lowerInput.includes('contenido') || lowerInput.includes('content')) {
      return `✨ El contenido es el rey del marketing digital. ¿Necesitas ayuda con blog posts, social media, email marketing, o algo más? Cada tipo de contenido requiere un enfoque diferente para conectar con tu audiencia.`
    }
    return `🚀 ¡Hola! Soy KAEL, tu experto en marketing y crecimiento. Veo que estás interesado en: "${input}". Puedo ayudarte a crear estrategias de marketing, contenido impactante, y campañas que conviertan. Cuéntame más sobre tu proyecto.`
  }

  // NORA - Operations specialist
  if (agentId === 'nora-003') {
    if (lowerInput.includes('proceso') || lowerInput.includes('workflow')) {
      return `⚙️ La optimización de procesos es clave para la eficiencia operativa. Para mejorar tu workflow, necesito analizar: pasos actuales, cuellos de botella, y recursos disponibles. ¿Podrías describirme el proceso que quieres optimizar?`
    }
    if (lowerInput.includes('tarea') || lowerInput.includes('task')) {
      return `📋 La gestión de tareas es fundamental. Puedo ayudarte a priorizar, delegar, y hacer seguimiento de tus tareas. ¿Necesitas ayuda con organización personal o gestión de equipo?`
    }
    return `🔧 Hola, soy NORA, tu especialista en operaciones. Entiendo que necesitas ayuda con: "${input}". Me especializo en optimización de procesos, gestión de proyectos, y mejora continua. ¿En qué puedo asistirte hoy?`
  }

  // LIOR - Strategy specialist
  if (agentId === 'lior-004') {
    if (lowerInput.includes('estrategia') || lowerInput.includes('strategy')) {
      return `🎯 Una estrategia sólida es el fundamento del éxito. Para desarrollar una estrategia efectiva, necesito analizar: tu posición actual, objetivos a largo plazo, recursos disponibles, y el panorama competitivo. ¿Cuál es el desafío estratégico principal que enfrentas?`
    }
    if (lowerInput.includes('decisión') || lowerInput.includes('decision')) {
      return `🧠 La toma de decisiones basada en datos es crucial. Puedo ayudarte a analizar opciones, evaluar riesgos, y considerar el impacto a largo plazo de tus decisiones. ¿Qué decisión estás considerando?`
    }
    return `📊 Hola, soy LIOR, tu estratega. Veo que estás pensando en: "${input}". Puedo ayudarte a analizar situaciones, desarrollar planes estratégicos, y tomar decisiones informadas. Cuéntame más sobre el contexto.`
  }

  // ZIV - Productivity specialist
  if (agentId === 'ziv-005') {
    if (lowerInput.includes('tiempo') || lowerInput.includes('time')) {
      return `⏰ La gestión del tiempo es esencial para la productividad. Para optimizar tu tiempo, necesito entender: tus prioridades actuales, distracciones comunes, y patrones de trabajo. ¿Cuál es tu mayor desafío con la gestión del tiempo?`
    }
    if (lowerInput.includes('meta') || lowerInput.includes('goal')) {
      return `🎯 El establecimiento de metas es el primer paso para lograrlas. Puedo ayudarte a definir metas SMART, crear planes de acción, y hacer seguimiento de tu progreso. ¿Qué meta quieres trabajar?`
    }
    return `💪 ¡Hola! Soy ZIV, tu especialista en productividad. Entiendo que necesitas ayuda con: "${input}". Me especializo en gestión del tiempo, establecimiento de metas, y creación de hábitos productivos. ¿En qué puedo ayudarte?`
  }

  // Default response
  return `Entiendo tu consulta: "${input}". Como tu empleaido, estoy aquí para ayudarte. ¿Podrías darme más detalles sobre lo que necesitas?`
}

/**
 * Log execution to database
 */
async function logExecution(data: Omit<ExecutionLog, 'id' | 'created_at'>): Promise<void> {
  try {
    const supabase = createRouteHandlerClient()
    await supabase.from('ef_executions').insert({
      empleaido_id: data.empleaido_id,
      user_id: data.user_id,
      input: data.input,
      output: data.output,
      cost: data.cost,
      tokens_used: data.tokens_used,
      duration_ms: data.duration_ms,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to log execution:', error)
    // Don't throw - logging failure shouldn't break execution
  }
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Get user's execution statistics
 */
export async function getUserExecutionStats(userId: string, period: 'day' | 'week' | 'month' = 'month') {
  const supabase = createRouteHandlerClient()
  const now = new Date()
  const startDate = new Date()

  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
  }

  const { data: executions } = await supabase
    .from('ef_executions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())

  if (!executions || executions.length === 0) {
    return {
      total: 0,
      totalCost: 0,
      totalTokens: 0,
      avgDuration: 0,
      empleaidos: {},
    }
  }

  const empleaidos: Record<string, number> = {}
  let totalCost = 0
  let totalTokens = 0
  let totalDuration = 0

  executions.forEach((ex) => {
    empleaidos[ex.empleaido_id] = (empleaidos[ex.empleaido_id] || 0) + 1
    totalCost += ex.cost || 0
    totalTokens += ex.tokens_used || 0
    totalDuration += ex.duration_ms || 0
  })

  return {
    total: executions.length,
    totalCost: Math.round(totalCost * 10000) / 10000,
    totalTokens,
    avgDuration: Math.round(totalDuration / executions.length),
    empleaidos,
  }
}

/**
 * Get empleaido execution statistics
 */
export async function getEmpleaidoStats(empleaidoId: string, period: 'day' | 'week' | 'month' = 'month') {
  const supabase = createRouteHandlerClient()
  const now = new Date()
  const startDate = new Date()

  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
  }

  const { data: executions } = await supabase
    .from('ef_executions')
    .select('*')
    .eq('empleaido_id', empleaidoId)
    .gte('created_at', startDate.toISOString())

  if (!executions || executions.length === 0) {
    return {
      total: 0,
      totalCost: 0,
      uniqueUsers: 0,
      avgCost: 0,
    }
  }

  const uniqueUsers = new Set(executions.map((e) => e.user_id)).size
  const totalCost = executions.reduce((sum, e) => sum + (e.cost || 0), 0)

  return {
    total: executions.length,
    totalCost: Math.round(totalCost * 10000) / 10000,
    uniqueUsers,
    avgCost: Math.round((totalCost / executions.length) * 10000) / 10000,
  }
}
