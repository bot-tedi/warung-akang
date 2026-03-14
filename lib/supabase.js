import { createClient } from '@supabase/supabase-js';

// Use environment vars for better security and to avoid hardcoded invalid keys.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhqtewsbfqvxuxwtdiqb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRld3NiZnF2eHV4d3RkaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzQxOTYsImV4cCI6MjA4ODcxMDE5Nn0.939Z8wXSHu1jCB0EgS6Xkdzhkok1bBv8SdwbcvF-1O8';

// Service role key untuk admin operations (bypass RLS)
const serviceRoleKey = 'your-service-role-key-here'; // Ganti dengan service role key dari Supabase dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Helper function to upload payment proof to storage
export async function uploadPaymentProof(file, orderId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `receipts/${orderId}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

// Helper function to save order to database
export async function saveOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Helper function to fetch products by type
export async function fetchProductsByType(type) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by type:', error);
    throw error;
  }

  return data || [];
}

// Helper function to fetch products by type and category
export async function fetchProductsByTypeAndCategory(type, category) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('type', type);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by type and category:', error);
    throw error;
  }

  return data || [];
}

// Helper function to update product stock
export async function updateProductStock(productId, newStock) {
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }

  return data;
}

// Helper function to decrease stock when order is placed
export async function decreaseStock(orderItems) {
  const updates = orderItems.map(async (item) => {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.id)
      .single();

    if (product && product.stock >= item.quantity) {
      const newStock = product.stock - item.quantity;
      return await updateProductStock(item.id, newStock);
    } else {
      throw new Error(`Insufficient stock for product: ${item.name}`);
    }
  });

  try {
    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error decreasing stock:', error);
    throw error;
  }
}

// Helper function to increase stock when order is cancelled
export async function increaseStock(orderItems) {
  const updates = orderItems.map(async (item) => {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.id)
      .single();

    if (product) {
      const newStock = product.stock + item.quantity;
      return await updateProductStock(item.id, newStock);
    }
  });

  try {
    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error increasing stock:', error);
    throw error;
  }
}

// Helper function to check product availability
export async function checkProductAvailability(productId, requestedQuantity) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('stock, name')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error checking product availability:', error);
      // Return default values if product not found
      return {
        available: false,
        currentStock: 0,
        productName: 'Unknown Product'
      };
    }

    if (!product) {
      return {
        available: false,
        currentStock: 0,
        productName: 'Unknown Product'
      };
    }

    return {
      available: (product.stock || 0) >= requestedQuantity,
      currentStock: product.stock || 0,
      productName: product.name || 'Unknown Product'
    };
  } catch (error) {
    console.error('Error in checkProductAvailability:', error);
    return {
      available: false,
      currentStock: 0,
      productName: 'Unknown Product'
    };
  }
}

// Helper function to get real-time statistics
export async function getRealTimeStats() {
  try {
    console.log('🔍 Fetching real-time stats...');

    const [productsRes, ordersRes] = await Promise.all([
      supabase.from('products').select('stock, price'),
      supabase.from('orders').select('total_amount, status, created_at') // Use total_amount field
    ]);

    console.log('📊 Products response:', productsRes);
    console.log('📦 Orders response:', ordersRes);

    if (productsRes.error) {
      console.error('❌ Products error:', productsRes.error);
      throw new Error(`Products error: ${productsRes.error.message}`);
    }

    if (ordersRes.error) {
      console.error('❌ Orders error:', ordersRes.error);
      throw new Error(`Orders error: ${ordersRes.error.message}`);
    }

    const products = productsRes.data || [];
    const orders = ordersRes.data || [];

    console.log('📈 Products count:', products.length);
    console.log('📋 Orders count:', orders.length);

    const completedOrders = orders.filter(order => {
      const isCompleted = order.status === 'completed' || order.status === 'completed_verification';
      console.log(`Order ${order.id}: status=${order.status}, isCompleted=${isCompleted}`);
      return isCompleted;
    });

    const pendingOrders = orders.filter(order => {
      const isPending = order.status === 'pending' || order.status === 'pending_verification';
      return isPending;
    });

    const cancelledOrders = orders.filter(order => {
      const isCancelled = order.status === 'cancelled' || order.status === 'canceled';
      return isCancelled;
    });

    console.log('✅ Completed orders:', completedOrders.length);
    console.log('⏳ Pending orders:', pendingOrders.length);
    console.log('❌ Cancelled orders:', cancelledOrders.length);

    const totalRevenue = completedOrders.reduce((acc, order) => {
      const orderTotal = order.total_amount || 0; // Use total_amount field
      console.log(`Order revenue: ${orderTotal} (field: total_amount)`);
      return acc + orderTotal;
    }, 0);

    const totalStockValue = products.reduce((acc, product) => {
      const stockValue = (product.stock || 0) * (product.price || 0);
      return acc + stockValue;
    }, 0);

    const lowStockProducts = products.filter(product => (product.stock || 0) <= 10).length;

    const stats = {
      totalRevenue,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      totalProducts: products.length,
      totalStockValue,
      lowStockProducts,
      totalOrders: orders.length
    };

    console.log('🎯 Final stats:', stats);
    return stats;
  } catch (error) {
    console.error('❌ getRealTimeStats error:', error);
    throw error;
  }
}
