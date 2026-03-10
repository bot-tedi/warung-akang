'use client';

import { Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { memo, useState } from 'react';

const ProductCard = memo(function ProductCard({ product, variant = 'default' }) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  // Determine color scheme based on variant
  const isAsinan = variant === 'asinan' || product.type === 'asinan_sayur';
  const colorClass = isAsinan ? 'text-orange-600' : 'text-emerald-600';
  const bgClass = isAsinan ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30';
  const badgeClass = isAsinan ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product);
    // Visual feedback animation
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
      {/* Product Image - Professional */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm font-medium">No Image</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeClass} backdrop-blur-sm`}>
          {isAsinan ? 'Asinan' : 'Sayur'}
        </div>
      </div>

      {/* Product Info - Professional */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 line-clamp-1 group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className={`font-bold text-lg sm:text-xl ${colorClass}`}>
              {formatPrice(product.price)}
            </span>
            <span className="text-gray-400 text-xs block">/item</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg ${bgClass} ${isAdding ? 'scale-95' : ''}`}
          >
            {isAdding ? (
              <Check className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
