'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from './ui/ui-components';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative bg-[#1A434F] py-20 md:py-32 overflow-hidden">
      {/* Background elements with parallax */}
      <div className="absolute inset-0">
        {/* Halftone texture */}
        <div className="absolute inset-0 halftone opacity-10 pointer-events-none" />

        {/* Enhanced starfield */}
        <div className="absolute inset-0 starfield-enhanced opacity-30" />

        {/* Floating planets */}
        <div
          className="absolute top-10 right-10 w-32 h-32 border-4 border-[#5ED3D0]/20 rounded-full parallax-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />
        <div
          className="absolute bottom-20 left-20 w-20 h-20 border-2 border-[#5ED3D0]/10 rounded-full parallax-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E3A41]/50 border-2 border-[#5ED3D0]/50 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#5ED3D0] rounded-full animate-pulse" />
              <Badge size="sm" variant="default" className="border-0">
                POWERED BY SEPHIROT AI
              </Badge>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl text-[#F3E4C8] mb-6 leading-none">
              COLLECTIBLE{' '}
              <span className="text-[#5ED3D0] relative">
                AI EMPLOYEES
                {/* Underline decoration */}
                <span className="absolute -bottom-2 left-0 right-0 h-2 bg-[#5ED3D0]/30 rounded-full" />
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-[#F3E4C8]/80 mb-8 leading-relaxed">
              That <span className="text-[#5ED3D0] font-bold">EVOLVE</span> with every task.
              <br />
              Choose yours. Watch them <span className="text-[#5ED3D0] font-bold">GROW</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="group relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 bg-[#F3E4C8] text-[#0E3A41] font-black text-xl tracking-wider uppercase border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
              >
                {/* Hover effect overlay */}
                <span className="absolute inset-0 bg-[#5ED3D0]/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">⚡ GET STARTED</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="#catalog"
                className="inline-flex items-center gap-2 px-6 py-4 bg-transparent text-[#F3E4C8] font-bold text-xl tracking-wider uppercase border-4 border-[#F3E4C8] hover:border-[#5ED3D0] hover:text-[#5ED3D0] transition-all rounded-xl"
              >
                EXPLORE CATALOG
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center gap-6 text-[#F3E4C8]/60">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">No commitment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">30-day guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-96 h-96">
              {/* Orbital elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central sphere */}
                <div
                  className="w-48 h-48 bg-[#5ED3D0] rounded-3xl border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] flex items-center justify-center relative"
                  style={{
                    transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
                  }}
                >
                  <span className="text-8xl">🤖</span>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-[#5ED3D0]/20 rounded-3xl blur-xl animate-pulse" />
                </div>

                {/* Orbiting elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-[#5ED3D0] rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${(Date.now() / 1000 + i * 120) * (Math.PI / 180)}) translateX(120px) rotate(-${(Date.now() / 1000 + i * 120) * (Math.PI / 180)}) translateX(-50%) translateY(-50%)`
                      }}
                    >
                      <div className="w-full h-full bg-[#5ED3D0] shadow-lg shadow-[#5ED3D0]/50 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative stars */}
              <span className="absolute top-4 right-8 text-[#5ED3D0] text-2xl animate-pulse">✦</span>
              <span className="absolute bottom-8 left-6 text-[#5ED3D0]/60 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
              <span className="absolute top-1/3 left-4 text-[#5ED3D0]/40 text-lg animate-pulse" style={{ animationDelay: '1s' }}>✦</span>
            </div>
          </div>
        </div>

        {/* Side navigation hint */}
        <div className="hidden xl:block absolute left-6 top-1/2 -translate-y-1/2">
          <Link
            href="#catalog"
            className="flex flex-col gap-2 text-[#F3E4C8]/40 hover:text-[#5ED3D0] transition-colors"
          >
            <span className="writing-vertical text-xs tracking-wider uppercase">CATÁLOGO</span>
            <span className="text-lg">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Utility for vertical text
const writingVerticalStyle = {
  writingMode: 'vertical-rl' as const,
  textOrientation: 'mixed' as const
};
