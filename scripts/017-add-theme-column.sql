-- Add theme column to memorials table
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'classic';

-- Update existing memorials to have the classic theme
UPDATE memorials
SET theme = 'classic'
WHERE theme IS NULL;
