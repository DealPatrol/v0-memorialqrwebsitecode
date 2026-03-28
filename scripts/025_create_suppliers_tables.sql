-- Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Supplier basic info
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- API Configuration
  api_key_encrypted TEXT, -- Encrypted API key stored securely
  api_endpoint TEXT,
  api_type TEXT NOT NULL, -- 'printful', 'printfusion', 'printnode', 'custom'
  
  -- Status and settings
  is_active BOOLEAN DEFAULT true,
  is_primary BOOLEAN DEFAULT false, -- Primary supplier for routing
  priority INTEGER DEFAULT 0, -- Higher priority used first
  
  -- Configuration JSON
  config JSONB DEFAULT '{}'::jsonb, -- Additional config like webhook settings, product mappings
  
  admin_notes TEXT
);

-- Create memorials reference table if needed
CREATE TABLE IF NOT EXISTS public.memorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'US',
  
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  product_type TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE SET NULL,
  special_instructions TEXT,
  admin_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Create order_suppliers table to track which supplier each order was sent to
CREATE TABLE IF NOT EXISTS public.order_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign keys
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  
  -- Supplier order info
  supplier_order_id TEXT, -- Order ID from the supplier's system
  supplier_status TEXT, -- 'pending', 'submitted', 'processing', 'printed', 'shipped', 'error'
  
  -- Tracking
  submitted_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  
  -- Error handling
  last_error TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Logs
  sync_logs JSONB DEFAULT '[]'::jsonb -- Array of sync attempts with timestamps and status
);

-- Create product_supplier_mappings table for routing products to specific suppliers
CREATE TABLE IF NOT EXISTS public.product_supplier_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign keys
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  
  -- Product mapping
  product_type TEXT NOT NULL, -- e.g., 'wooden-keychain-necklace', 'slate-coaster', 'photo-frame'
  product_name TEXT,
  
  -- Supplier product details
  supplier_product_id TEXT, -- ID in the supplier's system
  supplier_product_name TEXT,
  
  -- Settings
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  fallback_supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL, -- Fallback if this supplier fails
  
  -- Configuration
  variant_mapping JSONB DEFAULT '{}'::jsonb, -- Map our options to supplier's options
  
  UNIQUE(supplier_id, product_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON public.suppliers(is_active);
CREATE INDEX IF NOT EXISTS idx_suppliers_primary ON public.suppliers(is_primary);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_order_id ON public.order_suppliers(order_id);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_supplier_id ON public.order_suppliers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_status ON public.order_suppliers(supplier_status);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_submitted_at ON public.order_suppliers(submitted_at);
CREATE INDEX IF NOT EXISTS idx_product_supplier_mappings_supplier_id ON public.product_supplier_mappings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_product_supplier_mappings_product_type ON public.product_supplier_mappings(product_type);

-- Create product_supplier_mappings table for routing products to specific suppliers
CREATE TABLE IF NOT EXISTS public.product_supplier_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign keys
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  
  -- Product mapping
  product_type TEXT NOT NULL, -- e.g., 'wooden-keychain-necklace', 'slate-coaster', 'photo-frame'
  product_name TEXT,
  
  -- Supplier product details
  supplier_product_id TEXT, -- ID in the supplier's system
  supplier_product_name TEXT,
  
  -- Settings
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  fallback_supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL, -- Fallback if this supplier fails
  
  -- Configuration
  variant_mapping JSONB DEFAULT '{}'::jsonb, -- Map our options to supplier's options
  
  UNIQUE(supplier_id, product_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON public.suppliers(is_active);
CREATE INDEX IF NOT EXISTS idx_suppliers_primary ON public.suppliers(is_primary);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_order_id ON public.order_suppliers(order_id);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_supplier_id ON public.order_suppliers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_status ON public.order_suppliers(supplier_status);
CREATE INDEX IF NOT EXISTS idx_order_suppliers_submitted_at ON public.order_suppliers(submitted_at);
CREATE INDEX IF NOT EXISTS idx_product_supplier_mappings_supplier_id ON public.product_supplier_mappings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_product_supplier_mappings_product_type ON public.product_supplier_mappings(product_type);

-- Row Level Security will be configured separately

-- Create update triggers
CREATE OR REPLACE FUNCTION update_suppliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suppliers_updated_at_trigger
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_suppliers_updated_at();

CREATE OR REPLACE FUNCTION update_order_suppliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_suppliers_updated_at_trigger
  BEFORE UPDATE ON public.order_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_order_suppliers_updated_at();

CREATE OR REPLACE FUNCTION update_product_supplier_mappings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_supplier_mappings_updated_at_trigger
  BEFORE UPDATE ON public.product_supplier_mappings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_supplier_mappings_updated_at();
