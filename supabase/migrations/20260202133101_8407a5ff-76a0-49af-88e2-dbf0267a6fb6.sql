-- Add user_id column to products table
ALTER TABLE public.products 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop all existing public policies
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow public insert access" ON public.products;
DROP POLICY IF EXISTS "Allow public update access" ON public.products;
DROP POLICY IF EXISTS "Allow public delete access" ON public.products;

-- Create owner-scoped RLS policies
-- Users can only read their own products
CREATE POLICY "Users can read own products"
ON public.products
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert products (user_id will be set via trigger)
CREATE POLICY "Users can insert own products"
ON public.products
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update only their own products
CREATE POLICY "Users can update own products"
ON public.products
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own products
CREATE POLICY "Users can delete own products"
ON public.products
FOR DELETE
USING (auth.uid() = user_id);