-- E-Commerce Platform Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
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
  stock_status TEXT DEFAULT 'In Stock', -- 'In Stock' or 'Out of Stock'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL, -- Human-readable ID like ORD-XXXXXX
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
  payment_method TEXT NOT NULL, -- 'Cash on Delivery' or 'bKash'
  bkash_transaction_id TEXT,
  customer_note TEXT,
  order_status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for Products (Public can read)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" ON products
FOR SELECT USING (true);

-- Policies for Orders (Public can insert, admin uses service role)
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select orders" ON orders;
CREATE POLICY "Public can select orders" ON orders
FOR SELECT USING (true);

-- Allow public access to the product-media bucket
-- This allows anyone to view and upload files (ideal for public product media)

-- 1. Allow public to view files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-media' );

-- 2. Allow public to upload files
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-media' );

-- 3. Allow public to update/delete files
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-media' );
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'product-media' );

-- Allow the app to confirm orders were saved
DROP POLICY IF EXISTS "Public can select orders" ON orders;
CREATE POLICY "Public can select orders" ON orders FOR SELECT USING (true);





















-- STEP 1: RUN THIS FIRST
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text;

-- STEP 2: RUN THIS SECOND (AFTER STEP 1 FINISHES)
UPDATE products SET image_urls = ARRAY[image_url] WHERE image_urls = '{}' OR image_urls IS NULL;

-- STEP 3: REFRESH CACHE
NOTIFY pgrst, 'reload schema';






-- 1. Drop the old category constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- 2. Add the new category constraint with updated names
ALTER TABLE products ADD CONSTRAINT products_category_check 
CHECK (category IN ('iron dumbell', 'mossaic dumbell', 'Uncategorized'));

-- 3. Update existing records to match new names (if not already done)
UPDATE products SET category = 'iron dumbell' WHERE category = 'Category One';
UPDATE products SET category = 'mossaic dumbell' WHERE category = 'Category Two';
UPDATE orders SET category = 'iron dumbell' WHERE category = 'Category One';
UPDATE orders SET category = 'mossaic dumbell' WHERE category = 'Category Two';
