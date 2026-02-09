'use client';

import Link from 'next/link';
import { EmpleaidoCard } from '../components/EmpleaidoCard';
import empleaidos from '../../data/empleaidos.json';
import type { Empleaido } from '../../lib/types';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0E3A41] text-[#F3E4C8] flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1A434F] border-r-4 border-[#0E3A41] p-4 space-y-4">
        <div className="text-xl font-bold font-display text-[#F3E4C8]">EMPLEAIDO</div>

        <nav className="space-y-2 text-sm">
          <button className="w-full text-left px-3 py-2 rounded bg-[#5ED3D0] text-[#0E3A41] font-bold">Dashboard</button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-[#0E3A41] text-[#F3E4C8] font-medium">Workers</button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-[#0E3A41] text-[#F3E4C8] font-medium">Docs</button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-[#0E3A41] text-[#F3E4C8] font-medium">API</button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-[#0E3A41] text-[#F3E4C8] font-medium">Settings</button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display text-[#F3E4C8]">Dashboard</h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#F3E4C8] font-medium">Factory Active</span>
            <span className="w-3 h-3 rounded-full bg-[#5ED3D0] animate-pulse shadow-[0_0_10px_rgba(94,211,208,0.6)]" />
          </div>
        </header>

        {/* KPI ROW */}
        <section className="grid grid-cols-4 gap-4">
          {[
            { label: 'Empleaidos Activos', value: '14' },
            { label: 'Energía Promedio', value: '57%' },
            { label: 'Tareas Hoy', value: '32' },
            { label: 'En Producción', value: '4' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#1A434F] border-2 border-[#0E3A41] rounded-lg p-4">
              <div className="text-sm text-[#F3E4C8] font-medium">{kpi.label}</div>
              <div className="text-3xl font-bold text-[#5ED3D0]">{kpi.value}</div>
            </div>
          ))}
        </section>

        {/* FACTORY STATUS */}
        <div className="flex items-center gap-2 text-sm text-[#F3E4C8] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#5ED3D0] animate-ping" />
          La fábrica nunca duerme
        </div>

        {/* EMPLEAIDOS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(empleaidos as Empleaido[]).map((emp, index) => (
            <EmpleaidoCard
              key={emp.id}
              id={emp.id}
              serial={emp.serial}
              name={emp.name}
              role={emp.role}
              sephirot={emp.sephirot}
              skills={emp.skills}
              pricing={emp.pricing}
              index={index + 1}
            />
          ))}
        </section>

        {/* QUICK ASSIGN PANEL */}
        <section className="grid grid-cols-3 gap-6">

          {/* Main content left - placeholder */}
          <div className="col-span-2" />

          {/* Quick Assign */}
          <aside className="bg-[#1A434F] border-4 border-[#0E3A41] rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-[#F3E4C8] text-lg">Asignación rápida</h3>

            {['KAEL', 'SERA', 'NORA'].map((name) => (
              <button
                key={name}
                className="w-full flex items-center justify-between px-3 py-2 rounded bg-[#0E3A41] text-[#F3E4C8] font-bold hover:bg-[#5ED3D0] hover:text-[#0E3A41] transition"
              >
                {name}
                <span className="text-[#5ED3D0]">→</span>
              </button>
            ))}
          </aside>

        </section>

        {/* BACK TO CATALOG */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-2 border-[#0E3A41] hover:border-[#5ED3D0] hover:text-[#5ED3D0] transition-all rounded"
          >
            ← Volver al Catálogo
          </Link>
        </div>

      </main>
    </div>
  );
}
