-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "memorials_insert_own" ON memorials;

-- Create a new policy that allows:
-- 1. Authenticated users to create memorials with their user_id
-- 2. Service role to create memorials with null user_id (for purchase flow)
CREATE POLICY "memorials_insert_flexible" ON memorials
  FOR INSERT
  WITH CHECK (
    -- Allow if user is authenticated and user_id matches
    (auth.uid() = user_id)
    OR
    -- Allow if user_id is null (for purchase flow, will be claimed later)
    (user_id IS NULL)
  );

-- Add a policy to allow users to claim unclaimed memorials
-- This will be used when customers sign up after purchase
CREATE POLICY "memorials_update_claim" ON memorials
  FOR UPDATE
  USING (
    -- Allow owners to update their memorials
    (auth.uid() = user_id)
    OR
    -- Allow claiming unclaimed memorials
    (user_id IS NULL)
  );
