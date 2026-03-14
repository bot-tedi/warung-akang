'use client';

import { Plus, Check, Package, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { memo, useState } from 'react';

const ProductCard = memo(function ProductCard({ product, variant = 'default' }) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  // Get unit based on category
  const getUnitByCategory = (category) => {
    const unitMap = {
      'sayuran': 'kg',
      'buah': 'kg',
      'cabe_cabean': 'kg',
      'rempah_rempah': 'kg',
      'bawang_bawangan': 'kg',
      'biji_bijian': 'kg',
      'kerupuk': 'pcs',
      'bumbu': 'pcs',
      'Daun': 'pcs',
      'lainnya': 'pcs'
    };
    return unitMap[category] || 'pcs';
  };

  const displayUnit = product.unit || 'pcs';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    setError('');
    try {
      setIsAdding(true);
      await addItem(product);
      setTimeout(() => setIsAdding(false), 800);
    } catch (err) {
      setError(err.message);
      setIsAdding(false);
      setTimeout(() => setError(''), 3000);
    }
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
            {product.category}
          </span>
        </div>

        {/* Stock Indicator */}
        <div className="absolute top-5 right-5">
          <div className={`px-3 py-1.5 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm dark:shadow-lg flex items-center gap-1 ${product.stock <= 0
            ? 'bg-red-500/90 text-white'
            : product.stock <= 10
              ? 'bg-amber-500/90 text-white'
              : 'bg-emerald-500/90 text-white'
            }`}>
            {product.stock <= 0 ? (
              <><AlertTriangle className="w-3 h-3" /> Out of Stock</>
            ) : product.stock <= 10 ? (
              <><Package className="w-3 h-3" /> {product.stock} {displayUnit}</>
            ) : (
              <><Package className="w-3 h-3" /> {product.stock} {displayUnit}</>
            )}
          </div>
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
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-500">Price / {displayUnit}</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.stock <= 10 && product.stock > 0 && (
              <span className="text-[8px] text-amber-500 font-medium mt-1">Only {product.stock} {displayUnit} left</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock <= 0}
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${product.stock <= 0
              ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
              : isAdding
                ? 'bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-600/30'
                : 'bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 shadow-slate-200 dark:shadow-emerald-600/20'
              }`}
          >
            {product.stock <= 0 ? (
              <AlertTriangle className="w-5 h-5 text-white/50" />
            ) : isAdding ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <Plus className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductCard;