/**
 * FEATURE: Enterprise Firebase Client SDK Initialization
 * This module establishes the secure connection between the Parbet Admin Gateway
 * and the Google Firebase production environment using encrypted Vercel variables.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// FEATURE: Strict Environment Validation Boundary
// This permanently stops the "Uncaught FirebaseError: (auth/invalid-api-key)" fatal crash
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!apiKey) {
    console.error(
        "CRITICAL ERROR: Firebase API Key is missing. \n" +
        "Vite failed to inject the VITE_FIREBASE_API_KEY environment variable. \n" +
        "Ensure your local .env file contains these variables and you have restarted the Vite server."
    );
}

// FEATURE: Secure Environment Variable Mapping
// Vite strictly requires the 'VITE_' prefix for client-side exposure.
const firebaseConfig = {
    // Injecting a fallback string if undefined to prevent Firebase from fatally crashing the React DOM
    apiKey: apiKey || 'missing-api-key-prevent-crash',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

/**
 * FEATURE: Cold-Start App Persistence
 * Checks for existing app instances to prevent re-initialization errors
 * during React Fast Refresh or Vercel Edge cold starts.
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * FEATURE: Identity & Database Export
 * auth: Used by the AdminGuard to strictly lock access to testcodecfg@gmail.com
 * db: Used to fetch real-time latency and status metrics from Firestore
 */
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;