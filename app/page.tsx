import { HeroSection } from '@/components/HeroSection';
import { EmpleaidoCard } from '@/components/EmpleaidoCard';
import { empleaidos } from '@/data/empleaidos';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8] font-ui overflow-x-hidden">
      {/* ASTROBOY Hero Section */}
      <HeroSection />

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
