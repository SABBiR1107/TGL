-- ==========================================
-- 1. EXTENSIONS & TABLES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT DEFAULT 'Uncategorized',
  available_sizes TEXT[] DEFAULT '{5KG, 7KG, 10KG}',
  stock_status TEXT DEFAULT 'In Stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  category TEXT,
  size TEXT,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  district TEXT,
  payment_method TEXT NOT NULL,
  bkash_transaction_id TEXT,
  customer_note TEXT,
  admin_note TEXT, -- Added for admin management
  order_status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. SECURITY POLICIES (Proper & Safe)
-- ==========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);

-- Orders: Public can insert and select (to track status)
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can select orders" ON orders;
CREATE POLICY "Public can select orders" ON orders FOR SELECT USING (true);

-- Storage: Public access to 'product-media' bucket
-- Run these only if the bucket exists
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-media' );
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-media' );
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-media' );
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'product-media' );

-- ==========================================
-- 3. MIGRATION & FIXES (The "Worker" Part)
-- ==========================================

-- Ensure columns exist even if table was created long ago
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_note text;

-- Fix the category constraint error once and for all
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Clean existing data so the constraint can be applied
UPDATE products SET category = 'Uncategorized' 
WHERE category IS NULL OR category NOT IN ('iron dumbell', 'mossaic dumbell', 'Uncategorized');

-- Apply the proper constraint
ALTER TABLE products ADD CONSTRAINT products_category_check 
CHECK (category IN ('iron dumbell', 'mossaic dumbell', 'Uncategorized'));

-- Refresh PostgREST to recognize changes
NOTIFY pgrst, 'reload schema';




























-- ==========================================
-- 1. EXTENSIONS & TABLES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT DEFAULT 'Uncategorized',
  available_sizes TEXT[] DEFAULT '{5KG, 7KG, 10KG}',
  stock_status TEXT DEFAULT 'In Stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  category TEXT,
  size TEXT,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  district TEXT,
  payment_method TEXT NOT NULL,
  bkash_transaction_id TEXT,
  customer_note TEXT,
  admin_note TEXT, -- Added for admin management
  order_status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. SECURITY POLICIES (Proper & Safe)
-- ==========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);

-- Orders: Public can insert and select (to track status)
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can select orders" ON orders;
CREATE POLICY "Public can select orders" ON orders FOR SELECT USING (true);

-- Storage: Public access to 'product-media' bucket
-- Run these only if the bucket exists
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-media' );
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-media' );
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-media' );
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'product-media' );

-- ==========================================
-- 3. MIGRATION & FIXES (The "Worker" Part)
-- ==========================================

-- Ensure columns exist even if table was created long ago
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_note text;

-- Fix the category constraint error once and for all
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Clean existing data so the constraint can be applied
UPDATE products SET category = 'Uncategorized' 
WHERE category IS NULL OR category NOT IN ('iron dumbell', 'mossaic dumbell', 'Uncategorized');

-- Apply the proper constraint
ALTER TABLE products ADD CONSTRAINT products_category_check 
CHECK (category IN ('iron dumbell', 'mossaic dumbell', 'Uncategorized'));

-- Refresh PostgREST to recognize changes
NOTIFY pgrst, 'reload schema';



