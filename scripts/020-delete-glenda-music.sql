-- Delete all music entries from Glenda Jane Kelso's memorial
-- This will keep voicemails/audio files (stored in the videos table)

DELETE FROM music
WHERE memorial_id = (
  SELECT id FROM memorials 
  WHERE full_name ILIKE '%Glenda%Kelso%' 
  OR full_name ILIKE '%Glenda Jane Kelso%'
  LIMIT 1
);
