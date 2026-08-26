# Firebase Setup Documentation

Firebase has been configured for your Memorial QR project with the following services:

## Configuration Details

- **Project ID**: pro-talon-480005-p6
- **Auth Domain**: pro-talon-480005-p6.firebaseapp.com
- **Storage Bucket**: pro-talon-480005-p6.firebasestorage.app

## Available Services

### Firebase Authentication
- **Google OAuth**: Enabled and configured
- **Facebook OAuth**: Enabled and configured
- **Email/Password**: Available for traditional sign-up

### Firebase Analytics
- Automatically tracking user behavior
- Page views and events tracked
- Access analytics at: https://console.firebase.google.com/project/pro-talon-480005-p6/analytics

## Authentication Functions

All auth functions are available in `lib/firebase/auth.ts`:

\`\`\`typescript
import { 
  signInWithGoogle, 
  signInWithFacebook, 
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  resetPassword,
  getCurrentUser,
  onAuthStateChange
} from "@/lib/firebase/auth"
\`\`\`

## Usage Examples

### Sign in with Google
\`\`\`typescript
const { user, error } = await signInWithGoogle()
if (error) {
  console.error("Sign-in failed:", error)
} else {
  console.log("Signed in as:", user.email)
}
\`\`\`

### Sign in with Facebook
\`\`\`typescript
const { user, error } = await signInWithFacebook()
\`\`\`

### Email/Password Sign Up
\`\`\`typescript
const { user, error } = await signUpWithEmail(email, password)
\`\`\`

### Listen to Auth Changes
\`\`\`typescript
const unsubscribe = onAuthStateChange((user) => {
  if (user) {
    console.log("User signed in:", user.email)
  } else {
    console.log("User signed out")
  }
})
\`\`\`

## Next Steps

Firebase is now ready to use alongside your existing Supabase setup. You can:

1. Migrate authentication to Firebase (no more "Database error saving new user")
2. Use Firebase Analytics to track user behavior
3. Add Firebase Cloud Messaging for notifications
4. Use Firebase Storage as an alternative to Vercel Blob

## Firebase Console

Access your Firebase project at:
https://console.firebase.google.com/project/pro-talon-480005-p6
