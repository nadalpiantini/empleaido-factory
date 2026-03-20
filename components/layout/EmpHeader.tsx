import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface EmpHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showNav?: boolean;
  className?: string;
}

export const EmpHeader: React.FC<EmpHeaderProps> = ({
  title = 'EMPLEAIDO FACTORY',
  subtitle = 'OS v2.1',
  showLogo = true,
  showNav = true,
  className = '',
}) => {
  const navItems = [
    { href: '/', label: 'CATALOG', id: '01' },
    { href: '/dashboard', label: 'WORKFORCE', id: '02' },
    { href: '/factory', label: 'FACTORY', id: '03' },
  ];

  return (
    <header className={`emp-card border-b-4 border-cyan ${className}`}>
      <div className="flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center gap-4">
          {showLogo && (
            <div className="w-12 h-12 bg-cream border-3 border-cyan flex items-center justify-center">
              <Image
                src="/empleaido/empleaido-logo-typo.png"
                alt="Empleaido"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="font-mono font-black text-xl text-cream uppercase tracking-wider">
              {title}
            </h1>
            <p className="font-mono text-xs text-cyan">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Navegación */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group font-mono text-sm text-gray hover:text-cream transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan/50">[{item.id}]</span>
                  <span>{item.label}</span>
                </div>
                <div className="h-px bg-cyan w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
        )}

        {/* Estado del sistema */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan animate-pulse" />
          <span className="font-mono text-xs text-cyan">ONLINE</span>
        </div>
      </div>

      {/* Barra de progreso del sistema */}
      <div className="mt-4 h-2 bg-blue-dark border border-cyan/30">
        <div className="h-full bg-cyan w-3/4 animate-pulse" />
      </div>
    </header>
  );
};