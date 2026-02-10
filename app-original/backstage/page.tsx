import Link from 'next/link';
import empleaidos from '@/data/empleaidos.json';

// Tier config
const tierConfig = {
  base: { label: 'Base', color: 'text-[#F3E4C8]/70' },
  pro: { label: 'Pro', color: 'text-[#5ED3D0]' },
  deluxe: { label: 'Deluxe', color: 'text-yellow-500' },
};

export default function BackstagePage() {
  const activeEmpleaidos = empleaidos.filter(e => e.status === 'active');
  const inDevelopment = empleaidos.filter(e => e.status === 'draft');

  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8]">
      {/* ===== HEADER ===== */}
      <header className="bg-[#F3E4C8] border-b-4 border-[#0E3A41]">
        <div className="max-w-7xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 bg-[#1A434F] rounded-lg border-4 border-[#0E3A41] flex items-center justify-center">
                <span className="text-2xl">🏭</span>
              </div>
              <div>
                <h1 className="font-display text-2xl tracking-tight text-[#0E3A41]">
                  EMPLEAIDO FACTORY
                </h1>
                <p className="text-xs text-[#0E3A41]/60 font-medium tracking-wider">
                  BACKSTAGE · PRODUCTION MANAGEMENT SYSTEM
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-sm">
              <Link
                href="/"
                className="px-lg py-sm bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
              >
                ← CATÁLOGO
              </Link>
              <Link
                href="/backstage/create"
                className="px-lg py-sm bg-[#5ED3D0] text-[#0E3A41] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:bg-[#F3E4C8] transition-colors"
              >
                + CREAR EMPLEAIDO
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[#1A434F] border-b-4 border-[#0E3A41]">
        <div className="max-w-7xl mx-auto px-lg py-lg">
          <div className="grid grid-cols-3 gap-lg">
            {/* Total */}
            <div className="bg-[#0E3A41] rounded-lg border-4 border-[#0E3A41] p-md text-center">
              <p className="text-[#F3E4C8]/50 text-xs tracking-wider uppercase mb-xs">Empleaidos Totales</p>
              <p className="font-display text-4xl text-[#F3E4C8]">{empleaidos.length}</p>
            </div>

            {/* Active */}
            <div className="bg-[#0E3A41] rounded-lg border-4 border-[#0E3A41] p-md text-center">
              <p className="text-[#F3E4C8]/50 text-xs tracking-wider uppercase mb-xs">Activos en Producción</p>
              <p className="font-display text-4xl text-[#5ED3D0]">{activeEmpleaidos.length}</p>
            </div>

            {/* In Development */}
            <div className="bg-[#0E3A41] rounded-lg border-4 border-[#0E3A41] p-md text-center">
              <p className="text-[#F3E4C8]/50 text-xs tracking-wider uppercase mb-xs">En Desarrollo</p>
              <div className="flex items-center justify-center gap-sm">
                <span className="font-display text-4xl text-[#F3E4C8]/50">{inDevelopment.length}</span>
                <span className="text-[#F3E4C8]/30">|</span>
                <span className="font-display text-4xl text-[#F3E4C8]/50">0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FACTORY STATUS ===== */}
      <section className="bg-[#0E3A41] py-md border-b-2 border-[#1A434F]">
        <div className="max-w-7xl mx-auto px-lg">
          <div className="flex items-center justify-center gap-md">
            <div className="h-px flex-1 bg-[#5ED3D0]/30" />
            <div className="flex items-center gap-md px-lg py-sm bg-[#1A434F] rounded-full border-2 border-[#5ED3D0]">
              <span className="font-display text-sm text-[#F3E4C8] tracking-wider">FÁBRICA OPERANDO</span>
              <span className="text-[#5ED3D0] text-xs">24/7 · PRODUCCIÓN ACTIVA</span>
              <span className="w-2 h-2 bg-[#5ED3D0] rounded-full animate-pulse" />
              <span className="text-[#5ED3D0] font-bold text-sm">ACTIVO</span>
            </div>
            <div className="h-px flex-1 bg-[#5ED3D0]/30" />
          </div>
        </div>
      </section>

      {/* ===== EMPLEAIDO LIST ===== */}
      <section className="py-xl relative">
        {/* Halftone background */}
        <div className="absolute inset-0 halftone opacity-5 pointer-events-none" />
        {/* Starfield */}
        <div className="absolute inset-0 starfield opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-lg">
          <div className="space-y-md">
            {empleaidos.map((emp) => (
              <div
                key={emp.id}
                className="bg-[#1A434F] rounded-xl border-4 border-[#0E3A41] overflow-hidden hover:border-[#5ED3D0] transition-all"
              >
                <div className="p-lg">
                  <div className="flex items-center gap-lg">
                    {/* Mascot */}
                    <div className="w-20 h-20 bg-[#0E3A41] rounded-lg border-2 border-[#0E3A41] flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl">🤖</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Name row */}
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="font-display text-2xl text-[#F3E4C8]">{emp.name}</span>
                        <span className="text-[#5ED3D0]/70 text-sm font-mono">#{emp.serial}</span>
                        <span className="text-[#F3E4C8]/60 italic text-sm ml-sm">{emp.role.main}</span>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-lg text-sm">
                        <div className="flex items-center gap-xs">
                          <span className="text-[#F3E4C8]/50">Tier:</span>
                          <span className={`font-bold ${tierConfig[emp.role.tier as keyof typeof tierConfig].color}`}>
                            {tierConfig[emp.role.tier as keyof typeof tierConfig].label}
                          </span>
                        </div>
                        <span className="text-[#F3E4C8]/30">|</span>
                        <div className="flex items-center gap-xs">
                          <span className="text-[#F3E4C8]/50">Sephirah:</span>
                          <span className="text-[#F3E4C8] font-medium">{emp.sephirot.primary}</span>
                        </div>
                        <span className="text-[#F3E4C8]/30">|</span>
                        <div className="flex items-center gap-xs">
                          <span className="text-[#F3E4C8]/50">Nivel:</span>
                          <span className="text-[#F3E4C8] font-bold">{emp.life.level}</span>
                        </div>
                        <span className="text-[#F3E4C8]/30">|</span>
                        <div className="flex items-center gap-xs">
                          <span className="text-[#F3E4C8]/50">Energía:</span>
                          <span className="text-[#5ED3D0] font-bold">{emp.life.energy}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-sm flex-shrink-0">
                      <Link
                        href={`/backstage/edit/${emp.id.split('-')[1]}`}
                        className="px-lg py-sm bg-[#0E3A41] text-[#F3E4C8] text-sm font-bold tracking-wider uppercase border-2 border-[#F3E4C8]/30 hover:border-[#5ED3D0] hover:text-[#5ED3D0] transition-all rounded"
                      >
                        EDITAR
                      </Link>
                      <Link
                        href={`/empleaido/${emp.id.split('-')[1]}`}
                        className="px-lg py-sm bg-[#0E3A41] text-[#F3E4C8] text-sm font-bold tracking-wider uppercase border-2 border-[#F3E4C8]/30 hover:border-[#5ED3D0] hover:text-[#5ED3D0] transition-all rounded"
                      >
                        VISTA PREVIA
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER STATUS ===== */}
      <footer className="bg-[#1A434F] border-t-4 border-[#0E3A41] py-lg">
        <div className="max-w-7xl mx-auto px-lg">
          {/* System status */}
          <div className="text-center mb-lg">
            <div className="inline-flex items-center gap-md px-xl py-sm bg-[#0E3A41] rounded-full border-2 border-[#0E3A41]">
              <span className="text-[#F3E4C8]/50 text-sm">EMPLEAIDO CORE:</span>
              <span className="text-[#5ED3D0] font-bold text-sm">IDLE</span>
              <span className="text-[#F3E4C8]/30">•</span>
              <span className="text-[#F3E4C8]/50 text-sm">SISTEMA:</span>
              <span className="text-green-500 font-bold text-sm">ESTABLE</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-md mb-lg">
            <div className="h-px flex-1 bg-[#0E3A41]" />
            <span className="text-[#F3E4C8]/40 text-xs tracking-widest">
              EMPLEAIDO FACTORY v1.0 • BACKSTAGE MANAGEMENT
            </span>
            <div className="h-px flex-1 bg-[#0E3A41]" />
          </div>

          {/* Tagline */}
          <p className="text-center text-[#F3E4C8]/30 text-xs tracking-widest uppercase">
            ★ LA FÁBRICA NUNCA DUERME ★
          </p>
        </div>
      </footer>
    </main>
  );
}
