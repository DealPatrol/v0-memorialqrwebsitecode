# Complete OAuth Setup Guide - Google & Facebook Sign-In

This guide will walk you through setting up Google and Facebook sign-in for your Memorial QR website. Total time: approximately 40 minutes.

---

## Part 1: Google OAuth Setup (15 minutes)

### Step 1: Access Google Cloud Console

1. Open your browser and go to: https://console.cloud.google.com/
2. Sign in with your Google account (use a business account if you have one)
3. You'll see the Google Cloud Console dashboard

### Step 2: Create a New Project

1. Click the **project dropdown** at the top of the page (next to "Google Cloud")
2. Click **"NEW PROJECT"** button in the top right
3. Enter project details:
   - **Project name**: `Memorial QR Auth` (or your preferred name)
   - **Organization**: Leave as default or select your organization
4. Click **"CREATE"**
5. Wait 10-20 seconds for the project to be created
6. Select your new project from the dropdown

### Step 3: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"**
2. Click **"OAuth consent screen"**
3. Choose **"External"** (allows anyone with a Google account to sign in)
4. Click **"CREATE"**
5. Fill out the required fields:
   - **App name**: `Memorial QR`
   - **User support email**: Your email address
   - **App logo**: (Optional - upload your logo if you have one)
   - **Application home page**: `https://memorialsqr.com`
   - **Authorized domains**: Add `memorialsqr.com`
   - **Developer contact email**: Your email address
6. Click **"SAVE AND CONTINUE"**
7. **Scopes page**: Click **"SAVE AND CONTINUE"** (default scopes are fine)
8. **Test users page**: Click **"SAVE AND CONTINUE"** (not needed for external apps)
9. Click **"BACK TO DASHBOARD"**

### Step 4: Create OAuth Credentials

1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** from the dropdown
5. Fill in the details:
   - **Name**: `Memorial QR Web Client`
   - **Authorized JavaScript origins**: Add `https://memorialsqr.com`
   - **Authorized redirect URIs**: Add `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`
6. Click **"CREATE"**
7. A popup will show your credentials:
   - **Your Client ID**: Copy this (looks like `123456789-abc.apps.googleusercontent.com`)
   - **Your Client Secret**: Copy this (looks like `GOCSPX-abc123xyz`)
8. Click **"OK"**

**Important**: Save these credentials somewhere safe - you'll need them in Step 10!

---

## Part 2: Facebook OAuth Setup (15 minutes)

### Step 1: Access Facebook Developers

1. Go to: https://developers.facebook.com/
2. Sign in with your Facebook account
3. You'll see the Facebook for Developers dashboard

### Step 2: Create a New App

1. Click **"My Apps"** in the top right corner
2. Click **"Create App"** button
3. Select **"Consumer"** as the app type
4. Click **"Next"**
5. Fill in app details:
   - **App name**: `Memorial QR`
   - **App contact email**: Your email address
   - **Business Account**: (Optional - skip if you don't have one)
6. Click **"Create app"**
7. Complete the security check if prompted
8. You'll be redirected to your new app dashboard

### Step 3: Add Facebook Login Product

1. On the app dashboard, scroll down to **"Add products to your app"**
2. Find **"Facebook Login"** and click **"Set Up"**
3. Choose **"Web"** as your platform
4. Enter your site URL: `https://memorialsqr.com`
5. Click **"Save"**
6. Click **"Continue"** through the quickstart (you can skip the code examples)

### Step 4: Configure Facebook Login Settings

1. In the left sidebar, expand **"Facebook Login"**
2. Click **"Settings"**
3. Configure the settings:
   - **Valid OAuth Redirect URIs**: Add `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`
   - **Client OAuth Login**: Toggle **ON**
   - **Web OAuth Login**: Toggle **ON**
   - **Use Strict Mode for Redirect URIs**: Toggle **ON**
4. Click **"Save Changes"** at the bottom

### Step 5: Get Your App Credentials

1. In the left sidebar, click **"Settings"** → **"Basic"**
2. You'll see your credentials:
   - **App ID**: Copy this (looks like `123456789012345`)
   - **App Secret**: Click **"Show"**, complete security check, then copy (looks like `abc123def456ghi789`)
3. Scroll down to **"App Domains"**: Add `memorialsqr.com` and `supabase.co`
4. Click **"Save Changes"**

### Step 6: Make Your App Live (IMPORTANT!)

1. At the top of the page, you'll see a toggle that says **"In development"**
2. Click the toggle to switch to **"Live"**
3. Facebook may ask you to complete some additional steps - follow the prompts
4. Your app must be **Live** for real users to sign in!

**Important**: Save your App ID and App Secret somewhere safe!

---

## Part 3: Configure Supabase (5 minutes)

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/tkowdctozynuksdjzbgl
2. Sign in to your Supabase account
3. You'll see your Memorial QR project dashboard

### Step 2: Enable Google Provider

1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** tab
3. Find **"Google"** in the list and click on it
4. Toggle **"Enable Sign in with Google"** to **ON**
5. Paste your credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID from Part 1
   - **Client Secret (for OAuth)**: Paste your Google Client Secret from Part 1
6. Click **"Save"**

### Step 3: Enable Facebook Provider

1. Still in the **"Providers"** tab, find **"Facebook"**
2. Click on **"Facebook"**
3. Toggle **"Enable Sign in with Facebook"** to **ON**
4. Paste your credentials:
   - **Facebook client ID**: Paste your Facebook App ID from Part 2
   - **Facebook secret**: Paste your Facebook App Secret from Part 2
5. Click **"Save"**

### Step 4: Verify Redirect URL

1. In the Providers tab, scroll to the top
2. You should see: **Site URL**: `https://memorialsqr.com`
3. You should see: **Redirect URLs**: Should include `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`
4. If these are incorrect, update them in **"URL Configuration"** section

---

## Part 4: Testing (5 minutes)

### Test Google Sign-In

1. Open your website: https://memorialsqr.com
2. Click **"Sign In"** or **"Get Started"**
3. Click the **"Continue with Google"** button
4. You should see Google's sign-in popup
5. Choose your Google account
6. Grant permissions
7. You should be redirected back to your site, now signed in!

### Test Facebook Sign-In

1. On the sign-in page, click **"Continue with Facebook"** button
2. You should see Facebook's sign-in popup
3. Log in with your Facebook account
4. Grant permissions to Memorial QR
5. You should be redirected back to your site, now signed in!

---

## Troubleshooting Common Issues

### Google Issues

**Error: "redirect_uri_mismatch"**
- **Cause**: Your redirect URI in Google Cloud Console doesn't match Supabase
- **Fix**: Go to Google Cloud Console → Credentials → Edit your OAuth client → Add exact URL: `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`

**Error: "Access blocked: This app's request is invalid"**
- **Cause**: OAuth consent screen not properly configured
- **Fix**: Go to OAuth consent screen → Make sure app is published (not in testing mode)

**Error: "Invalid client"**
- **Cause**: Wrong Client ID or Secret in Supabase
- **Fix**: Double-check you copied the correct credentials from Google Cloud Console

### Facebook Issues

**Error: "Can't Load URL: The domain of this URL isn't included in the app's domains"**
- **Cause**: App domains not configured
- **Fix**: Facebook Developer Console → Settings → Basic → Add `memorialsqr.com` and `supabase.co` to App Domains

**Error: "App Not Set Up: This app is still in development mode"**
- **Cause**: Your Facebook app is not live
- **Fix**: Toggle your app from "Development" to "Live" mode at the top of Facebook Developer Console

**Error: "URL Blocked: This redirect failed because the redirect URI is not whitelisted"**
- **Cause**: Redirect URI not added to Facebook Login settings
- **Fix**: Facebook Login → Settings → Valid OAuth Redirect URIs → Add `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`

### General Issues

**Users can sign in but can't create memorials**
- **Cause**: User ID not being captured correctly
- **Fix**: Check that `app/api/memorials/route.ts` properly handles authenticated users

**Sign-in button doesn't work**
- **Cause**: Supabase client not properly initialized
- **Fix**: Check browser console for errors, ensure environment variables are set

**Users stuck on "Loading..." after sign-in**
- **Cause**: Auth callback route not working
- **Fix**: Check `app/auth/callback/route.ts` is properly handling the redirect

---

## Security Best Practices

1. **Never commit secrets to Git**: Your Client Secrets should only be in Supabase dashboard
2. **Use environment variables**: Keep all API keys in Vercel/Supabase environment variables
3. **Enable HTTPS only**: Make sure your site uses HTTPS (https://memorialsqr.com)
4. **Monitor auth logs**: Regularly check Supabase auth logs for suspicious activity
5. **Rotate secrets periodically**: Change your OAuth secrets every 6-12 months

---

## What Users Will Experience

### Before OAuth Setup
- ❌ Users see "Database error saving new user" when trying to sign up
- ❌ Cannot create accounts
- ❌ Cannot save or edit memorials

### After OAuth Setup
- ✅ Users click "Continue with Google" or "Continue with Facebook"
- ✅ Sign in with one click using existing account
- ✅ Automatically redirected back to your site
- ✅ Can create, save, and edit memorials
- ✅ No password to remember!

---

## Need Help?

If you're still experiencing issues after following this guide:

1. Check the Troubleshooting section above
2. Review Supabase auth logs: https://supabase.com/dashboard/project/tkowdctozynuksdjzbgl/auth/logs
3. Check browser console for JavaScript errors (press F12)
4. Contact Vercel support at: https://vercel.com/help

---

## Summary Checklist

- [ ] Created Google Cloud project
- [ ] Configured Google OAuth consent screen
- [ ] Created Google OAuth credentials
- [ ] Created Facebook Developer app
- [ ] Added Facebook Login product
- [ ] Made Facebook app Live
- [ ] Enabled Google provider in Supabase
- [ ] Enabled Facebook provider in Supabase
- [ ] Tested Google sign-in
- [ ] Tested Facebook sign-in

**Congratulations!** Your users can now sign in with Google or Facebook, completely bypassing the broken email/password signup! 🎉
