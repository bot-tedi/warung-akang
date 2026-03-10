'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Plus, 
  Search, 
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

// --- Auth & Config (Tetap sesuai sistem Anda) ---
const ADMIN_PASSWORD_HASH = 'W4rung@k4ng2024!S3cur3';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const [formData, setFormData] = useState({
    name: '', price: '', type: 'warung_sayur', category: 'sayuran', description: '', image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image: ' + err.message);
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

    try {
      let imageUrl = formData.image_url;
      
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }

      const productData = {
        name: formData.name,
        price: parseInt(formData.price),
        type: formData.type,
        category: formData.category,
        description: formData.description,
        image_url: imageUrl,
      };

      if (editingProduct) {
        await supabase.from('products').update(productData).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert([productData]);
      }

      // Reset form
      setFormData({ name: '', price: '', type: 'warung_sayur', category: 'sayuran', description: '', image_url: '' });
      setImageFile(null);
      setImagePreview(null);
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchInitialData();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save product: ' + err.message);
    }
  };

  // --- Logic Dashboard (Logic tetap, hanya format visual diperhalus) ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    return [
      { label: 'Total Revenue', value: `Rp ${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'New Orders', value: pendingOrders, icon: ShoppingCart, trend: 'Action Needed', color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Total Products', value: products.length, icon: Package, trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Total Customers', value: new Set(orders.map(o => o.customer_name)).size, icon: Users, trend: 'Loyalists', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];
  }, [orders, products]);

  // --- Handlers (Fungsi tidak diubah sama sekali) ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD_HASH) setIsAuthenticated(true);
    else alert('Akses Ditolak');
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) fetchInitialData();
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Hapus produk ini secara permanen?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchInitialData();
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
              type="password" 
              placeholder="••••••••" 
              className="w-full px-6 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all outline-none text-center tracking-[0.5em]"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Authenticate</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      {/* --- Sidebar Desktop --- */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-16">
          <div className="bg-slate-900 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold uppercase tracking-tighter text-lg">Akang<span className="text-emerald-600">Admin</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Order List', icon: ShoppingCart },
            { id: 'products', label: 'Inventory', icon: Package },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === nav.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <nav.icon className="w-4 h-4" />
              {nav.label}
            </button>
          ))}
        </nav>

        <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-4 px-5 py-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-2xl transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-grow p-6 lg:p-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Internal Management</p>
            <h1 className="text-3xl font-light tracking-tight capitalize">{activeTab} Panel</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick search..."
                className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 w-64 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* --- Tab Content: Dashboard --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={i} className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"
                >
                  <div className={`${s.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{s.value}</h3>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" /> {s.trend}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-bold uppercase tracking-widest text-xs">Recent Transactions</h2>
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
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 font-medium">{order.customer_name}</td>
                        <td className="px-8 py-5">Rp {order.total_price?.toLocaleString()}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-slate-400 text-xs">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
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
                  {orders.filter(o => o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="px-8 py-6 text-[10px] font-mono text-slate-400">#{order.id.slice(0,8)}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-sm text-slate-900">{order.customer_name}</p>
                        <p className="text-xs text-slate-400">{order.customer_phone}</p>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <p className="text-xs text-slate-500 line-clamp-1 italic">{order.items_summary || 'Manual items list'}</p>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-sm">Rp {order.total_price?.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
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

        {/* --- Tab Content: Products --- */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                <motion.div 
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={product.id} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-6 relative">
                    <img src={product.image_url || '/placeholder.png'} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={product.name} />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white p-2 rounded-full shadow-lg text-slate-600 hover:text-emerald-600"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="bg-white p-2 rounded-full shadow-lg text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 tracking-tight">{product.name}</h3>
                    <span className="text-xs font-black text-emerald-600">Rp {product.price.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300">{product.category}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* --- Add Product Modal (Desain baru, Sistem Placeholder tetap) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] p-12 relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><XCircle className="w-8 h-8" /></button>
              <h2 className="text-3xl font-light mb-8 italic font-serif">Add New Product</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Product Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" 
                      placeholder="e.g. Wortel Organik" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Price (IDR)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" 
                      placeholder="15000" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl outline-none appearance-none"
                    >
                      <option value="warung_sayur">Warung Sayur</option>
                      <option value="asinan_sayur">Asinan Signature</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl outline-none appearance-none"
                    >
                      <option value="sayuran">Sayuran</option>
                      <option value="buah">Buah-Buahan</option>
                      <option value="bumbu">Bumbu Dapur</option>
                      <option value="sembako">Sembako</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" 
                      rows={3}
                      placeholder="Product description..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div 
                    className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer relative overflow-hidden"
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
                        <Upload className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Click to upload image</span>
                        <p className="text-[9px] mt-2">Max size: 5MB</p>
                      </>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleSaveProduct}
                    disabled={isUploading}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50"
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
    </div>
  );
}