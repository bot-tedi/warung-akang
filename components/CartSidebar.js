'use client';

import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartSidebar() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!mounted || !isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-md z-[60] transition-opacity" onClick={closeCart} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl dark:shadow-xl z-[70] flex flex-col animate-slide-in-right border-l border-slate-100 dark:border-slate-700">
        {/* Header */}
        <div className="px-8 py-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-light font-serif italic text-slate-900 dark:text-white">Keranjang</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">Total {items.length} Pesanan</p>
          </div>
          <button onClick={closeCart} className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-8 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-[2.5rem] flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-slate-200 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Belum ada item pilihan</p>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm dark:shadow-lg">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(item.price)}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-50 dark:bg-slate-700 rounded-full p-1 border border-slate-100 dark:border-slate-600">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-8 bg-slate-900 dark:bg-emerald-600 rounded-t-[3rem] text-white dark:text-slate-900">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 dark:text-slate-700 mb-1">Estimated Total</p>
                <h3 className="text-3xl font-light tracking-tighter">{formatPrice(getTotalPrice())}</h3>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="group w-full py-5 bg-emerald-500 dark:bg-white text-slate-900 dark:text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 dark:shadow-lg"
            >
              Secure Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}