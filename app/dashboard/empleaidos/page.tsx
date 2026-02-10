/**
 * My Empleaidos - Detailed Management View
 */

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function MyEmpleaidosPage() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: empleaidos } = await supabase
    .from('ef_adoptions')
    .select('*')
    .eq('user_id', user?.id)
    .eq('status', 'active')
    .order('bond_started_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Mis Empleaidos</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {empleaidos?.map((empleaito) => (
            <EmpleaidoDetailCard key={empleaito.id} empleaido={empleaito} />
          ))}
        </div>

        {empleaidos && empleaidos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No tienes empleaidos activos.</p>
            <Link href="/catalog" className="text-purple-600 hover:text-purple-700">
              Explora el catálogo →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function EmpleaidoDetailCard({ empleaido }: any) {
  const names: Record<string, string> = {
    sera: 'SERA #4094',
    kael: 'KAEL #1823',
    nora: 'NORA #2756',
    lior: 'LIOR #8129',
    ziv: 'ZIV #3647',
  };

  const name = names[empleaido.empleaido_id] || empleaido.empleaido_id.toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-600">Adoptado: {new Date(empleaido.bond_started_at).toLocaleDateString()}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Activo
        </span>
      </div>

      {/* Life Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold text-purple-600">{empleaido.level || 1}</div>
          <div className="text-sm text-gray-600">Level</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold text-blue-600">{empleaido.xp || 0}</div>
          <div className="text-sm text-gray-600">XP</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold text-green-600">
            {Math.round((empleaido.confidence || 0) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Confianza</div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/empleaido/${empleaido.empleaido_id}`}
          className="text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Ver Perfil
        </Link>
        <Link
          href="/virtual-office"
          className="text-center border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50"
        >
          Virtual Office
        </Link>
        <button className="text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
          Configurar
        </button>
        <button className="text-center border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
          Pausar
        </button>
      </div>
    </div>
  );
}
