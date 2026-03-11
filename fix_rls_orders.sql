-- Disable RLS untuk orders table (development only)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Atau buat policy yang memperbolehkan anon users insert
CREATE POLICY "Enable insert for all users" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON orders
FOR SELECT USING (true);
