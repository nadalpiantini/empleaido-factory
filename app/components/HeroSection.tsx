export function HeroSection() {
  return (
    <section className="relative flex h-[70vh] items-center justify-center bg-mid bg-halftone">
      {/* Optional starfield overlay (you can add a PNG later) */}
      <div className="absolute inset-0 bg-[url('/starfield.png')] bg-cover opacity-30" />

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-display font-black uppercase text-light drop-shadow-[0_0_8px_#5ED3D0]">
          Empleaido Factory
        </h1>
        <p className="mt-4 text-lg text-light">
          la fuerza laboral AI del futuro, estilo retro‑sci‑fi.
        </p>
        <a
          href="/catalog"
          className="mt-6 inline-block rounded border-4 border-black bg-mid px-6 py-3 text-cyan font-semibold hover:shadow-led transition"
        >
          Ver Catálogo
        </a>
      </div>
    </section>
  );
}
