import React from 'react';

interface AsteroidMissionProps {
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  className?: string;
}

export const AsteroidMission: React.FC<AsteroidMissionProps> = ({
  title,
  description,
  status,
  priority = 'medium',
  className = '',
}) => {
  const statusColors = {
    pending: 'border-gray-600 text-gray-400',
    active: 'border-cyan text-cyan',
    completed: 'border-green-500 text-green-400',
  }[status];

  const priorityGlow = {
    low: 'hover:shadow-[0_0_10px_rgba(94,211,208,0.2)]',
    medium: 'hover:shadow-[0_0_20px_rgba(94,211,208,0.4)]',
    high: 'hover:shadow-[0_0_30px_rgba(94,211,208,0.6)]',
  }[priority];

  const statusDot = {
    pending: 'bg-gray-600',
    active: 'bg-cyan animate-pulse',
    completed: 'bg-green-500',
  }[status];

  return (
    <div className={`asteroid-card group ${statusColors} ${priorityGlow} ${className}`}>
      {/* Header de misión */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 ${statusDot} rounded-sm`} />
          <h3 className="font-mono font-bold text-cream text-sm uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div className="font-mono text-xs text-gray">
          [{status.toUpperCase()}]
        </div>
      </div>

      {/* Descripción */}
      <p className="font-mono text-xs text-gray leading-relaxed mb-4">
        {description}
      </p>

      {/* Footer con acciones */}
      <div className="flex items-center justify-between">
        <div className="font-mono text-xs text-cyan opacity-70">
          PRIORITY: {priority.toUpperCase()}
        </div>
        <button className="font-mono text-xs text-cream hover:text-cyan transition-colors">
          ENGAGE →
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-2 right-2 font-mono text-xs text-gray opacity-50">
        ▲
      </div>
      <div className="absolute bottom-2 left-2 font-mono text-xs text-gray opacity-50">
        ▼
      </div>
    </div>
  );
};