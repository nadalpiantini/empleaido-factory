import { VirtualOffice } from '@/components/virtual-office/VirtualOffice';
import Link from 'next/link';

export default function VirtualOfficePage() {
  return (
    <main className="min-h-screen">
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                EMPLEAIDO FACTORY
              </h1>
              <p className="text-sm text-slate-400">
                Virtual Office Workspace
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-[#5ED3D0] text-[#5ED3D0] hover:bg-[#5ED3D0] hover:text-white font-bold rounded-lg transition-colors"
            >
              ← Exit
            </Link>
          </div>
        </div>
      </nav>

      {/* Virtual Office Component */}
      <div className="pt-24">
        <VirtualOffice />
      </div>
    </main>
  );
}
