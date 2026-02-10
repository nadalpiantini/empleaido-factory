/**
 * Main Dashboard - User Home
 * Overview of all empleaidos and quick actions
 */

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function DashboardPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get user's empleaidos
  const { data: empleaidos } = await supabase
    .from('ef_adoptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
              <p className="text-sm text-gray-600">Bienvenido, {user.email}</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/catalog" className="text-gray-700 hover:text-gray-900">Catálogo</Link>
              <Link href="/dashboard/empleaidos" className="text-gray-700 hover:text-gray-900">Mis Empleaidos</Link>
              <Link href="/dashboard/billing" className="text-gray-700 hover:text-gray-900">Facturación</Link>
              <Link href="/dashboard/settings" className="text-gray-700 hover:text-gray-900">Configuración</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Empleaidos</p>
            <p className="text-2xl font-bold">{empleaidos?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Nivel Promedio</p>
            <p className="text-2xl font-bold">1.0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Confianza</p>
            <p className="text-2xl font-bold">15%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Tareas</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/catalog" className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="text-2xl mb-2">🎁</div>
              <div className="font-medium">Adoptar Empleaido</div>
            </Link>
            <Link href="/virtual-office" className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-medium">Virtual Office</div>
            </Link>
            <Link href="/dashboard/activity" className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Ver Actividad</div>
            </Link>
          </div>
        </div>

        {/* My Empleaidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Mis Empleaidos</h2>
          {empleaidos && empleaidos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {empleaidos.map((e: any) => (
                <div key={e.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{e.empleaido_id.toUpperCase()}</h3>
                  <p className="text-sm text-gray-600">Level {e.level || 1}</p>
                  <Link href={`/empleaido/${e.empleaido_id}`} className="text-purple-600 text-sm">Ver →</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">No tienes empleaidos aún</p>
          )}
        </div>
      </main>
    </div>
  );
}
