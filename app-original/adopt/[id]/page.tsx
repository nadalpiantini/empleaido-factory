/**
 * ADOPTION PAGE
 *
 * MVP: User adopts an Empleaido without payment
 * Creates ef_adoptions record + spawns OpenClaw agent
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { EmpleaidoCard } from '../../components/EmpleaidoCard';
import AdoptionButton from './AdoptionButton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdoptionPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch Empleaido from catalog
  const catalogResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/empleaidos/${id}`, {
    cache: 'no-store'
  });
  if (!catalogResponse.ok) return notFound();
  const empleaido = await catalogResponse.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to Catalog
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Catalog → {empleaido.name} → Adoption
          </p>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Adopt {empleaido.name}
          </h1>
          <p className="text-lg text-gray-600">
            {empleaido.role.main} for {empleaido.role.sub}
          </p>
        </div>

        {/* Empleaido Card Preview */}
        <div className="mb-8">
          <EmpleaidoCard
            id={empleaido.id}
            serial={empleaido.serial}
            name={empleaido.name}
            role={empleaido.role}
            sephirot={empleaido.sephirot}
            skills={empleaido.skills}
            pricing={empleaido.pricing}
          />
        </div>

        {/* Adoption Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll get</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-900">AI-Powered Assistant</p>
                <p className="text-gray-600 text-sm">
                  {empleaido.name} will help you with {empleaido.skills.native.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-900">OpenClaw Integration</p>
                <p className="text-gray-600 text-sm">
                  Full workspace with memory, tools, and Sephirotic routing
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-900">Personalized Onboarding</p>
                <p className="text-gray-600 text-sm">
                  5-phase wizard to customize {empleaido.name} to your needs
                </p>
              </div>
            </div>
          </div>

          {/* Pricing (Mock for MVP) */}
          <div className="bg-purple-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly subscription</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${empleaido.pricing.monthly_usd}
                  <span className="text-lg font-normal text-gray-600">/mo</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Annual (save 20%)</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${empleaido.pricing.annual_usd}
                  <span className="text-base font-normal text-gray-600">/yr</span>
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mb-6">
            ⚠️ MVP: No payment required for validation. PayPal integration coming soon.
          </p>

          {/* Adopt Button */}
          <AdoptionButton empleaidoId={id} empleaidoName={empleaido.name} />
        </div>

        {/* What happens next */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li><strong>1.</strong> We create your adoption record</li>
            <li><strong>2.</strong> {empleaido.name} gets spawned in your OpenClaw workspace</li>
            <li><strong>3.</strong> You'll complete a 5-phase onboarding wizard</li>
            <li><strong>4.</strong> Start interacting with your new AI employee!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
