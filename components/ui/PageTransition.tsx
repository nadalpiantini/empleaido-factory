'use client';

import { useEffect, useState } from 'react';
import { Loading } from './ui-components';

interface PageTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function PageTransition({ children, isLoading = false }: PageTransitionProps) {
  const [showContent, setShowContent] = useState(!isLoading);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowContent(false);
      setIsTransitioning(false);
    } else {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setShowContent(true);
        setIsTransitioning(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="relative min-h-screen">
      {/* Loading overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-[#1A434F] z-50 flex items-center justify-center transition-opacity duration-300',
          showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      >
        <div className="text-center">
          <Loading size="lg" className="mx-auto mb-4" />
          <p className="text-[#F3E4C8]/60 text-sm tracking-wider uppercase">Cargando...</p>
        </div>
      </div>

      {/* Page content */}
      <div
        className={cn(
          'transition-all duration-500 ease-out',
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Helper function for the cn utility
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
