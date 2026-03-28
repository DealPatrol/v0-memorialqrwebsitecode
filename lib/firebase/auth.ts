import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth"
import { auth } from "./config"

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  provider.addScope("email")
  provider.addScope("profile")

  try {
    const result = await signInWithPopup(auth, provider)
    console.log("[v0] Google sign-in successful:", result.user.email)
    return { user: result.user, error: null }
  } catch (error: any) {
    console.error("[v0] Google sign-in error:", error)
    return { user: null, error: error.message }
  }
}

// Facebook Sign-In
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider()
  provider.addScope("email")
  provider.addScope("public_profile")

  try {
    const result = await signInWithPopup(auth, provider)
    console.log("[v0] Facebook sign-in successful:", result.user.email)
    return { user: result.user, error: null }
  } catch (error: any) {
    console.error("[v0] Facebook sign-in error:", error)
    return { user: null, error: error.message }
  }
}

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    console.log("[v0] Email sign-up successful:", result.user.email)
    return { user: result.user, error: null }
  } catch (error: any) {
    console.error("[v0] Email sign-up error:", error)
    return { user: null, error: error.message }
  }
}

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    console.log("[v0] Email sign-in successful:", result.user.email)
    return { user: result.user, error: null }
  } catch (error: any) {
    console.error("[v0] Email sign-in error:", error)
    return { user: null, error: error.message }
  }
}

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth)
    console.log("[v0] User signed out successfully")
    return { error: null }
  } catch (error: any) {
    console.error("[v0] Sign-out error:", error)
    return { error: error.message }
  }
}

// Password Reset
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    console.log("[v0] Password reset email sent to:", email)
    return { error: null }
  } catch (error: any) {
    console.error("[v0] Password reset error:", error)
    return { error: error.message }
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback)
}
