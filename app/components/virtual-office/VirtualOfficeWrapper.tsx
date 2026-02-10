'use client';

/**
 * VirtualOfficeWrapper - Main entry point for Virtual Office
 *
 * Provides the interactive department navigation interface
 */

import { Suspense } from 'react';
import { VirtualOffice } from './VirtualOffice';

export function VirtualOfficeWrapper() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading Virtual Office...</div>
      </div>
    }>
      <VirtualOffice />
    </Suspense>
  );
}
