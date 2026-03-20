import React from 'react';
import Image from 'next/image';
import { EmpLayout } from '@/components/layout/EmpLayout';
import { EmpHeader } from '@/components/layout/EmpHeader';
import { EmpFooter } from '@/components/layout/EmpFooter';
import { EmpCard } from '@/components/ui/EmpCard';
import { EmpButton } from '@/components/ui/EmpButton';
import { EmpStatus } from '@/components/ui/EmpStatus';
import { EmpRarity } from '@/components/ui/EmpRarity';

// Datos de ejemplo para los empleaidos
const empleaidos = [
  {
    id: 'conta-01',
    serial: 1,
    name: 'CONTA-01',
    role: 'Contabilidad RD',
    tier: 'base' as const,
    sephirot: 'MALKUTH',
    skills: ['Libro Banco', 'ITBIS', 'Comprobantes'],
    price: 199,
  },
  {
    id: 'growth-02',
    serial: 2,
    name: 'GROWTH-02',
    role: 'Growth Marketing',
    tier: 'pro' as const,
    sephirot: 'YESOD',
    skills: ['Email Marketing', 'SEO', 'Analytics'],
    price: 299,
  },
  {
    id: 'cfo-03',
    serial: 3,
    name: 'CFO-03',
    role: 'CFO Estratégico',
    tier: 'deluxe' as const,
    sephirot: 'BINAH',
    skills: ['Proyecciones', 'Cash Flow', 'Modelos'],
    price: 599,
  },
];

export default function EmpleaidoV1Page() {
  return (
    <EmpLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <EmpHeader />

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-6xl w-full">
            {/* Main Hero Card */}
            <EmpCard withCorners className="mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Imagen del empleaido */}
                <div className="relative w-64 h-64 bg-blue-dark border-4 border-cyan flex items-center justify-center">
                  <Image
                    src="/empleaido/head-empleaido.png"
                    alt="Empleaido Head Unit"
                    fill
                    className="object-contain p-4 grayscale hover:grayscale-0 transition-all"
                    priority
                  />
                  {/* Indicadores de estado */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-3 h-3 bg-green-500 animate-pulse" />
                    <div className="w-3 h-3 bg-cyan animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 text-center md:text-left">
                  <div className="font-mono text-sm text-cyan mb-2">
                    [FACTORY ID: EMPLEAIDO-01]
                  </div>
                  <h1 className="font-display font-black text-4xl md:text-6xl text-cream uppercase tracking-tight mb-4">
                    AI Workforce
                  </h1>
                  <p className="font-mono text-xl text-cyan mb-6">
                    Collectible &bull; Upgradable &bull; Yours
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <EmpButton href="#catalog" size="lg">
                      View Catalog
                    </EmpButton>
                    <EmpButton variant="secondary" href="#about" size="lg">
                      Learn More
                    </EmpButton>
                  </div>
                </div>
              </div>
            </EmpCard>

            {/* Status Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <EmpCard>
                <div className="text-center">
                  <div className="font-mono text-xs text-gray mb-1">[SYSTEM STATUS]</div>
                  <EmpStatus status="online" />
                </div>
              </EmpCard>

              <EmpCard>
                <div className="text-center">
                  <div className="font-mono text-xs text-gray mb-1">[ACTIVE UNITS]</div>
                  <div className="font-mono text-2xl text-cream">05</div>
                </div>
              </EmpCard>

              <EmpCard>
                <div className="text-center">
                  <div className="font-mono text-xs text-gray mb-1">[FACTORY MODE]</div>
                  <div className="font-mono text-sm text-cyan">PRODUCTION</div>
                </div>
              </EmpCard>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <EmpCard className="mb-8">
              <h2 className="font-mono font-black text-2xl text-cream uppercase tracking-wide text-center mb-2">
                Available Units
              </h2>
              <p className="font-mono text-sm text-gray text-center">
                [SELECT TIER TO FILTER]
              </p>
            </EmpCard>

            {/* Grid de empleaidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {empleaidos.map((emp, index) => (
                <EmpCard key={emp.id} withCorners className="relative">
                  {/* Numero de serie */}
                  <div className="absolute -top-2 -left-2 bg-blue-dark border-3 border-cyan px-3 py-1">
                    <span className="font-mono text-sm text-cyan font-bold">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="pt-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-mono text-xs text-gray mb-1">
                            SERIAL #{emp.serial}
                          </div>
                          <h3 className="font-display font-black text-xl text-cream uppercase">
                            {emp.name}
                          </h3>
                        </div>
                        <div className="text-2xl">🤖</div>
                      </div>
                      <EmpRarity tier={emp.tier} />
                    </div>

                    {/* Imagen */}
                    <div className="w-full h-32 bg-blue-dark border-3 border-cyan/50 rounded mb-4 flex items-center justify-center">
                      <div className="text-6xl opacity-50">🤖</div>
                    </div>

                    {/* Info */}
                    <div className="mb-4">
                      <div className="font-bold text-cream mb-1">{emp.role}</div>
                      <div className="font-mono text-sm text-cyan mb-2">
                        {emp.sephirot}
                      </div>
                      <div className="space-y-1">
                        {emp.skills.map((skill, i) => (
                          <div key={i} className="font-mono text-xs text-gray">
                            ■ {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="font-mono text-2xl text-cream font-bold">
                          ${emp.price}
                        </div>
                        <div className="font-mono text-xs text-gray">/month</div>
                      </div>
                      <div className="font-mono text-xs text-gray">USD</div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <EmpButton size="sm" fullWidth>
                        Activate
                      </EmpButton>
                      <EmpButton variant="secondary" size="sm">
                        Info
                      </EmpButton>
                    </div>
                  </div>
                </EmpCard>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <EmpFooter />
      </div>
    </EmpLayout>
  );
}
