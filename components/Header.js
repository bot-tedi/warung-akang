'use client';

import { ShoppingCart, Leaf, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useState, useEffect } from 'react';

const Header = memo(function Header() {
  const { toggleCart, items } = useCartStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const showBack = pathname !== '/';

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          {showBack && (
            <Link href="/" className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-all active:scale-90">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 dark:bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg dark:shadow-emerald-600/25">
              <Leaf className="w-5 h-5 text-emerald-400 dark:text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-xs uppercase tracking-[0.3em] text-slate-900 dark:text-white">Warung</span>
              <span className="font-serif italic text-emerald-600 dark:text-emerald-400 text-lg lowercase tracking-normal">Akang</span>
            </div>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-all active:scale-90"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="group relative flex items-center gap-3 bg-slate-900 dark:bg-emerald-600 pl-5 pr-2 py-2 rounded-full transition-all hover:bg-slate-800 dark:hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-600/20 active:scale-95 shadow-lg dark:shadow-emerald-600/25"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 dark:text-slate-900">Cart</span>
            <div className="relative bg-white/10 p-2 rounded-full">
              <ShoppingCart className="w-4 h-4 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 dark:bg-white text-white dark:text-emerald-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900 dark:ring-emerald-600">
                  {totalItems}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;