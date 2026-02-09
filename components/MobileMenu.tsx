'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-[#1A434F] text-[#F3E4C8] border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-center gap-1">
          <span className={cn(
            'block h-0.5 bg-[#F3E4C8] transition-all duration-300',
            isOpen ? 'rotate-45 translate-y-1.5' : ''
          )} />
          <span className={cn(
            'block h-0.5 bg-[#F3E4C8] transition-all duration-300',
            isOpen ? 'opacity-0' : ''
          )} />
          <span className={cn(
            'block h-0.5 bg-[#F3E4C8] transition-all duration-300',
            isOpen ? '-rotate-45 -translate-y-1.5' : ''
          )} />
        </div>
      </button>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-[#1A434F]/95 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Menu content */}
        <div className={cn(
          'absolute top-20 left-0 right-0 bg-[#1A434F] border-t-4 border-[#0E3A41] transition-transform duration-300',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}>
          <nav className="flex flex-col p-6 space-y-4">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-[#1A434F] text-[#F3E4C8] font-bold text-lg tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-all"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/backstage"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-[#1A434F] text-[#F3E4C8] font-bold text-lg tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-all"
            >
              🎛️ Backstage
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-[#1A434F] text-[#F3E4C8] font-bold text-lg tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-all"
            >
              📦 Catalog
            </Link>
            <Link
              href="/docs"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-[#1A434F] text-[#F3E4C8] font-bold text-lg tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-all"
            >
              📄 Docs
            </Link>
          </nav>

          {/* Footer in mobile menu */}
          <div className="mt-auto p-6 border-t-2 border-[#0E3A41]/50">
            <p className="text-[#F3E4C8]/40 text-xs text-center">
              ★ TRABAJAR MEJOR, CON UNA SONRISA ★
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function for the cn utility
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
