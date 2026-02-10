'use client';

import Link from 'next/link';
import { EmpleaidoCard } from '../components/EmpleaidoCard';
import catalogData from '../../data/empleaidos.json';
import type { Empleaido } from '../../lib/types';
import { useState, useMemo } from 'react';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSephirot, setSelectedSephirot] = useState<string>('all');

  // Extract unique categories and sephirot attributes
  const categories = useMemo(() => {
    const cats = new Set(catalogData.map((e: Empleaido) => e.role.main));
    return ['all', ...Array.from(cats)];
  }, []);

  const sephirotAttributes = useMemo(() => {
    const seps = new Set(catalogData.map((e: Empleaido) => e.sephirot.primary));
    return ['all', ...Array.from(seps)];
  }, []);

  // Filter empleaidos based on search and filters
  const filteredEmpleaidos = useMemo(() => {
    return (catalogData as Empleaido[]).filter((empleaido) => {
      const matchesSearch =
        searchTerm === '' ||
        empleaido.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleaido.role.main.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleaido.role.sub.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || empleaido.role.main === selectedCategory;

      const matchesSephirot =
        selectedSephirot === 'all' || empleaido.sephirot.primary === selectedSephirot;

      return matchesSearch && matchesCategory && matchesSephirot;
    });
  }, [searchTerm, selectedCategory, selectedSephirot]);

  return (
    <main className="min-h-screen bg-[#1A434F]">
      {/* HEADER */}
      <header className="bg-[#F3E4C8] border-b-4 border-[#0E3A41]">
        <div className="max-w-4xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="px-lg py-sm bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
            >
              ← Home
            </Link>
            <h1 className="font-display text-2xl text-[#0E3A41]">CATALOG</h1>
          </div>
        </div>
      </header>

      {/* CATALOG SECTION */}
      <section className="relative py-20 px-8">
        {/* SECTION HEADER */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center gap-6 mb-4">
            <div className="font-mono text-xs text-[#5ED3D0] tracking-[0.3em]">
              ◄[SECTION 01]►
            </div>
            <div className="h-px flex-1 bg-[#5ED3D0]" />
          </div>

          <h2 className="font-display text-5xl font-black text-[#F3E4C8] mb-4">
            WORKFORCE CATALOG
          </h2>

          <div className="font-mono text-sm text-[#5ED3D0] max-w-2xl mb-8">
            &gt; SELECT YOUR AI EMPLOYEE. ALL UNITS COME WITH OPENCLAW WORKSPACE INCLUDED.
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="space-y-4 mb-8">
            {/* Search Bar */}
            <div>
              <input
                type="search"
                placeholder="Search by name, role, or skill..."
                className="catalog-search w-full px-lg py-md bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#5ED3D0]/30 rounded-lg focus:border-[#5ED3D0] outline-none font-mono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div className="category-filter">
                <label className="block text-[#5ED3D0] text-xs font-mono mb-2">
                  ▸ FILTER BY CATEGORY
                </label>
                <select
                  className="w-full px-lg py-md bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#5ED3D0]/30 rounded-lg focus:border-[#5ED3D0] outline-none font-mono"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'ALL CATEGORIES' : cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sephirot Filter */}
              <div className="sephirot-filter">
                <label className="block text-[#5ED3D0] text-xs font-mono mb-2">
                  ▸ FILTER BY SEPHIROT
                </label>
                <select
                  className="w-full px-lg py-md bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#5ED3D0]/30 rounded-lg focus:border-[#5ED3D0] outline-none font-mono"
                  value={selectedSephirot}
                  onChange={(e) => setSelectedSephirot(e.target.value)}
                >
                  {sephirotAttributes.map((sep) => (
                    <option key={sep} value={sep}>
                      {sep === 'all' ? 'ALL SEPHIROT' : sep.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="font-mono text-xs text-[#5ED3D0]/80">
              [FOUND: {filteredEmpleaidos.length} UNITS]
            </div>
          </div>
        </div>

        {/* CATALOG GRID - RIGID 8px GRID */}
        <div className="max-w-7xl mx-auto">
          {filteredEmpleaidos.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl block mb-lg">🔍</span>
              <h3 className="font-display text-2xl text-[#F3E4C8] mb-md">NO UNITS FOUND</h3>
              <p className="text-[#F3E4C8]/60 font-mono">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEmpleaidos.map((empleaido, index) => (
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
          )}
        </div>

        {/* SECTION FOOTER */}
        <div className="max-w-7xl mx-auto mt-16 flex items-center justify-between">
          <div className="font-mono text-xs text-[#5ED3D0]">
            [SYS.STATUS: ALL UNITS OPERATIONAL]
          </div>
          <div className="font-mono text-xs text-[#5ED3D0]">
            ◄[PAGE 01]►
          </div>
        </div>
      </section>
    </main>
  );
}
