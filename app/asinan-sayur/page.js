'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchProductsByType } from '@/lib/supabase';
import { fuzzyMatch } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import {
  Sparkles,
  Search,
  Clock,
  ShieldCheck,
  Navigation,
  ArrowRight,
  ShoppingBag,
  Utensils,
  Sun,
  Moon
} from 'lucide-react';

export default function AsinanSayurPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('Loading asinan products...');
        setLoading(true);
        setError(null);
        const data = await fetchProductsByType('asinan_sayur');
        console.log('Asinan products loaded:', data?.length || 0);
        setProducts(data || []);
      } catch (err) {
        console.error('Error loading asinan products:', err);
        setError('Gagal memuat produk. Silakan refresh halaman.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    fuzzyMatch(product.name, searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-orange-100 dark:selection:bg-orange-900 transition-colors duration-300">
      <Header />
      <CartSidebar />

      {/* Theme Switcher */}
      <div className="fixed top-24 right-6 z-40">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full shadow-lg dark:shadow-xl border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Hero Section - Boutique Style */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")` }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Premium Selection</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-slate-900 mb-6 leading-[1.1]">
              The Art of <span className="font-serif italic text-orange-600">Asinan Sayur</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-500 mb-10 leading-relaxed font-light max-w-xl">
              Simfoni rasa tradisional yang dikurasi dengan sayuran pilihan dan bumbu rahasia warisan keluarga.
            </p>

            <div className="relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Temukan varian favorit Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-5 rounded-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500/50 transition-all text-slate-800 placeholder-slate-400 outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Floating Abstract Element */}
        <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 hidden lg:block">
          <div className="w-[500px] h-[500px] border-[1px] border-orange-100 rounded-full animate-spin-slow flex items-center justify-center">
            <div className="w-[400px] h-[400px] border-[1px] border-orange-200/50 rounded-full flex items-center justify-center">
              <div className="w-[300px] h-[300px] bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Stats */}
      <div className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Varian Menu', val: '12+' },
              { label: 'Bahan Organik', val: '100%' },
              { label: 'Rating Pelanggan', val: '4.9/5' },
              { label: 'Pengiriman Cepat', val: '< 1 Jam' }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-2xl font-semibold text-slate-900">{stat.val}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Collection */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-light text-slate-900 tracking-tight">Our Collection</h2>
            <div className="h-1 w-12 bg-orange-500 mt-4" />
          </div>
          {mounted && totalItems > 0 && (
            <div className="flex items-center gap-3 text-sm font-medium text-orange-700 bg-orange-50 px-5 py-2.5 rounded-full">
              <ShoppingBag className="w-4 h-4" />
              <span>{totalItems} Selected Items</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-32 text-center">
            <div className="inline-flex p-6 rounded-full bg-slate-50 mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-medium text-slate-900">No results found</h3>
            <p className="text-slate-500 mt-2">Coba gunakan kata kunci pencarian yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} variant="asinan" />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Boutique Experience Section */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-light leading-tight mb-8">
                Kenapa Memilih <br />
                <span className="font-serif italic text-orange-400">Asinan Akang Signature?</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: 'Kualitas Bahan', desc: 'Hanya sayuran segar dari petani lokal yang dipilih setiap pagi.', icon: ShieldCheck },
                  { title: 'Resep Otentik', desc: 'Bumbu kacang dan kuah cuka difermentasi secara alami tanpa pengawet.', icon: Utensils },
                  { title: 'Pengiriman Steril', desc: 'Kemasan food-grade double-sealed untuk menjaga kesegaran maksimal.', icon: Navigation }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl border border-white/10 flex items-center justify-center">
                <div className="text-center p-12">
                  <Clock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                  <p className="text-2xl font-light italic">"Kelezatan yang menanti untuk dinikmati."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
            <div className="max-w-xs">
              <span className="text-2xl font-bold tracking-tighter text-slate-900">
                ASINAN<span className="text-orange-600 italic">AKANG</span>
              </span>
              <p className="mt-6 text-slate-500 text-sm leading-relaxed">
                Menghadirkan cita rasa tradisi ke meja makan modern dengan standar kualitas tanpa kompromi.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900 mb-6">Explore</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><Link href="/warung-sayur" className="hover:text-orange-600 transition-colors">Warung Sayur</Link></li>
                  <li><Link href="/asinan-sayur" className="hover:text-orange-600 transition-colors">Asinan Sayur</Link></li>
                  <li><Link href="/about" className="hover:text-orange-600 transition-colors">Our Story</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900 mb-6">Service</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><Link href="/shipping" className="hover:text-orange-600 transition-colors">Shipping</Link></li>
                  <li><Link href="/wholesale" className="hover:text-orange-600 transition-colors">Wholesale</Link></li>
                  <li><Link href="/contact" className="hover:text-orange-600 transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
            <p>© 2024 Asinan Akang Signature. Jakarta, Indonesia.</p>
            <div className="flex gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}