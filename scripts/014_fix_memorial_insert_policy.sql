-- Drop the restrictive insert policy that prevents null user_id
DROP POLICY IF EXISTS "memorials_insert_own" ON memorials;

-- Create a new policy that allows:
-- 1. Authenticated users to create memorials with their own user_id
-- 2. Service role to create memorials with null user_id (for paid customers before signup)
CREATE POLICY "memorials_insert_flexible" ON memorials
  FOR INSERT
  WITH CHECK (
    -- Allow if user_id matches authenticated user
    (auth.uid() = user_id)
    OR
    -- Allow if user_id is null (for paid customers creating memorials before signup)
    (user_id IS NULL)
  );

-- Also update the update policy to allow null user_id memorials to be updated by anyone authenticated
DROP POLICY IF EXISTS "memorials_update_own" ON memorials;

CREATE POLICY "memorials_update_flexible" ON memorials
  FOR UPDATE
  USING (
    -- Allow if user owns the memorial
    (auth.uid() = user_id)
    OR
    -- Allow if memorial has no owner yet (null user_id)
    (user_id IS NULL AND auth.uid() IS NOT NULL)
  );
