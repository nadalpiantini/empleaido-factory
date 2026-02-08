import Link from 'next/link';
import Image from 'next/image';
import empleaidos from '@/data/empleaidos.json';
import { getSkillLabel } from '@/lib/skills';
import imageManifest from '../../../public/empleaido-images.json';
import { Button, Card, CardHeader, CardContent, EmptyState, Mascot } from '../../components/ui';

export default async function EmpleaidoProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = empleaidos.find((emp) => emp.id === id);

  if (!e) {
    return (
      <main className="min-h-screen bg-shadow flex items-center justify-center starfield">
        <div className="card-power bg-light p-12 text-center max-w-lg">
          <div className="text-8xl mb-6">🔍</div>
          <h2 className="text-2xl font-black text-shadow uppercase mb-4">EMPLEAIDO NO ENCONTRADO</h2>
          <p className="text-shadow/70 mb-8">Este Empleaido no existe o fue removido del sistema.</p>
          <Link href="/">
            <Button variant="primary" size="xl" starburst>
              ← VOLVER AL CATÁLOGO
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const imageData = imageManifest.find((img) => img.empleaido_id === e.id);
  const imageUrl = imageData?.imageUrl;

  return (
    <main className="min-h-screen bg-shadow text-light font-ui">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER — Navigation Bar
      ═══════════════════════════════════════════════════════════════ */}
      <header className="border-b-4 border-shadow bg-mid/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-lg py-md flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="md">
              ← Catálogo
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Mascot state="idle" size="sm" />
            <span className="font-bold uppercase tracking-wide">Empleaido Profile</span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Profile Showcase
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-lg py-xl">
        <div className="card-power bg-light overflow-hidden">
          {/* Hero Banner */}
          <div className="relative h-56 md:h-72 bg-shadow overflow-hidden">
            {/* Starfield background */}
            <div className="absolute inset-0 starfield" />

            {/* Decorative elements */}
            <div className="absolute top-6 left-6 text-7xl text-cyan/20 ">✧</div>
            <div className="absolute bottom-6 right-6 text-5xl text-cyan/20 " style={{ animationDelay: '-2s' }}>★</div>
            <div className="absolute inset-0 halftone-dark opacity-20" />

            {/* Diagonal stripes */}
            <div className="absolute inset-0 stripes-diagonal opacity-20" />

            {/* LED accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-cyan" />

            {/* Serial number */}
            <div className="absolute top-6 right-6">
              <span className="badge-power">
                <span className="w-2 h-2 bg-shadow rounded-full led-pulse" />
                #{e.serial.toString().padStart(5, '0')}
              </span>
            </div>
          </div>

          {/* Profile Image - Overlapping */}
          <div className="relative px-8 md:px-12">
            <div className="absolute -top-24 md:-top-28 left-8 md:left-12 w-44 h-44 md:w-52 md:h-52 rounded-xl overflow-hidden border-[6px] border-shadow shadow-brutal-lg img-power">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${e.name} - AI Employee`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-mid flex items-center justify-center">
                  <span className="text-7xl">{getRoleEmoji(e.role.main)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pt-28 md:pt-32 px-8 md:px-12 pb-10">
            {/* Title Row */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
              <div>
                <h1 className="text-huge text-power text-shadow">{e.name}</h1>
                <p className="text-2xl font-mono font-bold text-cyan mt-2">
                  {e.role.main}
                </p>
                <p className="text-lg text-shadow/70 font-medium">{e.role.sub}</p>
              </div>
              <div className="flex gap-3 mt-6 md:mt-0">
                <span className="badge-power">
                  {e.sephirot.primary}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider border-4 border-shadow ${getTierBadge(e.role.tier)}`}>
                  {getTierIcon(e.role.tier)} {e.role.tier}
                </span>
              </div>
            </div>

            {/* Motivation Quote - POWER */}
            {e.identity?.motivation && (
              <div className="mb-10 p-8 rounded-xl bg-mid border-l-8 border-cyan relative overflow-hidden">
                <div className="absolute top-4 left-4 text-6xl text-cyan/20">"</div>
                <p className="text-2xl font-bold text-light leading-relaxed pl-8">
                  {e.identity.motivation}
                </p>
              </div>
            )}

            {/* Skills Grid - POWER */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Native Skills */}
              <div className="card-power bg-mid p-6">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Included Skills</span>
                </h3>
                <ul className="space-y-3">
                  {e.skills.native.map((s) => (
                    <li key={s} className="flex items-center gap-4 p-3 bg-shadow rounded-lg border-2 border-cyan/30">
                      <span className="w-8 h-8 rounded-lg bg-cyan flex items-center justify-center text-shadow font-bold">
                        ✓
                      </span>
                      <span className="text-light font-medium">{getSkillLabel(s)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Locked Skills */}
              <div className="card-power bg-shadow p-6 border-2 border-dashed border-light/20">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3 text-light/60">
                  <span className="text-2xl">🔒</span>
                  <span>Unlockable Skills</span>
                </h3>
                <ul className="space-y-3">
                  {e.skills.locked.map((s) => (
                    <li key={s} className="flex items-center gap-4 p-3 bg-mid/50 rounded-lg border-2 border-light/10">
                      <span className="w-8 h-8 rounded-lg bg-light/10 flex items-center justify-center text-light/40">
                        🔒
                      </span>
                      <span className="text-light/50 font-medium">{getSkillLabel(s)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Boundaries - POWER WARNING */}
            {e.identity?.boundaries && e.identity.boundaries.length > 0 && (
              <div className="mb-10 p-6 card-power bg-warning/10 border-4 border-warning/50">
                <h3 className="font-black text-lg uppercase tracking-wider mb-4 text-warning flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  What I Don't Do
                </h3>
                <ul className="space-y-3">
                  {e.identity.boundaries.map((b, i) => (
                    <li key={i} className="text-shadow/80 font-medium flex items-start gap-3 p-3 bg-light/50 rounded-lg">
                      <span className="text-warning text-xl">✕</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pricing Card - MEGA */}
            <div className="mb-10 p-8 card-power bg-mid text-center relative overflow-hidden">
              <div className="absolute inset-0 starfield opacity-30" />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-widest text-light/50 mb-4">INVERSIÓN MENSUAL</p>
                <div className="text-7xl font-black text-cyan mb-2 starburst inline-block">
                  ${e.pricing.monthly_usd}
                </div>
                <div className="text-xl text-light/70 font-bold">por mes</div>
                {e.pricing.annual_usd && (
                  <div className="mt-6 inline-flex items-center gap-4 px-6 py-3 bg-success/20 rounded-xl border-2 border-success/30">
                    <span className="text-light/80 font-medium">
                      o ${e.pricing.annual_usd}/año
                    </span>
                    <span className="px-4 py-2 bg-success text-shadow rounded-lg text-sm font-black uppercase">
                      AHORRA ${((e.pricing.monthly_usd * 12) - e.pricing.annual_usd).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA - MEGA POWER */}
            <Link href={`/adopt/${e.id}`}>
              <Button variant="mega" size="mega" className="w-full" starburst>
                <span className="flex items-center justify-center gap-4">
                  🚀 ADOPTAR A {e.name.toUpperCase()}
                  <span className="text-3xl">→</span>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER — Back to catalog
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t-4 border-shadow/50 py-lg bg-mid">
        <div className="max-w-5xl mx-auto px-lg flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-light/60 hover:text-cyan transition-colors">
            <Mascot state="idle" size="sm" />
            <span className="font-bold">← Ver más Empleaidos</span>
          </Link>
          <p className="text-sm text-cyan font-mono">
            ✦ EMPLEAIDO FACTORY ✦
          </p>
        </div>
      </footer>
    </main>
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

function getTierBadge(tier: string): string {
  const colors = {
    base: 'bg-light text-shadow',
    pro: 'bg-cyan text-shadow',
    deluxe: 'bg-warning text-shadow',
  };
  return colors[tier as keyof typeof colors] || colors.base;
}

function getTierIcon(tier: string): string {
  const icons = { base: '○', pro: '◆', deluxe: '★' };
  return icons[tier as keyof typeof icons] || '○';
}
