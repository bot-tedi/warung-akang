'use client';

import Link from 'next/link';
import { 
  Carrot, 
  Soup, 
  ArrowRight, 
  Leaf,
  Star,
  Truck,
  Clock,
  Shield
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-gray-800">
                Warung <span className="text-emerald-500">Akang</span>
              </span>
            </Link>
            <Link
              href="/admin"
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-orange-100 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
              <Star className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700">Segar & Berkualitas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
              Selamat Datang di
              <span className="block bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Warung Akang
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Pilihan tepat untuk kebutuhan dapur dan camilan segar Anda. 
              Kualitas terbaik dengan harga bersahabat.
            </p>
          </div>

          {/* Two Options Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Warung Sayur Option */}
            <Link href="/warung-sayur" className="group">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl transform translate-x-20 -translate-y-20" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                      <Carrot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:text-white" />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Warung Sayur
                  </h2>
                  <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                    Belanja sayur segar, buah-buahan, bumbu dapur, dan kebutuhan sembako. 
                    Langsung dari petani ke dapur Anda.
                  </p>

                  {/* Categories Preview */}
                  <div className="flex flex-wrap gap-2">
                    {['Sayuran', 'Buah', 'Bumbu', 'Sembako'].map((item) => (
                      <span 
                        key={item}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>

            {/* Asinan Sayur Option */}
            <Link href="/asinan-sayur" className="group">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-2xl transform translate-x-20 -translate-y-20" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                      <Soup className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5 text-orange-600 group-hover:text-white" />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Asinan Sayur
                  </h2>
                  <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                    Nikmati asinan sayur segar dengan bumbu khas tradisional. 
                    Pedas, segar, dan bikin nagih!
                  </p>

                  {/* Features Preview */}
                  <div className="flex flex-wrap gap-2">
                    {['Pedas', 'Segar', 'Homemade', 'Original'].map((item) => (
                      <span 
                        key={item}
                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
            Kenapa Memilih Kami?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Leaf, title: 'Produk Segar', desc: 'Dipetik dan dibuat setiap hari', color: 'emerald' },
              { icon: Truck, title: 'Cepat Sampai', desc: 'Pengiriman di hari yang sama', color: 'blue' },
              { icon: Shield, title: 'Kualitas Terjamin', desc: 'Hanya produk terbaik untuk Anda', color: 'purple' },
              { icon: Clock, title: 'Layanan 24/7', desc: 'Pesan kapan saja Anda mau', color: 'orange' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center p-4 sm:p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className={`w-12 h-12 mx-auto mb-3 sm:mb-4 rounded-xl flex items-center justify-center ${
                    feature.color === 'emerald' ? 'bg-emerald-100' :
                    feature.color === 'blue' ? 'bg-blue-100' :
                    feature.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      feature.color === 'emerald' ? 'text-emerald-600' :
                      feature.color === 'blue' ? 'text-blue-600' :
                      feature.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Butuh Bantuan?
          </h2>
          <p className="text-emerald-100 mb-6 sm:mb-8 max-w-xl mx-auto">
            Hubungi kami via WhatsApp untuk pertanyaan atau pemesanan khusus
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-emerald-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
          >
            <span>Chat WhatsApp</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Warung Akang</span>
              </div>
              <p className="text-gray-400 text-sm">
                Solusi terbaik untuk kebutuhan dapur dan camilan segar Anda.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Menu</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/warung-sayur" className="hover:text-white transition-colors">
                    Warung Sayur
                  </Link>
                </li>
                <li>
                  <Link href="/asinan-sayur" className="hover:text-white transition-colors">
                    Asinan Sayur
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <p className="text-gray-400 text-sm">
                WhatsApp: 0812-3456-7890<br />
                Jam Operasional: 06.00 - 20.00 WIB
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Warung Akang. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
