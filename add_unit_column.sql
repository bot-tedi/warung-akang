-- Add unit column to products table
ALTER TABLE products ADD COLUMN unit TEXT DEFAULT 'kg';

-- Add description column if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing products to have proper units based on category
UPDATE products SET unit = 'kg' WHERE category IN ('sayuran', 'buah', 'cabe_cabean', 'rempah_rempah', 'bawang_bawangan', 'biji_bijian');
UPDATE products SET unit = 'pcs' WHERE category IN ('kerupuk', 'bumbu', 'lainnya');
UPDATE products SET unit = 'pcs' WHERE category = 'sembako';
