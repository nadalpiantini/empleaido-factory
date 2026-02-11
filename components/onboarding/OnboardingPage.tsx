'use client';

/**
 * ONBOARDING PAGE
 *
 * Full-page onboarding experience for newly adopted Empleaidos
 */

import { use } from 'react';
import { BootstrapWizard } from './BootstrapWizard';

interface OnboardingPageProps {
  params: Promise<{ id: string }>;
}

export default function OnboardingPage({ params }: OnboardingPageProps) {
  const { id } = use(params);

  // TODO: Fetch empleaido details from API
  // For now, use mock data
  const empleaido = {
    empleaidoId: id,
    empleaidoName: 'SERA',
    empleaidoSerial: 4094,
    sephirot: 'Netzach',
    role: 'Contabilidad RD',
    nativeSkills: ['OCR Facturas', 'ITBIS Mensual', 'Clasificación NCF', 'Alertas DGII'],
    lockedSkills: ['Planeación Fiscal', 'ISR Anual'],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Adaptación de {empleaido.empleaidoName}
          </h1>
          <p className="text-lg text-gray-600">
            Tu empleaido está aprendiendo a trabajar contigo
          </p>
        </div>

        {/* Wizard */}
        <BootstrapWizard
          empleaidoId={empleaido.empleaidoId}
          empleaidoName={empleaido.empleaidoName}
          empleaidoSerial={empleaido.empleaidoSerial}
          sephirot={empleaido.sephirot}
          role={empleaido.role}
          nativeSkills={empleaido.nativeSkills}
          lockedSkills={empleaido.lockedSkills}
          onComplete={() => {
            window.location.href = `/dashboard/empleaidos/${id}`;
          }}
        />
      </div>
    </div>
  );
}
