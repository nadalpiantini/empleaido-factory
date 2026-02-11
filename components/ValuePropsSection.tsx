
interface ValueProp {
  icon: string;
  title: string;
  description: string;
}

interface ValuePropsSectionProps {
  title?: string;
  props?: ValueProp[];
}

export function ValuePropsSection({
  title = '¿POR QUÉ EMPLEAIDOS?',
  props = [
    {
      icon: '🧬',
      title: 'IDENTIDAD ÚNICA',
      description: 'Cada Empleaido tiene personalidad, habilidades y un camino de crecimiento único.'
    },
    {
      icon: '🎯',
      title: 'DOMINIO EXPERTO',
      description: 'Especializados en áreas específicas. Sin IA genérica. Expertise real que se acumula.'
    },
    {
      icon: '📈',
      title: 'EVOLUCIÓN CONTINUA',
      description: 'Aprenden de tu workflow, se adaptan a tu estilo, se vuelven más valiosos.'
    }
  ]
}: ValuePropsSectionProps) {
  return (
    <section className="relative py-3xl bg-[#1A434F]">
      {/* Top zigzag border */}
      <div
        className="absolute top-0 left-0 right-0 h-8 bg-[#0E3A41]"
        style={{
          clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)'
        }}
      />

      <div className="max-w-6xl mx-auto px-lg pt-xl">
        <h3 className="text-huge font-display font-black tracking-tight text-center mb-2xl text-[#F3E4C8]">
          {title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {props.map((prop, i) => (
            <div
              key={prop.title}
              className="bg-[#1A434F] border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:border-[#5ED3D0] transition-colors duration-fast cursor-pointer p-xl group"
              style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -2 : 2}deg)` }}
            >
              <div className="text-6xl mb-md flex justify-center items-center">
                <span className="bg-[#5ED3D0]/20 rounded-full w-24 h-24 flex items-center justify-center text-4xl">
                  {prop.icon}
                </span>
              </div>
              <h4 className="text-xl font-display font-black text-[#F3E4C8] uppercase tracking-wide mb-sm text-center">
                {prop.title}
              </h4>
              <p className="text-[#F3E4C8]/80 font-medium leading-relaxed text-center">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
