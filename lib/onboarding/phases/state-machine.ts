/**
 * Onboarding State Machine
 * Manages 5-phase conversational onboarding for Empleaidos
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type OnboardingPhase =
  | 'phase_0_spawn'
  | 'phase_1_awakening'
  | 'phase_2_sefirot'
  | 'phase_3_context'
  | 'phase_4_skills'
  | 'phase_5_complete'
  | 'operational';

export interface OnboardingState {
  adoptionId: string;
  userId: string;
  empleaidoId: string;
  currentPhase: OnboardingPhase;
  messagesInPhase: number;
  startedAt: string;
  completedAt?: string;
  userPreferences: UserPreferences;
}

export interface UserPreferences {
  language: 'spanish' | 'english' | 'mixed';
  formality: 'formal' | 'casual';
  proactivityLevel: 'low' | 'medium' | 'high';
  communicationStyle: 'concise' | 'detailed' | 'conversational';
  workType?: string;
  taxRegime?: string;
}

/**
 * Get or create onboarding state
 */
export async function getOnboardingState(adoptionId: string): Promise<OnboardingState | null> {
  const { data, error } = await supabase
    .from('ef_onboarding_states')
    .select('*')
    .eq('adoption_id', adoptionId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    adoptionId: data.adoption_id,
    userId: data.user_id,
    empleaidoId: data.empleaido_id,
    currentPhase: data.current_phase,
    messagesInPhase: data.messages_in_phase,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    userPreferences: data.user_preferences || {},
  };
}

/**
 * Create initial onboarding state
 */
export async function createOnboardingState(adoptionId: string, userId: string, empleaidoId: string) {
  const { data, error } = await supabase
    .from('ef_onboarding_states')
    .insert({
      adoption_id: adoptionId,
      user_id: userId,
      empleaido_id: empleaidoId,
      current_phase: 'phase_1_awakening',
      messages_in_phase: 0,
      started_at: new Date().toISOString(),
      user_preferences: {},
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating onboarding state:', error);
    throw error;
  }

  return data;
}

/**
 * Process message through onboarding phases
 */
export async function processOnboardingMessage(
  adoptionId: string,
  message: string
): Promise<{
  response: string;
  newPhase?: OnboardingPhase;
  shouldUpdateUser?: boolean;
}> {
  const state = await getOnboardingState(adoptionId);

  if (!state) {
    throw new Error('Onboarding state not found');
  }

  // Route to appropriate phase handler
  switch (state.currentPhase) {
    case 'phase_1_awakening':
      return handlePhase1Awakening(state, message);
    case 'phase_2_sefirot':
      return handlePhase2Sefirot(state, message);
    case 'phase_3_context':
      return handlePhase3Context(state, message);
    case 'phase_4_skills':
      return handlePhase4Skills(state, message);
    case 'phase_5_complete':
      return handlePhase5Complete(state, message);
    default:
      return { response: 'Operational mode - onboarding complete' };
  }
}

/**
 * Phase 1: Awakening (First Contact)
 * Trigger: User first interacts
 * Goal: Establish professional identity
 */
async function handlePhase1Awakening(
  state: OnboardingState,
  message: string
): Promise<{ response: string; newPhase?: OnboardingPhase }> {
  const empleaidoNames: Record<string, string> = {
    sera: 'SERA #4094',
    kael: 'KAEL #1823',
    nora: 'NORA #2756',
    lior: 'LIOR #8129',
    ziv: 'ZIV #3647',
  };

  const empleaidoDescriptions: Record<string, string> = {
    sera: 'Contabilidad RD - Expert en facturación, ITBIS y DGII',
    kael: 'Marketing Digital - Social media, content y analytics',
    nora: 'Customer Success - Relaciones y retención',
    lior: 'Operations & Logistics - Procesos y eficiencia',
    ziv: 'Legal & Compliance - Contratos y regulaciones',
  };

  const name = empleaidoNames[state.empleaidoId] || 'Tu empleaido';
  const description = empleaidoDescriptions[state.empleaidoId] || 'Especialista';

  const response = `
¡Hola! 🎉

Soy **${name}**, tu empleaido especialista en **${description}**.

Acabo de activarme y estoy lista para trabajar contigo.

**Lo que puedo hacer por ti:**
✅ Procesar facturas y comprobantes
✅ Calcular impuestos automáticamente
✅ Generar reportes mensuales
✅ Mantener tu cumplimiento al día

¿En qué te gustaría que te ayude hoy?
  `.trim();

  // Move to Phase 2 after first message
  await updatePhase(state.adoptionId, 'phase_2_sefirot');

  return {
    response,
    newPhase: 'phase_2_sefirot',
  };
}

/**
 * Phase 2: Sefirot Discovery
 * Trigger: After first interaction
 * Goal: User understands agent's behavioral nature
 */
async function handlePhase2Sefirot(
  state: OnboardingState,
  message: string
): Promise<{ response: string; newPhase?: OnboardingPhase }> {
  const sefirotInfo: Record<string, { name: string; traits: string[] }> = {
    sera: {
      name: 'Netzach',
      traits: ['⚡ Proactiva', '🔥 Optimista', '💪 Persistente'],
    },
    kael: {
      name: 'Hod',
      traits: ['🎨 Creativo', '💭 Intuitivo', '🤝 Empático'],
    },
    nora: {
      name: 'Chesed',
      traits: ['❤️ Compasiva', '🌟 Cálida', '🤗 Servicial'],
    },
    lior: {
      name: 'Tiferet',
      traits: ['⚖️ Equilibrada', '🎯 Precisa', '🔄 Adaptativa'],
    },
    ziv: {
      name: 'Gevurah',
      traits: ['🛡️ Rigurosa', '📏 Estricta', '✅ Detallista'],
    },
  };

  const info = sefirotInfo[state.empleaidoId] || {
    name: 'Balanceado',
    traits: ['⚖️ Equilibrada', '🎯 Profesional'],
  };

  const response = `
Antes de continuar, déjame explicarte cómo trabajo:

Mi Sephirah principal es **${info.name}**, esto significa que soy:

${info.traits.map(t => `  ${t}`).join('\n')}

**¿Te sientes cómodo/a con este estilo?**

Puedo ajustar mi nivel de proactividad según tus preferencias:
- Más proactiva: Tomo iniciativa sin esperar
- Más conservadora: Te pregunto antes de actuar
  `.trim();

  // Check if user responds, then move to Phase 3
  const messagesCount = state.messagesInPhase + 1;
  await updateMessagesInPhase(state.adoptionId, messagesCount);

  if (messagesCount >= 2) {
    await updatePhase(state.adoptionId, 'phase_3_context');
    return {
      response: response + '\n\nPerfecto, ahora conozcamos un poco sobre tu trabajo...',
      newPhase: 'phase_3_context',
    };
  }

  return { response };
}

/**
 * Phase 3: Context Learning
 * Trigger: During first 3-5 interactions
 * Goal: Build rich user profile
 */
async function handlePhase3Context(
  state: OnboardingState,
  message: string
): Promise<{ response: string; newPhase?: OnboardingPhase; shouldUpdateUser?: boolean }> {
  const messagesCount = state.messagesInPhase + 1;
  await updateMessagesInPhase(state.adoptionId, messagesCount);

  // Extract user preferences from conversation
  const preferences = extractPreferences(message);
  await updateUserPreferences(state.adoptionId, preferences);

  let response = '';

  if (messagesCount === 1) {
    response = `
Para ayudarte mejor, cuéntame:

**¿Tipo de trabajo?**
- Freelancer independiente
- Tienes empresa registrada
- Soy profesional asalariado/a

**¿Régimen fiscal?** (si aplica)
- Régimen simplificado
- Régimen normal
- Otro
    `.trim();
  } else if (messagesCount === 2) {
    response = `
Entendido. Un par de ajustes más:

**¿Prefieres:**
- Comunicación formal (usted) o casual (tú)?
- Respuestas detalladas o resúmenes breves?
- ¿Con qué frecuencia trabajamos? (diario, semanal, según surja)
    `.trim();
  } else if (messagesCount >= 3) {
    await updatePhase(state.adoptionId, 'phase_4_skills');
    return {
      response: 'Perfecto, ya te entiendo mejor. Ahora déjame explicar mis habilidades...',
      newPhase: 'phase_4_skills',
      shouldUpdateUser: true,
    };
  }

  return { response, shouldUpdateUser: true };
}

/**
 * Phase 4: Skill Scope Calibration
 * Trigger: When user asks for something outside scope
 * Goal: Set clear expectations
 */
async function handlePhase4Skills(
  state: OnboardingState,
  message: string
): Promise<{ response: string; newPhase?: OnboardingPhase }> {
  const empleaidoSkills: Record<string, { included: string[]; locked: string[] }> = {
    sera: {
      included: [
        '✅ OCR de facturas y comprobantes',
        '✅ Cálculo de ITBIS mensual',
        '✅ Clasificación de NCF',
        '✅ Alertas de vencimientos DGII',
      ],
      locked: [
        '🔒 Planeación fiscal estratégica',
        '🔒 Cálculo de ISR anual',
        '🔒 Representación ante DGII',
      ],
    },
    kael: {
      included: [
        '✅ Creación de contenido social',
        '✅ Calendar de posts',
        '✅ Analytics básico',
      ],
      locked: [
        '🔒 Estrategia de marca completa',
        '🔒 Gestión de ad campaigns',
      ],
    },
    // Add other empleaidos...
  };

  const skills = empleaidoSkills[state.empleaidoId] || {
    included: ['✅ Habilidades core'],
    locked: ['🔒 Habilidades avanzadas'],
  };

  const response = `
**Mis habilidades incluidas en tu plan:**

${skills.included.join('\n')}

**Habilidades disponibles con upgrade:**

${skills.locked.join('\n')}

---

Si necesitas algo fuera de mi scope, te lo indicaré claramente y te recomendaré alternativas.

**¿Listo para empezar a trabajar?**
  `.trim();

  const messagesCount = state.messagesInPhase + 1;
  await updateMessagesInPhase(state.adoptionId, messagesCount);

  if (messagesCount >= 2) {
    await updatePhase(state.adoptionId, 'phase_5_complete');
    return {
      response: response + '\n\n¡Excelente! Pasemos a la última fase...',
      newPhase: 'phase_5_complete',
    };
  }

  return { response };
}

/**
 * Phase 5: Integration Complete
 * Trigger: After 1 week or 10 successful interactions
 * Goal: Celebrate progress, transition to operational
 */
async function handlePhase5Complete(
  state: OnboardingState,
  message: string
): Promise<{ response: string; newPhase?: OnboardingPhase }> {
  const response = `
🎉 **¡Felicidades!**

Has completado mi periodo de adaptación. En nuestros primeros días juntos:

✅ He aprendido tu estilo de trabajo
✅ He calibrado mis respuestas a tus necesidades
✅ He organizado mis herramientas según tu flujo

**Mi nivel actual:** Level 2 📈
**Confianza ganada:** 15% (sólido inicio)

Estoy lista para trabajar contigo a largo plazo. Mi sistema de vida me permite crecer contigo - cada interacción me hará mejor.

¿Hay algo que deba ajustar en mi configuración antes de que empecemos oficialmente?
  `.trim();

  // Mark onboarding as complete
  await markOnboardingComplete(state.adoptionId);

  // Delete BOOTSTRAP.md from agent workspace (conceptually)
  await deleteBootstrapFlag(state.adoptionId);

  return {
    response,
    newPhase: 'operational',
  };
}

// ==================== HELPER FUNCTIONS ====================

async function updatePhase(adoptionId: string, newPhase: OnboardingPhase) {
  await supabase
    .from('ef_onboarding_states')
    .update({ current_phase: newPhase, messages_in_phase: 0 })
    .eq('adoption_id', adoptionId);
}

async function updateMessagesInPhase(adoptionId: string, count: number) {
  await supabase
    .from('ef_onboarding_states')
    .update({ messages_in_phase: count })
    .eq('adoption_id', adoptionId);
}

async function updateUserPreferences(adoptionId: string, prefs: Partial<UserPreferences>) {
  const { data: current } = await supabase
    .from('ef_onboarding_states')
    .select('user_preferences')
    .eq('adoption_id', adoptionId)
    .single();

  await supabase
    .from('ef_onboarding_states')
    .update({
      user_preferences: { ...current.user_preferences, ...prefs },
    })
    .eq('adoption_id', adoptionId);
}

async function markOnboardingComplete(adoptionId: string) {
  await supabase
    .from('ef_onboarding_states')
    .update({
      current_phase: 'operational',
      completed_at: new Date().toISOString(),
    })
    .eq('adoption_id', adoptionId);
}

async function deleteBootstrapFlag(adoptionId: string) {
  // This would delete BOOTSTRAP.md from the OpenClaw workspace
  // For now, just a flag in the database
  await supabase
    .from('ef_onboarding_states')
    .update({ bootstrap_deleted: true })
    .eq('adoption_id', adoptionId);
}

function extractPreferences(message: string): Partial<UserPreferences> {
  const lower = message.toLowerCase();
  const prefs: Partial<UserPreferences> = {};

  // Extract formality
  if (lower.includes('tú') || lower.includes('tu ') || lower.includes('tienes')) {
    prefs.formality = 'casual';
  } else if (lower.includes('usted')) {
    prefs.formality = 'formal';
  }

  // Extract work type
  if (lower.includes('freelancer')) {
    prefs.workType = 'freelancer';
  } else if (lower.includes('empresa') || lower.includes('negocio')) {
    prefs.workType = 'business';
  }

  // Extract communication style
  if (lower.includes('breve') || lower.includes('resumen')) {
    prefs.communicationStyle = 'concise';
  } else if (lower.includes('detallado')) {
    prefs.communicationStyle = 'detailed';
  }

  return prefs;
}
