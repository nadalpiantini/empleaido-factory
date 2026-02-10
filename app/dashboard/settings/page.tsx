/**
 * User Settings - Preferences and Configuration
 */

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SettingsPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Notificaciones</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email notifications</div>
                <div className="text-sm text-gray-600">Recibir actualizaciones por email</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600" />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium">Weekly summary</div>
                <div className="text-sm text-gray-600">Resumen semanal de actividad</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600" />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium">Empleaido achievements</div>
                <div className="text-sm text-gray-600">Notificaciones de level-up</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600" />
            </label>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Preferencias de Comunicación</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de detalle
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Resúmenes breves</option>
                <option>Detallado</option>
                <option>Muy detallado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Cuenta</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={user.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>

            <button className="text-purple-600 hover:text-purple-700">
              Cambiar contraseña
            </button>

            <button className="text-red-600 hover:text-red-700">
              Eliminar cuenta
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
