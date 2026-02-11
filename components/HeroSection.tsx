/**
 * ASTROBOY FACTORY HERO
 *
 * Command Center Retro - Hero 16:9
 * Fondo plano #1A434F + halftone sutil
 * Panel de control + glow cian
 */

import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] bg-[#1A434F] overflow-hidden">
      {/* HALFTONE OVERLAY */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '8px 8px'
        }} />
      </div>

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(94, 211, 208, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 211, 208, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* SCANLINE EFFECT */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 4px'
        }} />
      </div>

      {/* DECORATIVE CORNERS */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-[#5ED3D0]" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-[#5ED3D0]" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-[#5ED3D0]" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-[#5ED3D0]" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        {/* EMPLEAIDO HEAD - CENTERPIECE */}
        <div className="relative mb-8 group">
          {/* BACKGROUND GLOW */}
          <div className="absolute inset-0 bg-[#5ED3D0] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

          <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-[#5ED3D0] bg-[#0E3A41] p-4 shadow-[0_0_30px_rgba(94,211,208,0.2)]">
            <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-500">
              <Image
                src="/empleaido/head-empleaido.png"
                alt="Empleaido Head Unit"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* HUD SCANNER DECORATION */}
            <div className="absolute top-0 left-0 w-4 h-1 bg-[#5ED3D0] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-4 h-1 bg-[#5ED3D0] animate-pulse" />
            <div className="absolute top-4 -right-2 w-1 h-8 bg-[#5ED3D0]/30" />
          </div>
        </div>

        {/* HEADER LABEL */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px w-20 bg-[#5ED3D0]" />
          <div className="font-mono text-sm tracking-[0.3em] text-[#5ED3D0]">
            ⬡ EMPLEAIDO FACTORY ⬡
          </div>
          <div className="h-px w-20 bg-[#5ED3D0]" />
        </div>

        {/* MAIN TITLE */}
        <div className="text-center mb-12">
          <h1 className="font-display text-7xl md:text-8xl font-black text-[#F3E4C8] mb-4 tracking-tight">
            AI WORKFORCE
          </h1>
          <p className="font-mono text-xl md:text-2xl text-[#5ED3D0] tracking-wider">
            COLLECTIBLE • UPGRADABLE • YOURS
          </p>
        </div>

        {/* CONTROL PANEL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
          {/* Card 1 */}
          <div className="bg-[#0E3A41] border-2 border-[#F3E4C8] p-6 hover:shadow-[0_0_20px_rgba(94,211,208,0.3)] transition-shadow">
            <div className="font-mono text-xs text-[#5ED3D0] mb-2">[01]</div>
            <div className="text-[#F3E4C8] font-bold mb-1">5 FOUNDERS</div>
            <div className="font-mono text-sm text-gray-400">Ready for deployment</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0E3A41] border-2 border-[#F3E4C8] p-6 hover:shadow-[0_0_20px_rgba(94,211,208,0.3)] transition-shadow">
            <div className="font-mono text-xs text-[#5ED3D0] mb-2">[02]</div>
            <div className="text-[#F3E4C8] font-bold mb-1">OPENCLAW READY</div>
            <div className="font-mono text-sm text-gray-400">Workspace included</div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0E3A41] border-2 border-[#F3E4C8] p-6 hover:shadow-[0_0_20px_rgba(94,211,208,0.3)] transition-shadow">
            <div className="font-mono text-xs text-[#5ED3D0] mb-2">[03]</div>
            <div className="text-[#F3E4C8] font-bold mb-1">LVL 1 → ∞</div>
            <div className="font-mono text-sm text-gray-400">Grow with you</div>
          </div>
        </div>

        {/* MAIN CTA WITH GLOW */}
        <div className="relative">
          {/* GLOW EFFECT */}
          <div className="absolute inset-0 bg-[#5ED3D0] blur-xl opacity-50" />

          {/* BUTTON */}
          <Link
            href="#catalog"
            className="relative z-10 block bg-[#F3E4C8] text-[#0E3A41] px-12 py-5 border-4 border-[#5ED3D0]
                     font-mono font-bold text-xl tracking-wider
                     hover:bg-[#5ED3D0] hover:text-[#0E3A41]
                     transition-all duration-200"
          >
            ⬡ INITIALIZE WORKFORCE ⬡
          </Link>
        </div>

        {/* STATUS BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0E3A41] border-t-2 border-[#5ED3D0] px-8 py-3">
          <div className="flex items-center justify-between font-mono text-xs text-[#5ED3D0]">
            <div>SYS.STATUS: OPERATIONAL</div>
            <div>FACTORY.ID: EMPLEAIDO-01</div>
            <div>V:2.1.0-SECURED</div>
          </div>
        </div>
      </div>

      {/* SPEED LINES DECORATION */}
      <div className="absolute top-1/4 right-0 w-32 h-2 bg-[#5ED3D0] opacity-30" />
      <div className="absolute top-1/4 right-0 w-24 h-2 bg-[#5ED3D0] opacity-20" />
      <div className="absolute top-1/4 right-0 w-16 h-2 bg-[#5ED3D0] opacity-10" />
    </section>
  );
}
