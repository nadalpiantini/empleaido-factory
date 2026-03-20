'use client';

import React, { useEffect, useState } from 'react';

interface EnergyMeterProps {
  value?: number; // 0-100
  autoAnimate?: boolean;
  className?: string;
  label?: string;
}

export const EnergyMeter: React.FC<EnergyMeterProps> = ({
  value = 75,
  autoAnimate = true,
  className = '',
  label = 'POWER',
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, autoAnimate ? 500 : 0);
    return () => clearTimeout(timer);
  }, [value, autoAnimate]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <div className="font-mono text-xs text-cream opacity-70">
          {label}
        </div>
      )}
      <div className="energy-meter">
        <div
          className="energy-level"
          style={{ height: `${currentValue}%` }}
        />
      </div>
      <div className="font-mono text-sm text-cyan font-bold">
        {Math.round(currentValue)}%
      </div>
    </div>
  );
};