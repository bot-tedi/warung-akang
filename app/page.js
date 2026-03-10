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
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg group-hover:bg-emerald-500/30 transition-all" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
                  <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  Warung <span className="text-emerald-600">Akang</span>
                </span>
                <span className="text-[10px] text-gray-400 -mt-1 tracking-wider uppercase">Segar & Berkualitas</span>
              </div>
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Professional */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 overflow-hidden">
        {/* Sophisticated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-600">Pilihan Keluarga Indonesia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Segar Setiap Hari,
              <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Langsung ke Dapur
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Pilihan tepat untuk kebutuhan dapur dan camilan segar Anda. 
              Kualitas terbaik dengan harga bersahabat untuk keluarga.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/warung-sayur"
                className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              >
                <Carrot className="w-5 h-5" />
                Belanja Sayur
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/asinan-sayur"
                className="group flex items-center gap-3 bg-white border-2 border-orange-100 hover:border-orange-200 text-gray-800 px-8 py-4 rounded-2xl font-semibold transition-all hover:bg-orange-50 hover:-translate-y-0.5"
              >
                <Soup className="w-5 h-5 text-orange-500" />
                Pesan Asinan
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Cards Section - Professional */}
      <section className="relative py-20 sm:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">Pilihan Menu</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Apa yang Anda Cari?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Warung Sayur Card */}
            <Link href="/warung-sayur" className="group">
              <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full">
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                      <Carrot className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    Warung Sayur
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed mb-6">
                    Belanja sayur segar, buah-buahan, bumbu dapur, dan kebutuhan sembako berkualitas.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {['Sayuran Segar', 'Buah', 'Bumbu Dapur', 'Sembako'].map((item) => (
                      <span 
                        key={item}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>

            {/* Asinan Sayur Card */}
            <Link href="/asinan-sayur" className="group">
              <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-orange-50/0 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                      <Soup className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                      <ArrowRight className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    Asinan Sayur
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed mb-6">
                    Nikmati asinan sayur segar dengan bumbu khas tradisional. Pedas, segar, dan bikin nagih!
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {['Asinan Pedas', 'Segar', 'Homemade', 'Original Recipe'].map((item) => (
                      <span 
                        key={item}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium group-hover:bg-orange-50 group-hover:text-orange-700 transition-colors"
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

      {/* Features Section - Professional */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">Mengapa Kami</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Keunggulan Kami</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Leaf, title: 'Produk Segar', desc: 'Dipetik dan dibuat setiap hari', color: 'emerald', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
              { icon: Truck, title: 'Cepat Sampai', desc: 'Pengiriman di hari yang sama', color: 'blue', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
              { icon: Shield, title: 'Kualitas Terjamin', desc: 'Hanya produk terbaik untuk Anda', color: 'purple', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
              { icon: Clock, title: 'Layanan 24/7', desc: 'Pesan kapan saja Anda mau', color: 'orange', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group text-center p-6 sm:p-8 rounded-3xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Professional */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Siap Berbelanja?
          </h2>
          <p className="text-emerald-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Hubungi kami via WhatsApp untuk pertanyaan atau pemesanan khusus
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <span>Chat WhatsApp</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  Warung <span className="text-emerald-400">Akang</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed">
                Solusi terbaik untuk kebutuhan dapur dan camilan segar Anda. Kualitas terbaik dengan harga bersahabat.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h4 className="text-white font-semibold mb-6">Menu</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/warung-sayur" className="hover:text-emerald-400 transition-colors">
                    Warung Sayur
                  </Link>
                </li>
                <li>
                  <Link href="/asinan-sayur" className="hover:text-emerald-400 transition-colors">
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
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Syarat & Ketentuan</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Kebijakan Privasi</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © 2024 Warung Akang. All rights reserved.
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
