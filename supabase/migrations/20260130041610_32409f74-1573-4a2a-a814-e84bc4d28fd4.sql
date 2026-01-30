-- Create products table for storing pricing scenarios
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  link TEXT,
  image_url TEXT,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC NOT NULL DEFAULT 0,
  net_profit NUMERIC NOT NULL DEFAULT 0,
  margin_type TEXT NOT NULL DEFAULT 'recommended',
  base_cost NUMERIC DEFAULT 0,
  import_shipping NUMERIC DEFAULT 0,
  packaging_cost NUMERIC DEFAULT 0,
  customs_clearance NUMERIC DEFAULT 0,
  misc_costs NUMERIC DEFAULT 0,
  customer_delivery_fee NUMERIC DEFAULT 0,
  gateway_fee_percent NUMERIC DEFAULT 2.2,
  gateway_fixed_fee NUMERIC DEFAULT 1.0
);

-- Enable Row Level Security (public access for demo - no auth required)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON public.products 
FOR SELECT 
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access" 
ON public.products 
FOR DELETE 
USING (true);

-- Allow public update access
CREATE POLICY "Allow public update access" 
ON public.products 
FOR UPDATE 
USING (true);