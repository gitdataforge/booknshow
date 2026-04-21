import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// CRITICAL PATH: Read directly from standard Vite environment variables (.env.local)
// This strictly connects the seller app to the 100% real parbet database network
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// STRICT SINGLETON PATTERN: Prevent Vite HMR 'duplicate-app' crashes
let app;
let db;

if (!getApps().length) {
    // Only initialize the app if it hasn't been initialized already
    app = initializeApp(firebaseConfig);
    
    // FEATURE: Ad-Blocker Immunity & WebSocket Bypass
    // CRITICAL FIX: Aggressive ad-blockers intercept and block WebSocket connections (WSS), 
    // throwing net::ERR_BLOCKED_BY_CLIENT on Firestore. By explicitly declaring experimentalForceLongPolling, 
    // we force Firebase to communicate via standard HTTPS, completely bypassing the network heuristic block.
    db = initializeFirestore(app, {
        experimentalForceLongPolling: true
    });
} else {
    // Retrieve existing instance during hot module replacement
    app = getApp();
    db = getFirestore(app);
}

const auth = getAuth(app);

export { app, db, auth };