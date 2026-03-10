import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhqtewsbfqvxuxwtdiqb.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRld3NiZnF2eHV4d3RkaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzQxOTYsImV4cCI6MjA4ODcxMDE5Nn0.939Z8wXSHu1jCB0EgS6Xkdzhkok1bBv8SdwbcvF-1O8';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Warning: Missing Supabase environment variables. Using placeholder values.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

// Helper function to fetch products by type and category
export async function fetchProductsByTypeAndCategory(type, category) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('type', type)
    .eq('is_active', true);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}
