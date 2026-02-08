import Link from 'next/link';
import empleaidos from '@/data/empleaidos.json';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Mascot,
  MascotWithMessage,
} from '../components/ui';

// Demo user for v1
const DEMO_USER = 'user-demo';

// Status indicator component - POWER VERSION
function StatusIndicator({ status }: { status: 'online' | 'thinking' | 'error' }) {
  const colors = {
    online: 'bg-success',
    thinking: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <span className={`relative w-3 h-3 rounded-full ${colors[status]}`}>
      <span className={`absolute inset-0 rounded-full ${colors[status]} led-pulse`} />
      <span className={`absolute -inset-1 rounded-full ${colors[status]} opacity-30 animate-ping`} />
    </span>
  );
}

// Navigation item component - POWER VERSION
function NavItem({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active?: boolean;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider
        transition-all duration-fast border-2
        ${active
          ? 'bg-cyan text-shadow border-shadow shadow-brutal'
          : 'text-light/70 border-transparent hover:text-cyan hover:bg-shadow/50 hover:border-cyan/30'
        }
      `}
    >
      <span className="text-xl">{icon}</span>
      {children}
    </Link>
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

export default function Dashboard() {
  const adoptedEmpleaidos = empleaidos;

  return (
    <main className="min-h-screen bg-shadow text-light font-ui flex">
      {/* ═══════════════════════════════════════════════════════════════
          SIDEBAR — Command Station
      ═══════════════════════════════════════════════════════════════ */}
      <aside className="w-72 bg-mid p-6 flex flex-col gap-8 border-r-4 border-shadow relative overflow-hidden">
        {/* Decorative starfield */}
        <div className="absolute inset-0 starfield opacity-30 pointer-events-none" />

        {/* Logo with Mascot - POWER */}
        <Link href="/" className="relative z-10 block group">
          <div className="flex items-center gap-4 p-4 bg-shadow rounded-xl border-4 border-shadow shadow-brutal ">
            <div className="relative">
              <Mascot state="idle" size="sm" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan rounded-full led-pulse border-2 border-shadow" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight uppercase">EMPLEAIDO</div>
              <div className="text-xs text-cyan font-mono">▸ COMMAND CENTER</div>
            </div>
          </div>
        </Link>

        {/* Navigation - POWER */}
        <nav className="relative z-10 flex flex-col gap-2">
          <NavItem href="/dashboard" active icon="📊">
            Panel
          </NavItem>
          <NavItem href="/dashboard/tasks" icon="📋">
            Tareas
          </NavItem>
          <NavItem href="/dashboard/agents" icon="🤖">
            Agentes
          </NavItem>
          <NavItem href="/dashboard/settings" icon="⚙️">
            Config
          </NavItem>
        </nav>

        {/* Status Panel - POWER */}
        <div className="relative z-10 mt-auto">
          <div className="card-power bg-shadow p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Mascot state="wave" size="sm" />
                <span className="absolute -top-1 -right-1 text-xl starburst">✦</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusIndicator status="online" />
                  <span className="text-sm font-bold uppercase">SISTEMA ACTIVO</span>
                </div>
                <p className="text-xs text-cyan font-mono">
                  {adoptedEmpleaidos.length} EMPLEAIDOS ONLINE
                </p>
              </div>
            </div>
            <div className="h-2 bg-mid rounded-full overflow-hidden">
              <div className="h-full bg-cyan rounded-full w-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT — Operations View
      ═══════════════════════════════════════════════════════════════ */}
      <section className="flex-1 p-8 overflow-auto relative">
        {/* Background texture */}
        <div className="absolute inset-0 halftone-heavy opacity-5 pointer-events-none" />

        {/* Header - POWER */}
        <div className="relative z-10 flex justify-between items-center mb-10">
          <div>
            <h1 className="text-huge text-power">
              MY <span className="text-cyan">EMPLEAIDOS</span>
            </h1>
            <p className="text-lg text-light/60 font-medium">Tu equipo de IA, listo para trabajar</p>
          </div>
          <Link href="/">
            <Button variant="secondary" size="lg" starburst>
              ← CATÁLOGO
            </Button>
          </Link>
        </div>

        {/* Stats Overview - POWER CARDS */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="card-power bg-light p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-shadow/50 uppercase tracking-wider">Total Empleaidos</span>
              <Mascot state="celebrating" size="sm" />
            </div>
            <div className="text-5xl font-black text-shadow">{adoptedEmpleaidos.length}</div>
            <p className="text-sm text-shadow/60 font-medium mt-1">en tu equipo</p>
          </div>

          <div className="card-power bg-light p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-shadow/50 uppercase tracking-wider">Nivel Promedio</span>
              <Mascot state="working" size="sm" />
            </div>
            <div className="text-5xl font-black text-shadow">
              {Math.round(adoptedEmpleaidos.reduce((acc, e) => acc + e.life.level, 0) / adoptedEmpleaidos.length)}
            </div>
            <p className="text-sm text-shadow/60 font-medium mt-1">experiencia acumulada</p>
          </div>

          <div className="card-power bg-light p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-shadow/50 uppercase tracking-wider">Estado del Sistema</span>
              <StatusIndicator status="online" />
            </div>
            <div className="text-3xl font-black text-success uppercase">TODOS ACTIVOS</div>
            <p className="text-sm text-shadow/60 font-medium mt-1">operando al 100%</p>
          </div>
        </div>

        {/* Empleaidos Grid - POWER */}
        {adoptedEmpleaidos.length === 0 ? (
          <div className="card-power bg-light p-12 text-center">
            <MascotWithMessage
              state="supportive"
              size="lg"
              message="No tienes Empleaidos aún. ¡Explora el catálogo!"
            />
            <div className="mt-8">
              <Link href="/">
                <Button variant="mega" size="xl" starburst>
                  🚀 EXPLORAR CATÁLOGO
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adoptedEmpleaidos.map((e) => (
              <div key={e.id} className="card-power bg-light overflow-hidden group">
                {/* Header with emoji */}
                <div className="p-6 border-b-4 border-shadow/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-black text-shadow uppercase">{e.name}</h2>
                      <p className="text-sm text-cyan font-mono font-bold">
                        #{e.serial.toString().padStart(5, '0')}
                      </p>
                    </div>
                    <span className="text-5xl  transition-transform duration-med">
                      {getRoleEmoji(e.role.main)}
                    </span>
                  </div>
                  <p className="text-sm text-shadow/70 font-medium mt-2">{e.role.main}</p>
                </div>

                {/* Life Stats - POWER */}
                <div className="p-6 bg-mid space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-light/60 uppercase">Level</span>
                    <span className="text-2xl font-black text-light">{e.life.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-light/60 uppercase">XP</span>
                    <span className="text-lg font-bold text-cyan">{e.life.experience}</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-light/60 uppercase">Energy</span>
                      <span className="text-sm font-bold text-cyan">{e.life.energy}%</span>
                    </div>
                    <div className="h-3 bg-shadow rounded-full overflow-hidden border-2 border-shadow">
                      <div
                        className="h-full bg-cyan rounded-full transition-all duration-slow"
                        style={{ width: `${e.life.energy}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-light/60 uppercase">Trust</span>
                    <span className="text-lg font-bold text-success">
                      {Math.round(e.life.trust * 100)}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-light">
                  <Link href={`/dashboard/${e.id}`}>
                    <Button variant="primary" size="lg" className="w-full" starburst>
                      VER DETALLES →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
