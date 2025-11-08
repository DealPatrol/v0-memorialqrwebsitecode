-- Add missing columns to orders table for addons and customization
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS plaque_color VARCHAR(50),
ADD COLUMN IF NOT EXISTS box_personalization TEXT,
ADD COLUMN IF NOT EXISTS addon_wooden_qr BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS addon_picture_plaque BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS addon_stone_qr BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stone_engraving_text TEXT,
ADD COLUMN IF NOT EXISTS picture_plaque_url TEXT,
ADD COLUMN IF NOT EXISTS monthly_amount_cents INTEGER,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_plan_id TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_orders_subscription_id ON public.orders(subscription_id);
