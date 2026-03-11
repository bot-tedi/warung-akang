'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { getRealTimeStats, updateProductStock, increaseStock, decreaseStock } from '@/lib/supabase';
import { fuzzyMatch } from '@/lib/utils';
import {
  Search,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Upload,
  Image as ImageIcon,
  Loader2,
  Filter,
  ArrowUpRight,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MonthlyRevenueChart from '@/components/MonthlyRevenueChart';

// --- Auth & Config (Tetap sesuai sistem Anda) ---
const ADMIN_PASSWORD_HASH = 'W4rung@k4ng2024!S3cur3';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Data State (Tetap sesuai sistem Anda)
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State (Tetap sesuai sistem Anda)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', type: 'warung_sayur', category: 'sayuran', description: '', image_url: '', stock: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    setLoading(true);
    const [pRes, oRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);
    if (pRes.data) setProducts(pRes.data);
    if (oRes.data) setOrders(oRes.data);
    setLoading(false);
  };

  // Real-time stats update
  const [realTimeStats, setRealTimeStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalProducts: 0,
    totalStockValue: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    previousRevenue: 0 // Store previous revenue for growth calculation
  });

  // Calculate growth percentage
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return '+0%';
    const growth = ((current - previous) / previous) * 100;
    return growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔧 Setting up real-time subscriptions...');

      const updateStats = async () => {
        try {
          console.log('📊 Updating stats...');
          const stats = await getRealTimeStats();
          console.log('📈 New stats:', stats);

          // Update with growth calculation
          setRealTimeStats(prev => {
            const growthPercentage = calculateGrowth(stats.totalRevenue, prev.previousRevenue || stats.totalRevenue);
            return {
              ...stats,
              previousRevenue: stats.totalRevenue, // Store current as previous for next update
            };
          });
        } catch (error) {
          console.error('❌ Error updating stats:', error);
        }
      };

      // Initial fetch
      updateStats();

      // Set up real-time subscription for orders
      const ordersChannel = supabase.channel('admin-orders-changes');

      const ordersSubscription = ordersChannel
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: 'status=eq.pending_verification'
          },
          (payload) => {
            console.log('📦 Orders change detected:', payload);
            updateStats();
            fetchInitialData();
          }
        )
        .subscribe((status) => {
          console.log('📦 Orders subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Orders subscription active');
          } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
            console.log('⚠️ Orders subscription failed, retrying...');
            setTimeout(() => ordersSubscription.subscribe(), 5000);
          }
        });

      // Set up real-time subscription for products
      const productsChannel = supabase.channel('admin-products-changes');

      const productsSubscription = productsChannel
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products'
          },
          (payload) => {
            console.log('🛍️ Products change detected:', payload);
            updateStats();
            fetchInitialData();
          }
        )
        .subscribe((status) => {
          console.log('🛍️ Products subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Products subscription active');
          } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
            console.log('⚠️ Products subscription failed, retrying...');
            setTimeout(() => productsSubscription.subscribe(), 5000);
          }
        });

      // Fallback interval for backup
      const interval = setInterval(updateStats, 10000); // Update every 10 seconds

      return () => {
        console.log('🧹 Cleaning up subscriptions...');
        clearInterval(interval);
        ordersChannel.unsubscribe();
        productsChannel.unsubscribe();
      };
    }
  }, [isAuthenticated]);

  // Image upload handlers
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setIsUploading(true);
    try {
      // 1. Buat nama file unik
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // 2. Upload langsung ke Supabase Storage
      // Pastikan Anda sudah membuat bucket bernama 'product-images' di Dashboard Supabase
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (error) throw error;

      // 3. Ambil Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal upload ke Supabase Storage: ' + err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price) {
      alert('Product name and price are required');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.image_url;

      // 1. Upload gambar jika ada file baru yang dipilih
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      // 2. Siapkan data produk
      const productData = {
        name: formData.name,
        price: parseCurrencyValue(formData.price),
        type: formData.type,
        category: formData.category,
        description: formData.description,
        image_url: imageUrl,
        stock: parseInt(formData.stock) || 0,
      };

      // 3. Simpan langsung ke tabel 'products' menggunakan Supabase Client
      let result;
      if (editingProduct) {
        // Update produk yang sudah ada
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
      } else {
        // Tambah produk baru
        result = await supabase
          .from('products')
          .insert([productData]);
      }

      if (result.error) throw result.error;

      // 4. Reset form dan tutup modal
      alert('Produk berhasil disimpan!');
      setFormData({ name: '', price: '', type: 'warung_sayur', category: 'sayuran', description: '', image_url: '', stock: 0 });
      setImageFile(null);
      setImagePreview(null);
      setIsModalOpen(false);
      setEditingProduct(null);
      
      // Refresh data di halaman admin
      fetchInitialData();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrencyInput = (value) => {
    const digits = value.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('id-ID');
  };

  const parseCurrencyValue = (formattedValue) => {
    const digits = formattedValue.replace(/[^0-9]/g, '');
    const number = parseInt(digits, 10);
    return Number.isNaN(number) ? 0 : number;
  };

  // --- Logic Dashboard (Logic tetap, hanya format visual diperhalus) ---
  const stats = useMemo(() => {
    const revenueGrowth = calculateGrowth(realTimeStats.totalRevenue, realTimeStats.previousRevenue);

    return [
      { label: 'Total Revenue', value: `Rp ${realTimeStats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: revenueGrowth, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Pending Orders', value: realTimeStats.pendingOrders, icon: ShoppingCart, trend: 'Action Needed', color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Completed Orders', value: realTimeStats.completedOrders, icon: CheckCircle, trend: 'Success', color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Cancelled Orders', value: realTimeStats.cancelledOrders, icon: XCircle, trend: 'Lost', color: 'text-red-600', bg: 'bg-red-50' },
    ];
  }, [realTimeStats, realTimeStats.previousRevenue]);

  // --- Handlers (Fungsi tidak diubah sama sekali) ---
  // --- Data Reset (Security & Maintenance) ---
  const handleResetAllData = async () => {
    const confirmPrompt = window.prompt("PERINGATAN BAHAYA!\n\nTindakan ini akan MENGHAPUS SEMUA DATA TRANSAKSI (Orders) dan PENDAPATAN BULANAN (Monthly Revenue) secara permanen.\n\nKetik 'RESET SAYA YAKIN' untuk melanjutkan:");

    if (confirmPrompt !== "RESET SAYA YAKIN") {
      alert("Reset dibatalkan.");
      return;
    }

    setLoading(true);
    try {
      console.log('🗑️ Menghapus data Revenue...');
      const { error: revError } = await supabase.from('monthly_revenue').delete().neq('month', 'xx_dummy_xx'); // Delete all
      if (revError) throw revError;

      console.log('🗑️ Menghapus data Orders...');
      const { error: orderError } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      if (orderError) throw orderError;

      alert('Berhasil mereset seluruh data transaksi dan pendapatan!');

      // Reset stats in UI immediately
      setRealTimeStats({
        totalRevenue: 0, pendingOrders: 0, completedOrders: 0,
        cancelledOrders: 0, totalProducts: realTimeStats.totalProducts,
        totalStockValue: realTimeStats.totalStockValue,
        lowStockProducts: realTimeStats.lowStockProducts,
        totalOrders: 0, previousRevenue: 0
      });
      setOrders([]);
      await fetchInitialData();
    } catch (error) {
      console.error('❌ Error resetting data:', error);
      alert('Gagal mereset data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert('Akses Ditolak: ' + error.message);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);

    try {
      const order = orders.find(o => o.id === orderId);

      if (order) {
        console.log('📦 Found order:', order);

        // Parse order items from items_summary or items field
        let orderItems = [];
        if (order.items) {
          orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        } else if (order.items_summary) {
          // Try to extract items from summary - basic parsing
          try {
            // If items_summary contains JSON data
            if (order.items_summary.includes('{')) {
              orderItems = JSON.parse(order.items_summary);
            } else {
              // Fallback: don't create dummy item for stock update if we don't know the real products
              orderItems = [];
            }
          } catch (e) {
            console.log('Error parsing items_summary:', e);
            orderItems = [];
          }
        }

        console.log('🛒 Order items:', orderItems);

        // Filter out dummy items from past bugs (where item.id === order.id)
        if (orderItems && orderItems.length > 0) {
          orderItems = orderItems.filter(item => item.id !== orderId && item.id !== 'dssdsdsds');
        }

        // Handle stock changes based on status - RE-ENABLED WITH CORRECT FIELD NAMES
        if (newStatus === 'completed' && order.status !== 'completed') {
          console.log('✅ Decreasing stock for completed order...');
          try {
            await decreaseStock(orderItems);
          } catch (stockError) {
            console.error('⚠️ Stock management error:', stockError);
            // Don't fail the order update, just log the error
          }
        } else if (newStatus === 'cancelled' && order.status === 'pending') {
          console.log('↩️ Increasing stock for cancelled order...');
          try {
            await increaseStock(orderItems);
          } catch (stockError) {
            console.error('⚠️ Stock management error:', stockError);
            // Don't fail the order update, just log the error
          }
        }

        // Update order status in database
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

        if (error) {
          console.error('❌ Error updating order status:', error);
          throw error;
        }

        console.log('✅ Order status updated successfully');

        // Refresh data immediately
        await fetchInitialData();

        // Force stats update
        try {
          const stats = await getRealTimeStats();
          console.log('📊 Updated stats after status change:', stats);
          setRealTimeStats(stats);
        } catch (statsError) {
          console.error('❌ Error updating stats:', statsError);
        }
      } else {
        console.error('❌ Order not found:', orderId);
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      alert('Error updating order status: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Hapus produk ini secara permanen?')) {
      setLoading(true);
      try {
        // Hapus langsung dari tabel 'products' menggunakan Supabase Client
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        alert('Produk berhasil dihapus!');
        
        // Refresh data agar daftar produk diperbarui
        await fetchInitialData();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Gagal menghapus produk: ' + err.message);
      } finally {
        setLoading(true);
      }
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await updateProductStock(productId, parseInt(newStock));
      fetchInitialData();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock: ' + error.message);
    }
  };

  // --- UI: Login Page ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <TrendingUp className="text-emerald-400 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2 uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-slate-400 text-sm text-center mb-8">Enter secure key to access dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="admin@warungakang.com"
              className="w-full px-6 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all outline-none tracking-widest"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all outline-none tracking-[0.5em]"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:bg-slate-400"
            >
              {loading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      {/* --- Responsive Sidebar --- */}
      <aside className="w-64 lg:w-72 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 lg:p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 lg:gap-3 mb-8 lg:mb-16">
          <div className="bg-slate-900 p-1.5 lg:p-2 rounded-lg">
            <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
          </div>
          <span className="font-bold uppercase tracking-tighter text-sm lg:text-lg">Akang<span className="text-emerald-600">Admin</span></span>
        </div>

        <nav className="space-y-1 lg:space-y-2 flex-grow">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Order List', icon: ShoppingCart },
            { id: 'products', label: 'Inventory', icon: Package },
            { id: 'revenue', label: 'Pendapatan', icon: TrendingUp },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-5 py-2.5 lg:py-4 rounded-xl lg:rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === nav.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
              <nav.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span className="hidden lg:block">{nav.label}</span>
              <span className="lg:hidden text-xs">{nav.label.slice(0, 3)}</span>
            </button>
          ))}
        </nav>

        <button onClick={async () => await supabase.auth.signOut()} className="flex items-center gap-3 lg:gap-4 px-3 lg:px-5 py-2.5 lg:py-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-xl lg:rounded-2xl transition-all">
          <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </aside>

      {/* --- Mobile Navigation --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard },
            { id: 'orders', icon: ShoppingCart },
            { id: 'products', icon: Package },
            { id: 'revenue', icon: TrendingUp },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${activeTab === nav.id ? 'text-emerald-600' : 'text-slate-400'
                }`}
            >
              <nav.icon className="w-5 h-5" />
              <span className="text-xs">{nav.id.slice(0, 4)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="flex-grow p-4 lg:p-6 xl:p-12 max-w-7xl mx-auto pb-20 md:pb-0">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div>
            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1 lg:mb-2">Internal Management</p>
            <h1 className="text-2xl lg:text-3xl font-light tracking-tight capitalize">{activeTab} Panel</h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative group">
              <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-9 lg:pl-11 pr-3 lg:pr-6 py-2 lg:py-3 bg-white border border-slate-100 rounded-full text-xs lg:text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 w-48 lg:w-64 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === 'products' && (
              <button
                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                className="bg-emerald-600 text-white p-2 lg:p-3 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            )}
          </div>
        </header>

        {/* --- Tab Content: Dashboard --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 lg:space-y-12">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((s, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={i} className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-[2rem] border border-slate-50 shadow-sm"
                >
                  <div className={`${s.bg} w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-6`}>
                    <s.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${s.color}`} />
                  </div>
                  <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                  <h3 className="text-lg lg:text-2xl font-bold text-slate-900">{s.value}</h3>
                  <div className="mt-3 lg:mt-4 flex items-center gap-2 text-[9px] lg:text-[10px] font-bold text-emerald-600">
                    <ArrowUpRight className="w-2.5 h-2.5 lg:w-3 lg:h-3" /> {s.trend}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                  Recent Transactions
                  <button
                    onClick={handleResetAllData}
                    className="ml-4 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black hover:bg-red-600 hover:text-white transition-all flex items-center gap-1"
                    title="Hapus Semua Data Transaksi & Pendapatan"
                  >
                    <Trash2 className="w-3 h-3" /> RESET DATA
                  </button>
                </h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-8 py-4">Customer</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.filter(o => o.status === 'pending' || o.status === 'pending_verification').slice(0, 5).map((order) => (
                      <tr key={order.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 font-medium">{order.customer_name}</td>
                        <td className="px-8 py-5">Rp {order.total_amount?.toLocaleString()}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-slate-400 text-xs">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {orders.filter(o => o.status === 'pending' || o.status === 'pending_verification').length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-8 text-center text-slate-400 text-sm">
                          No pending transactions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab Content: Orders --- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-8 py-6">Reference ID</th>
                    <th className="px-8 py-6">Customer & Phone</th>
                    <th className="px-8 py-6">Items</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6">Total</th>
                    <th className="px-8 py-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.filter(o =>
                    fuzzyMatch(o.customer_name, searchQuery) &&
                    (o.status === 'pending' || o.status === 'pending_verification')
                  ).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="px-8 py-6 text-[10px] font-mono text-slate-400">#{order.id.slice(0, 8)}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-sm text-slate-900">{order.customer_name}</p>
                        <p className="text-xs text-slate-400">{order.customer_phone}</p>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <div className="text-xs text-slate-500">
                          {order.items && order.items.length > 0 ? (
                            <div>
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="mb-1">
                                  {item.name} x{item.quantity}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-slate-400">+{order.items.length - 2} more</div>
                              )}
                            </div>
                          ) : order.items_summary ? (
                            <p className="line-clamp-1 italic">{order.items_summary}</p>
                          ) : (
                            <p className="text-slate-400">No items data</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-sm">Rp {order.total_amount?.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedOrder(order)} className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all text-xs font-bold">
                            Detail
                          </button>
                          <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><XCircle className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Tab Content: Revenue --- */}
        {activeTab === 'revenue' && (
          <MonthlyRevenueChart />
        )}

        {/* --- Tab Content: Products --- */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            <AnimatePresence>
              {products.filter(p => fuzzyMatch(p.name, searchQuery)).map((product) => (
                <motion.div
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={product.id} className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-[2rem] border border-slate-50 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                >
                  <div className="aspect-square rounded-xl lg:rounded-2xl overflow-hidden bg-slate-50 mb-4 lg:mb-6 relative">
                    <img src={product.image_url || '/placeholder.png'} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={product.name} />
                    <div className="absolute top-2 lg:top-4 right-2 lg:right-4 flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white p-1.5 lg:p-2 rounded-full shadow-lg text-slate-600 hover:text-emerald-600"><Edit3 className="w-3 h-3 lg:w-4 lg:h-4" /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="bg-white p-1.5 lg:p-2 rounded-full shadow-lg text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3 lg:w-4 lg:h-4" /></button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm lg:text-base text-slate-900 tracking-tight">{product.name}</h3>
                    <span className="text-xs lg:text-sm font-black text-emerald-600">Rp {product.price.toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-slate-300">{product.category}</p>
                  <div className="mt-2 lg:mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <span className="text-[9px] lg:text-[10px] font-bold text-slate-400">Stock:</span>
                      <span className={`text-xs lg:text-sm font-bold ${product.stock <= 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                        {product.stock} pcs
                      </span>
                    </div>
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                      className="w-14 lg:w-16 px-1.5 lg:px-2 py-1 text-xs border border-slate-200 rounded text-center"
                      min="0"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* --- Add Product Modal (Responsive Design) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 lg:p-12 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 lg:top-8 right-4 lg:right-8 text-slate-400 hover:text-slate-900"><XCircle className="w-6 h-6 lg:w-8 lg:h-8" /></button>
            <h2 className="text-2xl lg:text-3xl font-light mb-6 lg:mb-8 italic font-serif">Add New Product</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 lg:px-5 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="e.g. Wortel Organik"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Price (IDR)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: formatCurrencyInput(e.target.value) })}
                    className="w-full px-4 lg:px-5 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="20.000"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 lg:px-5 py-3 bg-slate-50 rounded-xl outline-none appearance-none"
                    >
                      <option value="warung_sayur">Warung Sayur</option>
                      <option value="asinan_sayur">Asinan Signature</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 lg:px-5 py-3 bg-slate-50 rounded-xl outline-none appearance-none"
                    >
                      <option value="sayuran">Sayuran</option>
                      <option value="buah">Buah-Buahan</option>
                      <option value="bumbu">Bumbu Dapur</option>
                      <option value="sembako">Sembako</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 lg:px-5 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    rows={3}
                    placeholder="Product description..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 lg:px-5 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <div
                  className="aspect-square lg:aspect-square bg-slate-50 rounded-2xl lg:rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer relative overflow-hidden"
                  onDrop={handleImageDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 lg:w-8 lg:h-8 mb-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-center">Click to upload image</span>
                      <p className="text-[8px] lg:text-[9px] mt-2">Max size: 5MB</p>
                    </>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600 animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSaveProduct}
                  disabled={isUploading}
                  className="w-full py-4 lg:py-5 bg-slate-900 text-white rounded-xl lg:rounded-2xl font-bold text-[9px] lg:text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Save to Inventory'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* --- MODAL DETAIL PESANAN (REVOLUSI) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header Visual */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">Pesanan Baru - Warung Akang</p>
                <h2 className="text-2xl font-bold tracking-tighter italic">Order Detail</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white transition-colors">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto no-scrollbar">
              {/* DATA PEMESAN */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4">Data Pemesan</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-400">Nama:</span> <span className="font-bold">{selectedOrder.customer_name}</span></p>
                  <p><span className="text-slate-400">No. WA:</span> <span className="font-bold">{selectedOrder.customer_phone}</span></p>
                  <p><span className="text-slate-400">Alamat:</span> <span className="font-medium text-slate-600 italic">"{selectedOrder.customer_address || selectedOrder.address || 'Alamat tidak diisi'}"</span></p>
                </div>
              </div>

              {/* DAFTAR PESANAN */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Item Pesanan</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <span className="text-sm font-bold text-slate-800">- {item.name} ({item.quantity}x)</span>
                      <span className="text-sm font-mono text-emerald-600 font-black">Rp {item.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between items-center bg-emerald-50 p-4 rounded-2xl">
                  <span className="font-black text-xs uppercase tracking-widest text-emerald-700">Total Tagihan</span>
                  <span className="text-xl font-black text-slate-900">Rp {selectedOrder.total_amount?.toLocaleString()}</span>
                </div>
              </div>

              {/* BUKTI PEMBAYARAN */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Bukti Verifikasi</h3>
                <div className="rounded-3xl overflow-hidden border-2 border-slate-100 shadow-sm relative group">
                  <img
                    src={selectedOrder.payment_proof_url}
                    className="w-full h-auto max-h-80 object-contain bg-slate-100"
                    alt="Bukti Transfer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                    Status: {selectedOrder.status}
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 mt-3 font-mono break-all">{selectedOrder.payment_proof_url}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => { handleUpdateStatus(selectedOrder.id, 'completed'); setSelectedOrder(null); }}
                className="flex-grow py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-colors"
              >
                Tandai Selesai
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}