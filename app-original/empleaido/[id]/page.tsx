import Link from 'next/link';
import empleaidos from '@/data/empleaidos';
import { getSkillLabel } from '@/lib/skills';

export default async function EmpleaidoProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Support both full ID (empleaido-04094) and serial (04094)
  const emp = empleaidos.find((e) => e.id === `empleaido-${id}` || e.id === id || e.serial.toString() === id);

  if (!emp) {
    return (
      <main className="min-h-screen bg-[#0E3A41] flex items-center justify-center">
        <div className="bg-[#1A434F] p-xl rounded-xl border-4 border-[#0E3A41] text-center max-w-lg">
          <span className="text-6xl block mb-lg">🔍</span>
          <h2 className="font-display text-2xl text-[#F3E4C8] mb-md">EMPLEAIDO NO ENCONTRADO</h2>
          <p className="text-[#F3E4C8]/60 mb-xl">Este Empleaido no existe o fue removido del sistema.</p>
          <Link
            href="/"
            className="inline-flex px-xl py-md bg-[#5ED3D0] text-[#0E3A41] font-bold tracking-wider uppercase border-4 border-[#0E3A41]"
          >
            ← VOLVER AL CATÁLOGO
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8]">
      {/* ===== HEADER ===== */}
      <header className="bg-[#F3E4C8] border-b-4 border-[#0E3A41]">
        <div className="max-w-4xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="px-lg py-sm bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
            >
              ← Catálogo
            </Link>
            <div className="flex items-center gap-sm">
              <span className="text-[#0E3A41]/50 text-sm">✦</span>
              <span className="text-[#0E3A41]/50 text-sm">✦</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== PROFILE CARD ===== */}
      <section className="py-xl relative">
        {/* Starfield background */}
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="absolute inset-0 halftone opacity-5" />

        <div className="relative z-10 max-w-4xl mx-auto px-lg">
          <div className="bg-[#1A434F] rounded-xl border-4 border-[#0E3A41] overflow-hidden">
            {/* Profile header with decorative border */}
            <div className="border-b-2 border-[#5ED3D0]/30 px-xl py-lg">
              <div className="flex items-center gap-md mb-md">
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
                <span className="text-[#F3E4C8]/40 text-xs tracking-widest">★ Empleaido Profile ★</span>
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
              </div>

              <div className="flex items-start gap-xl">
                {/* Left: Info */}
                <div className="flex-1">
                  {/* Serial badge */}
                  <div className="inline-flex items-center gap-sm px-md py-xs bg-[#5ED3D0] text-[#0E3A41] rounded mb-md">
                    <span className="w-2 h-2 bg-[#0E3A41] rounded-full" />
                    <span className="text-xs font-bold">#{emp.serial.toString().padStart(5, '0')}</span>
                  </div>

                  {/* Name */}
                  <h1 className="font-display text-5xl text-[#F3E4C8] mb-xs">{emp.name}</h1>
                  <p className="text-xl text-[#F3E4C8]/70 mb-md">{emp.name} – AI Employee</p>

                  {/* Role */}
                  <p className="font-display text-2xl text-[#5ED3D0] mb-md">{emp.role.main}</p>

                  {/* Tags row */}
                  <div className="flex items-center gap-sm mb-lg">
                    <span className="px-md py-xs bg-[#0E3A41] text-[#F3E4C8] text-xs font-bold rounded border-2 border-[#F3E4C8]/20">
                      👤 {emp.role.sub}
                    </span>
                    <span className="px-md py-xs bg-[#0E3A41] text-[#5ED3D0] text-xs font-bold rounded border-2 border-[#5ED3D0]/30">
                      ◉ {emp.sephirot.primary}
                    </span>
                  </div>

                  {/* Motivation quote */}
                  {emp.identity?.motivation && (
                    <p className="text-[#F3E4C8]/60 italic text-lg border-l-4 border-[#5ED3D0]/30 pl-md">
                      &ldquo;{emp.identity.motivation}&rdquo;
                    </p>
                  )}
                </div>

                {/* Right: Mascot */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-[#0E3A41] rounded-xl border-4 border-[#0E3A41] flex items-center justify-center relative">
                    {/* Stars decoration */}
                    <span className="absolute top-2 right-2 text-[#5ED3D0] text-sm">✦</span>
                    <span className="absolute bottom-4 left-4 text-[#5ED3D0]/50 text-xs">✦</span>
                    <span className="text-8xl">🤖</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills section */}
            <div className="px-xl py-lg border-b-2 border-[#0E3A41]/50">
              {/* Included Skills */}
              <div className="mb-lg">
                <div className="flex items-center gap-md mb-md">
                  <div className="h-px flex-1 bg-[#F3E4C8]/10" />
                  <span className="text-[#F3E4C8] text-sm font-bold tracking-wider">✓ Included Skills</span>
                  <div className="h-px flex-1 bg-[#F3E4C8]/10" />
                </div>

                <div className="space-y-sm">
                  {emp.skills.native.map((skill) => (
                    <div key={skill} className="flex items-center gap-sm">
                      <span className="text-[#5ED3D0]">✓</span>
                      <span className="text-[#F3E4C8]">{getSkillLabel(skill)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlockable Skills */}
              <div className="mb-lg">
                <div className="flex items-center gap-md mb-md">
                  <div className="h-px flex-1 bg-[#F3E4C8]/10" />
                  <span className="text-[#F3E4C8]/50 text-sm font-bold tracking-wider">🔒 Unlockable Skills</span>
                  <div className="h-px flex-1 bg-[#F3E4C8]/10" />
                </div>

                <div className="space-y-sm">
                  {emp.skills.locked.map((skill) => (
                    <div key={skill} className="flex items-center gap-sm">
                      <span className="text-[#F3E4C8]/30">🔒</span>
                      <span className="text-[#F3E4C8]/50">{getSkillLabel(skill)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boundaries */}
              {emp.identity?.boundaries && emp.identity.boundaries.length > 0 && (
                <div>
                  <div className="flex items-center gap-md mb-md">
                    <div className="h-px flex-1 bg-yellow-500/20" />
                    <span className="text-yellow-500 text-sm font-bold tracking-wider">⚠️ What I Don&apos;t Do</span>
                    <div className="h-px flex-1 bg-yellow-500/20" />
                  </div>

                  <div className="space-y-sm">
                    {emp.identity.boundaries.map((boundary, i) => (
                      <div key={i} className="flex items-center gap-sm">
                        <span className="text-yellow-500">✕</span>
                        <span className="text-[#F3E4C8]/70">{boundary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing section */}
            <div className="px-xl py-lg bg-[#0E3A41]/50">
              <div className="grid md:grid-cols-2 gap-lg">
                {/* Pricing card */}
                <div className="bg-[#F3E4C8] rounded-xl border-4 border-[#0E3A41] p-lg text-center">
                  <p className="text-[#0E3A41]/60 text-xs tracking-widest uppercase mb-sm">INVERSIÓN MENSUAL</p>
                  <p className="font-display text-5xl text-[#0E3A41] mb-xs">${emp.pricing.monthly_usd}</p>
                  <p className="text-[#0E3A41]/60">por mes</p>

                  {emp.pricing.annual_usd && (
                    <div className="mt-md pt-md border-t-2 border-[#0E3A41]/20">
                      <p className="text-[#0E3A41]/60 text-sm">
                        o ${emp.pricing.annual_usd}/año{' '}
                        <span className="inline-flex px-sm py-xs bg-yellow-500 text-[#0E3A41] text-xs font-bold rounded ml-sm">
                          AHORRA ${((emp.pricing.monthly_usd * 12) - emp.pricing.annual_usd).toFixed(0)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="flex flex-col justify-center">
                  <Link
                    href={`/adopt/${emp.id}`}
                    className="block w-full text-center py-lg bg-[#5ED3D0] text-[#0E3A41] font-black text-xl tracking-wider uppercase border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all mb-md"
                  >
                    ⚡ ADOPTAR A {emp.name} →
                  </Link>

                  <p className="text-[#F3E4C8]/40 text-center text-sm">
                    Sin compromisos. Cancela cuando quieras.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to catalog link */}
          <div className="mt-xl text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-sm px-xl py-md bg-[#1A434F] text-[#F3E4C8] font-bold tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors rounded-full"
            >
              ★ Ver más Empleaidos ★
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1A434F] border-t-4 border-[#0E3A41] py-lg">
        <div className="max-w-4xl mx-auto px-lg text-center">
          <div className="flex items-center justify-center gap-md mb-md">
            <div className="h-px flex-1 bg-[#0E3A41] max-w-32" />
            <span className="text-[#F3E4C8]/40 text-xs tracking-widest">EMPLEAIDO FACTORY</span>
            <div className="h-px flex-1 bg-[#0E3A41] max-w-32" />
          </div>
        </div>
      </footer>
    </main>
  );
}
