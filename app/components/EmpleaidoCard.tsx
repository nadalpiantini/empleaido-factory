interface EmpleaidoCardProps {
  id: string;
  serial: number;
  name: string;
  role: { main: string; sub: string; tier: string };
  sephirot: { primary: string; secondary: string[] };
  skills: { native: string[]; locked: string[] };
  pricing: { monthly_usd: number; annual_usd: number };
  index: number;
}

export function EmpleaidoCard({
  id,
  name,
  role,
  pricing,
  index,
}: EmpleaidoCardProps) {
  return (
    <div className="relative rounded border-4 border-black bg-mid overflow-hidden transition-shadow hover:shadow-led">
      {/* Placeholder image – replace with /empleaidos/${id}.png */}
      <div className="flex h-48 items-center justify-center bg-light">
        <span className="text-4xl font-display text-mid">{index}</span>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-xl font-bold text-light">{name}</h3>
        <p className="text-sm text-cyan">{role.main} – {role.tier}</p>
        <p className="mt-2 text-sm text-light">
          ${pricing.monthly_usd}/mes • ${pricing.annual_usd}/año
        </p>
        <button className="mt-3 inline-block rounded border-4 border-black bg-mid px-3 py-1 text-cyan font-semibold hover:shadow-led transition">
          Seleccionar
        </button>
      </div>
      {/* Speed‑line overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent,transparent,rgba(94,211,208,0.15),transparent,transparent)] opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  );
}
