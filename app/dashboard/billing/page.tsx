/**
 * Billing Management - Subscription and Payment History
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BillingPage() {
  const { data: { user } } = await supabase.auth.getUser();

  // Get payment history (TODO: implement payment records table)
  const { data: payments } = await supabase
    .from('ef_adoptions')
    .select('*, empleaido_id')
    .eq('user_id', user?.id)
    .order('bond_started_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Métodos de Pago</h2>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💳</div>
              <div>
                <div className="font-medium">Tarjeta de crédito/debito</div>
                <div className="text-sm text-gray-600">Stripe Checkout</div>
              </div>
            </div>
            <button className="text-purple-600 hover:text-purple-700">
              Actualizar
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Historial de Pagos</h2>

          {payments && payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment: any) => {
                const empleaidoNames: Record<string, string> = {
                  sera: 'SERA #4094',
                  kael: 'KAEL #1823',
                  nora: 'NORA #2756',
                  lior: 'LIOR #8129',
                  ziv: 'ZIV #3647',
                };

                return (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {empleaidoNames[payment.empleaido_id] || payment.empleaido_id.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(payment.bond_started_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${payment.amount || 0}</div>
                      <div className="text-sm text-green-600">Completado</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No hay pagos registrados
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Facturas</h2>
          <div className="text-center py-8 text-gray-600">
            Las facturas estarán disponibles aquí después de cada pago
          </div>
        </div>
      </main>
    </div>
  );
}
