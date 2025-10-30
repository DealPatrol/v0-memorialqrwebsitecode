-- Link Glenda's memorial to the memorial owner
-- This script creates a user account and assigns ownership of Glenda's memorial

-- First, check if a user already exists with the admin email
-- If not, create a placeholder user that can be claimed later
DO $$
DECLARE
  owner_user_id UUID;
  glenda_memorial_id UUID;
BEGIN
  -- Get Glenda's memorial ID
  SELECT id INTO glenda_memorial_id
  FROM memorials
  WHERE slug = 'glenda-kelso'
  LIMIT 1;

  -- Check if memorial exists
  IF glenda_memorial_id IS NULL THEN
    RAISE NOTICE 'Glenda memorial not found with slug glenda-kelso';
    RETURN;
  END IF;

  -- For now, we'll set a placeholder user_id that matches the admin's auth user
  -- When the admin signs up, their auth.users id will be used
  -- You can update this after signing up by running:
  -- UPDATE memorials SET user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com') WHERE slug = 'glenda-kelso';
  
  -- Update the memorial to link it to the owner
  -- Replace 'YOUR_USER_ID_HERE' with your actual user ID after signing up
  UPDATE memorials
  SET user_id = NULL  -- Will be set after you sign up
  WHERE id = glenda_memorial_id;

  RAISE NOTICE 'Glenda memorial is ready to be claimed. Sign up at /auth/sign-up and then run: UPDATE memorials SET user_id = (SELECT id FROM auth.users WHERE email = ''your-email@example.com'') WHERE slug = ''glenda-kelso'';';
END $$;
