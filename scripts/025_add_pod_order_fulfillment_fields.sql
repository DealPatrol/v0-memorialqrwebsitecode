-- Additive columns so a paid order can store the supplier result.
-- Safe to run more than once.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS line_items JSONB,
ADD COLUMN IF NOT EXISTS fulfillment_provider TEXT,
ADD COLUMN IF NOT EXISTS fulfillment_id TEXT,
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS fulfillment_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS print_file_url TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_provider ON orders(fulfillment_provider);
