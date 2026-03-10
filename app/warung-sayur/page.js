'use client';

import { useEffect, useState } from 'react';
import { fetchProducts, fetchProductsByTypeAndCategory } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import { 
  ShoppingBag, 
  Sparkles, 
  Leaf, 
  Carrot, 
  Apple, 
  Flame,
  ChevronRight,
  Search,
  SlidersHorizontal
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: ShoppingBag },
  { id: 'sayuran', name: 'Sayuran', icon: Carrot },
  { id: 'buah', name: 'Buah', icon: Apple },
  { id: 'bumbu', name: 'Bumbu', icon: Flame },
  { id: 'sembako', name: 'Sembako', icon: ShoppingBag },
  { id: 'lainnya', name: 'Lainnya', icon: Leaf },
];

// Simplified animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function WarungSayurPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { items, getTotalItems } = useCartStore();
  
  // Calculate total items directly for reactivity
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        let data;
        if (activeCategory === 'all') {
          data = await fetchProductsByTypeAndCategory('warung_sayur');
        } else {
          data = await fetchProductsByTypeAndCategory('warung_sayur', activeCategory);
        }
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Gagal memuat produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [activeCategory]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <Header />
      <CartSidebar />

      {/* Hero Section - Optimized for LCP */}
      <section className="relative bg-emerald-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
            <div className="text-center lg:text-left w-full lg:w-1/2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Warung Sayur
                <span className="block text-emerald-100 text-lg sm:text-xl font-normal mt-1">
                  Segar, Berkualitas, Harga Terjangkau
                </span>
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-6">
                Belanja sayur dan kebutuhan dapur dengan kualitas terbaik. 
                Langsung dari petani ke dapur Anda.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto lg:mx-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari sayur, buah, bumbu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Hero Image - Simplified */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20">
                  <Carrot className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  Fresh
                </div>
                <div className="absolute -bottom-1 -left-1 bg-white text-emerald-600 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  Organik
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter - Horizontal Scroll on Mobile */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {CATEGORIES.find(c => c.id === activeCategory)?.name}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              {filteredProducts.length} produk tersedia
            </p>
          </div>
          {totalItems > 0 && (
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-300">
              {totalItems} item
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 sm:p-4 animate-pulse shadow-sm">
                <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-20">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Produk tidak ditemukan</p>
            <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards"
                style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-800">Warung Akang</span>
              </div>
              <p className="text-gray-500 text-sm">
                Menyediakan sayur segar dan kebutuhan dapur berkualitas untuk keluarga Anda.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Kategori</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Sayuran Segar</li>
                <li>Buah-Buahan</li>
                <li>Bumbu Dapur</li>
                <li>Sembako</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Kontak</h3>
              <p className="text-sm text-gray-500">
                WhatsApp: 0812-3456-7890<br />
                Buka: 06.00 - 20.00 WIB
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Warung Akang. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
