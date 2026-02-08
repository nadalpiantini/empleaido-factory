import Link from 'next/link';
import empleaidos from '@/data/empleaidos.json';
import { EmpleaidoCard } from './components/EmpleaidoCard';
import { Button, PowerButton, Card, CardContent, Mascot } from './components/ui';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-shadow text-light font-ui overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER — Sticky command bar
      ═══════════════════════════════════════════════════════════════ */}
      <header className="border-b-4 border-shadow bg-mid/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-lg py-md flex items-center justify-between">
          <Link href="/" className="flex items-center gap-md group">
            <div className="relative">
              <Mascot state="idle" size="sm" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan rounded-full led-pulse border-2 border-shadow" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase glitch-hover">
                EMPLEAIDO FACTORY
              </h1>
              <p className="text-xs text-cyan font-mono tracking-wider">
                ▸ AI WORKFORCE COMMAND CENTER
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-md">
            <Link
              href="/backstage"
              className="px-md py-sm text-sm font-bold text-light/80 hover:text-cyan transition-colors duration-fast uppercase tracking-wider"
            >
              Backstage
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="md" starburst>
                Dashboard →
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Maximum visual impact zone
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center starfield diagonal-cut">
        {/* Decorative elements */}
        <div className="absolute inset-0 stripes-diagonal opacity-30" />
        <div className="absolute top-20 left-10 text-6xl opacity-20">✦</div>
        <div className="absolute bottom-40 right-20 text-4xl opacity-30" style={{ animationDelay: '-3s' }}>✦</div>
        <div className="absolute top-1/3 right-10 text-3xl opacity-20" style={{ animationDelay: '-5s' }}>★</div>

        <div className="relative z-10 max-w-6xl mx-auto px-lg py-3xl text-center">
          {/* Floating Mascot - HUGE */}
          <div className="relative inline-block mb-xl ">
            <div className="relative">
              <Mascot state="wave" size="xl" />
              {/* Glow ring behind mascot */}
              <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-cyan/10 blur-3xl" />
              {/* Orbiting stars */}
              <span className="absolute -top-4 -right-4 text-3xl">✦</span>
            </div>
          </div>

          {/* Power Badge */}
          <div className="badge-power mb-lg inline-flex ">
            <span className="w-3 h-3 bg-shadow rounded-full led-pulse" />
            POWERED BY SEPHIROT AI
          </div>

          {/* MEGA Title */}
          <h2 className="text-mega text-power mb-lg">
            <span className="block text-light">COLLECTIBLE</span>
            <span className="block text-gradient">AI EMPLOYEES</span>
          </h2>

          <p className="text-huge text-light/80 max-w-3xl mx-auto mb-2xl font-medium">
            That <span className="text-cyan font-bold">EVOLVE</span> with every task.
            <br />
            Choose yours. Watch them <span className="text-cyan font-bold">GROW</span>.
          </p>

          {/* MEGA CTA Button */}
          <PowerButton href="#catalog">
            EXPLORE CATALOG
          </PowerButton>

          {/* Scroll indicator */}
          <div className="mt-3xl animate-bounce">
            <span className="text-4xl text-cyan">↓</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES — Comic panel style
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-3xl bg-mid">
        {/* Top zigzag border */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-shadow" style={{
          clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)'
        }} />

        <div className="max-w-6xl mx-auto px-lg pt-xl">
          <h3 className="text-huge text-power text-center mb-2xl">
            ¿POR QUÉ <span className="text-cyan">EMPLEAIDOS</span>?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {[
              {
                icon: '🧬',
                title: 'IDENTIDAD ÚNICA',
                desc: 'Cada Empleaido tiene personalidad, habilidades y un camino de crecimiento único.',
              },
              {
                icon: '🎯',
                title: 'DOMINIO EXPERTO',
                desc: 'Especializados en áreas específicas. Sin IA genérica. Expertise real que se acumula.',
              },
              {
                icon: '📈',
                title: 'EVOLUCIÓN CONTINUA',
                desc: 'Aprenden de tu workflow, se adaptan a tu estilo, se vuelven más valiosos.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="card-power bg-light p-xl group"
                style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -2 : 2}deg)` }}
              >
                <div className="text-6xl mb-md  transition-transform duration-med">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-black text-shadow uppercase tracking-wide mb-sm">
                  {feature.title}
                </h4>
                <p className="text-shadow/80 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CATALOG — The main event
      ═══════════════════════════════════════════════════════════════ */}
      <section id="catalog" className="relative py-3xl bg-shadow">
        {/* Halftone overlay */}
        <div className="absolute inset-0 halftone-heavy opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-lg relative z-10">
          {/* Section header */}
          <div className="text-center mb-2xl">
            <div className="inline-block relative">
              <h3 className="text-huge text-power">
                THE FOUNDING <span className="text-cyan">EMPLEAIDOS</span>
              </h3>
              {/* Decorative underline */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-2 bg-cyan rounded-full" />
            </div>
            <p className="text-xl text-light/70 mt-xl font-medium">
              First generation. <span className="text-cyan font-bold">Limited edition</span>. Yours to collect.
            </p>
          </div>

          {/* Empleaido Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
            {empleaidos.map((e) => (
              <EmpleaidoCard
                key={e.id}
                id={e.id}
                name={e.name}
                serial={e.serial}
                role={e.role as { main: string; sub: string; tier: 'base' | 'pro' | 'deluxe' }}
                sephirot={e.sephirot}
                skills={e.skills}
                visual={e.visual}
                pricing={e.pricing}
              />
            ))}
          </div>

          {/* More coming soon */}
          <div className="mt-2xl text-center">
            <div className="inline-flex items-center gap-md px-xl py-lg bg-mid rounded-xl border-4 border-shadow shadow-brutal">
              <Mascot state="thinking" size="sm" />
              <div className="text-left">
                <p className="font-bold text-lg">Más Empleaidos en desarrollo...</p>
                <p className="text-light/60 text-sm">La fábrica nunca duerme ⚡</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA FINAL — Call to action
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-3xl bg-mid diagonal-cut-reverse overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 starfield opacity-50" />
        <div className="absolute top-10 left-1/4 text-8xl opacity-10 ">🚀</div>
        <div className="absolute bottom-20 right-1/4 text-6xl opacity-10 " style={{ animationDelay: '-2s' }}>⭐</div>

        <div className="relative z-10 max-w-4xl mx-auto px-lg text-center">
          {/* Celebrating mascot */}
          <div className="relative inline-block mb-xl">
            <Mascot state="celebrating" size="lg" />
            <span className="absolute -top-2 -right-2 text-4xl starburst">✦</span>
          </div>

          <h3 className="text-huge text-power mb-lg">
            ¿LISTO PARA TU <span className="text-cyan">AI WORKFORCE</span>?
          </h3>

          <p className="text-xl text-light/80 mb-2xl max-w-2xl mx-auto font-medium leading-relaxed">
            Empieza con <span className="text-cyan font-bold">UN Empleaido</span>.
            Míralo crecer. Escala cuando estés listo.
            <br />
            <span className="text-cyan">Sin límites. Sin compromisos.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-lg justify-center items-center">
            <Link href="/dashboard">
              <Button variant="mega" size="xl" starburst>
                🚀 GET STARTED
              </Button>
            </Link>
            <Link href="/backstage">
              <Button variant="secondary" size="lg">
                Ver Backstage →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER — Clean and branded
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t-4 border-cyan/20 py-xl bg-shadow">
        <div className="max-w-7xl mx-auto px-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-lg">
            {/* Logo */}
            <div className="flex items-center gap-md">
              <Mascot state="idle" size="sm" />
              <div>
                <p className="font-black text-lg uppercase tracking-wide">EMPLEAIDO FACTORY</p>
                <p className="text-xs text-light/50 font-mono">v1.0 · Powered by OpenClaw</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-xl text-sm font-medium">
              <a href="#" className="text-light/60 hover:text-cyan transition-colors">Docs</a>
              <a href="#" className="text-light/60 hover:text-cyan transition-colors">API</a>
              <a href="#" className="text-light/60 hover:text-cyan transition-colors">GitHub</a>
            </div>

            {/* Tagline */}
            <p className="text-sm text-light/40 font-mono">
              ✦ TRABAJAR MEJOR, CON UNA SONRISA ✦
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
