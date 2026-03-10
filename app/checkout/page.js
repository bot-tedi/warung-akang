'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from 'next-themes';
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
  Loader2,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// NoSSR wrapper to prevent hydration mismatch
const NoSSR = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient ? children : null;
};

// --- Sub-Components for Clean Code ---

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-lg">
      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
    </div>
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const CustomInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
      {label} {props.required && <span className="text-emerald-500 dark:text-emerald-400">*</span>}
    </label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 outline-none transition-all text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
      />
    </div>
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (items.length === 0) router.push('/');
  }, [items, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = async (text, button) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        // Show feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('text-green-600', 'dark:text-green-400');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('text-green-600', 'dark:text-green-400');
        }, 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          // Show feedback
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.classList.add('text-green-600', 'dark:text-green-400');
          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('text-green-600', 'dark:text-green-400');
          }, 2000);
        } catch (err) {
          console.error('Copy failed:', err);
          setError('Gagal menyalin nomor. Silakan salin manual.');
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      setError('Gagal menyalin nomor. Silakan salin manual.');
    }
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('File terlalu besar (Maks 5MB)');
    if (!file.type.startsWith('image/')) return setError('Hanya format gambar yang didukung');

    setError('');
    setPaymentFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPaymentPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== SUBMIT DEBUG ===');
    console.log('Form data:', formData);
    console.log('Payment file:', paymentFile);
    console.log('Items:', items);
    console.log('Total:', getTotalPrice());

    // Validate all required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      console.log('❌ Form validation failed');
      setError('Semua field wajib diisi');
      return;
    }

    if (!paymentFile) {
      console.log('❌ No payment file');
      setError('Silakan upload bukti pembayaran terlebih dahulu');
      return;
    }

    console.log('✅ Validation passed, starting submit...');
    setIsSubmitting(true);
    setError('');
    setUploadProgress(0);

    try {
      // 1. Upload payment proof to Supabase Storage
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileExt = paymentFile.name.split('.').pop();
      const fileName = `receipts/${orderId}.${fileExt}`;

      setUploadProgress(30);

      // Import supabase dynamically for client-side
      const { supabase } = await import('@/lib/supabase');

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: paymentFile.type,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Gagal upload bukti pembayaran: ${uploadError.message}`);
      }

      setUploadProgress(60);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      const paymentUrl = publicUrlData.publicUrl;

      setUploadProgress(80);

      // 2. Save order to database (simplified)
      const orderData = {
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: formData.address.trim(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
        })),
        total_amount: getTotalPrice(),
        payment_proof_url: paymentUrl,
        status: 'pending_verification',
        order_id: orderId,
        created_at: new Date().toISOString(),
      };

      const { data: savedOrder, error: insertError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Gagal menyimpan pesanan: ${insertError.message}`);
      }

      setUploadProgress(100);

      // 3. Clear cart BEFORE redirect
      const totalPrice = getTotalPrice();
      clearCart();

      // 4. Open WhatsApp with order info
      const itemsList = items.map(item =>
        `- ${item.name} (${item.quantity}x) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
      ).join('%0A');

      const message = `*PESANAN BARU - WARUNG AKANG*%0A%0A` +
        `*Data Pemesan:*%0A` +
        `Nama: ${formData.name}%0A` +
        `No. WA: ${formData.phone}%0A` +
        `Alamat: ${formData.address}%0A%0A` +
        `*Pesanan:*%0A${itemsList}%0A%0A` +
        `*Total: Rp ${totalPrice.toLocaleString('id-ID')}*%0A%0A` +
        `*Status: Menunggu Verifikasi Pembayaran*%0A%0A` +
        `Order ID: ${orderId}%0A%0A` +
        `Bukti Pembayaran: ${paymentUrl}`;

      // Open WhatsApp
      window.open(
        `https://wa.me/6285775339643?text=${message}`,
        '_blank'
      );

      // 5. Redirect to success page
      router.push('/success');

    } catch (err) {
      console.error('Checkout error details:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300" suppressHydrationWarning>
      {/* Theme Switcher */}
      <div className="fixed top-24 right-6 z-40">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full shadow-lg dark:shadow-xl border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
            suppressHydrationWarning
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Premium Minimal Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Store</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-16">
            <section>
              <SectionHeader
                icon={User}
                title="Shipping Details"
                subtitle="Pastikan informasi pengiriman sudah benar"
              />
              <div className="space-y-6">
                <CustomInput
                  label="Full Name"
                  name="name"
                  placeholder="e.g. Jonathan Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid sm:grid-cols-2 gap-6">
                  <CustomInput
                    label="WhatsApp Number"
                    icon={Phone}
                    name="phone"
                    placeholder="0812..."
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="flex items-end pb-2">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">Kami akan menghubungi Anda via WhatsApp untuk konfirmasi pengiriman.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Delivery Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Alamat lengkap, patokan, atau instruksi khusus..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 outline-none transition-all text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                    required
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionHeader
                icon={CreditCard}
                title="Payment Method"
                subtitle="Pilih salah satu metode pembayaran di bawah"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-blue-600 text-[10px] font-bold text-white rounded-md">BCA</div>
                    <button
                      onClick={() => copyToClipboard('1234567890', event.target)}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-widest"
                    >
                      Copy
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">1234-5678-9012</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">A/n Warung Akang</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-purple-600 text-[10px] font-bold text-white rounded-md">OVO</div>
                   <button
                      onClick={() => copyToClipboard('085775339643', event.target)}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-widest"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">0857-7533-9643</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">OVO</p>
                </div>
                
              </div>
            </section>

            <section>
              <SectionHeader
                icon={Upload}
                title="Upload Bukti Pembayaran"
                subtitle="Upload bukti transfer untuk verifikasi pesanan"
              />

              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) processFile(file);
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) processFile(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />

                {paymentPreview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={paymentPreview}
                        alt="Payment proof"
                        className="max-w-xs max-h-48 rounded-xl shadow-lg mx-auto"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentFile(null);
                          setPaymentPreview(null);
                        }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Klik atau drag untuk mengganti bukti pembayaran
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                      <FileImage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium mb-2">
                        Upload Bukti Pembayaran
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Drag & drop atau klik untuk browse
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        Format: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Mengupload...</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <NoSSR>
                <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-200 dark:shadow-slate-900">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 dark:text-blue-400 mb-8">Order Summary</h3>

                  <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto no-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start group">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-white/5 dark:bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-80" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100 dark:text-slate-100">{item.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{item.quantity} Unit</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/10 dark:border-slate-700">
                    <div className="flex justify-between items-center text-slate-400 dark:text-slate-400">
                      <span className="text-[10px] uppercase tracking-widest">Subtotal</span>
                      <span className="text-sm">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 dark:text-slate-400">
                      <span className="text-[10px] uppercase tracking-widest">Delivery Fee</span>
                      <span className="text-sm">FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-100 dark:text-slate-100">Total Amount</span>
                      <span className="text-2xl font-light text-blue-400 dark:text-blue-400">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !paymentFile}
                    className="w-full mt-10 py-5 bg-blue-500 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Processing...'}
                      </>
                    ) : (
                      <>Upload & Complete Order <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-center text-[9px] text-slate-500 dark:text-slate-400 mt-6 uppercase tracking-widest leading-loose">
                    Pesanan akan diverifikasi setelah bukti pembayaran diupload. <br />
                    Admin akan menghubungi Anda setelah verifikasi selesai.
                  </p>
                </div>
              </NoSSR>

              {/* Secure Info Card */}
              <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex gap-4">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed font-medium uppercase tracking-wider">
                  Data Anda aman. Kami hanya menggunakan informasi ini untuk keperluan koordinasi pengiriman pesanan.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}