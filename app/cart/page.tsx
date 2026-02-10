'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import empleaidos from '@/data/empleaidos.json';

interface CartItem {
  empleaido: typeof empleaidos[0];
  billing: 'monthly' | 'annual';
}

export default function CartPage() {
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const addId = searchParams.get('add');
    if (addId) {
      const empleaido = empleaidos.find(e => e.id === addId);
      if (empleaido) {
        setCartItems([{ empleaido, billing: 'monthly' }]);
      }
    }
  }, [searchParams]);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.billing === 'monthly' ? item.empleaido.pricing.monthly_usd : (item.empleaido.pricing.annual_usd || item.empleaido.pricing.monthly_usd * 12));
  }, 0);

  return (
    <main className="min-h-screen bg-[#0E3A41] text-[#F3E4C8]">
      {/* HEADER */}
      <header className="bg-[#F3E4C8] border-b-4 border-[#0E3A41]">
        <div className="max-w-4xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="px-lg py-sm bg-[#1A434F] text-[#F3E4C8] font-bold text-sm tracking-wider uppercase border-4 border-[#0E3A41] hover:border-[#5ED3D0] transition-colors"
            >
              ← Catalog
            </Link>
            <h1 className="font-display text-2xl text-[#0E3A41]">YOUR CART</h1>
          </div>
        </div>
      </header>

      {/* CART CONTENT */}
      <section className="py-xl relative">
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-lg">
          {cartItems.length === 0 ? (
            <div className="bg-[#1A434F] rounded-xl border-4 border-[#0E3A41] p-xl text-center">
              <span className="text-6xl block mb-lg">🛒</span>
              <h2 className="font-display text-2xl text-[#F3E4C8] mb-md">YOUR CART IS EMPTY</h2>
              <p className="text-[#F3E4C8]/60 mb-xl">Add some AI employees to get started!</p>
              <Link
                href="/"
                className="inline-flex px-xl py-md bg-[#5ED3D0] text-[#0E3A41] font-bold tracking-wider uppercase border-4 border-[#0E3A41]"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-md mb-xl">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-[#1A434F] rounded-xl border-4 border-[#0E3A41] p-lg">
                    <div className="flex items-center gap-md">
                      <div className="text-6xl">🤖</div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl text-[#F3E4C8]">{item.empleaido.name}</h3>
                        <p className="text-[#F3E4C8]/60">{item.empleaido.role.main}</p>
                        <p className="text-[#5ED3D0] font-bold text-lg mt-sm">
                          ${item.billing === 'monthly' ? item.empleaido.pricing.monthly_usd : (item.empleaido.pricing.annual_usd || item.empleaido.pricing.monthly_usd * 12)}/{item.billing === 'monthly' ? 'month' : 'year'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-[#F3E4C8] rounded-xl border-4 border-[#0E3A41] p-lg mb-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[#0E3A41] font-bold text-lg">TOTAL</span>
                  <span className="font-display text-3xl text-[#0E3A41]">${total}/month</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full text-center py-lg bg-[#5ED3D0] text-[#0E3A41] font-black text-xl tracking-wider uppercase border-4 border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] transition-all"
              >
                ⚡ PROCEED TO CHECKOUT →
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
