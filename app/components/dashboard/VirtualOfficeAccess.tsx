'use client';

import { motion } from 'framer-motion';
import { Building2, ArrowRight, Users, Settings, DollarSign, Megaphone, Laptop, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const departments = [
  { name: 'HR', icon: Users, color: 'bg-pink-500' },
  { name: 'Operations', icon: Settings, color: 'bg-blue-500' },
  { name: 'Finance', icon: DollarSign, color: 'bg-green-500' },
  { name: 'Marketing', icon: Megaphone, color: 'bg-purple-500' },
  { name: 'Technology', icon: Laptop, color: 'bg-cyan-500' },
  { name: 'Innovation', icon: Lightbulb, color: 'bg-yellow-500' },
];

export function VirtualOfficeAccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Virtual Office</h3>
          <p className="text-sm text-slate-400">Navigate your departments</p>
        </div>
        <div className="p-3 bg-cyan-500/20 rounded-xl">
          <Building2 className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <motion.div
              key={dept.name}
              whileHover={{ scale: 1.05 }}
              className={`${dept.color} p-4 rounded-xl flex items-center justify-center`}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          );
        })}
      </div>

      <Link href="/virtual-office">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          Enter Office
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </Link>
    </motion.div>
  );
}
