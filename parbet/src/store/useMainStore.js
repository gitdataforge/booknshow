import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { 
    collection, 
    query, 
    onSnapshot, 
    doc, 
    setDoc, 
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { 
    signInAnonymously, 
    onAuthStateChanged, 
    signInWithCustomToken 
} from 'firebase/auth';

// Retrieve global environment variables
const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-main-app';

export const useMainStore = create((set, get) => ({
    // --- STATE ---
    user: null,
    isAuthenticated: false,
    authLoading: true,

    // Real-time Data
    orders: [],
    isLoadingOrders: false,
    
    wallet: { balance: 0, currency: 'INR' },
    isLoadingWallet: false,

    // Internal listener cleanup
    activeListeners: [],

    // --- ACTIONS ---

    /**
     * FEATURE 1: Secure Authentication Initialization
     * Negotiates a real cryptographic identity with Firebase.
     */
    initAuth: async () => {
        set({ authLoading: true });
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                set({ user, isAuthenticated: true, authLoading: false });
                // RULE 3: Start data queries only after authentication is confirmed
                get().startDataListeners(user.uid);
            } else {
                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Critical Auth Error:", error);
                    set({ authLoading: false });
                }
            }
        });
    },

    /**
     * FEATURE 2 & 3: Real-Time Data Synchronization
     * Establishes persistent websocket connections to Firestore for instant updates.
     */
    startDataListeners: (userId) => {
        // Stop any existing listeners to prevent memory leaks
        get().stopListeners();

        const listeners = [];

        // 1. ORDERS LISTENER
        // RULE 1: Strict User-Specific Pathing
        set({ isLoadingOrders: true });
        const ordersRef = collection(db, 'artifacts', appId, 'users', userId, 'orders');
        
        // RULE 2: Simple query to avoid index requirements
        const unsubOrders = onSnapshot(ordersRef, (snapshot) => {
            const ordersList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            // Client-side sorting for production performance
            ordersList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            set({ orders: ordersList, isLoadingOrders: false });
        }, (error) => {
            console.error("Orders sync failed:", error);
            set({ isLoadingOrders: false });
        });
        listeners.push(unsubOrders);

        // 2. WALLET LISTENER
        set({ isLoadingWallet: true });
        const walletDocRef = doc(db, 'artifacts', appId, 'users', userId, 'wallet', 'main');
        
        const unsubWallet = onSnapshot(walletDocRef, (snap) => {
            if (snap.exists()) {
                set({ wallet: snap.data(), isLoadingWallet: false });
            } else {
                // Feature: Auto-provision wallet for new users
                setDoc(walletDocRef, { 
                    balance: 0, 
                    currency: 'INR', 
                    lastUpdated: serverTimestamp() 
                });
                set({ isLoadingWallet: false });
            }
        }, (error) => {
            console.error("Wallet sync failed:", error);
            set({ isLoadingWallet: false });
        });
        listeners.push(unsubWallet);

        set({ activeListeners: listeners });
    },

    /**
     * FEATURE 4: Lifecycle Cleanup
     * Gracefully detaches all real-time listeners.
     */
    stopListeners: () => {
        const { activeListeners } = get();
        activeListeners.forEach(unsub => unsub());
        set({ activeListeners: [] });
    },

    /**
     * FEATURE 5: Secure Sign Out
     */
    logout: async () => {
        get().stopListeners();
        await auth.signOut();
        set({ 
            user: null, 
            isAuthenticated: false, 
            orders: [], 
            wallet: { balance: 0, currency: 'INR' } 
        });
    }
}));