import { createClient } from '@supabase/supabase-js';

// Hardcoded values to ensure connection works (same as lib/supabase.js)
const supabaseUrl = 'https://qhqtewsbfqvxuxwtdiqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRld3NiZnF2eHV4d3RkaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzQxOTYsImV4cCI6MjA4ODcxMDE5Nn0.939Z8wXSHu1jCB0EgS6Xkdzhkok1bBv8SdwbcvF-1O8';

// Create admin client with service role key (bypasses RLS)
// Note: You should replace this with actual service role key from Supabase dashboard
const serviceRoleKey = 'your-service-role-key-here'; // Ganti dengan service role key dari Supabase dashboard
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

const ADMIN_PASSWORD = 'W4rung@k4ng2024!S3cur3';

export async function POST(request) {
  try {
    const { password, action, productData, productId } = await request.json();

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401 }
      );
    }

    if (action === 'insert') {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (action === 'update') {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (action === 'delete') {
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
