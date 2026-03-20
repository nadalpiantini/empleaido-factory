import React from 'react';

interface ControlRadarProps {
  size?: 'sm' | 'md' | 'lg';
  pulseSpeed?: number; // seconds
  className?: string;
}

export const ControlRadar: React.FC<ControlRadarProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-30 h-30',
    lg: 'w-40 h-40',
  }[size];

  return (
    <div className={`control-radar ${sizeClasses} ${className} cyan-pulse`}>
      {/* Texto de estado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-xs text-cream opacity-70">
            SCANNING
          </div>
          <div className="font-mono text-sm text-cyan font-bold">
            ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
};