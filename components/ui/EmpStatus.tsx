import React from 'react';

interface EmpStatusProps {
  status: 'online' | 'offline' | 'busy' | 'error';
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const EmpStatus: React.FC<EmpStatusProps> = ({
  status,
  label,
  pulse = true,
  className = '',
}) => {
  const statusConfig = {
    online: {
      color: '#10b981', // green
      label: label || 'ONLINE',
      dotClass: 'bg-green-500',
    },
    offline: {
      color: '#6b7280', // gray
      label: label || 'OFFLINE',
      dotClass: 'bg-gray-500',
    },
    busy: {
      color: '#f59e0b', // amber
      label: label || 'BUSY',
      dotClass: 'bg-amber-500',
    },
    error: {
      color: '#ef4444', // red
      label: label || 'ERROR',
      dotClass: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`emp-status ${className}`}>
      <div
        className={`emp-status-dot w-2 h-2 ${config.dotClass} ${
          pulse ? 'animate-pulse' : ''
        }`}
        style={{ backgroundColor: config.color }}
      />
      <span>{config.label}</span>
    </div>
  );
};