import Link from 'next/link';
import empleaidos from '@/data/empleaidos.json';
import { getSkillLabel } from '@/lib/skills';
import { Button, Card, CardHeader, CardContent, EmptyState } from '../../components/ui';

export default async function EmpleaidoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = empleaidos.find((emp) => emp.id === id);

  if (!e) {
    return (
      <main className="min-h-screen bg-[#0E3A41] flex items-center justify-center">
        <Card variant="outlined" padding="lg">
          <EmptyState
            icon="🔍"
            title="Empleaido not found"
            hint="This Empleaido doesn't exist or has been removed."
            action={
              <Link href="/dashboard">
                <Button variant="secondary">← Back to dashboard</Button>
              </Link>
            }
          />
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8] font-ui">
      {/* Header */}
      <header className="border-b border-[#F3E4C8]/10 bg-[#0E3A41]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors duration-med"
          >
            ← Back to my Empleaidos
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <Card variant="elevated" padding="lg">
          {/* Title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{e.name}</h1>
              <p className="text-[#F3E4C8]/60 font-mono">
                EMPLEAIDO #{e.serial.toString().padStart(5, '0')}
              </p>
              <p className="text-lg mt-2 text-[#F3E4C8]/80">{e.role.main}</p>
            </div>
            <div className="text-5xl">{getRoleEmoji(e.role.main)}</div>
          </div>

          {/* Sephirot Badges */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#5ED3D0]/20 text-[#5ED3D0] rounded-full text-sm font-semibold">
              Primary: {e.sephirot.primary}
            </span>
            {e.sephirot.secondary.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-[#F3E4C8]/10 text-[#F3E4C8]/70 rounded-full text-xs"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Motivation */}
          {e.identity?.motivation && (
            <div className="mb-6 p-4 bg-[#0E3A41] rounded-lg border-l-4 border-[#5ED3D0]">
              <p className="italic text-[#F3E4C8]/90">&ldquo;{e.identity.motivation}&rdquo;</p>
            </div>
          )}

          {/* Life Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Level" value={e.life.level} />
            <StatCard label="XP" value={e.life.experience} />
            <StatCard label="Energy" value={`${e.life.energy}%`} showBar energy={e.life.energy} />
            <StatCard label="Trust" value={`${Math.round(e.life.trust * 100)}%`} highlight />
          </div>

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card variant="default" padding="md">
              <CardHeader title="Active Skills" subtitle="Ready to use" />
              <CardContent>
                <ul className="space-y-2">
                  {e.skills.native.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#5ED3D0]/20 flex items-center justify-center text-[#5ED3D0] text-xs">
                        ✓
                      </span>
                      <span className="text-[#F3E4C8]/80">{getSkillLabel(s)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card variant="outlined" padding="md">
              <CardHeader title="Locked Skills" subtitle="Level up to unlock" />
              <CardContent>
                <ul className="space-y-2">
                  {e.skills.locked.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#F3E4C8]/10 flex items-center justify-center text-[#F3E4C8]/40 text-xs">
                        🔒
                      </span>
                      <span className="text-[#F3E4C8]/50">{getSkillLabel(s)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* OpenClaw Status */}
          <div className="border-t border-[#F3E4C8]/10 pt-6">
            <h3 className="font-semibold mb-3">OpenClaw Agent Status</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 led-pulse" />
              <span className="text-sm font-mono text-[#F3E4C8]/80">
                empleaido-{e.name.toLowerCase()}-{e.serial}
              </span>
            </div>
            <p className="text-xs text-[#F3E4C8]/50 font-mono">
              ~/.openclaw/workspace-empleaido-{e.name.toLowerCase()}-{e.serial}/
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <Button className="flex-1">Start Task</Button>
            <Link href={`/empleaido/${e.id}`}>
              <Button variant="secondary">View Public Profile</Button>
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  showBar,
  energy,
  highlight,
}: {
  label: string;
  value: string | number;
  showBar?: boolean;
  energy?: number;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#0E3A41] rounded-lg p-4 text-center border border-[#F3E4C8]/10">
      <div className={`text-2xl font-bold mb-1 ${highlight ? 'text-green-500' : 'text-[#5ED3D0]'}`}>
        {value}
      </div>
      <div className="text-xs text-[#F3E4C8]/50">{label}</div>
      {showBar && energy !== undefined && (
        <div className="mt-2 w-full h-1.5 bg-[#1A434F] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5ED3D0] rounded-full transition-all duration-med"
            style={{ width: `${energy}%` }}
          />
        </div>
      )}
    </div>
  );
}

function getRoleEmoji(role: string): string {
  const map: Record<string, string> = {
    'Contabilidad RD': '🧾',
    'Growth Marketing': '📣',
    'Operaciones': '🗂️',
    'CFO Estrategico': '💰',
    'Productividad Personal': '⏱️',
  };
  return map[role] || '🤖';
}
