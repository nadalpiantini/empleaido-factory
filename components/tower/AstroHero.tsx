'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AstroHeroProps {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDiagonalLines?: boolean;
  className?: string;
}

export const AstroHero: React.FC<AstroHeroProps> = ({
  isActive = false,
  size = 'md',
  className = '',
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsExecuting(true);
        setTimeout(() => setIsExecuting(false), 1000);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-80 h-80',
  }[size];

  return (
    <div
      className={`astro-hero ${sizeClasses} ${className} ${
        isExecuting ? 'active' : ''
      }`}
    >
      {/* Marco grueso tipo cómic */}
      <div className="absolute inset-0 border-4 border-cream bg-gradient-to-br from-blue-dark to-blue" />

      {/* Esquinas decorativas */}
      <div className="absolute top-2 left-2 w-6 h-6 border-l-3 border-t-3 border-cyan" />
      <div className="absolute top-2 right-2 w-6 h-6 border-r-3 border-t-3 border-cyan" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-3 border-b-3 border-cyan" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-3 border-b-3 border-cyan" />

      {/* Contenedor de la imagen */}
      <div className="relative w-full h-full p-6 flex items-center justify-center">
        <Image
          src="/empleaido/head-empleaido.png"
          alt="Empleaido Astro Hero"
          fill
          className="object-contain grayscale hover:grayscale-0 transition-all duration-500"
          priority
        />

        {/* Indicadores de estado */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm animate-pulse" />
          <div className="w-3 h-3 bg-cyan rounded-sm animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="w-3 h-3 bg-yellow-400 rounded-sm animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Label de estado */}
        <div className="absolute bottom-4 left-4 font-mono text-xs text-cream opacity-70">
          UNIT-01
        </div>

        {/* Status LED */}
        <div className="absolute bottom-4 right-4">
          <div className={`w-4 h-4 rounded-sm ${isActive ? 'bg-cyan animate-pulse' : 'bg-gray-600'}`} />
        </div>
      </div>

      {/* Título hero */}
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <h2 className="font-display font-black text-2xl text-cream uppercase tracking-wider">
          AI WORKFORCE
        </h2>
        <p className="font-mono text-sm text-cyan">
          COMMAND MODULE
        </p>
      </div>
    </div>
  );
};