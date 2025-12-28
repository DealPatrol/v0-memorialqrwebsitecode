-- Add is_premium column to family_members table
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Add subscription_id column to family_members table
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Create subscriptions table for family member profiles
CREATE TABLE IF NOT EXISTS family_member_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  family_member_id UUID REFERENCES family_members(id),
  status TEXT NOT NULL DEFAULT 'active',
  price DECIMAL(10, 2) NOT NULL DEFAULT 2.99,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_family_member_subscriptions_user_id ON family_member_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_family_member_subscriptions_family_member_id ON family_member_subscriptions(family_member_id);
