/**
 * ASTROBOY FACTORY HERO - ENHANCED v2.0
 *
 * Modernized with dynamic animations and effects
 * Interactive particle system
 * Mouse-responsive glow effects
 * Smooth scroll animations
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Pre-compute particle positions to avoid Math.random() during render
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  delay: `${(i * 0.15) % 3}s`,
  duration: `${2 + (i * 0.1) % 2}s`,
}));

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Track mouse position for glow effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Track scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] bg-gradient-to-br from-[#0A2A35] via-[#1A434F] to-[#0E3A41] overflow-hidden"
    >
      {/* PARTICLE SYSTEM */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#5ED3D0] rounded-full opacity-30 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* DYNAMIC GLOW EFFECT - Mouse responsive */}
      <div
        className="absolute w-96 h-96 bg-[#5ED3D0] rounded-full blur-3xl opacity-20 transition-all duration-300 pointer-events-none"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          opacity: 0.1 + mousePosition.x * 0.2,
        }}
      />

      {/* ENHANCED HALFTONE OVERLAY */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '6px 6px',
          transform: `translateY(${scrollY * 0.5}px)`,
        }} />
      </div>

      {/* ENHANCED GRID OVERLAY with parallax */}
      <div className="absolute inset-0 opacity-15">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(94, 211, 208, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 211, 208, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * 0.1}px)`,
        }} />
      </div>

      {/* CIRCUIT BOARD PATTERN */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full circuit-pattern" />
      </div>

      {/* ANIMATED SCANLINE EFFECT */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
          backgroundSize: '100% 6px',
          animation: 'scanline 8s linear infinite',
        }} />
      </div>

      {/* ENHANCED DECORATIVE CORNERS with hover effects */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-[#5ED3D0] transition-all duration-300 hover:scale-110" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-[#5ED3D0] transition-all duration-300 hover:scale-110" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-[#5ED3D0] transition-all duration-300 hover:scale-110" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-[#5ED3D0] transition-all duration-300 hover:scale-110" />

      {/* SPEED LINES with animation */}
      <div className="absolute top-1/4 right-0">
        {[32, 24, 16].map((width, i) => (
          <div
            key={i}
            className={`h-2 bg-[#5ED3D0] mb-2 animate-pulse`}
            style={{
              width: `${width}px`,
              opacity: 0.4 - (i * 0.1),
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        {/* ENHANCED EMPLEAIDO HEAD - CENTERPIECE */}
        <div className="relative mb-8 group animate-float">
          {/* MULTILAYER GLOW EFFECT */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5ED3D0] to-[#7DF3F0] blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-1000 animate-pulse" />
          <div className="absolute inset-0 bg-[#5ED3D0] blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-700" />

          {/* MAIN DISPLAY */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-[#5ED3D0] bg-gradient-to-br from-[#0E3A41] to-[#082A31] p-4 shadow-[0_0_30px_rgba(94,211,208,0.3)] hover:shadow-[0_0_50px_rgba(94,211,208,0.5)] transition-all duration-500">
            <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-1000">
              <Image
                src="/empleaido/head-empleaido.png"
                alt="Empleaido Head Unit"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* ENHANCED HUD SCANNER DECORATION */}
            <div className="absolute top-0 left-0 w-4 h-1 bg-[#5ED3D0] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-4 h-1 bg-[#5ED3D0] animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-4 -right-2 w-1 h-8 bg-[#5ED3D0]/30" />
            <div className="absolute bottom-4 -left-2 w-1 h-8 bg-[#5ED3D0]/30" />

            {/* ACTIVITY INDICATORS */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-[#5ED3D0] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>

        {/* ENHANCED HEADER LABEL with animation */}
        <div className="mb-8 flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#5ED3D0]" />
          <div className="font-mono text-sm tracking-[0.3em] text-[#5ED3D0] glow-cyan">
            ⬡ EMPLEAIDO FACTORY ⬡
          </div>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#5ED3D0]" />
        </div>

        {/* ENHANCED MAIN TITLE with gradient effect */}
        <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h1 className="font-display text-7xl md:text-8xl font-black text-[#F3E4C8] mb-4 tracking-tight text-grad-cyan">
            AI WORKFORCE
          </h1>
          <p className="font-mono text-xl md:text-2xl text-[#5ED3D0] tracking-wider animate-glow">
            COLLECTIBLE • UPGRADABLE • YOURS
          </p>
        </div>

        {/* ENHANCED CONTROL PANEL CARDS with hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-5xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
          {/* Card 1 */}
          <div className="group relative bg-gradient-to-br from-[#0E3A41] to-[#082A31] border-2 border-[#F3E4C8] p-6 hover:border-[#5ED3D0] hover:glow-cyan transition-all duration-300 hover-lift">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5ED3D0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="font-mono text-xs text-[#5ED3D0] mb-2">[01]</div>
              <div className="text-[#F3E4C8] font-bold mb-1">5 FOUNDERS</div>
              <div className="font-mono text-sm text-gray-400">Ready for deployment</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-gradient-to-br from-[#0E3A41] to-[#082A31] border-2 border-[#F3E4C8] p-6 hover:border-[#5ED3D0] hover:glow-cyan transition-all duration-300 hover-lift">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5ED3D0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="font-mono text-xs text-[#5ED3D0] mb-2">[02]</div>
              <div className="text-[#F3E4C8] font-bold mb-1">OPENCLAW READY</div>
              <div className="font-mono text-sm text-gray-400">Workspace included</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-gradient-to-br from-[#0E3A41] to-[#082A31] border-2 border-[#F3E4C8] p-6 hover:border-[#5ED3D0] hover:glow-cyan transition-all duration-300 hover-lift">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5ED3D0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="font-mono text-xs text-[#5ED3D0] mb-2">[03]</div>
              <div className="text-[#F3E4C8] font-bold mb-1">LVL 1 → ∞</div>
              <div className="font-mono text-sm text-gray-400">Grow with you</div>
            </div>
          </div>
        </div>

        {/* ENHANCED MAIN CTA with advanced glow */}
        <div className="relative group animate-slide-up" style={{ animationDelay: '0.8s' }}>
          {/* MULTILAYER GLOW EFFECT */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5ED3D0] to-[#7DF3F0] blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-[#F3E4C8] blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

          {/* BUTTON */}
          <Link
            href="#catalog"
            className="relative z-10 block bg-gradient-to-r from-[#F3E4C8] to-[#FFF4D8] text-[#0E3A41] px-12 py-5 border-4 border-[#5ED3D0]
                     font-mono font-bold text-xl tracking-wider
                     hover:bg-gradient-to-r hover:from-[#5ED3D0] hover:to-[#7DF3F0] hover:text-[#0E3A41]
                     hover:border-[#F3E4C8]
                     transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(94,211,208,0.5)]
                     animate-pulse-slow group-hover:animate-none"
          >
            ⬡ INITIALIZE WORKFORCE ⬡
          </Link>
        </div>

        {/* ENHANCED STATUS BAR with live indicators */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#0E3A41] to-[#082A31] border-t-2 border-[#5ED3D0] px-8 py-3">
          <div className="flex items-center justify-between font-mono text-xs text-[#5ED3D0]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>SYS.STATUS: OPERATIONAL</span>
            </div>
            <div>FACTORY.ID: EMPLEAIDO-01</div>
            <div>V:2.1.0-SECURED</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#5ED3D0] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#5ED3D0] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#5ED3D0] rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}