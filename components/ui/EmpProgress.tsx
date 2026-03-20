import React from 'react';

interface EmpProgressProps {
  value: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export const EmpProgress: React.FC<EmpProgressProps> = ({
  value,
  max = 100,
  label,
  size = 'md',
  showPercentage = false,
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-cream uppercase tracking-wide">
            {label}
          </span>
          {showPercentage && (
            <span className="font-mono text-xs text-cyan">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={`emp-progress ${heightClasses}`}>
        <div
          className="emp-progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};