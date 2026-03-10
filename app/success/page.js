'use client';

import { CheckCircle, Home, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Pesanan Berhasil!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Terima kasih telah memesan di Warung Akang. Pesanan Anda telah kami terima dan sedang diproses. 
          Admin akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi.
        </p>

        {/* WhatsApp Info */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-8 border border-emerald-100">
          <div className="flex items-center gap-2 justify-center text-emerald-700">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Cek WhatsApp Anda</span>
          </div>
          <p className="text-sm text-emerald-600 mt-1">
            Detail pesanan telah dikirim ke WhatsApp Admin
          </p>
        </div>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
        >
          <Home className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Footer Note */}
        <p className="text-gray-400 text-sm mt-6">
          Warung Akang - Hidangan Segar untuk Keluarga Anda
        </p>
      </div>
    </div>
  );
}
