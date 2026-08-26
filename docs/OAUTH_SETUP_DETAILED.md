# Complete OAuth Setup Guide for Google & Facebook Sign-In

This guide will walk you through setting up Google and Facebook authentication for your Memorial QR app.

---

## Part 1: Google OAuth Setup (15 minutes)

### Step 1: Access Google Cloud Console

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept Terms of Service if prompted

### Step 2: Create a New Project

1. Click the project dropdown at the top (says "Select a project")
2. Click **"NEW PROJECT"** button in the top right
3. Enter project name: `Memorial QR App`
4. Click **"CREATE"**
5. Wait for project creation (30 seconds)
6. Select your new project from the dropdown

### Step 3: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"**
2. Click **"OAuth consent screen"**
3. Select **"External"** (unless you have a Google Workspace)
4. Click **"CREATE"**
5. Fill in the required fields:
   - **App name**: `Memorial QR`
   - **User support email**: Your email address
   - **Developer contact email**: Your email address
6. Click **"SAVE AND CONTINUE"**
7. On "Scopes" screen, click **"SAVE AND CONTINUE"** (no changes needed)
8. On "Test users" screen, click **"SAVE AND CONTINUE"**
9. Review and click **"BACK TO DASHBOARD"**

### Step 4: Create OAuth Credentials

1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** from the dropdown
5. Enter name: `Memorial QR Web Client`
6. Under **"Authorized JavaScript origins"**, click **"+ ADD URI"**:
   - Add: `https://memorialsqr.com`
   - Add: `https://tkowdctozynuksdjzbgl.supabase.co`
7. Under **"Authorized redirect URIs"**, click **"+ ADD URI"**:
   - Add: `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`
8. Click **"CREATE"**

### Step 5: Copy Your Google Credentials

You'll see a popup with your credentials:
- **Client ID**: Looks like `123456789-abc123.apps.googleusercontent.com`
- **Client Secret**: Looks like `GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ`

**IMPORTANT**: Copy both values - you'll need them in Step 9

---

## Part 2: Facebook OAuth Setup (15 minutes)

### Step 1: Access Facebook Developers

1. Go to [https://developers.facebook.com/](https://developers.facebook.com/)
2. Log in with your Facebook account
3. If first time, complete developer registration

### Step 2: Create a New App

1. Click **"My Apps"** in the top right
2. Click **"Create App"** button
3. Select **"Consumer"** as the app type
4. Click **"Next"**
5. Fill in details:
   - **App name**: `Memorial QR`
   - **App contact email**: Your email
6. Click **"Create App"**
7. Complete security check if prompted

### Step 3: Add Facebook Login Product

1. You'll see "Add products to your app" page
2. Find **"Facebook Login"** card
3. Click **"Set Up"** button on that card
4. Select **"Web"** as the platform
5. Enter your site URL: `https://memorialsqr.com`
6. Click **"Save"**
7. Click **"Continue"** through the quickstart (you can skip the code examples)

### Step 4: Configure OAuth Settings

1. In the left sidebar, expand **"Facebook Login"**
2. Click **"Settings"**
3. Under **"Valid OAuth Redirect URIs"**, enter:
   - `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`
4. Click **"Save Changes"** at the bottom

### Step 5: Make App Live

1. In the top nav, find the toggle that says **"In development"**
2. Click the toggle to switch to **"Live"**
3. Choose a category: **"Business"** or **"Lifestyle"**
4. Confirm you want to make the app live

### Step 6: Copy Your Facebook Credentials

1. In the left sidebar, click **"Settings"** → **"Basic"**
2. You'll see:
   - **App ID**: A number like `123456789012345`
   - **App Secret**: Click **"Show"** button, enter your Facebook password
   - **App Secret**: Looks like `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

**IMPORTANT**: Copy both values - you'll need them in Step 9

---

## Part 3: Configure Supabase (5 minutes)

### Step 7: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in to your account
3. Select your project: **memorialqrwebsitecode**

### Step 8: Navigate to Authentication Providers

1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** tab
3. Scroll down to see all available providers

### Step 9: Enable Google Provider

1. Find **"Google"** in the provider list
2. Toggle it **ON** (the switch turns green)
3. Paste your Google credentials:
   - **Client ID**: Paste the value from Part 1, Step 5
   - **Client Secret**: Paste the value from Part 1, Step 5
4. Click **"Save"**

### Step 10: Enable Facebook Provider

1. Find **"Facebook"** in the provider list
2. Toggle it **ON**
3. Paste your Facebook credentials:
   - **Facebook Client ID**: Paste the App ID from Part 2, Step 6
   - **Facebook Secret**: Paste the App Secret from Part 2, Step 6
4. Click **"Save"**

---

## Part 4: Testing (5 minutes)

### Step 11: Test Google Sign-In

1. Go to your sign-up page: `https://memorialsqr.com/auth/sign-up`
2. Click **"Continue with Google"** button
3. Select your Google account
4. Grant permissions
5. You should be redirected back and logged in

### Step 12: Test Facebook Sign-In

1. Go to your sign-up page: `https://memorialsqr.com/auth/sign-up`
2. Click **"Continue with Facebook"** button
3. Log in to Facebook if needed
4. Click **"Continue as [Your Name]"**
5. You should be redirected back and logged in

---

## Troubleshooting

### Google Sign-In Issues

**Error: "redirect_uri_mismatch"**
- Go back to Google Cloud Console → Credentials
- Edit your OAuth client
- Verify redirect URI is exactly: `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`
- No trailing slash, must match exactly

**Error: "Access blocked: This app's request is invalid"**
- Complete the OAuth consent screen configuration
- Add your email as a test user
- Make sure app is not in "Testing" mode with restricted users

### Facebook Sign-In Issues

**Error: "Can't Load URL: The domain of this URL isn't included in the app's domains"**
- Go to Facebook App Settings → Basic
- Add `memorialsqr.com` to **App Domains**
- Add `https://memorialsqr.com` to **Site URL**
- Save changes

**Error: "URL Blocked: This redirect failed because the redirect URI is not whitelisted"**
- Go to Facebook Login → Settings
- Verify OAuth redirect URI is exactly: `https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback`
- Save changes and wait 2-3 minutes for changes to propagate

**App Still "In Development"**
- You need to switch app to "Live" mode for public users to sign in
- Only test users can use apps in development mode

---

## Security Best Practices

1. **Never share your Client Secrets or App Secrets publicly**
2. **Keep credentials in Supabase only** - don't hardcode in your app
3. **Regularly rotate secrets** if you suspect they've been compromised
4. **Monitor authentication logs** in Supabase dashboard
5. **Set up proper redirect URI whitelist** - don't use wildcards

---

## What Happens After Setup

Once configured, users can:
- Click "Continue with Google" or "Continue with Facebook"
- Sign in with one click using their existing accounts
- No email/password needed - completely bypasses the broken signup
- Their memorial data is automatically linked to their OAuth account
- They can edit their memorials anytime by signing in again

---

## Need Help?

If you encounter issues:
1. Check the Troubleshooting section above
2. Review Supabase auth logs: Dashboard → Authentication → Logs
3. Check browser console for detailed error messages
4. Verify all redirect URIs match exactly (case-sensitive, no trailing slashes)

Your OAuth setup is complete! Users can now sign in with Google and Facebook.
