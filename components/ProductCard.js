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
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Product Image - Optimized */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden will-change-transform">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className={`font-bold text-lg sm:text-xl ${colorClass}`}>
            {formatPrice(product.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`text-white p-2.5 sm:p-3 rounded-xl transition-all hover:scale-105 shadow-md ${bgClass} ${isAdding ? 'scale-90' : ''}`}
          >
            {isAdding ? (
              <Check className="w-5 h-5 animate-bounce" />
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
