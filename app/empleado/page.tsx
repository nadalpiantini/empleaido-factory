import { NavigationBar } from '@/app/components/NavigationBar';
import { Footer } from '@/app/components/Footer';

export default function EmpleadoPage() {
  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8] font-ui overflow-x-hidden">
      {/* Navigation */}
      <NavigationBar />

      {/* Profile Layout 3:2 */}
      <section className="relative min-h-screen flex items-center justify-center starfield">
        <div className="max-w-7xl mx-auto px-lg py-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
            {/* Left: Empleaido thinking */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-[#5ED3D0] rounded-full flex items-center justify-center">
                  <span className="text-9xl">🤔</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-[#5ED3D0]/10 blur-3xl" />
              </div>
            </div>

            {/* Right: Profile details */}
            <div className="bg-[#0E3A41] border-4 border-[#1A434F] p-xl">
              <div className="mb-lg">
                <h1 className="text-4xl font-display font-black tracking-tight uppercase mb-md">
                  SERA
                </h1>
                <div className="flex items-center gap-md">
                  <span className="text-3xl">🧾</span>
                  <div>
                    <p className="text-xl font-display font-black uppercase">Contabilidad RD</p>
                    <p className="text-sm text-[#F3E4C8]/70">Asistente fiscal inteligente</p>
                  </div>
                </div>
              </div>

              {/* Sephirah */}
              <div className="mb-lg">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A434F] text-[#5ED3D0] rounded-lg border-2 border-[#0E3A41]">
                  <span className="w-2 h-2 bg-[#5ED3D0] rounded-full led-pulse" />
                  <span className="font-mono font-bold text-sm uppercase tracking-wider">
                    Netzach
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t-4 border-[#1A434F]/50 pt-md">
                <div className="flex gap-sm mb-md">
                  <button className="px-md py-sm bg-[#5ED3D0] text-[#0E3A41] font-bold uppercase tracking-wider border-2 border-[#0E3A41]">
                    Skills
                  </button>
                  <button className="px-md py-sm bg-[#0E3A41] text-[#F3E4C8]/60 font-bold uppercase tracking-wider border-2 border-[#0E3A41]">
                    Evolución
                  </button>
                  <button className="px-md py-sm bg-[#0E3A41] text-[#F3E4C8]/60 font-bold uppercase tracking-wider border-2 border-[#0E3A41]">
                    Historial
                  </button>
                  <button className="px-md py-sm bg-[#0E3A41] text-[#F3E4C8]/60 font-bold uppercase tracking-wider border-2 border-[#0E3A41]">
                    Integraciones
                  </button>
                </div>

                {/* Skills content */}
                <div className="p-md bg-[#1A434F] border-2 border-[#0E3A41] rounded">
                  <div className="grid grid-cols-2 gap-sm mb-md">
                    <div className="bg-[#0E3A41] p-sm border-2 border-[#5ED3D0] rounded">
                      <h3 className="font-bold text-[#5ED3D0] mb-xs">OCR Facturas</h3>
                      <p className="text-xs">Extrae datos de facturas escaneadas</p>
                    </div>
                    <div className="bg-[#0E3A41] p-sm border-2 border-[#5ED3D0] rounded">
                      <h3 className="font-bold text-[#5ED3D0] mb-xs">ITBIS Mensual</h3>
                      <p className="text-xs">Calcula y reporta ITBIS automáticamente</p>
                    </div>
                    <div className="bg-[#0E3A41] p-sm border-2 border-[#5ED3D0] rounded">
                      <h3 className="font-bold text-[#5ED3D0] mb-xs">Clasificación NCF</h3>
                      <p className="text-xs">Categoriza comprobantes fiscales</p>
                    </div>
                    <div className="bg-[#0E3A41] p-sm border-2 border-[#5ED3D0] rounded">
                      <h3 className="font-bold text-[#5ED3D0] mb-xs">+1 más</h3>
                      <p className="text-xs">Habilidad secreta por descubrir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
