import { create } from 'zustand';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * FEATURE 1: Dynamic Razorpay SDK Injector
 * Bypasses global ad-blocker heuristics by only loading the payment tracker 
 * when a standard user explicitly initiates the checkout flow.
 */
const loadRazorpaySDK = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * FEATURE 2: Secure Dynamic 15% Pay-to-List Gateway Interceptor
 * FEATURE 3: Ad-Blocker Immunity & Telemetry Failsafe
 */
const processListingFee = async (sellerEmail, eventTitle, totalValue) => {
    // Await the dynamic injection of the SDK
    const isLoaded = await loadRazorpaySDK();

    return new Promise((resolve, reject) => {
        // Failsafe: Verify Razorpay SDK loaded correctly
        if (!isLoaded || !window.Razorpay) {
            reject(new Error("Payment gateway blocked or failed to load. Please disable your ad-blocker to pay the listing fee."));
            return;
        }

        // STRICT MATHEMATICS: Calculate 15% of total ticket value, converted to paise
        const feeInPaise = Math.round(totalValue * 0.15 * 100);
        
        // Failsafe: Ensure minimum transaction amount of 1 INR (100 paise) to prevent Razorpay crashes
        const finalAmount = feeInPaise >= 100 ? feeInPaise : 100;

        const options = {
            key: "rzp_test_parbet", // Sandbox/Live Key
            amount: finalAmount, // Dynamic 15% Platform Fee (in paise)
            currency: "INR",
            name: "Parbet Seller Portal",
            description: `15% Platform Fee for: ${eventTitle}`,
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
 * FEATURE 4: Global Shared Database Integrator & Admin Gatekeeper
 * Manages the state and execution of pushing seller payloads to the buyer market.
 */
export const useListingStore = create((set) => ({
    isLoading: false,
    error: null,

    // FEATURE 5: Secure Payload Injection & Admin Bypass Logic
    createListing: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            // STRICT ADMIN BYPASS: Free access for testcodecfg@gmail.com
            const isAdmin = payload.sellerEmail === 'testcodecfg@gmail.com';
            let listingPaymentId = null;
            
            // Calculate total ticket value for the gateway and ledger
            const totalValue = (Number(payload.price) || 0) * (Number(payload.quantity) || 0);

            if (!isAdmin) {
                console.log("[Parbet Seller Gatekeeper] Standard user detected. Injecting SDK and initiating 15% Platform Fee...");
                // Halt execution and wait for Dynamic Razorpay UI to resolve successfully
                listingPaymentId = await processListingFee(payload.sellerEmail, payload.title, totalValue);
                console.log(`[Parbet Seller Gatekeeper] Payment verified: ${listingPaymentId}`);
            } else {
                console.log("[Parbet Seller Gatekeeper] Admin Bypass verified. Proceeding without charge.");
            }

            // Target the globally shared 'events' collection
            const eventsRef = collection(db, 'events');
            
            // FEATURE 6: Real-Time Database Mutation
            // Injects the verified payload into Firestore (instantly updates Buyer Site)
            const docRef = await addDoc(eventsRef, {
                ...payload,
                listingFeePaid: !isAdmin, // Boolean flag for database auditing
                listingPaymentId: listingPaymentId, // Null for admin, String for standard sellers
                platformFee: !isAdmin ? (totalValue * 0.15) : 0, // Ledger tracking for Admin God-Mode
                createdAt: payload.createdAt || new Date().toISOString(),
            });

            console.log(`[Parbet Ledger] Successfully minted event document: ${docRef.id}`);
            
            set({ isLoading: false });
            return docRef.id;
        } catch (err) {
            console.error("[Parbet Ledger] Transaction failed:", err);
            
            // FEATURE 7: Dynamic Error Trapping
            set({ 
                error: err.message || 'Failed to publish the match to the global marketplace. Verify your connection.',
                isLoading: false 
            });
            throw err;
        }
    },

    // FEATURE 8: UI Error Boundary Reset
    clearError: () => set({ error: null })
}));