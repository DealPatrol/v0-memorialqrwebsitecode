-- Add Square customer ID column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS square_customer_id VARCHAR;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_square_customer_id ON orders(square_customer_id);

-- Add comment
COMMENT ON COLUMN orders.square_customer_id IS 'Square customer ID linked to this order';
