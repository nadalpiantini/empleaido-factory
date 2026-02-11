/**
 * STEP 2: Customize
 *
 * User personalizes their empleaido with a custom name and communication preferences.
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Step2Props {
  empleaidoId: string
  empleaidoName: string
  data: any
  onNext: (data: any) => void
  onBack: () => void
}

export function Step2_Customize({ empleaidoId, empleaidoName, data, onNext, onBack }: Step2Props) {
  const [customName, setCustomName] = useState(data.customName || '')
  const [communicationStyle, setCommunicationStyle] = useState(
    data.preferences?.communicationStyle || 'friendly'
  )
  const [language, setLanguage] = useState(data.preferences?.language || 'es')

  const handleNext = () => {
    onNext({
      customName: customName.trim() || undefined,
      preferences: {
        communicationStyle,
        language,
        timezone: 'America/Santo_Domingo',
      },
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Personaliza tu Empleaido
        </h2>
        <p className="text-gray-600">
          Configura cómo {empleaidoName} se comunicará contigo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Custom Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre Personalizado (opcional)
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={`Ej: "Mi ${empleaidoName}" o déjalo vacío`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Si no quieres un nombre personalizado, {empleaidoName} usará su nombre original.
            </p>
          </div>

          {/* Communication Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Estilo de Comunicación
            </label>
            <div className="space-y-3">
              <CommunicationStyleOption
                value="formal"
                label="Formal"
                description="Profesional y estructurado"
                selected={communicationStyle === 'formal'}
                onSelect={() => setCommunicationStyle('formal')}
              />
              <CommunicationStyleOption
                value="casual"
                label="Casual"
                description="Relajado y directo"
                selected={communicationStyle === 'casual'}
                onSelect={() => setCommunicationStyle('casual')}
              />
              <CommunicationStyleOption
                value="friendly"
                label="Amigable"
                description="Cercano y empático"
                selected={communicationStyle === 'friendly'}
                onSelect={() => setCommunicationStyle('friendly')}
              />
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Idioma Principal
            </label>
            <div className="flex gap-4">
              <LanguageOption
                code="es"
                label="Español"
                selected={language === 'es'}
                onSelect={() => setLanguage('es')}
              />
              <LanguageOption
                code="en"
                label="English"
                selected={language === 'en'}
                onSelect={() => setLanguage('en')}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vista Previa
          </h3>

          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={`https://im.runware.ai/image/ws/2/ii/4670e19d-6e62-455a-b62a-c44b457099fd.jpg`}
                  alt="Empleaido"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  {customName.trim() || empleaidoName}
                </h4>
                <p className="text-sm text-blue-600">
                  {empleaidoName} • Empleaido
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estilo:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {communicationStyle === 'formal' && 'Formal 👔'}
                  {communicationStyle === 'casual' && 'Casual 😎'}
                  {communicationStyle === 'friendly' && 'Amigable 😊'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Idioma:</span>
                <span className="font-medium text-gray-900">
                  {language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 italic">
                "{getPreviewMessage(empleaidoName, customName, communicationStyle, language)}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          ← Atrás
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}

interface CommunicationStyleOptionProps {
  value: string
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}

function CommunicationStyleOption({ value, label, description, selected, onSelect }: CommunicationStyleOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all
        ${selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
          ${selected ? 'border-blue-600' : 'border-gray-300'}
        `}>
          {selected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{label}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
    </div>
  )
}

interface LanguageOptionProps {
  code: string
  label: string
  selected: boolean
  onSelect: () => void
}

function LanguageOption({ code, label, selected, onSelect }: LanguageOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all text-center
        ${selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="font-semibold text-gray-900">{label}</div>
      <div className="text-xs text-gray-500 mt-1">
        {code === 'es' ? '🇪🇸' : '🇺🇸'}
      </div>
    </div>
  )
}

function getPreviewMessage(name: string, customName: string, style: string, language: string): string {
  const displayName = customName.trim() || name

  if (language === 'en') {
    if (style === 'formal') {
      return `Good day. I am ${displayName}, your specialized assistant. How may I be of service?`
    }
    if (style === 'casual') {
      return `Hey! I'm ${displayName}. What's up?`
    }
    return `Hi there! 👋 I'm ${displayName}, ready to help you with whatever you need!`
  }

  // Spanish
  if (style === 'formal') {
    return `Buen día. Soy ${displayName}, su asistente especializado. ¿En qué puedo servirle?`
  }
  if (style === 'casual') {
    return `¡Epa! Soy ${displayName}. ¿Qué cuentas?`
  }
  return `¡Hola! 👋 Soy ${displayName}, listo para ayudarte en lo que necesites`
}
