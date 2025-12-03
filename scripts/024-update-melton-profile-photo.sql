-- Update Janice & Earl Melton memorial profile photo
UPDATE memorials
SET profile_photo_url = '/images/65cbdfa3-70e4-486c-9ec7.jpeg',
    updated_at = NOW()
WHERE name = 'Janice & Earl Melton';

-- Verify the update
SELECT id, name, profile_photo_url
FROM memorials
WHERE name = 'Janice & Earl Melton';
