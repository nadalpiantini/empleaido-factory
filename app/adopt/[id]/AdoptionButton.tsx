'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdoptionButtonProps {
  empleaidoId: string;
  empleaidoName: string;
}

export default function AdoptionButton({ empleaidoId, empleaidoName }: AdoptionButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdopt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/adopt/${empleaidoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's auth error
        if (data.loginUrl) {
          router.push('/login?redirect=' + encodeURIComponent(`/adopt/${empleaidoId}`));
          return;
        }

        // Check if already adopted
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
          return;
        }

        throw new Error(data.error || 'Adoption failed');
      }

      if (data.success) {
        // Redirect to onboarding
        router.push(data.nextSteps.onboardingUrl);
      } else {
        throw new Error(data.error || 'Adoption failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdopt}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing Adoption...
          </span>
        ) : (
          `⚡ ADOPT ${empleaidoName.toUpperCase()} NOW`
        )}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        🔒 Secure adoption • No payment for MVP validation
      </p>
    </form>
  );
}
