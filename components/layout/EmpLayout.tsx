import React from 'react';

interface EmpLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'dashboard' | 'catalog';
  withProgress?: boolean;
  progressValue?: number;
}

export const EmpLayout: React.FC<EmpLayoutProps> = ({
  children,
  variant = 'default',
  withProgress = false,
  progressValue = 0,
}) => {
  const layoutVariants = {
    default: 'min-h-screen bg-blue-dark',
    dashboard: 'min-h-screen bg-blue-dark',
    catalog: 'min-h-screen bg-blue-dark',
  }[variant];

  return (
    <div className={layoutVariants}>
      {/* Progress bar opcional */}
      {withProgress && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-blue-dark border-b border-cyan/30">
            <div
              className="h-full bg-cyan transition-all duration-300"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      )}

      {/* Grid de fondo retro */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(94, 211, 208, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 211, 208, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};