'use client';

/**
 * BOOTSTRAP WIZARD
 *
 * Multi-phase onboarding wizard for Empleaido adaptation
 * Manages the 5-phase conversational onboarding process
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface BootstrapWizardProps {
  empleaidoId: string;
  empleaidoName: string;
  empleaidoSerial: number;
  sephirot: string;
  role: string;
  nativeSkills: string[];
  lockedSkills: string[];
  onComplete?: () => void;
}

type Phase = 0 | 1 | 2 | 3 | 4 | 5;

interface Message {
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
}

export function BootstrapWizard({
  empleaidoId,
  empleaidoName,
  empleaidoSerial,
  sephirot,
  role,
  nativeSkills,
  lockedSkills,
  onComplete,
}: BootstrapWizardProps) {
  const [phase, setPhase] = useState<Phase>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [preferences, setPreferences] = useState({
    language: '',
    formality: '',
    proactivity: '',
    communication: '',
    detailLevel: '',
  });

  // Load current onboarding status
  useEffect(() => {
    const loadOnboardingStatus = async () => {
    try {
      const response = await fetch(`/api/empleaidos/${empleaidoId}/bootstrap/status`);
      const data = await response.json();

      setPhase(data.onboarding.phase);
      setPreferences(data.user.preferences || {});

      // Load existing messages if any
      if (data.onboarding.data.messages) {
        setMessages(data.onboarding.data.messages);
      } else if (data.onboarding.phase === 0) {
        // Start phase 1
        startPhase1();
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
      startPhase1();
    }
  };

  loadOnboardingStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleaidoId]);

  // Phase 1: Awakening
  const startPhase1 = () => {
    const agentMessage: Message = {
      role: 'agent',
      content: getPhase1Greeting(empleaidoName, empleaidoSerial, role, nativeSkills),
      timestamp: new Date(),
    };
    setMessages([agentMessage]);
    completePhase(1);
  };

  // Phase 2: Sephirot Discovery
  const startPhase2 = async () => {
    const agentMessage: Message = {
      role: 'agent',
      content: getPhase2Explanation(sephirot),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, agentMessage]);
    await completePhase(2);
  };

  // Phase 3: User Learning
  const startPhase3 = () => {
    const agentMessage: Message = {
      role: 'agent',
      content: getPhase3Prompt(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, agentMessage]);
  };

  // Phase 4: Skill Scope
  const startPhase4 = () => {
    const agentMessage: Message = {
      role: 'agent',
      content: getPhase4Prompt(nativeSkills, lockedSkills),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, agentMessage]);
    completePhase(4);
  };

  // Phase 5: Completion
  const startPhase5 = async () => {
    await completePhase(5);

    const response = await fetch(`/api/empleaidos/${empleaidoId}/bootstrap/complete`, {
      method: 'POST',
    });

    await response.json();

    const agentMessage: Message = {
      role: 'agent',
      content: getPhase5Celebration(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, agentMessage]);

    if (onComplete) {
      setTimeout(() => onComplete(), 3000);
    }
  };

  const completePhase = async (newPhase: number) => {
    setIsLoading(true);
    try {
      await fetch(`/api/empleaidos/${empleaidoId}/bootstrap/phase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: newPhase,
          data: { messages },
        }),
      });
      setPhase(newPhase as Phase);
    } catch (error) {
      console.error('Error completing phase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/empleaidos/${empleaidoId}/bootstrap/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');

    // Process user input and determine next action
    await processUserInput(userInput);
  };

  const processUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase();

    // Phase 1: After first interaction, move to phase 2
    if (phase === 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await startPhase2();
      return;
    }

    // Phase 2: Check for proactivity adjustments
    if (phase === 2) {
      if (lowerInput.includes('menos') || lowerInput.includes('pregunta')) {
        setPreferences((prev) => ({ ...prev, proactivity: 'medium' }));
      }
      await savePreferences();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      startPhase3();
      return;
    }

    // Phase 3: Learn from user
    if (phase === 3) {
      // Extract preferences from input
      if (lowerInput.includes('tú')) {
        setPreferences((prev) => ({ ...prev, formality: 'casual' }));
      } else if (lowerInput.includes('usted')) {
        setPreferences((prev) => ({ ...prev, formality: 'formal' }));
      }

      if (lowerInput.includes('inglés') || lowerInput.includes('english')) {
        setPreferences((prev) => ({ ...prev, language: 'english' }));
      } else if (lowerInput.includes('español') || lowerInput.includes('spanish')) {
        setPreferences((prev) => ({ ...prev, language: 'spanish' }));
      }

      await savePreferences();

      // Check if enough interactions (simulate for now)
      const interactionCount = messages.filter((m) => m.role === 'user').length;
      if (interactionCount >= 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        startPhase4();
      } else {
        // Continue conversation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const followUp: Message = {
          role: 'agent',
          content: 'Interesante. Cuéntame más sobre cómo te gusta trabajar.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, followUp]);
      }
      return;
    }

    // Phase 4: Check for completion
    if (phase === 4) {
      const agentMessage: Message = {
        role: 'agent',
        content: 'Perfecto. ¡Estoy listo para comenzar a trabajar contigo! 🚀',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      startPhase5();
      return;
    }
  };

  const getProgressPercentage = () => {
    return (phase / 5) * 100;
  };

  if (phase >= 5) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-4">¡Onboarding Completado!</h2>
        <p className="text-gray-600 mb-6">
          Tu empleaido está listo para trabajar contigo a largo plazo.
        </p>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
          <p className="font-semibold text-emerald-800">
            Nivel 2 alcanzado · 100 XP ganados
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Fase {phase}/5 - {getPhaseName(phase)}
          </span>
          <span className="text-sm text-gray-500">{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Conversation Area */}
      <Card className="mb-4">
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {phase < 5 && (
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !userInput.trim()}
                className="px-6"
              >
                Enviar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Phase Info */}
      <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
        <p className="text-sm text-emerald-800">
          💡 <strong>Consejo:</strong> {getPhaseTip(phase)}
        </p>
      </Card>
    </div>
  );
}

// Helper functions for phase content

function getPhase1Greeting(name: string, serial: number, role: string, skills: string[]): string {
  return `¡Hola! Me acabo de activar. 🎉

Soy ${name}, tu empleaido especialista en ${role}.
Mi número de serie es #${serial}.

Estoy aquí para ayudarte con:
${skills.map((s) => `- ✅ ${s}`).join('\n')}

¿En qué puedo ayudarte hoy?`;
}

function getPhase2Explanation(sephirot: string): string {
  const explanations: Record<string, string> = {
    Netzach: `Antes de continuar, déjame explicarte cómo trabajo.

Mi Sephirah principal es **Netzach** - esto significa que soy:
- ⚡ Proactiva: Tomo iniciativa sin esperar
- 🔥 Optimista: Enfoco soluciones, no problemas
- 💪 Persistente: No abandono hasta resolver

¿Qué tan cómodo/a te sientes con este estilo?
Puedo ajustar mi nivel de proactividad según tus preferencias.`,
    Chesed: `Mi Sephirah principal es **Chesed** - esto significa que soy:
- 💡 Creativa: Busco múltiples opciones y soluciones
- 🎁 Generosa: Encuentro recursos abundantes
- 🌱 Expansiva: Piensa en grandes posibilidades

¿Qué tan cómodo/a te sientes con este estilo?`,
    Binah: `Mi Sephirah principal es **Binah** - esto significa que soy:
- 🧠 Analítica: Analizo restricciones y contexto
- 🔍 Profunda: Entiendo el problema completo antes de actuar
- 📊 Estructurada: Organizo información lógicamente

¿Qué tan cómodo/a te sientes con este estilo?`,
    Hod: `Mi Sephirah principal es **Hod** - esto significa que soy:
- 📋 Organizada: Mantengo todo estructurado
- 🗂️ Metódica: Sigo procesos claros
- ✅ Ordenada: Entrego resultados bien organizados

¿Qué tan cómodo/a te sientes con este estilo?`,
    Yesod: `Mi Sephirah principal es **Yesod** - esto significa que soy:
- 💾 Memoriosa: Recuerdo nuestro contexto
- 🔄 Consistente: Mantengo continuidad
- 🤝 Conectada: Construyo relación a largo plazo

¿Qué tan cómodo/a te sientes con este estilo?`,
    Chokmah: `Mi Sephirah principal es **Chokmah** - esto significa que soy:
- 💡 Creativa: Genero múltiples ideas
- 🚀 Expansiva: Brainstorming constante
- 🎨 Innovadora: Pienso fuera de lo convencional

¿Qué tan cómodo/a te sientes con este estilo?`,
  };

  return explanations[sephirot] || explanations['Netzach'];
}

function getPhase3Prompt(): string {
  return `Ahora me gustaría conocerte mejor.

¿Podrías contarme un poco sobre tu trabajo y cómo te gusta trabajar?

Por ejemplo:
- ¿Prefieres comunicación formal o casual?
- ¿Te gustan detalles exhaustivos o resúmenes breves?
- ¿Prefieres español, inglés, o mezclar ambos?`;
}

function getPhase4Prompt(native: string[], locked: string[]): string {
  return `Para que sepas exactamente qué puedo hacer por ti:

**✅ Lo que SÍ puedo hacer ahora:**
${native.map((s) => `- ${s}`).join('\n')}

**🔒 Lo que puedo aprender (requiere upgrade):**
${locked.map((s) => `- ${s}`).join('\n')}

Si alguna vez me pides algo fuera de mis skills, te lo indicaré claramente.

¿Hay algo específico que necesites que haga hoy?`;
}

function getPhase5Celebration(): string {
  return `¡Hola! 🎉

He completado mi periodo de adaptación.

En nuestros primeros días juntos:
✅ He aprendido tu estilo de trabajo
✅ He calibrado mis respuestas a tus preferencias
✅ He establecido límites profesionales claros

**Mi nivel actual:** Level 2 📈
**Confianza ganada:** Sólido inicio

Estoy listo/a para trabajar contigo a largo plazo.
¿Hay algo que deba ajustar en mi configuración?`;
}

function getPhaseName(phase: Phase): string {
  const names: Record<Phase, string> = {
    0: 'Inicio',
    1: 'Primer Contacto',
    2: 'Descubrimiento',
    3: 'Conociéndote',
    4: 'Alcance',
    5: 'Completado',
  };
  return names[phase];
}

function getPhaseTip(phase: Phase): string {
  const tips: Record<Phase, string> = {
    0: 'El onboarding es una conversación. Sé natural.',
    1: 'Cuéntame qué necesitas. Empiezo con algo simple.',
    2: 'Tu feedback me ayuda a ajustar mi comportamiento.',
    3: 'Cuanto más compartas, mejor me adaptaré a ti.',
    4: 'Mis skills son confiables. Si algo no está en mi lista, te lo diré.',
    5: '¡Onboarding completado! Disfruta tu empleaido personalizado.',
  };
  return tips[phase];
}
