-- Hapus policy lama
DROP POLICY IF EXISTS "Allow payment-proofs all" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads" ON storage.objects;

-- Buat policy baru (INSERT dengan WITH CHECK)
CREATE POLICY "Allow payment-proofs insert"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Allow payment-proofs select"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'payment-proofs');