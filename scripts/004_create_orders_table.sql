-- Create orders table to track customer purchases
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Order details
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, cancelled
  
  -- Customer information
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Shipping address
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'US',
  
  -- Payment information
  payment_id TEXT, -- Square payment ID
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  amount_cents INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'USD',
  
  -- Product information
  product_type TEXT NOT NULL, -- 'qr_plaque', 'memorial_package', etc.
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  
  -- Memorial connection (nullable - will be filled when memorial is created)
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE SET NULL,
  
  -- Additional notes
  special_instructions TEXT,
  admin_notes TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_memorial_id ON public.orders(memorial_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert orders (for checkout)
CREATE POLICY "Allow public to create orders"
  ON public.orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow users to view their own orders by email
CREATE POLICY "Allow users to view own orders"
  ON public.orders
  FOR SELECT
  TO public
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Allow service role full access (for admin)
CREATE POLICY "Allow service role full access to orders"
  ON public.orders
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
