'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface EmpleaidoCardProps {
  name: string;
  role: string;
  level: number;
  energy: number;
  id?: string;
}

export default function EmpleaidoCard({ name, role, level, energy, id }: EmpleaidoCardProps) {
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 5, repeat: Infinity }}
      className="bg-[#1A434F] border-4 border-[#0E3A41] rounded-xl p-4 space-y-3 shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
    >
      {/* Avatar */}
      <div className="h-24 rounded bg-[#0E3A41] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#5ED3D0] shadow-[0_0_20px_rgba(94,211,208,0.5)]" />
      </div>

      {/* Name & Role */}
      <div>
        <div className="font-display text-xl text-[#F3E4C8]">{name}</div>
        <div className="text-sm text-[#5ED3D0] font-medium">{role}</div>
      </div>

      {/* Energy bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#F3E4C8] font-medium">Energy</span>
          <span className="text-[#5ED3D0] font-bold">{energy}%</span>
        </div>
        <div className="h-2 w-full bg-[#0E3A41] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5ED3D0] rounded-full shadow-[0_0_10px_rgba(94,211,208,0.5)] transition-all"
            style={{ width: `${energy}%` }}
          />
        </div>
      </div>

      {/* Level */}
      <div className="flex items-center justify-between">
        <span className="text-[#F3E4C8] text-sm font-medium">Level</span>
        <span className="text-[#5ED3D0] font-bold text-lg">{level}</span>
      </div>

      {/* CTA Button */}
      <Link
        href={id ? `/dashboard/${id}` : '#'}
        className="block w-full mt-2 px-3 py-2 rounded bg-[#0E3A41] text-[#F3E4C8] text-center text-sm font-bold uppercase tracking-wider hover:bg-[#5ED3D0] hover:text-[#0E3A41] transition border-2 border-[#0E3A41] hover:border-[#5ED3D0]"
      >
        Ver Perfil →
      </Link>
    </motion.div>
  );
}
