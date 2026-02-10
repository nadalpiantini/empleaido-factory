'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Settings,
  DollarSign,
  Megaphone,
  Laptop,
  Lightbulb,
  ArrowRight,
  Activity,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  stats: {
    active: number;
    tasks: number;
    efficiency: number;
  };
}

const departments: Department[] = [
  {
    id: 'hr',
    name: 'Human Resources',
    icon: Users,
    color: 'bg-pink-500',
    description: 'Manage team members, payroll, and culture',
    stats: { active: 12, tasks: 8, efficiency: 94 }
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: Settings,
    color: 'bg-blue-500',
    description: 'Streamline workflows and processes',
    stats: { active: 24, tasks: 15, efficiency: 89 }
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    color: 'bg-green-500',
    description: 'Budget, accounting, and financial planning',
    stats: { active: 6, tasks: 4, efficiency: 97 }
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    color: 'bg-purple-500',
    description: 'Brand, campaigns, and growth',
    stats: { active: 18, tasks: 22, efficiency: 85 }
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: Laptop,
    color: 'bg-cyan-500',
    description: 'Infrastructure, development, and innovation',
    stats: { active: 15, tasks: 18, efficiency: 92 }
  },
  {
    id: 'innovation',
    name: 'Innovation',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    description: 'R&D, new products, and experiments',
    stats: { active: 9, tasks: 12, efficiency: 88 }
  }
];

function DepartmentCard({ dept, onClick }: { dept: Department; onClick: () => void }) {
  const Icon = dept.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className={`absolute inset-0 ${dept.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`} />

      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${dept.color} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">{dept.stats.efficiency}%</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{dept.name}</h3>
        <p className="text-sm text-slate-400 mb-4">{dept.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-4 h-4" />
              <span>{dept.stats.active}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{dept.stats.tasks}</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

function DepartmentDetail({ dept, onBack }: { dept: Department; onBack: () => void }) {
  const Icon = dept.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowRight className="w-5 h-5 rotate-180" />
        Back to Office
      </button>

      <div className={`${dept.color} p-8 rounded-2xl bg-gradient-to-br from-opacity-20 to-opacity-5`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-white/20 rounded-xl">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{dept.name}</h2>
            <p className="text-white/80">{dept.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">Active Members</span>
          </div>
          <p className="text-3xl font-bold text-white">{dept.stats.active}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Active Tasks</span>
          </div>
          <p className="text-3xl font-bold text-white">{dept.stats.tasks}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Efficiency</span>
          </div>
          <p className="text-3xl font-bold text-white">{dept.stats.efficiency}%</p>
        </motion.div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div className="flex-1">
                <p className="text-sm text-white">Task {i} completed successfully</p>
                <p className="text-xs text-slate-500">{i * 15} minutes ago</p>
              </div>
              <Zap className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function VirtualOffice() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Virtual Office</h1>
          </div>
          <p className="text-slate-400">
            {selectedDept
              ? `Managing ${selectedDept.name} department`
              : 'Navigate through your company departments'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedDept ? (
            <DepartmentDetail
              key="detail"
              dept={selectedDept}
              onBack={() => setSelectedDept(null)}
            />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DepartmentCard dept={dept} onClick={() => setSelectedDept(dept)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
