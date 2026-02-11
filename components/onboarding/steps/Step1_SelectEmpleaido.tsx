/**
 * STEP 1: Select Empleaido
 *
 * User browses and selects their first empleaido from the available options.
 */

'use client'

import { empleaidos } from '@/lib/data/empleaidos'
import Image from 'next/image'

interface Step1Props {
  onNext: (empleaidoId: string, empleaidoName: string) => void
  selectedId: string
}

export function Step1_SelectEmpleaido({ onNext, selectedId }: Step1Props) {
  const handleSelect = (id: string, name: string) => {
    onNext(id, name)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Elige tu primer Empleaido
        </h2>
        <p className="text-gray-600">
          Cada Empleaido tiene personalidades y habilidades únicas. Selecciona el que mejor se adapte a tus necesidades.
        </p>
      </div>

      {/* Empleaido Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empleaidos.map((empleaido) => (
          <EmpleaidoCard
            key={empleaido.id}
            empleaido={empleaido}
            isSelected={selectedId === empleaido.id}
            onSelect={() => handleSelect(empleaido.id, empleaido.name)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => selectedId && onNext(selectedId, empleaidos.find(e => e.id === selectedId)?.name || '')}
          disabled={!selectedId}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}

interface EmpleaidoCardProps {
  empleaido: any
  isSelected: boolean
  onSelect: () => void
}

function EmpleaidoCard({ empleaido, isSelected, onSelect }: EmpleaidoCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300
        ${isSelected
          ? 'ring-4 ring-blue-600 shadow-xl transform scale-105'
          : 'hover:shadow-lg hover:scale-102'
        }
      `}
    >
      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-purple-100">
        {empleaido.image_url ? (
          <Image
            src={empleaido.image_url}
            alt={empleaido.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {empleaido.emoji}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        <h3 className="font-bold text-lg text-gray-900 mb-1">
          {empleaido.name}
        </h3>
        <p className="text-sm text-blue-600 font-medium mb-2">
          {empleaido.tagline}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {empleaido.description}
        </p>

        {/* Skills Preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {empleaido.skills?.native?.slice(0, 3).map((skill: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {empleaido.skills?.native?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{empleaido.skills.native.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
