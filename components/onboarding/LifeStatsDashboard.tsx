'use client';

/**
 * LIFE STATS DASHBOARD
 *
 * Displays Empleaido life progression: Level, XP, Trust, Energy
 */

import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

interface LifeStats {
  level: number;
  experience: number;
  trust: number; // 0-1
  energy: number; // 0-100
}

interface LifeStatsDashboardProps {
  empleaidoId: string;
}

export function LifeStatsDashboard({ empleaidoId }: LifeStatsDashboardProps) {
  const [stats, setStats] = useState<LifeStats>({
    level: 1,
    experience: 0,
    trust: 0,
    energy: 100,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
    try {
      const response = await fetch(`/api/empleaidos/${empleaidoId}/bootstrap/status`);
      const data = await response.json();
      setStats(data.life);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  loadStats();
  }, [empleaidoId]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level & XP */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-700">Nivel</p>
            <p className="text-4xl font-bold text-purple-900">{stats.level}</p>
          </div>
          <div className="flex-1 mx-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-purple-700">Experiencia</span>
              <span className="text-sm font-medium text-purple-900">
                {stats.experience} XP
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((stats.experience % 100), 100)}%` }}
              />
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {100 - (stats.experience % 100)} XP para próximo nivel
            </p>
          </div>
          <div className="text-6xl">⭐</div>
        </div>
      </Card>

      {/* Trust & Energy */}
      <div className="grid grid-cols-2 gap-6">
        {/* Trust */}
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <div className="text-center">
            <div className="text-5xl mb-2">🤝</div>
            <p className="text-sm font-medium text-emerald-700 mb-2">Confianza</p>
            <p className="text-4xl font-bold text-emerald-900 mb-2">
              {Math.round(stats.trust * 100)}%
            </p>
            <div className="w-full bg-emerald-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.trust * 100}%` }}
              />
            </div>
            <p className="text-xs text-emerald-600">
              {getTrustLabel(stats.trust)}
            </p>
          </div>
        </Card>

        {/* Energy */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="text-center">
            <div className="text-5xl mb-2">⚡</div>
            <p className="text-sm font-medium text-amber-700 mb-2">Energía</p>
            <p className="text-4xl font-bold text-amber-900 mb-2">
              {stats.energy}/100
            </p>
            <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stats.energy > 50
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${stats.energy}%` }}
              />
            </div>
            <p className="text-xs text-amber-600">
              {getEnergyLabel(stats.energy)}
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-gray-900">Tarea completada</p>
                <p className="text-sm text-gray-600">OCR de facturas</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Hace 2 horas</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-medium text-gray-900">XP ganada</p>
                <p className="text-sm text-gray-600">+15 XP</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Hace 5 horas</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium text-gray-900">Nivel alcanzado</p>
                <p className="text-sm text-gray-600">Level 2</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Ayer</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function getTrustLabel(trust: number): string {
  if (trust < 0.2) return 'Conociéndose';
  if (trust < 0.5) return 'En desarrollo';
  if (trust < 0.8) return 'Confianza sólida';
  return 'Sociedad establecida';
}

function getEnergyLabel(energy: number): string {
  if (energy > 80) return '¡Lleno de energía!';
  if (energy > 50) return 'Buen nivel';
  if (energy > 20) return 'Necesito descanso';
  return 'Agotado - Descansando';
}
