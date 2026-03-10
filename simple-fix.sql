-- SIMPLE FIX - TANPA TABLE BARU
-- Run ini di Supabase SQL Editor

-- 1. Hapus semua policies yang conflict
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads to payment-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon select from payment-proofs" ON storage.objects;

-- 2. Pastikan bucket ada (jika belum ada)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('payment-proofs', 'payment-proofs', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- 3. Buat policy sederhana untuk anon uploads
CREATE POLICY "Allow anon uploads" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'payment-proofs');

-- 4. Buat policy untuk anon select
CREATE POLICY "Allow anon select" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'payment-proofs');

-- 5. Orders table - pastikan RLS enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 6. Hapus policies orders yang lama
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;

-- 7. Buat policies sederhana untuk orders
CREATE POLICY "Allow all operations on orders" ON orders
FOR ALL USING (true) WITH CHECK (true);

-- 8. Test query - lihat semua policies
SELECT 
    schemaname,
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has condition'
        ELSE 'No condition'
    END as has_condition
FROM pg_policies 
WHERE tablename IN ('storage.objects', 'orders')
ORDER BY tablename, policyname;
