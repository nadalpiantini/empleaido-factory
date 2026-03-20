import React from 'react';

interface EmpFooterProps {
  className?: string;
  showStatus?: boolean;
}

export const EmpFooter: React.FC<EmpFooterProps> = ({
  className = '',
  showStatus = true,
}) => {
  return (
    <footer className={`emp-card border-t-4 border-cyan mt-auto ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Info del sistema */}
        <div className="flex items-center gap-6 font-mono text-xs text-gray">
          <div className="flex items-center gap-2">
            <span>FACTORY.ID:</span>
            <span className="text-cyan">EMPLEAIDO-01</span>
          </div>
          <div className="flex items-center gap-2">
            <span>V:</span>
            <span className="text-cyan">2.1.0-SECURED</span>
          </div>
          {showStatus && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan animate-pulse" />
              <span className="text-cyan">ACTIVE</span>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="font-mono text-xs text-gray">
          <span>© 2024 EMPLEAIDO FACTORY // ALL RIGHTS RESERVED</span>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan/50" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan/50" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan/50" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan/50" />
    </footer>
  );
};