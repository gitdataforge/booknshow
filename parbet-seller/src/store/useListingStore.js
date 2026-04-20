import { create } from 'zustand';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * FEATURE 1: Secure Pay-to-List Razorpay Gateway Interceptor
 * FEATURE 2: Ad-Blocker Immunity & Telemetry Failsafe
 */
const processListingFee = (sellerEmail, eventTitle) => {
    return new Promise((resolve, reject) => {
        // Failsafe: Verify Razorpay SDK is loaded
        if (!window.Razorpay) {
            reject(new Error("Payment gateway blocked. Please disable your ad-blocker to pay the listing fee."));
            return;
        }

        const options = {
            key: "rzp_test_parbet", // Sandbox/Live Key
            amount: 9900, // Strict ₹99 Listing Fee (in paise)
            currency: "INR",
            name: "Parbet Seller Portal",
            description: `Listing Fee for: ${eventTitle}`,
            image: "https://parbet-44902.web.app/vite.svg", // Brand Logo
            handler: function (response) {
                // Transaction successful, release the promise lock
                resolve(response.razorpay_payment_id);
            },
            prefill: {
                email: sellerEmail || ''
            },
            theme: {
                color: "#1a1a1a" // Strict Dark Enterprise Brand Match
            },
            modal: {
                ondismiss: function() {
                    reject(new Error("Payment cancelled. Your match was not published."));
                }
            }
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                reject(new Error(`Transaction Failed: ${response.error.description}`));
            });
            rzp.open();
        } catch (err) {
            console.warn("[Parbet Seller Security] Gateway Tracker Blocked. Safely bypassed.");
            reject(new Error("Ad-blocker prevented the secure payment window from opening. Please temporarily pause it."));
        }
    });
};

/**
 * FEATURE 3: Global Shared Database Integrator & Admin Gatekeeper
 * Manages the state and execution of pushing seller payloads to the buyer market.
 */
export const useListingStore = create((set) => ({
    isLoading: false,
    error: null,

    // FEATURE 4: Secure Payload Injection & Admin Bypass Logic
    createListing: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            // STRICT ADMIN BYPASS: Free access for testcodecfg@gmail.com
            const isAdmin = payload.sellerEmail === 'testcodecfg@gmail.com';
            let listingPaymentId = null;

            if (!isAdmin) {
                console.log("[Parbet Seller Gatekeeper] Standard user detected. Initiating ₹99 Listing Fee...");
                // Halt execution and wait for Razorpay UI to resolve successfully
                listingPaymentId = await processListingFee(payload.sellerEmail, payload.title);
                console.log(`[Parbet Seller Gatekeeper] Payment verified: ${listingPaymentId}`);
            } else {
                console.log("[Parbet Seller Gatekeeper] Admin Bypass verified. Proceeding without charge.");
            }

            // Target the globally shared 'events' collection
            const eventsRef = collection(db, 'events');
            
            // FEATURE 5: Real-Time Database Mutation
            // Injects the verified payload into Firestore (instantly updates Buyer Site)
            const docRef = await addDoc(eventsRef, {
                ...payload,
                listingFeePaid: !isAdmin, // Boolean flag for database auditing
                listingPaymentId: listingPaymentId, // Null for admin, String for standard sellers
                createdAt: payload.createdAt || new Date().toISOString(),
            });

            console.log(`[Parbet Ledger] Successfully minted event document: ${docRef.id}`);
            
            set({ isLoading: false });
            return docRef.id;
        } catch (err) {
            console.error("[Parbet Ledger] Transaction failed:", err);
            
            // FEATURE 6: Dynamic Error Trapping
            set({ 
                error: err.message || 'Failed to publish the match to the global marketplace. Verify your connection.',
                isLoading: false 
            });
            throw err;
        }
    },

    // FEATURE 7: UI Error Boundary Reset
    clearError: () => set({ error: null })
}));