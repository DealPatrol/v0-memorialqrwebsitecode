# Facebook OAuth - Ready to Connect

## Your Facebook App Credentials
- **App ID**: 1207795304536612
- **App Secret**: (you have this from the Facebook page)

## Add to Supabase NOW (This will make Facebook login work immediately)

1. Go to: https://supabase.com/dashboard/project/tkowdctozynuksdjzbgl/auth/providers
2. Find "Facebook" in the list
3. Toggle it ON
4. Enter:
   - **Facebook Client ID**: 1207795304536612
   - **Facebook Client Secret**: (paste from Facebook page)
5. Click "Save"

## Then Complete Facebook Setup

### Add Privacy Policy Page
Your app needs a privacy policy. Add this to your site:

**File**: app/privacy/page.tsx
**URL**: https://memorialsqr.com/privacy

### Create App Icon (1024x1024)
Use Canva or any design tool to create a simple 1024x1024 PNG with your logo.

### Make App Live (After Supabase setup)
1. In Facebook Developer Console, top right corner
2. Toggle from "Development" to "Live" mode
3. During development, add test users under "Roles → Test Users"

## Testing Facebook Login

Once you add credentials to Supabase:
1. Go to https://memorialsqr.com/auth/sign-up
2. Click "Continue with Facebook" button
3. You'll be redirected to Facebook to authorize
4. After authorization, you'll be signed in!

## For Development/Testing

While in "Development Mode":
- Only you (the app owner) and added test users can sign in
- This is fine for testing - add the credentials to Supabase now and test it!

## To Accept Real Users

Complete all required fields above, then switch to "Live Mode" in Facebook Developer Console.
