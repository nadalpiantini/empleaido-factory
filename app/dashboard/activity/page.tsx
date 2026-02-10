/**
 * Activity History - Task and Interaction Log
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ActivityPage() {
  const { data: { user } } = await supabase.auth.getUser();

  // TODO: Create ef_empleaido_events table
  // const { data: events } = await supabase
  //   .from('ef_empleaido_events')
  //   .select('*')
  //   .eq('user_id', user?.id)
  //   .order('created_at', { ascending: false })
  //   .limit(50);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Historial de Actividad</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex space-x-4">
            <select className="border rounded-lg px-3 py-2">
              <option>Todos los empleaidos</option>
              <option>SERA #4094</option>
              <option>KAEL #1823</option>
              <option>NORA #2756</option>
              <option>LIOR #8129</option>
              <option>ZIV #3647</option>
            </select>

            <select className="border rounded-lg px-3 py-2">
              <option>Todas las acciones</option>
              <option>Tareas completadas</option>
              <option>Conversaciones</option>
              <option>Level-ups</option>
            </select>

            <select className="border rounded-lg px-3 py-2">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
              <option>Últimos 90 días</option>
              <option>Todo el historial</option>
            </select>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12 text-gray-600">
            <div className="text-4xl mb-4">📊</div>
            <p>El historial de actividad estará disponible pronto</p>
            <p className="text-sm mt-2">
              Aquí verás todas las tareas completadas, conversaciones y logros de tus empleaidos
            </p>
          </div>

          {/* Mock activity list (when implemented) */}
          <div className="space-y-4">
            <div className="flex items-start p-4 border rounded-lg">
              <div className="text-2xl mr-4">✅</div>
              <div className="flex-1">
                <div className="font-medium">SERA procesó 5 facturas</div>
                <div className="text-sm text-gray-600">Hace 2 horas</div>
              </div>
              <div className="text-sm text-purple-600">+50 XP</div>
            </div>

            <div className="flex items-start p-4 border rounded-lg">
              <div className="text-2xl mr-4">💬</div>
              <div className="flex-1">
                <div className="font-medium">Conversación con KAEL</div>
                <div className="text-sm text-gray-600">Hace 5 horas</div>
              </div>
            </div>

            <div className="flex items-start p-4 border rounded-lg">
              <div className="text-2xl mr-4">📈</div>
              <div className="flex-1">
                <div className="font-medium">NORA reached Level 2</div>
                <div className="text-sm text-gray-600">Ayer</div>
              </div>
              <div className="text-sm text-green-600">Level Up!</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
