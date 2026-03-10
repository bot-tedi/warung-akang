-- FIX SUPABASE RLS POLICIES
-- Run this SQL in Supabase Dashboard → SQL Editor

-- 1. Create metadata table for storage objects (public.file_references)
CREATE TABLE IF NOT EXISTS public.file_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL,
  object_name text NOT NULL, -- storage.objects.name
  url text,                  -- optional pre-signed URL or public URL
  uploaded_by uuid,          -- auth user id (nullable for anon uploads)
  content_type text,
  size bigint,
  created_at timestamptz DEFAULT now()
);

-- 2. Ensure extension for gen_random_uuid() exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_file_references_bucket ON public.file_references (bucket_id);
CREATE INDEX IF NOT EXISTS idx_file_references_uploaded_by ON public.file_references (uploaded_by);

-- 4. Enable RLS on this table
ALTER TABLE public.file_references ENABLE ROW LEVEL SECURITY;

-- 5. Drop conflicting policies if any (safe no-op if not exist)
DROP POLICY IF EXISTS "anon insert payment proofs" ON public.file_references;
DROP POLICY IF EXISTS "anon select payment proofs" ON public.file_references;
DROP POLICY IF EXISTS "owner_full_access" ON public.file_references;

-- 6. Create policies:
-- Allow anonymous INSERTs only for bucket = 'payment-proofs'
CREATE POLICY "anon insert payment proofs" ON public.file_references
FOR INSERT TO anon
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow anonymous SELECTs only for bucket = 'payment-proofs'
CREATE POLICY "anon select payment proofs" ON public.file_references
FOR SELECT TO anon
USING (bucket_id = 'payment-proofs');

-- Allow authenticated users to INSERT their own records (and ensure uploaded_by matches auth.uid())
CREATE POLICY "auth insert own" ON public.file_references
FOR INSERT TO authenticated
WITH CHECK (
  (bucket_id = 'payment-proofs') AND (
    (uploaded_by IS NOT NULL AND uploaded_by = (SELECT auth.uid()))
    OR uploaded_by IS NULL
  )
);

-- Allow authenticated users to SELECT their own records
CREATE POLICY "auth select own" ON public.file_references
FOR SELECT TO authenticated
USING (
  -- allow if it's a payment-proofs file and uploaded_by matches OR public listing (optional)
  bucket_id = 'payment-proofs' AND (
    uploaded_by = (SELECT auth.uid()) OR uploaded_by IS NULL
  )
);

-- Optional: Allow admins (based on custom JWT claim 'role' = 'admin') full access
CREATE POLICY "admin full access" ON public.file_references
FOR ALL TO authenticated
USING ((auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- 7. Enable RLS on storage.objects (if not already)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;

-- 9. Create new policies for payment-proofs bucket
CREATE POLICY "Allow anon uploads to payment-proofs" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Allow anon select from payment-proofs" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'payment-proofs');

-- 10. Enable RLS on orders table (if not exists)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 11. Drop existing orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;

-- 12. Create new policies for orders table
CREATE POLICY "Allow anon inserts to orders" ON orders
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow anon select from orders" ON orders
FOR SELECT TO anon
USING (true);

-- 13. Verify policies
SELECT * FROM pg_policies WHERE tablename IN ('storage.objects', 'orders', 'file_references');

-- 14. Test query: list policies for file_references table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'file_references';
