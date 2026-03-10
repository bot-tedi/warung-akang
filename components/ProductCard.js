'use client';

import { Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { memo, useState } from 'react';

const ProductCard = memo(function ProductCard({ product, variant = 'default' }) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const isAsinan = variant === 'asinan' || product.type === 'asinan_sayur';
  const themeColor = isAsinan ? 'emerald' : 'emerald'; // Konsisten profesional

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-700">
        <img
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Tag */}
        <div className="absolute top-5 left-5">
          <span className="px-4 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white shadow-sm dark:shadow-lg">
            {isAsinan ? 'Signature' : 'Fresh Market'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-light tracking-tight text-slate-900 dark:text-white mb-2 font-serif italic">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-light line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-500">Price / Unit</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isAdding
                ? 'bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-600/30'
                : 'bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 shadow-slate-200 dark:shadow-emerald-600/20'
              }`}
          >
            {isAdding ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <Plus className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;