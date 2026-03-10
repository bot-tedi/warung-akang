'use client';

import Link from 'next/link';
import {
  Carrot,
  Soup,
  ArrowRight,
  Leaf,
  Truck,
  Clock,
  Shield,
  ChevronRight,
  Sparkles,
  Award,
  Users,
  Store,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-100 dark:selection:bg-emerald-900 transition-colors duration-300">
      {/* Professional Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-xl blur-lg group-hover:bg-emerald-500/30 dark:group-hover:bg-emerald-400/30 transition-all" />
                <div className="relative bg-slate-900 dark:bg-emerald-600 p-2.5 rounded-xl transition-transform group-hover:scale-105 shadow-lg dark:shadow-emerald-600/25">
                  <Leaf className="w-6 h-6 text-emerald-400 dark:text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tighter text-slate-900 dark:text-white uppercase">
                  Warung<span className="text-emerald-600 dark:text-emerald-400 italic font-serif">Akang</span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-[0.3em] uppercase">Premium Produce</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/warung-sayur" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Market</Link>
              <Link href="/asinan-sayur" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Signature</Link>
              <Link href="/admin" className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Admin Port</Link>

              {/* Theme Switcher */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-all active:scale-90"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - The Editorial Look */}
      <section className="relative pt-44 pb-32 lg:pt-64 lg:pb-48 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f8faf9] dark:bg-slate-800/50 -z-10 hidden lg:block" />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-[120px] -z-10 opacity-60" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 mb-8 animate-fade-in">
                <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Quality Excellence 2024</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-light tracking-tight text-slate-900 dark:text-white mb-8 leading-[0.95]">
                Freshness <br />
                <span className="font-serif italic text-emerald-600 dark:text-emerald-400">Redefined.</span>
              </h1>

              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-light mb-12">
                Menghubungkan hasil tani terbaik dengan dapur Anda. Standar kualitas ekspor untuk konsumsi harian keluarga.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  href="/warung-sayur"
                  className="group flex items-center justify-center gap-4 bg-slate-900 dark:bg-emerald-600 text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:bg-emerald-600 dark:hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-600/20 dark:hover:shadow-emerald-700/30 active:scale-95"
                >
                  Explore Market
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/asinan-sayur"
                  className="group flex items-center justify-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95"
                >
                  Our Signature
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl dark:shadow-xl transition-transform duration-700 group-hover:scale-[1.02]">
                <img
                  src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800"
                  alt="Premium Produce"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-10 -right-6 md:right-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">4.9</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Customer Satisfaction</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-3 h-3 text-amber-400 dark:text-amber-500 fill-amber-400 dark:fill-amber-500" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Menu Section - High End Cards */}
      <section className="py-32 bg-[#F9F9F9] dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400 mb-4">Curated Selection</p>
              <h2 className="text-4xl font-light tracking-tight text-slate-900 dark:text-white">Elevate Your Kitchen</h2>
            </div>
            <div className="h-[1px] flex-grow bg-slate-200 dark:bg-slate-700 mx-10 hidden lg:block" />
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs font-light">Pilih kategori layanan kami yang dirancang untuk kemudahan gaya hidup modern Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Market Card */}
            <Link href="/warung-sayur" className="group relative h-[500px] overflow-hidden rounded-[2.5rem] bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&q=80&w=800"
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                alt="Market"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-12 w-full">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-light text-white mb-4">Daily Market</h3>
                <p className="text-slate-300 text-sm font-light mb-8 max-w-sm">Sayuran organik, buah-buahan segar, dan kebutuhan pokok dengan kualitas premium.</p>
                <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-emerald-400 group-hover:gap-5 transition-all">
                  Shop Produce <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Signature Card */}
            <Link href="/asinan-sayur" className="group relative h-[500px] overflow-hidden rounded-[2.5rem] bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                alt="Signature"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-12 w-full">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Soup className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-light text-white mb-4">Signature Asinan</h3>
                <p className="text-slate-300 text-sm font-light mb-8 max-w-sm">Resep warisan keluarga dengan perpaduan rasa pedas, asam, dan manis yang otentik.</p>
                <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-orange-400 group-hover:gap-5 transition-all">
                  Order Signature <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { icon: Shield, title: 'Quality Assurance', desc: 'Sistem sortir multi-tahap memastikan hanya bahan terbaik yang sampai ke tangan Anda.' },
              { icon: Truck, title: 'Precision Logistics', desc: 'Pengiriman terjadwal dengan armada khusus untuk menjaga suhu dan kesegaran produk.' },
              { icon: Users, title: 'Direct Sourcing', desc: 'Memotong rantai distribusi panjang dengan bekerja langsung bersama petani lokal.' },
            ].map((f, i) => (
              <div key={i} className="group">
                <div className="w-12 h-[1px] bg-emerald-600 mb-8 transition-all group-hover:w-24" />
                <f.icon className="w-6 h-6 text-slate-900 mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between gap-20 mb-20">
            <div className="max-w-xs">
              <span className="text-xl font-bold tracking-tighter uppercase">
                Warung<span className="text-emerald-600 italic font-serif">Akang</span>
              </span>
              <p className="mt-8 text-sm text-slate-400 font-light leading-relaxed">
                Menghadirkan kebaikan alam ke dalam rumah Anda melalui standar pelayanan profesional dan produk berkualitas tinggi.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 text-sm uppercase tracking-widest font-bold">
              <div>
                <p className="text-[10px] text-slate-400 mb-8">Service</p>
                <ul className="space-y-4 text-slate-900">
                  <li><Link href="/warung-sayur" className="hover:text-emerald-600 transition-colors">Market</Link></li>
                  <li><Link href="/asinan-sayur" className="hover:text-emerald-600 transition-colors">Signature</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-8">Company</p>
                <ul className="space-y-4 text-slate-900">
                  <li className="hover:text-emerald-600 transition-colors cursor-pointer">About</li>
                  <li className="hover:text-emerald-600 transition-colors cursor-pointer">Contact</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">© 2024 Warung Akang Signature. All rights reserved.</p>
            <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span className="hover:text-slate-900 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-900 cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: opacity 1s ease-out;
        }
        @keyframes opacity {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}