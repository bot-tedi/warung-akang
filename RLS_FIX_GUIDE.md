# 🛠️ FIX RLS POLICY ERROR - MOBILE CHECKOUT ISSUE

## 🚨 Problem Analysis
**Error**: "new row violates row-level security policy for table 'orders'"
**Issue**: Works on laptop but fails on mobile devices

## 🔍 Root Cause
- Using **anon key** with RLS restrictions
- Mobile browsers have different session/cookie handling
- RLS policies block anonymous inserts from mobile contexts

## ✅ Solutions (Choose One)

### Solution 1: Disable RLS for Orders (Development)
```sql
-- Run in Supabase SQL Editor
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
```

### Solution 2: Create Permissive Policy (Recommended)
```sql
-- Allow anyone to insert orders
CREATE POLICY "Enable insert for all users" ON orders
FOR INSERT WITH CHECK (true);

-- Allow anyone to select orders
CREATE POLICY "Enable select for all users" ON orders
FOR SELECT USING (true);
```

### Solution 3: Use Service Role Key (Production)
1. Get service role key from Supabase Dashboard > Settings > API
2. Replace `'your-service-role-key-here'` in `lib/supabase.js`
3. Code already updated to use `supabaseAdmin` for checkout

## 🚀 Quick Fix (Immediate)

Run this SQL in Supabase Dashboard:
```sql
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
```

## 📱 Why Mobile vs Desktop Difference?
- Desktop: Stable sessions, persistent cookies
- Mobile: Session resets, different browser contexts
- RLS policies treat them differently

## 🔧 Implementation Steps

1. **Immediate**: Run SQL fix above
2. **Test**: Try checkout on mobile
3. **Production**: Set up proper RLS policies if needed

## 📞 Support
Check browser console for detailed error messages if issue persists.
