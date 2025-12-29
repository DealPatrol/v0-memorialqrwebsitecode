-- Enable RLS on subscription_payments table
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription payments
CREATE POLICY "Users can view own subscription payments"
ON subscription_payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Service role can do anything
CREATE POLICY "Service role has full access to subscription payments"
ON subscription_payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Anonymous users cannot access subscription payments
CREATE POLICY "Anonymous users cannot access subscription payments"
ON subscription_payments
FOR ALL
TO anon
USING (false)
WITH CHECK (false);
