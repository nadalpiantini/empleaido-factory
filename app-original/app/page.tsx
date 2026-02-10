/**
 * FACTORY FLOOR HOME
 *
 * Dashboard modular tipo fábrica
 * Grid rígido (8px base)
 * Cards con numeración visible
 */

import { HeroSection } from '../components/HeroSection';
import { EmpleaidoCard } from '../components/EmpleaidoCard';
import catalogData from '../../data/empleaidos.json';
import type { Empleaido } from '@/lib/types';

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
            [UNITS: 05/05]
          </div>
          <div className="font-mono text-xs text-[#5ED3D0]">
            STATUS: ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </section>

      {/* FACTORY STATUS PANEL */}
      <section className="bg-[#0E3A41] border-t-4 border-[#F3E4C8] py-12 px-8">
        <div className="max-w-7xl mx-auto">
          {/* PANEL HEADER */}
          <div className="flex items-center gap-6 mb-8">
            <div className="font-mono text-xs text-[#5ED3D0] tracking-[0.3em]">
              ◄[FACTORY STATUS]►
            </div>
            <div className="h-px flex-1 bg-[#5ED3D0]" />
          </div>

          {/* STATUS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Status Card 1 */}
            <div className="bg-[#1A434F] border-2 border-[#F3E4C8] p-6">
              <div className="font-mono text-xs text-[#5ED3D0] mb-2">[01]</div>
              <div className="text-[#F3E4C8] font-bold mb-1">PRODUCTION</div>
              <div className="font-mono text-sm text-green-500">ACTIVE</div>
            </div>

            {/* Status Card 2 */}
            <div className="bg-[#1A434F] border-2 border-[#F3E4C8] p-6">
              <div className="font-mono text-xs text-[#5ED3D0] mb-2">[02]</div>
              <div className="text-[#F3E4C8] font-bold mb-1">WORKSPACES</div>
              <div className="font-mono text-sm text-[#5ED3D0]">05 UNITS</div>
            </div>

            {/* Status Card 3 */}
            <div className="bg-[#1A434F] border-2 border-[#F3E4C8] p-6">
              <div className="font-mono text-xs text-[#5ED3D0] mb-2">[03]</div>
              <div className="text-[#F3E4C8] font-bold mb-1">OPENCLAW</div>
              <div className="font-mono text-sm text-green-500">CONNECTED</div>
            </div>

            {/* Status Card 4 */}
            <div className="bg-[#1A434F] border-2 border-[#F3E4C8] p-6">
              <div className="font-mono text-xs text-[#5ED3D0] mb-2">[04]</div>
              <div className="text-[#F3E4C8] font-bold mb-1">SYSTEM</div>
              <div className="font-mono text-sm text-[#5ED3D0]">V2.1.0</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A434F] border-t-2 border-[#0E3A41] py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-[#5ED3D0]">
              &copy; 2026 EMPLEAIDO FACTORY • ALL SYSTEMS NOMINAL
            </div>
            <div className="font-mono text-xs text-gray-500">
              LABORATORY ID: ASTROBOY-01
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
