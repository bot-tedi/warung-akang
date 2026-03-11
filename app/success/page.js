'use client';

import { CheckCircle, Home, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function SuccessPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [orderSummary, setOrderSummary] = useState('');

  useEffect(() => {
    setMounted(true);
    const summary = localStorage.getItem('latest_order_summary');
    setOrderSummary(summary || 'Detail pesanan tidak ditemukan.');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-slate-900 to-white dark:to-slate-800 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Switcher */}
      <div className="fixed top-6 right-6 z-40">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full shadow-lg dark:shadow-xl border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl dark:shadow-2xl p-8 text-center border border-slate-100 dark:border-slate-700">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
          Pesanan Berhasil!
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-slate-400 mb-8">
          Terima kasih telah memesan di Warung Akang. Pesanan Anda telah kami terima dan disimpan di sistem admin.
          Silakan tunggu konfirmasi selanjutnya (verifikasi pembayaran dan pengiriman).
        </p>

        {/* Structured Order Summary */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-8 border border-slate-200 dark:border-slate-700 text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">Ringkasan Pesanan</h3>
          <pre className="whitespace-pre-wrap break-words text-xs leading-5 text-slate-700 dark:text-slate-300">{orderSummary}</pre>
        </div>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/20"
        >
          <Home className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Footer Note */}
        <p className="text-gray-400 dark:text-slate-500 text-sm mt-6">
          Warung Akang - Hidangan Segar untuk Keluarga Anda
        </p>
      </div>
    </div>
  );
}
