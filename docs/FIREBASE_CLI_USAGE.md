# Firebase CLI Usage Guide

## Installation Complete

Firebase Tools has been added to your project's dev dependencies. You can now use Firebase CLI commands through npm scripts.

## Available Commands

Run these commands in your terminal:

\`\`\`bash
# Login to Firebase
npm run firebase:login

# Initialize Firebase in your project
npm run firebase:init

# Deploy to Firebase
npm run firebase:deploy

# Test Firebase locally
npm run firebase:serve
\`\`\`

## Setup Steps

### 1. Login to Firebase
\`\`\`bash
npm run firebase:login
\`\`\`
This opens a browser window for authentication with your Google account.

### 2. Initialize Firebase
\`\`\`bash
npm run firebase:init
\`\`\`
Select the features you want:
- ✓ Hosting (for deploying your Next.js app)
- ✓ Authentication (already configured)
- ✓ Firestore (if you want to use Firestore database)

### 3. Deploy Your App
\`\`\`bash
# Build your Next.js app first
npm run build

# Deploy to Firebase
npm run firebase:deploy
\`\`\`

## Firebase Configuration

Your Firebase config is already set up in:
- `lib/firebase/config.ts` - Firebase initialization
- `lib/firebase/auth.ts` - Authentication helpers

## Environment Variables

Add these to your `.env.local` or Vercel environment variables:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCeVtKjprO8OyWt7uTOCu4fQwxS7JEWJDk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pro-talon-480005-p6.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pro-talon-480005-p6
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pro-talon-480005-p6.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=165060555362
NEXT_PUBLIC_FIREBASE_APP_ID=1:165060555362:web:3df87bea21e5ea03de973b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RBP2W2XN7P
\`\`\`

## Next Steps

1. Run `npm install` to install firebase-tools
2. Run `npm run firebase:login` to authenticate
3. Run `npm run firebase:init` to set up hosting
4. Configure your build settings in `firebase.json`
5. Deploy with `npm run firebase:deploy`
