-- Delete all memorials except Glenda Jane Kelso and Janice & Earl Melton
-- This script will also cascade delete related data (photos, videos, messages, etc.)

-- First, let's see what we're deleting (for safety)
-- Uncomment the SELECT below to preview which memorials will be deleted:
-- SELECT id, full_name, slug, created_at FROM memorials 
-- WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton');

-- Delete all memorials that are NOT the two we want to keep
DELETE FROM memorials
WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
  AND full_name NOT ILIKE '%Glenda%Kelso%'
  AND full_name NOT ILIKE '%Janice%Earl%Melton%';

-- The cascading deletes should handle related tables automatically,
-- but if needed, you can manually clean up orphaned records:

-- Clean up orphaned photos
DELETE FROM photos
WHERE memorial_id NOT IN (SELECT id FROM memorials);

-- Clean up orphaned videos
DELETE FROM videos
WHERE memorial_id NOT IN (SELECT id FROM memorials);

-- Clean up orphaned messages
DELETE FROM messages
WHERE memorial_id NOT IN (SELECT id FROM memorials);

-- Clean up orphaned stories
DELETE FROM stories
WHERE memorial_id NOT IN (SELECT id FROM memorials);

-- Clean up orphaned music
DELETE FROM music
WHERE memorial_id NOT IN (SELECT id FROM memorials);

-- Clean up orphaned milestones
DELETE FROM milestones
WHERE memorial_id NOT IN (SELECT id FROM memorials);

-- Verify the remaining memorials
SELECT id, full_name, slug, created_at FROM memorials ORDER BY created_at DESC;
