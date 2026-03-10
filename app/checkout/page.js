'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Upload, 
  CreditCard, 
  Smartphone, 
  User, 
  MapPin, 
  Phone,
  AlertCircle,
  Check,
  X,
  FileImage,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Fix: Global drag-drop handlers for the document to prevent browser default behavior
  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);
    
    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
    };
  }, []);
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diizinkan (JPG, PNG, WEBP)');
      return;
    }
    
    setPaymentFile(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const clearFile = () => {
    setPaymentFile(null);
    setPaymentPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Semua field wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setUploadProgress(0);

    try {
      // Validate cart items
      if (!items || items.length === 0) {
        throw new Error('Keranjang belanja kosong');
      }

      setUploadProgress(30);

      // 1. Prepare order items
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
      }));

      setUploadProgress(60);

      // 2. Skip database - Order via WhatsApp only (RLS issues in Supabase)
      console.log('Order will be sent via WhatsApp only');

      setUploadProgress(100);

      // 3. Open WhatsApp with complete order message (BEFORE clearing cart)
      const itemsList = orderItems.map(item => 
        `- ${item.name} (${item.quantity}x) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
      ).join('%0A');
      
      const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const message = `Halo Akang, ada pesanan baru!%0A%0A` +
        `*Data Pemesan:*%0A` +
        `Nama: ${formData.name}%0A` +
        `No. WA: ${formData.phone}%0A` +
        `Alamat: ${formData.address}%0A%0A` +
        `*Pesanan:*%0A${itemsList}%0A%0A` +
        `*Total: Rp ${totalPrice.toLocaleString('id-ID')}*%0A%0A` +
        `Mohon konfirmasi dan proses pesanan ini. Terima kasih!`;
      
      // 4. Clear cart AFTER message is prepared
      clearCart();

      // 5. Redirect to WhatsApp
      window.open(`https://wa.me/6285775339643?text=${message}`, '_blank');

      // 6. Redirect to success page
      router.push('/success');
      
    } catch (err) {
      console.error('Checkout error details:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      {/* Animated Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">Kembali</span>
          </Link>
          <h1 className="ml-4 text-lg font-bold text-gray-800">Checkout</h1>
        </div>
      </motion.header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm flex-1">{error}</p>
              <button 
                onClick={() => setError('')}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Customer Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
              Informasi Pemesan
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-gray-50/50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="081234567890"
                    pattern="[0-9]*"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-gray-50/50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Alamat Pengiriman <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap (RT/RW, Kelurahan, Kecamatan, Kota)"
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all resize-none bg-gray-50/50 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>
            
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FileImage className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Payment Instructions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              Instruksi Pembayaran
            </h2>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                    BCA
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 block">Transfer Bank BCA</span>
                    <span className="text-xs text-gray-500">A/n: Warung Akang</span>
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-2 font-mono text-sm text-gray-700 flex items-center justify-between">
                  <span>1234-5678-9012</span>
                  <button 
                    type="button"
                    onClick={() => navigator.clipboard.writeText('123456789012')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 block">OVO / DANA</span>
                    <span className="text-xs text-gray-500">A/n: Warung Akang</span>
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-2 font-mono text-sm text-gray-700 flex items-center justify-between">
                  <span>0812-3456-7890</span>
                  <button 
                    type="button"
                    onClick={() => navigator.clipboard.writeText('081234567890')}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upload Payment Proof with Drag & Drop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-emerald-600" />
              </div>
              Bukti Pembayaran
            </h2>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="payment-proof"
              />
              
              {!paymentPreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative w-full border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragging 
                      ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' 
                      : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <motion.div 
                      animate={{ 
                        scale: isDragging ? 1.1 : 1,
                        y: isDragging ? -5 : 0
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                        isDragging ? 'bg-emerald-200' : 'bg-gray-100'
                      }`}
                    >
                      <Upload className={`w-7 h-7 transition-colors ${
                        isDragging ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                    </motion.div>
                    <p className="text-gray-700 font-semibold mb-1">
                      <span className="text-emerald-600">Upload bukti pembayaran</span> (Opsional)
                    </p>
                    <p className="text-gray-500 text-sm">Preview hanya untuk verifikasi</p>
                    <p className="text-gray-400 text-xs mt-2">JPG, PNG, WEBP • Max 5MB</p>
                    <p className="text-emerald-600 text-xs mt-1 font-medium">✓ Bisa juga kirim via WhatsApp nanti</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500">
                  <img 
                    src={paymentPreview} 
                    alt="Payment proof preview" 
                    className="w-full max-h-64 object-contain bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-sm font-medium flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      {paymentFile.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Button with Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/30 disabled:shadow-none overflow-hidden"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses... {uploadProgress > 0 && `${uploadProgress}%`}</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Konfirmasi Pesanan
                </span>
              )}
              
              {/* Progress bar */}
              {isSubmitting && uploadProgress > 0 && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-white/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          </motion.div>
        </form>

        {/* Footer Note */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-400 text-xs mt-6"
        >
          Dengan melakukan pemesanan, Anda menyetujui syarat dan ketentuan kami
        </motion.p>
      </main>
    </div>
  );
}
