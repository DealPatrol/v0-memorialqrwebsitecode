-- Delete all test memorials except Glenda Jane Kelso and Janice & Earl Melton
-- This will remove all associated content first, then the memorials themselves

-- Delete associated content for test memorials
DELETE FROM photos 
WHERE memorial_id IN (
  SELECT id FROM memorials 
  WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
);

DELETE FROM messages 
WHERE memorial_id IN (
  SELECT id FROM memorials 
  WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
);

DELETE FROM stories 
WHERE memorial_id IN (
  SELECT id FROM memorials 
  WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
);

DELETE FROM milestones 
WHERE memorial_id IN (
  SELECT id FROM memorials 
  WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
);

DELETE FROM music 
WHERE memorial_id IN (
  SELECT id FROM memorials 
  WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
);

DELETE FROM videos 
WHERE memorial_id IN (
  SELECT id FROM memorials 
  WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
);

-- Delete orders associated with test memorials
DELETE FROM orders
WHERE memorial_id IN (
  SELECT id FROM memorials 
  WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton')
);

-- Finally, delete the test memorials themselves
DELETE FROM memorials 
WHERE full_name NOT IN ('Glenda Jane Kelso', 'Janice & Earl Melton');

-- Show remaining memorials
SELECT id, full_name, created_at FROM memorials ORDER BY created_at DESC;
