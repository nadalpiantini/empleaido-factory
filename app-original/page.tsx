/**
 * FACTORY FLOOR HOME - ASTROBOY LABORATORY
 *
 * Dashboard modular tipo fábrica
 * Grid rígido (8px base)
 * Cards con numeración visible
 */

import { HeroSection } from './components/HeroSection';
import { EmpleaidoCard } from './components/EmpleaidoCard';
import catalogData from '../data/empleaidos.json';
import type { Empleaido } from '../lib/types';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#1A434F]">
      {/* HERO */}
      <HeroSection />

      {/* CATALOG SECTION */}
      <section className="relative py-20 px-8">
        {/* SECTION HEADER */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center gap-6 mb-4">
            <div className="font-mono text-xs text-[#5ED3D0] tracking-[0.3em]">
              ◄[SECTION 01]►
            </div>
            <div className="h-px flex-1 bg-[#5ED3D0]" />
          </div>

          <h2 className="font-display text-5xl font-black text-[#F3E4C8] mb-4">
            WORKFORCE CATALOG
          </h2>

          <div className="font-mono text-sm text-[#5ED3D0] max-w-2xl">
            &gt; SELECT YOUR AI EMPLOYEE. ALL UNITS COME WITH OPENCLAW WORKSPACE INCLUDED.
          </div>
        </div>

        {/* CATALOG GRID - RIGID 8px GRID */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(catalogData as Empleaido[]).map((empleaido, index) => (
              <EmpleaidoCard
                key={empleaido.id}
                id={empleaido.id}
                serial={empleaido.serial}
                name={empleaido.name}
                role={empleaido.role}
                sephirot={empleaido.sephirot}
                skills={empleaido.skills}
                pricing={empleaido.pricing}
                index={index + 1}
              />
            ))}
          </div>
        </div>

        {/* SECTION FOOTER */}
        <div className="max-w-7xl mx-auto mt-16 flex items-center justify-between">
          <div className="font-mono text-xs text-[#5ED3D0]">
            [SYS.STATUS: ALL UNITS OPERATIONAL]
          </div>
          <div className="font-mono text-xs text-[#5ED3D0]">
            ◄[PAGE 01]►
          </div>
        </div>
      </section>
    </main>
  );
}
