'use client';

/**
 * FACTORY FLOOR NAVIGATION
 *
 * Navegación superior mínima: 3 ítems max
 * Estética retro-industrial
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'CATALOG', id: '01' },
    { href: '/dashboard', label: 'WORKFORCE', id: '02' },
    { href: '/factory', label: 'FACTORY', id: '03' },
  ];

  return (
    <nav className="bg-[#0E3A41] border-b-4 border-[#F3E4C8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* FACTORY ICON */}
            <div className="w-10 h-10 bg-[#F3E4C8] border-2 border-[#5ED3D0]
                            flex items-center justify-center
                            group-hover:bg-[#5ED3D0] transition-colors">
              <span className="text-2xl">🏭</span>
            </div>

            {/* BRAND */}
            <div className="hidden md:block">
              <div className="font-display font-black text-xl text-[#F3E4C8] tracking-wider">
                EMPLEAIDO
              </div>
              <div className="font-mono text-xs text-[#5ED3D0]">
                FACTORY OS v2.1
              </div>
            </div>
          </Link>

          {/* NAV ITEMS */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group"
                >
                  {/* ACTIVE UNDERLINE */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5ED3D0]" />
                  )}

                  {/* NAV ITEM */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="font-mono text-xs text-[#5ED3D0] opacity-50">
                      [{item.id}]
                    </div>
                    <div className={`font-mono text-sm tracking-wider ${
                      isActive ? 'text-[#F3E4C8]' : 'text-gray-500 group-hover:text-[#F3E4C8]'
                    } transition-colors`}>
                      {item.label}
                    </div>
                  </div>

                  {/* HOVER INDICATOR */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5
                                  bg-[#5ED3D0] opacity-0
                                  group-hover:w-full group-hover:opacity-100
                                  transition-all" />
                </Link>
              );
            })}
          </div>

          {/* STATUS INDICATOR */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-[#5ED3D0]">
            <div className="w-2 h-2 bg-green-500 animate-pulse" />
            <div>ONLINE</div>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-1 bg-[#1A434F] overflow-hidden">
        <div className="h-full bg-[#5ED3D0] w-2/3 animate-pulse" />
      </div>
    </nav>
  );
}
