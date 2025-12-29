-- Add new columns to orders table for enhanced checkout flow
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20), -- 'one-time' or 'monthly'
ADD COLUMN IF NOT EXISTS plaque_color VARCHAR(20), -- 'silver', 'gold', or 'black'
ADD COLUMN IF NOT EXISTS box_personalization TEXT, -- Custom text for luxury box
ADD COLUMN IF NOT EXISTS addon_wooden_qr BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS addon_picture_plaque BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS addon_stone_qr BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stone_engraving_text TEXT, -- Custom text for stone plaque
ADD COLUMN IF NOT EXISTS picture_plaque_url TEXT, -- URL of uploaded picture for picture plaque
ADD COLUMN IF NOT EXISTS subscription_id TEXT, -- Square subscription ID for monthly plans
ADD COLUMN IF NOT EXISTS monthly_amount_cents INTEGER, -- Monthly recurring amount
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id); -- Link to user account

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_subscription_id ON orders(subscription_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Add comment for documentation
COMMENT ON COLUMN orders.plan_type IS 'Payment plan: one-time ($129.99) or monthly ($49.99 + $4.99/month)';
COMMENT ON COLUMN orders.plaque_color IS 'Selected plaque color: silver, gold, or black';
COMMENT ON COLUMN orders.box_personalization IS 'Custom text to engrave on luxury presentation box';
COMMENT ON COLUMN orders.addon_wooden_qr IS 'Whether customer added wooden QR code ($29.97)';
COMMENT ON COLUMN orders.addon_picture_plaque IS 'Whether customer added picture plaque ($39.98)';
COMMENT ON COLUMN orders.addon_stone_qr IS 'Whether customer added stone QR code ($56.99)';
COMMENT ON COLUMN orders.stone_engraving_text IS 'Custom engraving text for stone QR code';
COMMENT ON COLUMN orders.picture_plaque_url IS 'Blob storage URL for uploaded picture on picture plaque';
COMMENT ON COLUMN orders.subscription_id IS 'Square subscription ID for monthly payment plans';
COMMENT ON COLUMN orders.monthly_amount_cents IS 'Monthly recurring payment amount in cents';
