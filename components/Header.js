'use client';

import { ShoppingCart, Leaf, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

const Header = memo(function Header() {
  const { toggleCart, items } = useCartStore();
  const pathname = usePathname();
  
  // Calculate total items directly from state for reactivity
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Show back button if not on home page
  const showBack = pathname !== '/';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showBack ? (
              <>
                <Link 
                  href="/" 
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <Link href="/" className="flex items-center gap-2">
                  <div className="bg-emerald-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg sm:text-xl text-gray-800 hidden sm:block">
                    Warung <span className="text-emerald-500">Akang</span>
                  </span>
                </Link>
              </>
            ) : (
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-emerald-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-bold text-lg sm:text-xl text-gray-800">
                  Warung <span className="text-emerald-500">Akang</span>
                </span>
              </Link>
            )}
          </div>

          {/* Right Section - Cart Button */}
          <button
            onClick={toggleCart}
            className="relative flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 sm:px-4 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              Keranjang
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-emerald-500 text-white text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-200">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
