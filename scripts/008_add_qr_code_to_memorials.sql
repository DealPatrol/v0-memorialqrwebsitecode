-- Add QR code URL column to memorials table
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_memorials_qr_code ON memorials(qr_code_url);

-- Add comment
COMMENT ON COLUMN memorials.qr_code_url IS 'URL to the generated QR code image stored in Blob storage';
