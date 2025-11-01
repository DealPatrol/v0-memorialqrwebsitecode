-- Add subscription plan ID to track Square subscription plans
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS subscription_plan_id TEXT;

-- Create a table to track subscription payments
CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  subscription_id TEXT NOT NULL,
  payment_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  billing_period_start DATE,
  billing_period_end DATE,
  failure_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_payments_order_id ON subscription_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription_id ON subscription_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON subscription_payments(status);
