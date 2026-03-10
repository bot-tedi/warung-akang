'use client';

import { useEffect, useState } from 'react';
import { fetchProductsByType } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import { 
  Sparkles, 
  Leaf, 
  Soup,
  ChefHat,
  Flame,
  Search,
  Clock,
  Award
} from 'lucide-react';

export default function AsinanSayurPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCartStore();
  
  // Calculate total items directly for reactivity
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProductsByType('asinan_sayur');
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Gagal memuat produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
      <Header />
      <CartSidebar />

      {/* Hero Section - Optimized */}
      <section className="relative bg-orange-500 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
            <div className="text-center lg:text-left w-full lg:w-1/2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Asinan Sayur
                <span className="block text-orange-100 text-lg sm:text-xl font-normal mt-1">
                  Segar, Renyah, Nikmat
                </span>
              </h1>
              <p className="text-orange-100 text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-6">
                Asinan sayur tradisional dengan cita rasa khas. 
                Cocok untuk camilan sehat keluarga Anda.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto lg:mx-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari asinan favorit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Hero Image - Simplified */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20">
                  <Soup className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  Renyah
                </div>
                <div className="absolute -bottom-1 -left-1 bg-white text-orange-600 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  Segar
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <div className="bg-white/50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">10+</p>
              <p className="text-xs sm:text-sm text-gray-500">Varian Rasa</p>
            </div>
            <div className="hidden sm:block w-px bg-orange-200" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">Fresh</p>
              <p className="text-xs sm:text-sm text-gray-500">Tiap Hari</p>
            </div>
            <div className="hidden sm:block w-px bg-orange-200" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">100%</p>
              <p className="text-xs sm:text-sm text-gray-500">Halal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              Menu Asinan
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              {filteredProducts.length} varian tersedia
            </p>
          </div>
          {totalItems > 0 && (
            <div className="bg-orange-100 text-orange-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-300">
              {totalItems} item
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
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
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="asinan" />
            ))}
          </div>
        )}
      </main>

      {/* How to Order Section */}
      <section className="bg-white border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            Cara Pesan
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: '1', title: 'Pilih Menu', desc: 'Pilih asinan favorit Anda' },
              { step: '2', title: 'Checkout', desc: 'Isi data dan upload bukti' },
              { step: '3', title: 'Konfirmasi', desc: 'Admin akan menghubungi Anda' },
              { step: '4', title: 'Pesanan Diantar', desc: 'Nikmati asinan segar!' },
            ].map((item) => (
              <div key={item.step} className="text-center p-4 sm:p-6 bg-orange-50 rounded-2xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg sm:text-xl">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Soup className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Asinan Akang</span>
              </div>
              <p className="text-orange-100 text-sm">
                Asinan sayur segar dengan resep tradisional yang tetap terjaga keaslian rasanya.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Varian</h3>
              <ul className="space-y-2 text-sm text-orange-100">
                <li>Asinan Sayur Pedas</li>
                <li>Asinan Buah Segar</li>
                <li>Asinan Campur Spesial</li>
                <li>Level Pedas Custom</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <p className="text-sm text-orange-100">
                WhatsApp: 0812-3456-7890<br />
                Buka: 08.00 - 18.00 WIB
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-orange-100 text-sm">
              © 2024 Asinan Akang. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
