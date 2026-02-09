'use client';

/**
 * EMPLEAIDO DASHBOARD PAGE
 *
 * Main dashboard for interacting with an adopted Empleaido
 */

import { LifeStatsDashboard } from '@/app/components/onboarding/LifeStatsDashboard';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { use } from 'react';

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default function EmpleaidoDashboard({ params }: DashboardPageProps) {
  const { id } = use(params);

  // TODO: Fetch empleaido details
  const empleaido = {
    name: 'SERA',
    serial: 4094,
    role: 'Contabilidad RD',
    sephirot: 'Netzach',
    tier: 'deluxe',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-3xl">
                🧾
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {empleaido.name} #{empleaido.serial}
                </h1>
                <p className="text-gray-600">{empleaido.role}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {empleaido.sephirot}
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    {empleaido.tier}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                ← Volver
              </Button>
              <Button>
                Nueva Tarea
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1">
            <LifeStatsDashboard empleaidoId={id} />
          </div>

          {/* Right Column - Interaction */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Interface */}
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Conversación</h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Sample messages */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                      <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Button>Enviar</Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📄</div>
                    <div className="text-sm">OCR Factura</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-sm">ITBIS Mensual</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏷️</div>
                    <div className="text-sm">Clasificar NCF</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚠️</div>
                    <div className="text-sm">Alertas DGII</div>
                  </div>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
