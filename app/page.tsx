import { EmpleaidoCard } from '@/components/EmpleaidoCard';
import { empleaidos } from '@/data/empleaidos';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              EMPLEAIDO FACTORY
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Adopt AI-powered employees with unique personalities and skills that grow with your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/catalog"
                className="px-8 py-4 bg-[#5ED3D0] hover:bg-[#4bc4b0] text-white font-bold rounded-lg transition-colors"
              >
                View Catalog
              </a>
              <a
                href="/virtual-office"
                className="px-8 py-4 border-2 border-[#5ED3D0] text-[#5ED3D0] hover:bg-[#5ED3D0] hover:text-white font-bold rounded-lg transition-colors"
              >
                Enter Office
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Empleaidos Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Meet Our Founding Empleaidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {empleaidos.map((empleaido) => (
            <EmpleaidoCard
              key={empleaido.id}
              empleaido={empleaido}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
