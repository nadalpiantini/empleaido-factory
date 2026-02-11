'use client';

/**
 * SKILL EXECUTOR COMPONENT
 *
 * UI component for executing Empleaido skills with safety checks
 */

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface SkillExecutorProps {
  empleaidoId: string;
  empleaidoName: string;
  nativeSkills: string[];
  lockedSkills: string[];
}

export function SkillExecutor({
  empleaidoId,
  nativeSkills,
  lockedSkills,
}: SkillExecutorProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [pendingResult, setPendingResult] = useState<Record<string, unknown> | null>(null);

  const executeSkill = async () => {
    if (!selectedSkill) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/skills/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleaidoId,
          userId: 'current-user', // TODO: Get from auth
          skill: selectedSkill,
          inputs,
        }),
      });

      const data = await response.json();

      if (data.requiresConfirmation) {
        setRequiresConfirmation(true);
        setPendingResult(data.result);
        return;
      }

      if (!data.success) {
        setError(data.message || data.error);
        return;
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error executing skill');
    } finally {
      setLoading(false);
    }
  };

  const confirmResult = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/skills/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleaidoId,
          userId: 'current-user',
          skill: selectedSkill,
          inputs: { result: pendingResult },
          userConfirmed: true,
        }),
      });

      await response.json();
      setResult(pendingResult);
      setRequiresConfirmation(false);
      setPendingResult(null);
    } catch {
      setError('Error confirming result');
    } finally {
      setLoading(false);
    }
  };

  const renderSkillInputs = () => {
    if (!selectedSkill) return null;

    switch (selectedSkill.toLowerCase()) {
      case 'ocr_facturas':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subir Factura
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setInputs({ ...inputs, file: e.target.files?.[0] })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        );

      case 'itbis_mensual':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <input
                type="month"
                onChange={(e) =>
                  setInputs({ ...inputs, periodo: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        );

      default:
        return (
          <p className="text-gray-600">
            Selecciona esta skill para ejecutarla con los parámetros actuales.
          </p>
        );
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Ejecutar Skill</h3>

      {/* Skill Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Skill
        </label>
        <select
          value={selectedSkill || ''}
          onChange={(e) => {
            setSelectedSkill(e.target.value);
            setInputs({});
            setResult(null);
            setError(null);
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">-- Selecciona una skill --</option>
          {nativeSkills.map((skill) => (
            <option key={skill} value={skill}>
              ✅ {skill}
            </option>
          ))}
          {lockedSkills.map((skill) => (
            <option key={skill} value={skill} disabled>
              🔒 {skill} (Requiere upgrade)
            </option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      {selectedSkill && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Parámetros</h4>
          {renderSkillInputs()}
        </div>
      )}

      {/* Execute Button */}
      {selectedSkill && !requiresConfirmation && (
        <Button
          onClick={executeSkill}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Ejecutando...' : 'Ejecutar Skill'}
        </Button>
      )}

      {/* Confirmation Dialog */}
      {requiresConfirmation && (
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-2">
            ⚠️ Confirmación Requerida
          </h4>
          <p className="text-sm text-amber-800 mb-4">
            Esta skill generó un resultado que requiere tu confirmación antes de
            guardarse.
          </p>
          <pre className="bg-white p-4 rounded border mb-4 overflow-auto max-h-64">
            {JSON.stringify(pendingResult, null, 2)}
          </pre>
          <div className="flex space-x-2">
            <Button
              onClick={confirmResult}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Confirmando...' : 'Confirmar y Guardar'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setRequiresConfirmation(false);
                setPendingResult(null);
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">❌ Error</h4>
          <p className="text-sm text-red-800 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && !requiresConfirmation && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Resultado</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <pre className="overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
