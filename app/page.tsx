import Link from 'next/link';
import EmpleaidoCard from '@/components/EmpleaidoCard';

// Static empleaidos data
const empleaidos = [
  { id: "empleaido-04094", name: "SERA", role: "Contabilidad RD", level: 1, energy: 100 },
  { id: "empleaido-00313", name: "NEXUS", role: "Growth Marketing", level: 1, energy: 100 },
  { id: "empleaido-00789", name: "OMEGA", role: "CFO Estrategico", level: 1, energy: 100 },
  { id: "empleaido-02568", name: "PIXEL", role: "UX Design", level: 1, energy: 100 },
  { id: "empleaido-01442", name: "SYNC", role: "Productividad Personal", level: 1, energy: 100 },
  { id: "empleaido-03177", name: "GEAR", role: "Operaciones", level: 1, energy: 100 },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F3E4C8] overflow-x-hidden">
      {/* ===== HEADER ===== */}
      <header className="bg-[#F3E4C8] border-b-4 border-[#0E3A41] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#1A434F] rounded-lg border-4 border-[#0E3A41] flex items-center justify-center">
                <span className="text-xl lg:text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="font-display text-xl lg:text-2xl tracking-tight text-[#0E3A41]">
                  EMPLEAIDO FACTORY
                </h1>
                <p className="text-xs text-[#0E3A41]/60 font-medium tracking-wider hidden sm:block">
                  AI WORKFORCE COMMAND CENTER
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3">
              <Link
                href="/backstage"
                className="px-4 py-2 bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
              >
                🎛️ Backstage
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
              >
                📊 Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="bg-[#1A434F] py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5ED3D0] rounded-full mb-6">
                <span className="w-2 h-2 bg-[#0E3A41] rounded-full animate-pulse" />
                <span className="text-[#0E3A41] font-bold text-sm">POWERED BY SEPHIROT AI</span>
              </div>

              <h1 className="font-display text-5xl lg:text-7xl text-[#F3E4C8] mb-6 leading-none">
                COLLECTIBLE{' '}
                <span className="text-[#5ED3D0]">AI EMPLOYEES</span>
              </h1>

              <p className="text-xl lg:text-2xl text-[#F3E4C8] mb-8 leading-relaxed">
                That <span className="text-[#5ED3D0] font-bold">EVOLVE</span> with every task.
                <br />
                Choose yours. Watch them <span className="text-[#5ED3D0] font-bold">GROW</span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#F3E4C8] text-[#0E3A41] font-black text-xl tracking-wider uppercase border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
                >
                  ⚡ GET STARTED →
                </Link>
                <Link
                  href="#catalog"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-transparent text-[#F3E4C8] font-bold text-xl tracking-wider uppercase border-4 border-[#F3E4C8] hover:border-[#5ED3D0] hover:text-[#5ED3D0] transition-all"
                >
                  EXPLORE CATALOG →
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex items-center gap-6 text-[#F3E4C8]">
                <div className="flex items-center gap-2">
                  <span className="text-[#4ADE80]">✓</span>
                  <span className="text-sm">No commitment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4ADE80]">✓</span>
                  <span className="text-sm">Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4ADE80]">✓</span>
                  <span className="text-sm">30-day guarantee</span>
                </div>
              </div>
            </div>

            {/* Right: Robot */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-48 h-48 bg-[#5ED3D0] rounded-3xl border-4 border-[#0E3A41] shadow-[8px_8px_0_#0E3A41] flex items-center justify-center">
                <span className="text-8xl">🤖</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="bg-[#F3E4C8] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-display text-3xl text-center text-[#0E3A41] mb-12 tracking-tight">
            ¿POR QUÉ <span className="text-[#1A434F]">EMPLEAIDOS</span>?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#1A434F] p-8 rounded-lg border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all">
              <div className="w-16 h-16 bg-[#0E3A41] rounded-lg flex items-center justify-center mb-6 border-2 border-[#5ED3D0]/30">
                <span className="text-3xl">🎭</span>
              </div>
              <h4 className="font-display text-xl text-[#F3E4C8] mb-2 tracking-wide">
                IDENTIDAD ÚNICA
              </h4>
              <p className="text-[#F3E4C8]/80 text-sm leading-relaxed">
                Cada Empleaido tiene personalidad, habilidades y un camino de crecimiento.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1A434F] p-8 rounded-lg border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all">
              <div className="w-16 h-16 bg-[#0E3A41] rounded-lg flex items-center justify-center mb-6 border-2 border-[#5ED3D0]/30">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="font-display text-xl text-[#F3E4C8] mb-2 tracking-wide">
                DOMINIO EXPERTO
              </h4>
              <p className="text-[#F3E4C8]/80 text-sm leading-relaxed">
                Especializados en áreas específicas. Sin IA genérica. Expertise real.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1A434F] p-8 rounded-lg border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all">
              <div className="w-16 h-16 bg-[#0E3A41] rounded-lg flex items-center justify-center mb-6 border-2 border-[#5ED3D0]/30">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="font-display text-xl text-[#F3E4C8] mb-2 tracking-wide">
                EVOLUCIÓN CONTINUA
              </h4>
              <p className="text-[#F3E4C8]/80 text-sm leading-relaxed">
                Aprenden de tu workflow, se adaptan a tu estilo, crecen contigo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATALOG ===== */}
      <section id="catalog" className="bg-[#1A434F] py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 flex-1 bg-[#5ED3D0]/30" />
            <h3 className="font-display text-3xl text-[#F3E4C8] tracking-tight">
              ★ THE FOUNDING <span className="text-[#5ED3D0]">EMPLEAIDOS</span> ★
            </h3>
            <div className="h-1 flex-1 bg-[#5ED3D0]/30" />
          </div>
          <p className="text-center text-[#F3E4C8]/80 mb-12">
            First generation. <span className="text-[#5ED3D0]">Limited edition</span>. Yours to collect.
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {empleaidos.map((emp) => (
              <EmpleaidoCard
                key={emp.id}
                id={emp.id}
                name={emp.name}
                role={emp.role}
                level={emp.level}
                energy={emp.energy}
              />
            ))}
          </div>

          {/* More coming */}
          <div className="mt-12 text-center">
            <p className="text-[#F3E4C8]/60 text-sm">
              More Empleaidos in development...
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#F3E4C8] py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="font-display text-4xl text-[#0E3A41] mb-6">
            ¿LISTO PARA TU <span className="text-[#1A434F]">AI WORKFORCE</span>?
          </h3>

          <p className="text-[#0E3A41]/80 text-lg mb-8 max-w-2xl mx-auto">
            Empieza con <span className="font-bold">UN</span> Empleaido. Míralo crecer. Escala cuando estés listo.
            <br />
            <span className="text-[#1A434F] font-bold">Sin límites. Sin compromisos.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A434F] text-[#F3E4C8] font-black text-lg tracking-wider uppercase border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
            >
              ⚡ GET STARTED →
            </Link>
            <Link
              href="/backstage"
              className="inline-flex items-center gap-2 px-6 py-4 bg-transparent text-[#0E3A41] font-bold tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#1A434F] transition-all"
            >
              Ver Backstage →
            </Link>
          </div>
        </div>

        {/* Decoration */}
        <div className="absolute bottom-0 right-6 opacity-20">
          <span className="text-9xl">🤖</span>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1A434F] border-t-4 border-[#0E3A41] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span className="font-display text-lg text-[#F3E4C8]">EMPLEAIDO FACTORY</span>
              <span className="text-[#F3E4C8]/50 text-sm">v1.0</span>
            </div>

            {/* Powered by */}
            <div className="text-[#F3E4C8]/60 text-sm">
              ★ Powered by <span className="text-[#5ED3D0]">OpenClaw</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/docs" className="text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors">
                📄 Docs
              </Link>
              <Link href="/api" className="text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors">
                🔌 API
              </Link>
              <Link href="https://github.com" className="text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors">
                🐙 GitHub
              </Link>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-6 pt-6 border-t border-[#0E3A41]/50 text-center">
            <p className="text-[#F3E4C8]/40 text-xs tracking-widest uppercase">
              ★ TRABAJAR MEJOR, CON UNA SONRISA ★
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
