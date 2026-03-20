import React from 'react';
import { ControlRadar } from '@/components/tower/ControlRadar';
import { EnergyMeter } from '@/components/tower/EnergyMeter';
import { AstroHero } from '@/components/tower/AstroHero';
import { AsteroidMission } from '@/components/tower/AsteroidMission';

// Datos de ejemplo
const missions = [
  {
    id: 1,
    title: 'Procesar facturas Q1',
    description: 'Analizar y clasificar 150 comprobantes de gastos operativos',
    status: 'active' as const,
    priority: 'high' as const,
  },
  {
    id: 2,
    title: 'Generar reporte de ventas',
    description: 'Crear dashboard mensual con métricas clave de performance',
    status: 'pending' as const,
    priority: 'medium' as const,
  },
  {
    id: 3,
    title: 'Optimizar campaña email',
    description: 'Ajustar segmentación y timing para mejorar conversiones',
    status: 'completed' as const,
    priority: 'medium' as const,
  },
];

const empleaidos = [
  {
    id: 'conta-01',
    name: 'CONTA-01',
    role: 'Contabilidad RD',
    tier: 'base' as const,
    status: 'active',
  },
  {
    id: 'growth-02',
    name: 'GROWTH-02',
    role: 'Growth Marketing',
    tier: 'pro' as const,
    status: 'idle',
  },
  {
    id: 'cfo-03',
    name: 'CFO-03',
    role: 'CFO Estratégico',
    tier: 'deluxe' as const,
    status: 'active',
  },
];

export default function TowerControlPage() {
  return (
    <>
      <div className="control-tower">
        <div className="control-tower-layout">
          {/* ÁREA 1: RADAR + STATUS */}
          <div className="control-radar-area">
            <div className="control-panel">
              <div className="flex flex-col items-center gap-4">
                <ControlRadar size="md" />
                <div className="text-center">
                  <div className="font-mono text-xs text-cream opacity-70 mb-1">
                    SYSTEM RADAR
                  </div>
                  <div className="font-mono text-sm text-cyan font-bold">
                    ALL SECTORS CLEAR
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ÁREA 2: STATUS GLOBAL */}
          <div className="control-status-area">
            <div className="control-panel">
              <h2 className="font-mono font-black text-lg text-cream uppercase tracking-wide mb-4">
                Command Status
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-mono text-xs text-gray mb-1">ACTIVE UNITS</div>
                  <div className="font-mono text-2xl text-cream font-bold">03</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xs text-gray mb-1">MISSIONS</div>
                  <div className="font-mono text-2xl text-cream font-bold">12</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xs text-gray mb-1">COMPLETED</div>
                  <div className="font-mono text-2xl text-green-400 font-bold">09</div>
                </div>
              </div>
            </div>
          </div>

          {/* ÁREA 3: CONTROLES */}
          <div className="control-controls-area">
            <div className="control-panel">
              <h3 className="font-mono font-black text-lg text-cream uppercase tracking-wide mb-4">
                Power Controls
              </h3>

              <div className="space-y-4">
                <EnergyMeter value={85} label="SYSTEM POWER" />
                <EnergyMeter value={72} label="AI CORE" />
                <EnergyMeter value={91} label="DATA LINK" />
              </div>

              {/* Botones de control físico */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                </div>
                <div className="font-mono text-xs text-cream opacity-70">
                  CONTROL ENGAGED
                </div>
              </div>
            </div>
          </div>

          {/* ÁREA 4: HERO */}
          <div className="control-hero-area">
            <div className="control-panel">
              <AstroHero />
            </div>
          </div>

          {/* ÁREA 5: MISIONES */}
          <div className="control-missions-area">
            <div className="control-panel">
              <h3 className="font-mono font-black text-lg text-cream uppercase tracking-wide mb-4">
                Active Missions
              </h3>
              <div className="space-y-3">
                {missions.map((mission) => (
                  <AsteroidMission
                    key={mission.id}
                    title={mission.title}
                    description={mission.description}
                    status={mission.status}
                    priority={mission.priority}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ÁREA 6: EMPLEAIDOS */}
          <div className="control-empleaidos-area">
            <div className="control-panel">
              <h3 className="font-mono font-black text-lg text-cream uppercase tracking-wide mb-4">
                Active Empleaidos
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {empleaidos.map((empleaido) => (
                  <div
                    key={empleaido.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]/50 border border-[#333] transition-all hover:border-cyan"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        empleaido.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      } animate-pulse`}
                    ></div>
                    <div>
                      <div className="font-mono text-sm text-cream font-bold">
                        {empleaido.name}
                      </div>
                      <div className="font-mono text-xs text-gray">
                        {empleaido.role} • {empleaido.tier}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}