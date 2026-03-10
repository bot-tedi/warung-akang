'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  LogIn,
  User,
  Package,
  ShoppingCart,
  DollarSign,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Upload,
  Check,
  X,
  Loader2,
  Search,
  Filter,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Admin password
const ADMIN_PASSWORD_HASH = 'W4rung@k4ng2024!S3cur3';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'sayuran',
    type: 'warung_sayur',
    image_url: '',
    is_active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Fix: Global drag-drop handlers for document - only prevent default on non-admin elements
  useEffect(() => {
    const preventDefault = (e) => {
      // Only prevent if not dropping on our upload zone
      if (!e.target.closest('.upload-zone')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);
    
    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
    };
  }, []);

  // Check for existing lockout on mount
  useEffect(() => {
    const savedLockout = localStorage.getItem('adminLockout');
    const savedAttempts = localStorage.getItem('adminLoginAttempts');
    
    if (savedLockout) {
      const lockoutTime = parseInt(savedLockout);
      if (Date.now() < lockoutTime) {
        setLockoutEndTime(lockoutTime);
      } else {
        localStorage.removeItem('adminLockout');
        localStorage.removeItem('adminLoginAttempts');
      }
    }
    
    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts));
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    try {
      setLoading(true);
      // Load products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      setProducts(productsData || []);

      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  function validatePassword(password) {
    // Complex password requirements:
    // - Minimum 12 characters
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    const minLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial,
      errors: {
        minLength: !minLength,
        hasUppercase: !hasUppercase,
        hasLowercase: !hasLowercase,
        hasNumber: !hasNumber,
        hasSpecial: !hasSpecial,
      }
    };
  }

  // Image upload handlers with proper drag-drop
  const handleImageDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    processImageFile(file);
  }, []);

  const handleImageDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleImageDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const processImageFile = (file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diizinkan');
      return;
    }
    
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setIsUploadingImage(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        // Check if it's RLS error
        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('policy')) {
          alert(
            'ERROR: Upload ditolak oleh kebijakan keamanan Supabase.\n\n' +
            'Jalankan SQL ini di Supabase Dashboard:\n\n' +
            '-- Buat bucket jika belum ada\n' +
            "INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);\n\n" +
            '-- Enable RLS pada storage\n' +
            'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;\n\n' +
            '-- Allow anon uploads\n' +
            'CREATE POLICY "Allow anon uploads" ON storage.objects\n' +
            "  FOR INSERT TO anon WITH CHECK (bucket_id = 'product-images');\n\n" +
            '-- Allow anon select\n' +
            'CREATE POLICY "Allow anon select storage" ON storage.objects\n' +
            "  FOR SELECT TO anon USING (bucket_id = 'product-images');"
          );
        }
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal upload gambar: ' + err.message);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setProductForm(prev => ({ ...prev, image_url: '' }));
  };

  function handleLogin(e) {
    e.preventDefault();
    
    // Check if locked out
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      const remainingMinutes = Math.ceil((lockoutEndTime - Date.now()) / 60000);
      setError(`Akun terkunci. Coba lagi dalam ${remainingMinutes} menit.`);
      return;
    }

    // Validate password complexity
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError('Password tidak valid. Format password salah.');
      
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('adminLoginAttempts', newAttempts);
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION;
        setLockoutEndTime(lockoutTime);
        localStorage.setItem('adminLockout', lockoutTime);
        setError(`Terlalu banyak percobaan gagal. Akun terkunci selama 30 menit.`);
      }
      return;
    }

    // Check password
    if (password === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      setError('');
      setLoginAttempts(0);
      setLockoutEndTime(null);
      localStorage.removeItem('adminLockout');
      localStorage.removeItem('adminLoginAttempts');
      // Set session expiry (4 hours)
      localStorage.setItem('adminSessionExpiry', Date.now() + (4 * 60 * 60 * 1000));
    } else {
      setError('Password salah.');
      
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('adminLoginAttempts', newAttempts);
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION;
        setLockoutEndTime(lockoutTime);
        localStorage.setItem('adminLockout', lockoutTime);
        setError(`Terlalu banyak percobaan gagal. Akun terkunci selama 30 menit.`);
      }
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('adminSessionExpiry');
  }

  // Session timeout check
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const expiry = localStorage.getItem('adminSessionExpiry');
        if (!expiry || Date.now() > parseInt(expiry)) {
          handleLogout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  async function handleProductSubmit(e) {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price) {
      alert('Nama produk dan harga wajib diisi');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = productForm.image_url;
      
      // Upload image if there's a new file
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseInt(productForm.price),
        category: productForm.category,
        type: productForm.type,
        image_url: imageUrl,
        is_active: productForm.is_active,
      };

      let result;
      if (isEditing) {
        result = await supabase.from('products').update(productData).eq('id', editId);
      } else {
        result = await supabase.from('products').insert([productData]);
      }
      
      // Check for RLS error
      if (result.error) {
        if (result.error.message?.includes('row-level security') || result.error.message?.includes('policy')) {
          throw new Error(
            'RLS: Jalankan SQL ini di Supabase Dashboard:\n\n' +
            '-- Enable RLS on products\n' +
            'ALTER TABLE products ENABLE ROW LEVEL SECURITY;\n\n' +
            '-- Allow all operations for anon\n' +
            'CREATE POLICY "Allow all products" ON products\n' +
            '  FOR ALL TO anon USING (true) WITH CHECK (true);'
          );
        }
        throw result.error;
      }

      // Reset form
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'sayuran',
        type: 'warung_sayur',
        image_url: '',
        is_active: true,
      });
      setIsEditing(false);
      setEditId(null);
      setImageFile(null);
      setImagePreview(null);
      
      loadData();
    } catch (err) {
      console.error('Error saving product:', err);
      if (err.message?.includes('RLS')) {
        alert(err.message);
      } else {
        alert('Gagal menyimpan produk: ' + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEditProduct(product) {
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || 'sayuran',
      type: product.type || 'warung_sayur',
      image_url: product.image_url || '',
      is_active: product.is_active,
    });
    setImagePreview(product.image_url || null);
    setIsEditing(true);
    setEditId(product.id);
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesType;
  });

  async function handleDeleteProduct(id) {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await supabase.from('products').delete().eq('id', id);
        loadData();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  }

  // Login Screen
  if (!isAuthenticated) {
    const remainingTime = lockoutEndTime ? Math.ceil((lockoutEndTime - Date.now()) / 60000) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white"
            >
              Admin Panel
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-400 mt-1"
            >
              Warung Akang
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/10"
          >
            {lockoutEndTime && Date.now() < lockoutEndTime ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center gap-2 text-red-300 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Akun Terkunci</span>
                </div>
                <p className="text-red-200 text-sm">
                  Terlalu banyak percobaan login gagal. Silakan tunggu {remainingTime} menit lagi.
                </p>
              </motion.div>
            ) : (
              <>
                <AnimatePresence>
                  {loginAttempts > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-4"
                    >
                      <p className="text-yellow-200 text-sm text-center">
                        Percobaan tersisa: {MAX_LOGIN_ATTEMPTS - loginAttempts}
                      </p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4"
                    >
                      <p className="text-red-200 text-sm text-center">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password Admin
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password..."
                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        disabled={lockoutEndTime && Date.now() < lockoutEndTime}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={lockoutEndTime && Date.now() < lockoutEndTime}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </motion.button>
                </form>

                {/* Password Requirements */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-xs text-slate-400 mb-3">Persyaratan Password:</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-500" />
                      Minimum 12 karakter
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-500" />
                      Huruf besar (A-Z) & kecil (a-z)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-500" />
                      Angka (0-9) & karakter khusus
                    </li>
                  </ul>
                </div>
              </>
            )}

            <Link
              href="/"
              className="block text-center text-slate-400 hover:text-white text-sm mt-6 transition-colors"
            >
              ← Kembali ke Beranda
            </Link>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-slate-500 text-xs mt-6"
          >
            Maksimum {MAX_LOGIN_ATTEMPTS} percobaan login • Akun terkunci 30 menit jika gagal
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800">Admin Panel</h1>
                <p className="text-xs text-slate-500">Warung Akang</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div 
              variants={cardHoverVariants}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Total Produk</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">{products.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div 
              variants={cardHoverVariants}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Total Pesanan</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">{orders.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div 
              variants={cardHoverVariants}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Pendapatan</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-800">
                    Rp {orders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div 
              variants={cardHoverVariants}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit"
        >
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 font-medium text-sm rounded-lg transition-all ${
              activeTab === 'products'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produk
            </span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 font-medium text-sm rounded-lg transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Pesanan
            </span>
          </button>
        </motion.div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add/Edit Product Form */}
            <motion.div 
              layout
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Produk</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-slate-50/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga (Rp)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-slate-50/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe</label>
                  <select
                    value={productForm.type}
                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-slate-50/50"
                  >
                    <option value="warung_sayur">Warung Sayur</option>
                    <option value="asinan_sayur">Asinan Sayur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-slate-50/50"
                  >
                    <option value="sayuran">Sayuran</option>
                    <option value="buah">Buah-Buahan</option>
                    <option value="bumbu">Bumbu Dapur</option>
                    <option value="sembako">Sembako</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Drag & Drop Image Upload */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gambar Produk</label>
                  <div className="relative">
                    {!imagePreview ? (
                      <div
                        onDrop={handleImageDrop}
                        onDragOver={handleImageDragOver}
                        onDragLeave={handleImageDragLeave}
                        className={`upload-zone relative w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                          isDragging 
                            ? 'border-emerald-500 bg-emerald-50 scale-[1.01]' 
                            : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                          <motion.div 
                            animate={{ 
                              scale: isDragging ? 1.1 : 1,
                              y: isDragging ? -5 : 0
                            }}
                            className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
                              isDragging ? 'bg-emerald-200' : 'bg-slate-100'
                            }`}
                          >
                            {isUploadingImage ? (
                              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                            ) : (
                              <Upload className={`w-6 h-6 transition-colors ${
                                isDragging ? 'text-emerald-600' : 'text-slate-400'
                              }`} />
                            )}
                          </motion.div>
                          <p className="text-slate-700 font-medium mb-1">
                            <span className="text-emerald-600">Klik</span> atau <span className="text-emerald-600">drag & drop</span>
                          </p>
                          <p className="text-slate-400 text-sm">Upload gambar produk</p>
                          <p className="text-slate-400 text-xs mt-1">JPG, PNG, WEBP • Max 5MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 max-w-xs">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-sm font-medium flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            {imageFile?.name || 'Gambar tersimpan'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all resize-none bg-slate-50/50"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isUploadingImage}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        {isEditing ? 'Update Produk' : 'Tambah Produk'}
                      </>
                    )}
                  </motion.button>
                  
                  {isEditing && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditId(null);
                        setProductForm({
                          name: '',
                          description: '',
                          price: '',
                          category: 'sayuran',
                          type: 'warung_sayur',
                          image_url: '',
                          is_active: true,
                        });
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-6 py-2.5 rounded-xl transition-all"
                    >
                      Batal
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-white"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 outline-none transition-all bg-white"
              >
                <option value="all">Semua Tipe</option>
                <option value="warung_sayur">Warung Sayur</option>
                <option value="asinan_sayur">Asinan Sayur</option>
              </select>
            </div>

            {/* Products List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Daftar Produk ({filteredProducts.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Produk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tipe</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kategori</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Harga</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {filteredProducts.map((product, index) => (
                        <motion.tr 
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                {product.image_url ? (
                                  <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <span className="font-medium text-slate-800">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.type === 'warung_sayur'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {product.type === 'warung_sayur' ? 'Warung Sayur' : 'Asinan Sayur'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 capitalize">{product.category}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            Rp {product.price.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleEditProduct(product)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteProduct(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Daftar Pesanan ({orders.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Pelanggan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {orders.map((order, index) => (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-800">{order.customer_name}</p>
                            <p className="text-xs text-slate-500">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          Rp {order.total_amount?.toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {order.status === 'pending' && <Clock className="w-3 h-3" />}
                            {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                            {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
