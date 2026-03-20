import React from 'react';

interface EmpRarityProps {
  tier: 'base' | 'pro' | 'deluxe';
  className?: string;
  showIcon?: boolean;
}

export const EmpRarity: React.FC<EmpRarityProps> = ({
  tier,
  className = '',
  showIcon = true,
}) => {
  const rarityConfig = {
    base: {
      label: 'BASE',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-400',
      icon: '●',
    },
    pro: {
      label: 'PRO',
      color: 'text-purple-400',
      borderColor: 'border-purple-400',
      icon: '◆',
    },
    deluxe: {
      label: 'DELUXE',
      color: 'text-yellow-400',
      borderColor: 'border-yellow-400',
      icon: '★',
    },
  };

  const config = rarityConfig[tier];

  return (
    <div className={`emp-rarity ${config.borderColor} ${config.color} ${className}`}>
      {showIcon && <span className="mr-2">{config.icon}</span>}
      {config.label}
    </div>
  );
};