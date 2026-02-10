'use client';

/**
 * SKILL EXECUTION PAGE
 *
 * Interface for executing Empleaido skills
 * Shows available skills, locked skills, and execution history
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardContent } from '../../../../components/ui';

interface Skill {
  id: string;
  name: string;
  status: 'available' | 'locked';
  unlock_at_level?: number;
}

interface SkillExecution {
  id: string;
  skill_id: string;
  skill_name: string;
  status: 'success' | 'failed' | 'timeout';
  output?: string;
  duration_ms: number;
  execution_time: string;
  xp_gained: number;
  energy_cost: number;
}

export default function SkillExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [empleaidoId, setEmpleaidoId] = useState<string>('');
  const [empleaido, setEmpleaido] = useState<any>(null);
  const [skills, setSkills] = useState<{ native: Skill[]; locked: Skill[] } | null>(null);
  const [history, setHistory] = useState<SkillExecution[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setEmpleaidoId(id);
      loadData(id);
    });
  }, [params]);

  const loadData = async (id: string) => {
    setIsLoading(true);
    try {
      // Load empleaido data
      const empleaidoRes = await fetch(`/api/empleaidos/${id}`);
      const empleaidoData = await empleaidoRes.json();
      setEmpleaido(empleaidoData);

      // Load skills
      const skillsRes = await fetch(`/api/skills/execute?empleaido_id=${id}`);
      const skillsData = await skillsRes.json();
      setSkills(skillsData.skills);

      // Load execution history (if available)
      try {
        const historyRes = await fetch(`/api/empleaidos/${id}/history`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.executions || []);
        }
      } catch (e) {
        // History endpoint might not exist yet
        console.log('No history available');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSkill = async (skillId: string) => {
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const response = await fetch('/api/skills/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleaido_id: empleaidoId,
          skill_id: skillId,
          params: {},
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExecutionResult(data.result);
        // Add to history
        setHistory((prev) => [data.result, ...prev]);
      } else {
        setExecutionResult({ error: data.error });
      }
    } catch (error) {
      setExecutionResult({ error: error instanceof Error ? error.message : 'Execution failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#5ED3D0] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#5ED3D0]">Loading skills...</p>
        </div>
      </main>
    );
  }

  if (!empleaido || !skills) {
    return (
      <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8] flex items-center justify-center">
        <Card variant="outlined" padding="lg">
          <p className="text-red-400">Failed to load empleaido data</p>
          <Link href="/dashboard" className="mt-4 block">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8]">
      {/* Header */}
      <header className="border-b border-[#F3E4C8]/10 bg-[#0E3A41]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/empleaidos/${empleaidoId}`}
              className="text-sm text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors"
            >
              ← Back to {empleaido.name}
            </Link>
            <h1 className="text-xl font-bold">Skill Execution</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Skills */}
            <Card variant="elevated" padding="lg">
              <CardHeader title="Available Skills" subtitle="Click to execute" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.native.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => executeSkill(skill.id)}
                      disabled={isExecuting}
                      className="p-4 bg-[#1A434F] border-2 border-[#5ED3D0] rounded-lg
                                 hover:bg-[#5ED3D0]/10 hover:shadow-lg
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-[#5ED3D0]">{skill.name}</div>
                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Available
                        </div>
                      </div>
                      <div className="text-xs text-[#F3E4C8]/60 font-mono">
                        {skill.id}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Locked Skills */}
            {skills.locked.length > 0 && (
              <Card variant="outlined" padding="lg">
                <CardHeader title="Locked Skills" subtitle="Level up to unlock" />
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skills.locked.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-4 bg-[#1A434F] border-2 border-[#F3E4C8]/20 rounded-lg opacity-60"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-[#F3E4C8]/60">{skill.name}</div>
                          <div className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            Lvl {skill.unlock_at_level}
                          </div>
                        </div>
                        <div className="text-xs text-[#F3E4C8]/40 font-mono">
                          🔒 {skill.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Execution Result & History */}
          <div className="space-y-6">
            {/* Execution Result */}
            {isExecuting && (
              <Card variant="elevated" padding="lg">
                <div className="text-center py-8">
                  <div className="animate-spin w-12 h-12 border-4 border-[#5ED3D0] border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-[#5ED3D0] font-semibold">Executing skill...</p>
                  <p className="text-xs text-[#F3E4C8]/60 mt-2">This may take a moment</p>
                </div>
              </Card>
            )}

            {executionResult && !isExecuting && (
              <Card variant={executionResult.error ? 'outlined' : 'elevated'} padding="lg">
                {executionResult.error ? (
                  <>
                    <h3 className="text-lg font-bold text-red-400 mb-3">❌ Execution Failed</h3>
                    <p className="text-sm text-[#F3E4C8]/80">{executionResult.error}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-green-400 mb-3">✅ Success!</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-[#F3E4C8]/60 mb-1">Skill</div>
                        <div className="font-semibold">{executionResult.skill_name}</div>
                      </div>
                      <div>
                        <div className="text-[#F3E4C8]/60 mb-1">Duration</div>
                        <div className="font-mono">{executionResult.duration_ms}ms</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-[#1A434F] rounded">
                          <div className="text-[#5ED3D0] font-bold">+{executionResult.xp_gained}</div>
                          <div className="text-xs text-[#F3E4C8]/60">XP</div>
                        </div>
                        <div className="text-center p-2 bg-[#1A434F] rounded">
                          <div className="text-green-400 font-bold">+{(executionResult.trust_increase * 100).toFixed(0)}%</div>
                          <div className="text-xs text-[#F3E4C8]/60">Trust</div>
                        </div>
                        <div className="text-center p-2 bg-[#1A434F] rounded">
                          <div className="text-red-400 font-bold">-{executionResult.energy_cost}</div>
                          <div className="text-xs text-[#F3E4C8]/60">Energy</div>
                        </div>
                      </div>
                      {executionResult.output && (
                        <div>
                          <div className="text-[#F3E4C8]/60 mb-1">Output</div>
                          <div className="p-3 bg-[#0E3A41] rounded text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {executionResult.output}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Card>
            )}

            {/* Execution History */}
            {history.length > 0 && (
              <Card variant="outlined" padding="lg">
                <CardHeader title="Recent Executions" subtitle={`${history.length} total`} />
                <CardContent>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((exec) => (
                      <div
                        key={exec.id}
                        className="p-3 bg-[#1A434F] rounded border border-[#F3E4C8]/10"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="text-sm font-semibold">{exec.skill_name}</div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            exec.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {exec.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#F3E4C8]/60">
                          <span>{exec.duration_ms}ms</span>
                          <span>+{exec.xp_gained} XP</span>
                          <span>-{exec.energy_cost} Energy</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
