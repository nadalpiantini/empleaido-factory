import { EmpleaidoCard } from '@/components/EmpleaidoCard';
import { empleaidos } from '@/data/empleaidos';
import Link from 'next/link';

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                EMPLEAIDO CATALOG
              </h1>
              <p className="text-slate-300">
                Choose your AI-powered employee
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-[#5ED3D0] text-[#5ED3D0] hover:bg-[#5ED3D0] hover:text-white font-bold rounded-lg transition-colors"
            >
              ← Back Home
            </Link>
          </div>

          {/* Tier Filter */}
          <div className="flex gap-4 mb-8">
            <button className="px-4 py-2 bg-[#5ED3D0] text-[#0E3A41] font-bold rounded-lg">
              All Tiers
            </button>
            <button className="px-4 py-2 border-2 border-[#5ED3D0] text-[#5ED3D0] hover:bg-[#5ED3D0] hover:text-white font-bold rounded-lg transition-colors">
              Base ($49)
            </button>
            <button className="px-4 py-2 border-2 border-[#5ED3D0] text-[#5ED3D0] hover:bg-[#5ED3D0] hover:text-white font-bold rounded-lg transition-colors">
              Pro ($99)
            </button>
            <button className="px-4 py-2 border-2 border-[#5ED3D0] text-[#5ED3D0] hover:bg-[#5ED3D0] hover:text-white font-bold rounded-lg transition-colors">
              Deluxe ($199)
            </button>
          </div>
        </div>
      </section>

      {/* Empleaidos Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

        {/* Empty State (if no empleaidos) */}
        {empleaidos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-slate-400">
              No empleaidos available at the moment.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
