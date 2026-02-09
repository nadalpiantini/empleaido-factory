interface FooterProps {
  version?: string;
  poweredBy?: string;
  tagline?: string;
}

export function Footer({
  version = 'v1.0',
  poweredBy = 'OpenClaw',
  tagline = '✦ TRABAJAR MEJOR, CON UNA SONRISA ✦'
}: FooterProps) {
  return (
    <footer className="border-t-4 border-[#5ED3D0]/20 py-xl bg-[#0E3A41]">
      <div className="max-w-7xl mx-auto px-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-lg">
          {/* Logo */}
          <div className="flex items-center gap-md">
            {/* Placeholder for Empleaido idle */}
            <div className="w-10 h-10 bg-[#5ED3D0] rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <p className="font-display font-black text-lg uppercase tracking-wide text-[#F3E4C8]">EMPLEAIDO FACTORY</p>
              <p className="text-xs text-[#F3E4C8]/50 font-mono">
                {version} · Powered by {poweredBy}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-xl text-sm font-medium">
            <a href="#" className="text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors">Docs</a>
            <a href="#" className="text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors">API</a>
            <a href="#" className="text-[#F3E4C8]/60 hover:text-[#5ED3D0] transition-colors">GitHub</a>
          </div>

          {/* Tagline */}
          <p className="text-sm text-[#F3E4C8]/40 font-mono">
            {tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
