import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCeVtKjprO8OyWt7uTOCu4fQwxS7JEWJDk",
  authDomain: "pro-talon-480005-p6.firebaseapp.com",
  projectId: "pro-talon-480005-p6",
  storageBucket: "pro-talon-480005-p6.firebasestorage.app",
  messagingSenderId: "165060555362",
  appId: "1:165060555362:web:3df87bea21e5ea03de973b",
  measurementId: "G-RBP2W2XN7P",
}

// Initialize Firebase (singleton pattern to prevent multiple instances)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)

// Initialize analytics only in browser environment
let analytics = null
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { app, auth, analytics }
