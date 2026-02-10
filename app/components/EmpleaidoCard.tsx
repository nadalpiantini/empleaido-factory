/**
 * FACTORY FLOOR UI - EMPLEAIDO CARD
 *
 * Card vertical con numeración
 * Hover: micro-zoom + glow + speed-lines
 * Bordes negros gruesos (2-3px)
 * Grid rígido 8px base
 */

import Link from 'next/link';

interface EmpleaidoCardProps {
  id: string;
  serial: number;
  name: string;
  role: {
    main: string;
    sub: string;
    tier: 'base' | 'pro' | 'deluxe';
  };
  sephirot: {
    primary: string;
  };
  skills: {
    native: string[];
  };
  pricing: {
    monthly_usd: number;
    annual_usd?: number;
  };
  index?: number; // Card number for collection display
}

export function EmpleaidoCard({
  id,
  serial,
  name,
  role,
  sephirot,
  skills,
  pricing,
  index = 1
}: EmpleaidoCardProps) {
  const getRoleEmoji = (roleMain: string) => {
    const map: Record<string, string> = {
      'Contabilidad RD': '🧾',
      'Growth Marketing': '📣',
      'Operaciones': '🗂️',
      'CFO Estrategico': '💰',
      'Productividad Personal': '⏱️',
      'UX Design': '🎨',
    };
    return map[roleMain] || '🤖';
  };

  const getTierStyles = (tier: string) => {
    const styles = {
      base: 'bg-[#F3E4C8] text-[#0E3A41] border-[#0E3A41]',
      pro: 'bg-[#5ED3D0] text-[#0E3A41] border-[#5ED3D0]',
      deluxe: 'bg-yellow-500 text-[#0E3A41] border-yellow-500',
    };
    return styles[tier as keyof typeof styles] || styles.base;
  };

  return (
    <Link href={`/empleaido/${id}`} className="block group" aria-label={`View ${name} details`}>
      {/* CARD CONTAINER - THICK BORDERS */}
      <div className="empleaido-card relative bg-[#F3E4C8] border-4 border-[#0E3A41]
                      shadow-[6px_6px_0_#0E3A41]
                      group-hover:shadow-[10px_10px_0_#0E3A41]
                      group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]
                      transition-all duration-200 overflow-hidden">

        {/* SPEED LINES ON HOVER */}
        <div className="absolute top-0 right-0 w-16 h-1 bg-[#5ED3D0] opacity-0
                          group-hover:opacity-50 transition-opacity" />
        <div className="absolute top-2 right-0 w-12 h-1 bg-[#5ED3D0] opacity-0
                          group-hover:opacity-40 transition-opacity delay-75" />
        <div className="absolute bottom-0 left-0 w-20 h-1 bg-[#5ED3D0] opacity-0
                          group-hover:opacity-50 transition-opacity" />

        {/* COLLECTION NUMBER */}
        <div className="absolute top-3 left-3 z-20">
          <div className="font-mono text-3xl font-black text-[#0E3A41] opacity-30">
            {String(index).padStart(2, '0')}
          </div>
        </div>

        {/* TIER BADGE */}
        <div className="absolute top-3 right-3 z-20">
          <div className={`px-3 py-1 border-2 border-[#0E3A41] font-mono text-xs font-bold uppercase
                          ${getTierStyles(role.tier)}`}>
            ★ {role.tier}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative bg-[#1A434F] p-6 h-full">
          {/* EMPLEAIDO IMAGE */}
          <div className="mb-4 relative z-10 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#5ED3D0] blur-xl opacity-30 rounded-full" />
              <img
                src="/empleaido/empleaido head logo ChatGPT Image May 8, 2025, 03_56_40 PM.png"
                alt={name}
                className="relative h-32 w-32 object-contain"
              />
            </div>
          </div>

          {/* NAME */}
          <h3 className="font-display text-3xl font-black text-[#F3E4C8] mb-2 text-center">
            {name}
          </h3>

          {/* SERIAL */}
          <div className="font-mono text-xs text-[#5ED3D0] mb-4">
            SER:#{String(serial).padStart(4, '0')}
          </div>

          {/* ROLE */}
          <div className="mb-4">
            <div className="font-mono text-sm text-[#5ED3D0] mb-1">
              [{role.main.toUpperCase()}]
            </div>
            <div className="text-gray-400 text-sm">
              for {role.sub}
            </div>
          </div>

          {/* SKILLS PREVIEW */}
          <div className="mb-4">
            <div className="font-mono text-xs text-gray-500 mb-2">
              NATIVE SKILLS:
            </div>
            <div className="space-y-1">
              {skills.native.slice(0, 3).map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#5ED3D0]" />
                  <div className="text-xs text-gray-300 font-mono">
                    {skill}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRICING */}
          <div className="border-t-2 border-[#0E3A41] pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-gray-500">MONTHLY</div>
                <div className="text-2xl font-black text-[#F3E4C8]">
                  ${pricing.monthly_usd}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-gray-500">ANNUAL</div>
                <div className="text-xl font-black text-[#5ED3D0]">
                  ${pricing.annual_usd}
                </div>
              </div>
            </div>
          </div>

          {/* STATUS INDICATOR */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 animate-pulse" />
            <div className="font-mono text-xs text-green-500">ACTIVE</div>
          </div>
        </div>

        {/* HOVER GLOW */}
        <div className="absolute inset-0 border-4 border-[#5ED3D0] opacity-0
                        group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </Link>
  );
}
