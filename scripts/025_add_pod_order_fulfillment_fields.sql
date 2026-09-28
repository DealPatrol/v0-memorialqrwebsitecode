-- Migration: Add POD fulfillment fields to orders table
-- This migration is strictly additive and safe for existing data.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS line_items JSONB,
ADD COLUMN IF NOT EXISTS fulfillment_provider TEXT,
ADD COLUMN IF NOT EXISTS fulfillment_id TEXT,
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS fulfillment_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS print_file_url TEXT;

-- Index fulfillment status for quick lookup by dispatch services
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_provider ON orders(fulfillment_provider);

COMMENT ON COLUMN orders.line_items IS 'Detailed array of purchased POD items with provider, template, price, and quantity';
COMMENT ON COLUMN orders.fulfillment_provider IS 'Print provider for order (printful, printify, or mixed)';
COMMENT ON COLUMN orders.fulfillment_id IS 'External order or shipment ID returned by fulfillment provider';
COMMENT ON COLUMN orders.fulfillment_status IS 'Fulfillment status (awaiting_memorial_setup, awaiting_print_file, ready_for_fulfillment, submitted, in_production, shipped, cancelled)';
COMMENT ON COLUMN orders.fulfillment_data IS 'Provider-specific metadata, payload responses, tracking info';
COMMENT ON COLUMN orders.print_file_url IS 'High-resolution composite print file URL with generated QR code';
