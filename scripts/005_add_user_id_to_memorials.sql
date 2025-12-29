-- Add user_id column to memorials table to track ownership
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_memorials_user_id ON memorials(user_id);

-- Enable Row Level Security on memorials table
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view memorials (public access)
CREATE POLICY "memorials_select_all" ON memorials
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can create memorials
CREATE POLICY "memorials_insert_own" ON memorials
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only memorial owners can update their memorials
CREATE POLICY "memorials_update_own" ON memorials
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Only memorial owners can delete their memorials
CREATE POLICY "memorials_delete_own" ON memorials
  FOR DELETE
  USING (auth.uid() = user_id);
