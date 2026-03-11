import { supabase } from './supabase';

// Create notification for new order
export async function createNotification(type, title, message, orderId = null, data = {}) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        type,
        title,
        message,
        order_id: orderId,
        data,
        is_read: false
      }]);

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    console.log('✅ Notification created:', { type, title, message });
    return true;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return false;
  }
}

// Get all notifications with unread count
export async function getNotifications() {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

// Get unread count
export async function getUnreadCount() {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

// Mark notification as read
export async function markAsRead(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// Mark all notifications as read
export async function markAllAsRead() {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

// Auto-create notification for new orders
export async function notifyNewOrder(orderData) {
  const message = `Pesanan baru dari ${orderData.customer_name} - Rp ${orderData.total_amount?.toLocaleString('id-ID')}`;
  
  return await createNotification(
    'new_order',
    '🛒 Pesanan Baru',
    message,
    orderData.id,
    {
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      total_amount: orderData.total_amount,
      order_id: orderData.order_id
    }
  );
}

// Auto-create notification for low stock
export async function notifyLowStock(productName, currentStock) {
  const message = `Stok ${productName} menipis: ${currentStock} pcs tersisa`;
  
  return await createNotification(
    'low_stock',
    '⚠️ Stok Menipis',
    message,
    null,
    {
      product_name: productName,
      current_stock: currentStock
    }
  );
}
