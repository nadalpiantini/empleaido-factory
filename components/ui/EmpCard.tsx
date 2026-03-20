import React from 'react';

interface EmpCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'highlight' | 'dark';
  withCorners?: boolean;
  withScanline?: boolean;
}

export const EmpCard: React.FC<EmpCardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  withCorners = false,
  withScanline = false,
}) => {
  const paddingClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  }[padding];

  const variantClasses = {
    default: 'emp-card',
    highlight: 'emp-card bg-gradient-to-b from-[#1A434F] to-[#0E3A41]',
    dark: 'emp-card bg-[#082A31] border-[#5ED3D0]',
  }[variant];

  const cornerClasses = withCorners ? 'emp-hud-corners' : '';
  const scanlineClasses = withScanline ? 'emp-scanline' : '';

  const combinedClasses = `${variantClasses} ${paddingClasses} ${cornerClasses} ${scanlineClasses} ${className}`;

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};