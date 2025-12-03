# OAuth Setup Guide for Memorial QR

This guide explains how to enable Google and Facebook sign-in for your Memorial QR application.

## Quick Setup

Your application now supports Google and Facebook OAuth authentication, completely bypassing the email/password signup issues.

## Supabase Configuration

### 1. Enable OAuth Providers in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `tkowdctozynuksdjzbgl`
3. Navigate to **Authentication** → **Providers**

### 2. Configure Google OAuth

1. In Supabase Providers, find **Google** and toggle it ON
2. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: Add your Supabase callback URL:
     \`\`\`
     https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback
     \`\`\`
3. Copy the **Client ID** and **Client Secret**
4. Paste them into Supabase Google provider settings
5. Click **Save**

### 3. Configure Facebook OAuth

1. In Supabase Providers, find **Facebook** and toggle it ON
2. Create a Facebook App:
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Click **My Apps** → **Create App**
   - Choose **Consumer** app type
   - Fill in app details
   - Go to **Settings** → **Basic**
   - Add **Facebook Login** product
   - In Facebook Login Settings, add OAuth Redirect URI:
     \`\`\`
     https://tkowdctozynuksdjzbgl.supabase.co/auth/v1/callback
     \`\`\`
3. Copy the **App ID** and **App Secret**
4. Paste them into Supabase Facebook provider settings
5. Click **Save**

## Testing

1. Go to your sign-up page: `https://memorialsqr.com/auth/sign-up`
2. Click **Continue with Google** or **Continue with Facebook**
3. Complete the OAuth flow
4. You should be redirected back to your app, fully authenticated

## Benefits

- **No password required** - Users don't need to remember passwords
- **Faster signup** - One click to create an account
- **Better security** - OAuth providers handle security
- **Bypasses email/password issues** - Completely avoids the Supabase auth.signUp error

## Fallback Option

Users can still click **Continue without account** to create memorials anonymously if they prefer not to sign in.

## User Experience Flow

1. User clicks "Get Started" on pricing page
2. Sees sign-up page with Google/Facebook buttons
3. Clicks their preferred OAuth provider
4. Completes OAuth flow (happens in popup/redirect)
5. Returns to site fully authenticated
6. Can now create and edit their memorials

## Troubleshooting

If OAuth sign-in fails:
1. Verify OAuth providers are enabled in Supabase
2. Check that redirect URIs match exactly (including https://)
3. Ensure Google/Facebook apps are in "Production" mode (not "Testing")
4. Check browser console for specific error messages
