-- Create timeline milestones table for memorial life events
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category VARCHAR(50), -- birth, marriage, achievement, military, education, career, family, other
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_milestones_memorial_id ON milestones(memorial_id);
CREATE INDEX IF NOT EXISTS idx_milestones_date ON milestones(date);

-- Enable RLS
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view milestones
CREATE POLICY "Anyone can view milestones"
  ON milestones FOR SELECT
  USING (true);

-- Allow authenticated users to insert milestones
CREATE POLICY "Authenticated users can insert milestones"
  ON milestones FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own milestones or memorial owner's milestones
CREATE POLICY "Users can update their own milestones"
  ON milestones FOR UPDATE
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM memorials WHERE id = memorial_id
    )
  );

-- Allow users to delete their own milestones or memorial owner's milestones
CREATE POLICY "Users can delete their own milestones"
  ON milestones FOR DELETE
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM memorials WHERE id = memorial_id
    )
  );
