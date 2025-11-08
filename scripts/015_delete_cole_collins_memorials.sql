-- Delete all memorials named "Cole Collins" and their associated content
-- This will cascade delete all related photos, messages, stories, milestones, etc.

BEGIN;

-- First, get the IDs of all Cole Collins memorials
WITH cole_memorials AS (
  SELECT id FROM memorials 
  WHERE full_name LIKE '%Cole Collins%'
)

-- Delete related content (if cascade isn't set up)
DELETE FROM photos WHERE memorial_id IN (SELECT id FROM cole_memorials);
DELETE FROM messages WHERE memorial_id IN (SELECT id FROM cole_memorials);
DELETE FROM stories WHERE memorial_id IN (SELECT id FROM cole_memorials);
DELETE FROM milestones WHERE memorial_id IN (SELECT id FROM cole_memorials);
DELETE FROM music WHERE memorial_id IN (SELECT id FROM cole_memorials);
DELETE FROM videos WHERE memorial_id IN (SELECT id FROM cole_memorials);

-- Finally, delete the memorials themselves
DELETE FROM memorials WHERE full_name LIKE '%Cole Collins%';

COMMIT;

-- Show how many Cole Collins memorials were deleted
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN 'All Cole Collins memorials have been deleted successfully'
    ELSE CONCAT(COUNT(*), ' Cole Collins memorials still remain')
  END as status
FROM memorials 
WHERE full_name LIKE '%Cole Collins%';
