-- Update Glenda's profile image to the correct path
UPDATE public.memorials 
SET profile_image_url = '/images/12ad3a4b-3655-4428-adba.jpeg'
WHERE slug = 'glenda-kelso';

-- Also update by name in case slug doesn't match
UPDATE public.memorials 
SET profile_image_url = '/images/12ad3a4b-3655-4428-adba.jpeg'
WHERE full_name ILIKE '%Glenda%Kelso%';
