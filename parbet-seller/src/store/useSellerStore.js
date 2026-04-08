import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const useSellerStore = create((set, get) => ({
    // Seller Authentication State
    user: { uid: 'seller_123_temp', email: 'seller@parbet.com' }, // Temporary mock user for dev if auth isn't wired yet, replace with null in prod
    isAuthenticated: true, 
    isSubmitting: false,
    submitError: null,

    // Auth Setters
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),

    // ------------------------------------------------------------------
    // CORE LOGIC: Strict Cross-App Data Bridge
    // ------------------------------------------------------------------
    addEventListing: async (listingData) => {
        set({ isSubmitting: true, submitError: null });
        
        try {
            const state = get();
            
            // Strict Auth Guard
            if (!state.user) {
                throw new Error("You must be signed in to list tickets on the marketplace.");
            }

            // CRITICAL PATH: Dynamically resolve the environment App ID
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            
            // STRICT RULE 1: Target the exact public shared path the buyer site listens to
            const ticketsRef = collection(db, 'artifacts', appId, 'public', 'data', 'tickets');

            // Format commence_time precisely for the buyer site's relative date parser
            let commenceTimeStr = new Date().toISOString();
            if (listingData.date && listingData.time) {
                commenceTimeStr = new Date(`${listingData.date}T${listingData.time}`).toISOString();
            }

            // Construct the exact schema expected by ViagogoListCard.jsx
            const payload = {
                sellerId: state.user.uid,
                t1: listingData.t1,
                t2: listingData.t2 || '',
                league: listingData.league || 'Indian Premier League',
                commence_time: commenceTimeStr,
                loc: listingData.venue || 'TBA Stadium',
                city: listingData.city || 'Pune',
                country: 'IN', // Enforce India localization for IPL focus
                price: parseFloat(listingData.price) || 0,
                quantity: parseInt(listingData.quantity, 10) || 1,
                section: listingData.section || 'General Admission',
                row: listingData.row || 'N/A',
                status: 'active', // 'active' status is required by the buyer site's query
                createdAt: serverTimestamp(),
            };

            // Execute the write operation to trigger real-time sync across clients
            const docRef = await addDoc(ticketsRef, payload);
            
            set({ isSubmitting: false });
            return { success: true, id: docRef.id };

        } catch (error) {
            console.error("Failed to sync ticket to buyer network:", error);
            set({ isSubmitting: false, submitError: error.message });
            throw error;
        }
    }
}));