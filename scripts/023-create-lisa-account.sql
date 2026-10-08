-- Create Lisa Hitchcock's memorial account with her email
-- After running this script, Lisa can use magic link login with lhitchcock02@yahoo.com

-- First, let's create a test user account (this assumes Lisa's Supabase user ID)
-- You'll need to manually create her in Supabase auth first, then update this with her actual UUID

-- For now, we'll create the memorial she can fill out
-- Once she has a valid Supabase user_id, update the user_id below

INSERT INTO public.memorials (
  slug,
  full_name,
  birth_date,
  death_date,
  package_type,
  theme
) VALUES (
  'lisa-fathers-memorial',
  'For Dad',
  NULL,
  NULL,
  'premium',
  'elegant'
) ON CONFLICT (slug) DO NOTHING;

-- This will be linked to Lisa's user_id once she successfully authenticates
-- The create-memorial page will auto-associate it with her account
