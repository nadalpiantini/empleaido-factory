import { EmpleaidoCard } from '@/components/EmpleaidoCard';
import { empleaidos } from '@/data/empleaidos';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8] font-ui overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center starfield">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-lg py-3xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight uppercase mb-lg">
              EMPLEAIDO FACTORY
            </h1>
            <p className="text-xl md:text-2xl text-[#F3E4C8]/80 mb-xl max-w-3xl mx-auto">
              Adopta empleados AI con personalidades únicas y skills que crecen con tu negocio
            </p>
            <div className="flex flex-col sm:flex-row gap-md justify-center">
              <a
                href="/catalog"
                className="px-xl py-lg bg-[#5ED3D0] hover:bg-[#4bc4b0] text-[#0E3A41] font-display font-bold uppercase tracking-wider border-2 border-[#0E3A41] transition-all"
              >
                Ver Catálogo
              </a>
              <a
                href="/virtual-office"
                className="px-xl py-lg border-2 border-[#5ED3D0] text-[#5ED3D0] hover:bg-[#5ED3D0] hover:text-[#0E3A41] font-display font-bold uppercase tracking-wider transition-all"
              >
                Entrar a la Oficina
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Empleaidos Showcase */}
      <section className="max-w-7xl mx-auto px-lg py-3xl">
        <h2 className="text-4xl font-display font-black uppercase text-center mb-xl">
          Conoce a los Empleaidos Fundadores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          {empleaidos.map((empleaido, index) => (
            <EmpleaidoCard
              key={empleaido.id}
              id={empleaido.id}
              serial={empleaido.serial}
              name={empleaido.name}
              role={empleaido.role}
              sephirot={empleaido.sephirot}
              skills={empleaido.skills}
              pricing={empleaido.pricing}
              index={index + 1}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
