/**
 * STEP 3: Confirm & Activate
 *
 * User reviews all selections and activates their empleaido.
 */

'use client'

import { empleaidos } from '@/lib/data/empleaidos'
import Image from 'next/image'

interface Step3Props {
  data: any
  onComplete: () => void
  onBack: () => void
  isLoading: boolean
}

export function Step3_Confirm({ data, onComplete, onBack, isLoading }: Step3Props) {
  const empleaido = empleaidos.find(e => e.id === data.empleaidoId)
  const displayName = data.customName?.trim() || data.empleaidoName

  if (!empleaido) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: Empleaido not found</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Confirma tu Selección
        </h2>
        <p className="text-gray-600">
          Revisa toda la información antes de activar a {displayName}.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
        <div className="max-w-2xl mx-auto">
          {/* Empleaido Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/3">
                <div className="h-48 md:h-full relative bg-gradient-to-br from-blue-100 to-purple-100">
                  {empleaido.image_url ? (
                    <Image
                      src={empleaido.image_url}
                      alt={empleaido.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      {empleaido.emoji}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {displayName}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {empleaido.tagline}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    Activo
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {empleaido.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {empleaido.skills?.native?.slice(0, 4).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {empleaido.skills?.native?.length > 4 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      +{empleaido.skills.native.length - 4} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h4 className="font-bold text-gray-900 mb-4">Configuración</h4>

            <DetailRow
              label="Nombre Original"
              value={empleaido.name}
            />

            {data.customName && (
              <DetailRow
                label="Nombre Personalizado"
                value={data.customName}
                highlight
              />
            )}

            <DetailRow
              label="Estilo de Comunicación"
              value={
                data.preferences?.communicationStyle === 'formal' ? 'Formal 👔' :
                data.preferences?.communicationStyle === 'casual' ? 'Casual 😎' :
                'Amigable 😊'
              }
            />

            <DetailRow
              label="Idioma"
              value={data.preferences?.language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
            />

            <DetailRow
              label="Zona Horaria"
              value="🌎 América/Santo_Domingo"
            />
          </div>

          {/* What's Next */}
          <div className="bg-blue-600 text-white rounded-xl p-6 mt-6">
            <h4 className="font-bold text-lg mb-3">¿Qué sigue?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-200">✓</span>
                <span>{displayName} estará disponible en tu dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200">✓</span>
                <span>Podrás empezar a chatear inmediatamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200">✓</span>
                <span>{displayName} aprenderá de tus interacciones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200">✓</span>
                <span>Sistema de vida y XP se activarán desde el primer uso</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          ← Atrás
        </button>
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Activando...
            </>
          ) : (
            <>
              <span>Activar {displayName}</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string
  highlight?: boolean
}

function DetailRow({ label, value, highlight }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}
