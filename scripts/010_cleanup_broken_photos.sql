-- Clean up photos with temporary browser blob URLs
-- These URLs start with "blob:" and are not permanent storage URLs
-- After running this script, users will need to re-upload their photos

-- Delete photos with browser blob URLs (temporary URLs that don't work after page reload)
DELETE FROM photos 
WHERE image_url LIKE 'blob:%';

-- Verify the cleanup
SELECT COUNT(*) as remaining_photos FROM photos;
SELECT memorial_id, COUNT(*) as photo_count 
FROM photos 
GROUP BY memorial_id;
