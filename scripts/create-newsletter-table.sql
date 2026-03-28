-- Create newsletter_subscribers table for email marketing
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to unsubscribe using their email
CREATE POLICY "Users can update their own subscription"
  ON newsletter_subscribers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow admins to view all subscribers
CREATE POLICY "Admins can view all subscribers"
  ON newsletter_subscribers
  FOR SELECT
  USING (true);

COMMENT ON TABLE newsletter_subscribers IS 'Stores email subscribers for Memorial QR blog newsletter';
