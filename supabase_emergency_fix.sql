-- EMERGENCY FIX: DISABLE RLS COMPLETELY (Untuk Testing)
-- Jalankan ini kalau SQL lain tidak berhasil

-- Disable RLS on all tables (EMERGENCY ONLY)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Pastikan bucket ada
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('payment-proofs', 'payment-proofs', true),
    ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Note: Setelah testing berhasil, ENABLE RLS lagi dengan policy yang benar!
