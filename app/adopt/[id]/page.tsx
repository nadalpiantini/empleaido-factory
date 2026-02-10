import Link from 'next/link';
import empleaidos from '@/data/empleaidos.json';

export default async function AdoptEmpleaido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Support both full ID (empleaido-04094) and serial (04094)
  const emp = empleaidos.find((e) => e.id === `empleaido-${id}` || e.id === id || e.serial.toString() === id);

  if (!emp) {
    return (
      <main className="min-h-screen bg-[#0E3A41] flex items-center justify-center">
        <div className="bg-[#1A434F] p-xl rounded-xl border-4 border-[#0E3A41] text-center max-w-lg">
          <span className="text-6xl block mb-lg">🔍</span>
          <h2 className="font-display text-2xl text-[#F3E4C8] mb-md">EMPLEAIDO NO ENCONTRADO</h2>
          <p className="text-[#F3E4C8]/60 mb-xl">Este Empleaido no existe o fue removido del sistema.</p>
          <Link
            href="/"
            className="inline-flex px-xl py-md bg-[#5ED3D0] text-[#0E3A41] font-bold tracking-wider uppercase border-4 border-[#0E3A41]"
          >
            ← VOLVER AL CATÁLOGO
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8]">
      {/* HEADER */}
      <header className="bg-[#F3E4C8] border-b-4 border-[#0E3A41]">
        <div className="max-w-4xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <Link
              href={`/empleaido/${emp.id}`}
              className="px-lg py-sm bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
            >
              ← Back to Profile
            </Link>
            <div className="flex items-center gap-sm">
              <span className="text-[#0E3A41]/50 text-sm">✦</span>
              <span className="text-[#0E3A41]/50 text-sm">✦</span>
            </div>
          </div>
        </div>
      </header>

      {/* CHECKOUT FORM */}
      <section className="py-xl relative">
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-lg">
          <div className="bg-[#1A434F] rounded-xl border-4 border-[#0E3A41] overflow-hidden">
            {/* Summary Header */}
            <div className="border-b-2 border-[#5ED3D0]/30 px-xl py-lg">
              <div className="flex items-center gap-md mb-md">
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
                <span className="text-[#F3E4C8]/40 text-xs tracking-widest">★ ADOPTION CHECKOUT ★</span>
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
              </div>

              <div className="flex items-center gap-xl">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-[#0E3A41] rounded-xl border-4 border-[#0E3A41] flex items-center justify-center">
                    <span className="text-6xl">🤖</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center gap-sm px-md py-xs bg-[#5ED3D0] text-[#0E3A41] rounded mb-md">
                    <span className="w-2 h-2 bg-[#0E3A41] rounded-full" />
                    <span className="text-xs font-bold">#{emp.serial.toString().padStart(5, '0')}</span>
                  </div>

                  <h1 className="font-display text-4xl text-[#F3E4C8] mb-xs">{emp.name}</h1>
                  <p className="text-xl text-[#F3E4C8]/70">{emp.role.main}</p>
                </div>

                <div className="text-right">
                  <p className="text-[#F3E4C8]/60 text-xs tracking-widest uppercase mb-sm">MONTHLY INVESTMENT</p>
                  <p className="font-display text-5xl text-[#5ED3D0]">${emp.pricing.monthly_usd}</p>
                  <p className="text-[#F3E4C8]/60">per month</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="px-xl py-lg space-y-lg">
              {/* Account Information */}
              <div>
                <h3 className="font-display text-xl text-[#5ED3D0] mb-md">ACCOUNT INFORMATION</h3>
                <div className="grid md:grid-cols-2 gap-md">
                  <div>
                    <label className="block text-[#F3E4C8]/60 text-sm mb-sm">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-[#F3E4C8]/60 text-sm mb-sm">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="font-display text-xl text-[#5ED3D0] mb-md">COMPANY INFORMATION</h3>
                <div className="grid md:grid-cols-2 gap-md">
                  <div>
                    <label className="block text-[#F3E4C8]/60 text-sm mb-sm">Company Name</label>
                    <input
                      type="text"
                      className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-[#F3E4C8]/60 text-sm mb-sm">Role</label>
                    <input
                      type="text"
                      className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                      placeholder="Your role"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div>
                <h3 className="font-display text-xl text-[#5ED3D0] mb-md">BILLING INFORMATION</h3>
                <div className="space-y-md">
                  <div>
                    <label className="block text-[#F3E4C8]/60 text-sm mb-sm">Card Number *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-md">
                    <div>
                      <label className="block text-[#F3E4C8]/60 text-sm mb-sm">Expiry Date *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-[#F3E4C8]/60 text-sm mb-sm">CVC *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="block text-[#F3E4C8]/60 text-sm mb-sm">Billing Zip</label>
                      <input
                        type="text"
                        className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#0E3A41] rounded focus:border-[#5ED3D0] outline-none"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="border-t-2 border-[#0E3A41] pt-lg">
                <h3 className="font-display text-xl text-[#5ED3D0] mb-md">SELECT PLAN</h3>
                <div className="grid md:grid-cols-2 gap-md">
                  <label className="relative cursor-pointer">
                    <input type="radio" name="plan" value="monthly" defaultChecked className="peer sr-only" />
                    <div className="p-md bg-[#0E3A41] border-2 border-[#0E3A41] rounded peer-checked:border-[#5ED3D0] transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#F3E4C8]">Monthly</p>
                          <p className="text-sm text-[#F3E4C8]/60">Pay monthly</p>
                        </div>
                        <p className="font-display text-2xl text-[#5ED3D0]">${emp.pricing.monthly_usd}/mo</p>
                      </div>
                    </div>
                  </label>

                  {emp.pricing.annual_usd && (
                    <label className="relative cursor-pointer">
                      <input type="radio" name="plan" value="annual" className="peer sr-only" />
                      <div className="p-md bg-[#0E3A41] border-2 border-[#0E3A41] rounded peer-checked:border-[#5ED3D0] transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#F3E4C8]">Annual</p>
                            <p className="text-sm text-[#F3E4C8]/60">
                              Save ${((emp.pricing.monthly_usd * 12) - emp.pricing.annual_usd).toFixed(0)}/year
                            </p>
                          </div>
                          <p className="font-display text-2xl text-[#5ED3D0]">${emp.pricing.annual_usd}/yr</p>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t-2 border-[#0E3A41] pt-lg">
                <button
                  type="submit"
                  className="purchase-button cta-button w-full py-lg bg-[#5ED3D0] text-[#0E3A41] font-black text-xl tracking-wider uppercase border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
                >
                  ⚡ COMPLETE ADOPTION →
                </button>

                <p className="text-[#F3E4C8]/40 text-center text-sm mt-md">
                  By completing this adoption, you agree to our Terms of Service. No commitment, cancel anytime.
                </p>
              </div>
            </form>
          </div>

          {/* Security Note */}
          <div className="mt-lg text-center">
            <p className="text-[#F3E4C8]/40 text-sm flex items-center justify-center gap-sm">
              <span>🔒</span>
              <span>Secure 256-bit SSL encrypted payment</span>
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A434F] border-t-4 border-[#0E3A41] py-lg">
        <div className="max-w-4xl mx-auto px-lg text-center">
          <div className="flex items-center justify-center gap-md mb-md">
            <div className="h-px flex-1 bg-[#0E3A41] max-w-32" />
            <span className="text-[#F3E4C8]/40 text-xs tracking-widest">EMPLEAIDO FACTORY</span>
            <div className="h-px flex-1 bg-[#0E3A41] max-w-32" />
          </div>
        </div>
      </footer>
    </main>
  );
}
