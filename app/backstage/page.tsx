import Link from 'next/link';
import empleaidos from '@/data/empleaidos.json';
import { Button, Card, CardHeader, CardContent, Mascot } from '../components/ui';

// Status indicator - POWER VERSION
function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative">
      <span
        className={`block w-4 h-4 rounded-full ${
          active ? 'bg-success' : 'bg-light/30'
        } border-2 border-shadow`}
      />
      {active && (
        <span className="absolute inset-0 rounded-full bg-success led-pulse" />
      )}
    </span>
  );
}

function getRoleEmoji(role: string): string {
  const map: Record<string, string> = {
    'Contabilidad RD': '🧾',
    'Growth Marketing': '📣',
    'Operaciones': '🗂️',
    'CFO Estrategico': '💰',
    'Productividad Personal': '⏱️',
    'UX Design': '🎨',
  };
  return map[role] || '🤖';
}

export default function Backstage() {
  const activeCount = empleaidos.filter(e => e.status === 'active').length;
  const draftCount = empleaidos.filter(e => e.status !== 'active').length;

  return (
    <main className="min-h-screen bg-shadow text-light font-ui">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER — Factory Command Bar
      ═══════════════════════════════════════════════════════════════ */}
      <header className="border-b-4 border-shadow bg-mid sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🏭</div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                  BACKSTAGE
                  <span className="text-cyan">/</span>
                  FÁBRICA
                </h1>
                <p className="text-sm text-cyan font-mono">▸ PRODUCTION MANAGEMENT SYSTEM</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/">
                <Button variant="ghost" size="md">
                  ← Catálogo
                </Button>
              </Link>
              <Link href="/backstage/create">
                <Button variant="power" size="md" starburst>
                  + CREAR EMPLEAIDO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          STATS BAR — Control Panel
      ═══════════════════════════════════════════════════════════════ */}
      <div className="border-b-4 border-shadow/50 bg-mid/80 relative overflow-hidden">
        <div className="absolute inset-0 stripes-diagonal opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-lg py-lg relative z-10">
          <div className="flex gap-12">
            {/* Total */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-shadow flex items-center justify-center border-4 border-shadow shadow-brutal">
                <span className="text-3xl font-black text-cyan">{empleaidos.length}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-light/50 uppercase tracking-wider">Total</p>
                <p className="text-lg font-black uppercase">Empleaidos</p>
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-success/20 flex items-center justify-center border-4 border-success/30 shadow-brutal">
                <span className="text-3xl font-black text-success">{activeCount}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-light/50 uppercase tracking-wider">Activos</p>
                <p className="text-lg font-black uppercase text-success">En Producción</p>
              </div>
            </div>

            {/* Draft */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-warning/20 flex items-center justify-center border-4 border-warning/30 shadow-brutal">
                <span className="text-3xl font-black text-warning">{draftCount}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-light/50 uppercase tracking-wider">Borrador</p>
                <p className="text-lg font-black uppercase text-warning">En Desarrollo</p>
              </div>
            </div>

            {/* Mascot */}
            <div className="ml-auto flex items-center gap-4">
              <Mascot state="working" size="md" />
              <div>
                <p className="text-sm font-bold">Fábrica Operando</p>
                <p className="text-xs text-cyan font-mono">24/7 PRODUCTION</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT — Production Grid
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-lg py-xl relative">
        {/* Background texture */}
        <div className="absolute inset-0 halftone-heavy opacity-5 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {empleaidos.map((e, i) => (
            <div
              key={e.id}
              className="card-power bg-light overflow-hidden group"
              style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
            >
              {/* Header */}
              <div className="p-6 border-b-4 border-shadow/10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusDot active={e.status === 'active'} />
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      e.status === 'active' ? 'text-success' : 'text-warning'
                    }`}>
                      {e.status === 'active' ? 'ACTIVO' : 'BORRADOR'}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-shadow uppercase">{e.name}</h2>
                  <p className="text-sm text-cyan font-mono font-bold">#{e.serial}</p>
                </div>
                <span className="text-4xl  transition-transform duration-med">
                  {getRoleEmoji(e.role.main)}
                </span>
              </div>

              {/* Role */}
              <div className="px-6 py-4 bg-light border-b-4 border-shadow/10">
                <p className="text-lg font-bold text-shadow">{e.role.main}</p>
              </div>

              {/* Stats - Control Panel Style */}
              <div className="p-6 bg-mid space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-light/60 uppercase">Tier</span>
                  <span className={`px-3 py-1 rounded text-xs font-black uppercase border-2 border-shadow ${
                    e.role.tier === 'deluxe' ? 'bg-warning text-shadow' :
                    e.role.tier === 'pro' ? 'bg-cyan text-shadow' :
                    'bg-light text-shadow'
                  }`}>
                    {e.role.tier}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-light/60 uppercase">Sephirah</span>
                  <span className="text-sm font-bold text-cyan">{e.sephirot.primary}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-light/60 uppercase">Level</span>
                  <span className="text-2xl font-black text-light">{e.life.level}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-light/60 uppercase">Energy</span>
                    <span className="text-sm font-bold text-cyan">{e.life.energy}%</span>
                  </div>
                  <div className="h-3 bg-shadow rounded-full overflow-hidden border-2 border-shadow">
                    <div
                      className="h-full bg-cyan rounded-full"
                      style={{ width: `${e.life.energy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-light flex gap-3">
                <Link href={`/backstage/edit/${e.id}`} className="flex-1">
                  <Button variant="secondary" size="md" className="w-full">
                    ✏️ EDITAR
                  </Button>
                </Link>
                <Link href={`/empleaido/${e.id}`} className="flex-1">
                  <Button variant="primary" size="md" className="w-full" starburst>
                    👁️ PREVIEW
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER — Factory Status
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t-4 border-shadow/50 py-lg bg-mid">
        <div className="max-w-7xl mx-auto px-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Mascot state="idle" size="sm" />
            <p className="text-sm font-mono text-light/50">
              EMPLEAIDO FACTORY v1.0 · BACKSTAGE MANAGEMENT
            </p>
          </div>
          <p className="text-sm text-cyan font-mono">
            ✦ LA FÁBRICA NUNCA DUERME ✦
          </p>
        </div>
      </footer>
    </main>
  );
}
