'use client';

/**
 * FACTORY FLOOR NAVIGATION - ENHANCED v2.0
 *
 * Modernized navigation with:
 * - Mobile menu with smooth animations
 * - Scroll-based background changes
 * - Enhanced hover effects
 * - Keyboard navigation support
 * - Accessibility improvements
 */

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavigationBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setActiveIndicator] = useState(0);

  const navItems = [
    { href: '/', label: 'CATALOG', id: '01' },
    { href: '/dashboard', label: 'WORKFORCE', id: '02' },
    { href: '/factory', label: 'FACTORY', id: '03' },
  ];

  // Handle scroll for background changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Close mobile menu on pathname change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Active indicator animation
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.href === pathname);
    if (currentIndex !== -1) {
      setActiveIndicator(currentIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- navItems is stable
  }, [pathname]);

  return (
    <nav className={`
      sticky top-0 z-50 transition-all duration-300
      ${isScrolled
        ? 'bg-[#0A2A35]/90 backdrop-blur-md border-b-2 border-[#5ED3D0]'
        : 'bg-[#0E3A41] border-b-4 border-[#F3E4C8]'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* ENHANCED LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ED3D0] rounded-md p-1"
            aria-label="Empleaido Factory Home"
          >
            {/* LOGO CONTAINER */}
            <div className={`
              relative w-10 h-10 flex items-center justify-center overflow-hidden
              ${isScrolled
                ? 'bg-gradient-to-br from-[#F3E4C8] to-[#FFF4D8] border-2 border-[#5ED3D0]'
                : 'bg-[#F3E4C8] border-2 border-[#5ED3D0]'
              }
              group-hover:from-[#5ED3D0] group-hover:to-[#7DF3F0] group-hover:border-[#F3E4C8]
              transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(94,211,208,0.5)] p-1.5
            `}>
              <Image
                src="/empleaido/empleaido-logo-typo.png"
                alt="Empleaido Logo"
                fill
                className="object-contain transition-all duration-300 group-hover:brightness-110"
              />
            </div>

            {/* BRAND */}
            <div className="hidden md:block">
              <div className="font-display font-black text-xl text-[#F3E4C8] tracking-wider uppercase transition-all duration-300 group-hover:text-[#5ED3D0]">
                EMPLEAIDO
              </div>
              <div className="font-mono text-xs text-[#5ED3D0] transition-all duration-300 group-hover:text-[#F3E4C8]">
                FACTORY OS v2.1
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ED3D0] rounded-md px-2 py-1"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {/* NAV ITEM */}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`
                      font-mono text-xs transition-all duration-300
                      ${isActive ? 'text-[#5ED3D0] font-semibold' : 'text-[#5ED3D0]/50 group-hover:text-[#5ED3D0]'}
                    `}>
                      [{item.id}]
                    </div>
                    <div className={`
                      font-mono text-sm tracking-wider transition-all duration-300
                      ${isActive
                        ? 'text-[#F3E4C8] font-semibold'
                        : 'text-gray-500 group-hover:text-[#F3E4C8]'
                      }
                    `}>
                      {item.label}
                    </div>
                  </div>

                  {/* ACTIVE INDICATOR */}
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <div className="w-2 h-2 bg-[#5ED3D0] rounded-full animate-pulse" />
                      <div className="absolute inset-0 bg-[#5ED3D0] rounded-full animate-ping" />
                    </div>
                  )}

                  {/* HOVER EFFECT */}
                  <div className={`
                    absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0.5
                    bg-gradient-to-r from-transparent via-[#5ED3D0] to-transparent
                    group-hover:w-full group-hover:h-1
                    transition-all duration-300
                  `} />
                </Link>
              );
            })}
          </div>

          {/* SEARCH & STATUS BAR */}
          <div className="hidden md:flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                className="w-32 px-3 py-1.5 bg-[#1A434F]/50 border border-[#5ED3D0]/30 rounded-md
                         text-[#F3E4C8] placeholder-gray-500
                         focus:outline-none focus:border-[#5ED3D0] focus:w-48 transition-all duration-300
                         font-mono text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-[#5ED3D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* STATUS INDICATOR */}
            <div className="flex items-center gap-2 font-mono text-xs text-[#5ED3D0]">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="hidden lg:inline">ONLINE</span>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center
                     bg-[#1A434F] border-2 border-[#5ED3D0] rounded-md
                     hover:bg-[#5ED3D0] hover:border-[#F3E4C8]
                     transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ED3D0]"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span className={`
              block w-6 h-0.5 bg-[#F3E4C8] transition-all duration-300
              ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}
            `} />
            <span className={`
              block w-6 h-0.5 bg-[#F3E4C8] mt-1 transition-all duration-300
              ${isMenuOpen ? 'opacity-0' : ''}
            `} />
            <span className={`
              block w-6 h-0.5 bg-[#F3E4C8] mt-1 transition-all duration-300
              ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}
            `} />
          </button>
        </div>
      </div>

      {/* ENHANCED PROGRESS BAR */}
      <div className="h-1 bg-[#1A434F] overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-[#5ED3D0] to-[#7DF3F0] w-2/3 animate-pulse relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Moving indicator */}
        <div className="absolute top-0 left-0 w-4 h-full bg-white/50 animate-slide-right" />
      </div>

      {/* MOBILE MENU */}
      <div className={`
        lg:hidden overflow-hidden transition-all duration-500 ease-in-out
        ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="bg-[#0A2A35]/95 backdrop-blur-md border-t-2 border-[#5ED3D0]">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    block px-4 py-3 rounded-md font-mono text-sm tracking-wider
                    transition-all duration-300
                    ${isActive
                      ? 'bg-[#5ED3D0]/20 text-[#F3E4C8] border border-[#5ED3D0]'
                      : 'text-gray-400 hover:bg-[#1A434F] hover:text-[#F3E4C8] border border-transparent'
                    }
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ED3D0]
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className="text-[#5ED3D0]">[{item.id}]</span>
                  </div>
                </Link>
              );
            })}

            {/* Mobile search */}
            <div className="pt-3 border-t border-[#5ED3D0]/30">
              <input
                type="text"
                placeholder="Search empleaidos..."
                className="w-full px-4 py-2 bg-[#1A434F]/50 border border-[#5ED3D0]/30 rounded-md
                         text-[#F3E4C8] placeholder-gray-500
                         focus:outline-none focus:border-[#5ED3D0]
                         font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Add shimmer animation to global styles or keep it inline
const shimmerStyle = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes slide-right {
    0% { transform: translateX(-100vw); }
    100% { transform: translateX(100vw); }
  }
`;

// Add to globals.css or inject in component
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerStyle;
  document.head.appendChild(style);
}