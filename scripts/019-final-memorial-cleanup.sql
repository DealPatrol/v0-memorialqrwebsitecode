-- FINAL CLEANUP: Delete all memorials except Glenda Jane Kelso and Janice & Earl Melton
-- Run this script on your production Supabase database before launch

-- Preview what will be deleted (run this first to be safe)
-- SELECT id, full_name, slug, created_at 
-- FROM memorials 
-- WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton');

-- Delete all test memorials, keeping only the two showcase memorials
DELETE FROM memorials
WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton');

-- Verify only 2 memorials remain
SELECT id, full_name, slug, created_at 
FROM memorials 
ORDER BY created_at DESC;
