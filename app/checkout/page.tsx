'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout submission
    console.log('Checkout submitted:', formData);
  };

  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8]">
      {/* HEADER */}
      <header className="bg-[#F3E4C8] border-b-4 border-[#0E3A41]">
        <div className="max-w-4xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="px-lg py-sm bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
            >
              ← Cart
            </Link>
            <h1 className="font-display text-2xl text-[#0E3A41]">CHECKOUT</h1>
          </div>
        </div>
      </header>

      {/* CHECKOUT FORM */}
      <section className="py-xl relative">
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-lg">
          <form onSubmit={handleSubmit} className="space-y-xl">
            {/* CONTACT INFORMATION SECTION */}
            <div className="bg-[#1A434F] rounded-xl border-4 border-[#0E3A41] p-xl">
              <div className="flex items-center gap-md mb-lg">
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
                <span className="text-[#F3E4C8] text-sm font-bold tracking-wider">📧 CONTACT INFORMATION</span>
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
              </div>

              <div className="space-y-md">
                <div>
                  <label htmlFor="email" className="block text-[#F3E4C8]/80 text-sm font-bold mb-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#F3E4C8]/20 rounded focus:border-[#5ED3D0] outline-none"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-[#F3E4C8]/80 text-sm font-bold mb-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#F3E4C8]/20 rounded focus:border-[#5ED3D0] outline-none"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="bg-[#1A434F] rounded-xl border-4 border-[#0E3A41] p-xl">
              <div className="flex items-center gap-md mb-lg">
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
                <span className="text-[#F3E4C8] text-sm font-bold tracking-wider">💳 PAYMENT INFORMATION</span>
                <div className="h-px flex-1 bg-[#F3E4C8]/20" />
              </div>

              <div className="space-y-md">
                <div>
                  <label htmlFor="cardNumber" className="block text-[#F3E4C8]/80 text-sm font-bold mb-sm">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    required
                    className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#F3E4C8]/20 rounded focus:border-[#5ED3D0] outline-none"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label htmlFor="expiry" className="block text-[#F3E4C8]/80 text-sm font-bold mb-sm">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      required
                      className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#F3E4C8]/20 rounded focus:border-[#5ED3D0] outline-none"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-[#F3E4C8]/80 text-sm font-bold mb-sm">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      required
                      className="w-full px-md py-sm bg-[#0E3A41] text-[#F3E4C8] border-2 border-[#F3E4C8]/20 rounded focus:border-[#5ED3D0] outline-none"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-lg bg-[#5ED3D0] text-[#0E3A41] font-black text-xl tracking-wider uppercase border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
            >
              ⚡ COMPLETE PURCHASE →
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
