import { createClient } from '@supabase/supabase-js';

// Hardcoded values to ensure connection works (same as lib/supabase.js)
const supabaseUrl = 'https://qhqtewsbfqvxuxwtdiqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRld3NiZnF2eHV4d3RkaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzQxOTYsImV4cCI6MjA4ODcxMDE5Nn0.939Z8wXSHu1jCB0EgS6Xkdzhkok1bBv8SdwbcvF-1O8';

// Create admin client with service role key
// Note: You should replace this with actual service role key from Supabase dashboard
const serviceRoleKey = 'your-service-role-key-here'; // Ganti dengan service role key dari Supabase dashboard
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

const ADMIN_PASSWORD = 'W4rung@k4ng2024!S3cur3';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const password = formData.get('password');

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401 }
      );
    }

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `products/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    // Convert File to Uint8Array instead of Buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload using service role
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, uint8Array, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: uploadError.message }),
        { status: 400 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ url: publicUrlData.publicUrl }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
