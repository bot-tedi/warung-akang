-- FIX ORDERS TABLE - ADD order_id COLUMN
-- Run ini di Supabase SQL Editor

-- 1. Cek apakah column order_id sudah ada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public';

-- 2. Tambah column order_id jika belum ada
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_id TEXT;

-- 3. Buat index untuk order_id (untuk performance)
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);

-- 4. Verifikasi column sudah ditambahkan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;
