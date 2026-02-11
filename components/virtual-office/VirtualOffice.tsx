'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  DollarSign,
  Megaphone,
  Laptop,
  Lightbulb,
  ArrowRight,
  Activity,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { empleaidos } from '@/data/empleaidos';

// =====================================================
// TYPES
// =====================================================

interface OfficeRoom {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  type: 'empleaido' | 'common';
  empleaidoId?: string;
  stats: {
    active: number;
    tasks: number;
    efficiency: number;
  };
}

// =====================================================
// OFFICE LAYOUT - 6 ROOMS
// =====================================================

const officeRooms: OfficeRoom[] = [
  // 5 Empleaido Offices
  {
    id: 'sera-office',
    name: 'Oficina de SERA',
    icon: DollarSign,
    color: 'bg-teal-500',
    description: 'Finanzas y Contabilidad - Facturación, Gastos, Reportes, Impuestos DGII',
    type: 'empleaido',
    empleaidoId: 'sera-001',
    stats: { active: 8, tasks: 12, efficiency: 97 }
  },
  {
    id: 'kael-office',
    name: 'Oficina de KAEL',
    icon: Megaphone,
    color: 'bg-red-500',
    description: 'Marketing y Crecimiento - Redes Sociales, Email Marketing, SEO, Contenido',
    type: 'empleaido',
    empleaidoId: 'kael-002',
    stats: { active: 15, tasks: 22, efficiency: 89 }
  },
  {
    id: 'nora-office',
    name: 'Oficina de NORA',
    icon: Laptop,
    color: 'bg-cyan-500',
    description: 'Operaciones y Procesos - Gestión de Proyectos, Optimización, Documentación',
    type: 'empleaido',
    empleaidoId: 'nora-003',
    stats: { active: 6, tasks: 9, efficiency: 95 }
  },
  {
    id: 'lior-office',
    name: 'Oficina de LIOR',
    icon: Lightbulb,
    color: 'bg-emerald-500',
    description: 'Estrategia y Datos - Análisis, Planificación, KPIs, Decisiones, Forecasting',
    type: 'empleaido',
    empleaidoId: 'lior-004',
    stats: { active: 4, tasks: 7, efficiency: 98 }
  },
  {
    id: 'ziv-office',
    name: 'Oficina de ZIV',
    icon: Sparkles,
    color: 'bg-rose-500',
    description: 'Productividad Personal - Gestión del Tiempo, Metas, Hábitos, Priorización',
    type: 'empleaido',
    empleaidoId: 'ziv-005',
    stats: { active: 10, tasks: 15, efficiency: 92 }
  },
  // Common Area
  {
    id: 'common-room',
    name: 'Sala de Reuniones',
    icon: Users,
    color: 'bg-violet-500',
    description: 'Espacio común para reuniones de equipo, colaboración y brainstorming',
    type: 'common',
    stats: { active: 43, tasks: 65, efficiency: 94 }
  }
];

// =====================================================
// COMPONENTS
// =====================================================

function OfficeRoomCard({ room, onClick }: { room: OfficeRoom; onClick: () => void }) {
  const Icon = room.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className={`absolute inset-0 ${room.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`} />

      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${room.color} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">{room.stats.efficiency}%</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{room.name}</h3>
        <p className="text-sm text-slate-400 mb-4">{room.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-4 h-4" />
              <span>{room.stats.active}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{room.stats.tasks}</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

function OfficeRoomDetail({ room, onBack, onChat }: { room: OfficeRoom; onBack: () => void; onChat: () => void }) {
  const Icon = room.icon;

  // Get empleaido data if this is an empleaido office
  const empleaido = room.type === 'empleaido' && room.empleaidoId
    ? empleaidos.find(e => e.id === room.empleaidoId)
    : null;

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
        Volver a la Oficina
      </button>

      <div className={`${room.color} p-8 rounded-2xl bg-gradient-to-br from-opacity-20 to-opacity-5`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-white/20 rounded-xl">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{room.name}</h2>
            <p className="text-white/80">{room.description}</p>
          </div>
        </div>
        {empleaido && (
          <div className="mt-4 bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-white/80 text-sm">SEPHIROT</p>
                <p className="text-white font-semibold">{empleaido.sephirot.primary}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">NIVEL</p>
                <p className="text-white font-semibold">{empleaido.life.level}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">ENERGÍA</p>
                <p className="text-white font-semibold">{empleaido.life.energy}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">Tareas Activas</span>
          </div>
          <p className="text-3xl font-bold text-white">{room.stats.active}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Completadas</span>
          </div>
          <p className="text-3xl font-bold text-white">{room.stats.tasks}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Eficiencia</span>
          </div>
          <p className="text-3xl font-bold text-white">{room.stats.efficiency}%</p>
        </motion.div>
      </div>

      {empleaido && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {empleaido.skills.native.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30"
              >
                {skill}
              </motion.span>
            ))}
            {empleaido.skills.locked.map((skill, index) => (
              <motion.span
                key={`locked-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (empleaido.skills.native.length + index) * 0.05 }}
                className="px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-sm border border-slate-500/30"
              >
                🔒 {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
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
                <p className="text-sm text-white">Tarea {i} completada exitosamente</p>
                <p className="text-xs text-slate-500">{i * 15} minutos atrás</p>
              </div>
              <Zap className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      </div>

      {empleaido && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onChat}
          className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          Chatear con {empleaido.name}
        </motion.button>
      )}
    </motion.div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export function VirtualOffice() {
  const [selectedRoom, setSelectedRoom] = useState<OfficeRoom | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleChat = () => {
    setShowChat(true);
  };

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
            <h1 className="text-4xl font-bold text-white">Oficina Virtual</h1>
          </div>
          <p className="text-slate-400">
            {selectedRoom
              ? `En ${selectedRoom.name}`
              : 'Navega por las oficinas de tus Empleaidos'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedRoom ? (
            <OfficeRoomDetail
              key="detail"
              room={selectedRoom}
              onBack={() => setSelectedRoom(null)}
              onChat={handleChat}
            />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {officeRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OfficeRoomCard room={room} onClick={() => setSelectedRoom(room)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
