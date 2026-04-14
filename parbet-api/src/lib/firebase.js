/**
 * FEATURE: Enterprise Firebase Client SDK Initialization
 * This module establishes the secure connection between the Parbet Admin Gateway
 * and the Google Firebase production environment using encrypted Vercel variables.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// FEATURE: Secure Environment Variable Mapping
// Vite strictly requires the 'VITE_' prefix for client-side exposure.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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