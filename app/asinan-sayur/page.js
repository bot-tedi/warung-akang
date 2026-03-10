'use client';

import Link from 'next/link';
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

      {/* Hero Section - Professional */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="text-center lg:text-left w-full lg:w-1/2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium text-white/90">Resep Tradisional</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Asinan Sayur
                <span className="block mt-2 text-orange-100 text-lg sm:text-xl font-normal">
                  Segar, Renyah, Nikmat
                </span>
              </h1>
              <p className="text-orange-100/80 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8">
                Asinan sayur tradisional dengan cita rasa khas. 
                Cocok untuk camilan sehat keluarga Anda.
              </p>
              
              {/* Search Bar - Professional */}
              <div className="relative max-w-md mx-auto lg:mx-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari asinan favorit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base border border-white/20"
                />
              </div>
            </div>

            {/* Hero Visual */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                  <Soup className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  Renyah
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white text-orange-600 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
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

      {/* Products Section - Professional */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase">Menu</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Asinan Sayur
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              {filteredProducts.length} varian tersedia
            </p>
          </div>
          {totalItems > 0 && (
            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold animate-in fade-in slide-in-from-right-4 duration-300 shadow-sm">
              {totalItems} item di keranjang
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
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards"
                style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              >
                <ProductCard product={product} variant="asinan" />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* How to Order Section - Professional */}
      <section className="bg-white border-t border-gray-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase">Proses</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Cara Pesan</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { step: '1', title: 'Pilih Menu', desc: 'Pilih asinan favorit Anda', icon: Sparkles },
              { step: '2', title: 'Checkout', desc: 'Isi data dan upload bukti', icon: Search },
              { step: '3', title: 'Konfirmasi', desc: 'Admin akan menghubungi Anda', icon: Clock },
              { step: '4', title: 'Pesanan Diantar', desc: 'Nikmati asinan segar!', icon: Soup },
            ].map((item) => (
              <div key={item.step} className="group text-center p-6 sm:p-8 bg-orange-50/50 rounded-3xl hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-xl">
                  <Soup className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  Asinan <span className="text-orange-400">Akang</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed">
                Asinan sayur segar dengan resep tradisional yang tetap terjaga keaslian rasanya.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h4 className="text-white font-semibold mb-6">Menu</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/warung-sayur" className="hover:text-orange-400 transition-colors">
                    Warung Sayur
                  </Link>
                </li>
                <li>
                  <Link href="/asinan-sayur" className="hover:text-orange-400 transition-colors">
                    Asinan Sayur
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="text-white font-semibold mb-6">Kontak</h4>
              <ul className="space-y-3 text-sm">
                <li>WhatsApp: 0812-3456-7890</li>
                <li>Jam Operasional: 06.00 - 20.00 WIB</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-orange-400 transition-colors cursor-pointer">Syarat & Ketentuan</li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">Kebijakan Privasi</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © 2024 Asinan Akang. All rights reserved.
            </p>
            <p className="text-sm">
              Made with care in Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
