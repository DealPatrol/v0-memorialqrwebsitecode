-- Add package_type column to memorials table to track plan tier
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS package_type VARCHAR(50) DEFAULT 'basic';

-- Add comment for documentation
COMMENT ON COLUMN memorials.package_type IS 'The memorial package type: free, basic, standard, or premium';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_memorials_package_type ON memorials(package_type);
