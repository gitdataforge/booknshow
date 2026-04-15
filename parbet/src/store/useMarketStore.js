import { create } from 'zustand';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * FEATURE 1: Global Read-Only State Manager
 * Actively synchronizes the Buyer's frontend with the Seller's Firestore payloads.
 */
export const useMarketStore = create((set, get) => ({
    activeListings: [],
    categories: ['All', 'Cricket', 'Football', 'Tennis', 'Esports', 'Other'],
    activeCategory: 'All',
    isLoading: true,
    error: null,

    // FEATURE 2: Real-Time Market Synchronization
    initMarketListener: () => {
        set({ isLoading: true, error: null });
        try {
            // Strict Query: Only fetch events that are marked active by the seller and have not yet expired
            const now = new Date().toISOString();
            const marketQuery = query(
                collection(db, 'events'),
                where('status', '==', 'active'),
                where('eventTimestamp', '>=', now),
                orderBy('eventTimestamp', 'asc')
            );

            // Establish the real-time WebSocket connection
            const unsubscribe = onSnapshot(marketQuery, 
                (snapshot) => {
                    const listings = snapshot.docs.map(doc => {
                        const data = doc.data();
                        
                        // FEATURE 3: Dynamic Minimum Price Calculator
                        // Scans all available ticket tiers for this specific match to find the "Starting from" price
                        let minPrice = Infinity;
                        if (data.ticketTiers && Array.isArray(data.ticketTiers)) {
                            data.ticketTiers.forEach(tier => {
                                if (tier.quantity > 0 && tier.price < minPrice) {
                                    minPrice = tier.price;
                                }
                            });
                        }
                        
                        return {
                            id: doc.id,
                            ...data,
                            // If all tickets are sold out or empty, set to null
                            startingPrice: minPrice === Infinity ? null : minPrice 
                        };
                    });

                    // Update global state instantly
                    set({ activeListings: listings, isLoading: false, error: null });
                    console.log(`[Parbet Market Sync] Successfully loaded ${listings.length} active global listings.`);
                },
                (error) => {
                    console.error("[Parbet Market Sync] Listener failed:", error);
                    set({ 
                        error: "Market synchronization interrupted. Please check your connection.", 
                        isLoading: false 
                    });
                }
            );

            // Return the cleanup function to prevent memory leaks when unmounting
            return unsubscribe;
        } catch (err) {
            console.error("[Parbet Market Sync] Critical initialization failure:", err);
            set({ 
                error: "Failed to initialize global market feed. Ensure database index exists.", 
                isLoading: false 
            });
        }
    },

    // FEATURE 4: Category Filtering Engine (Client-Side)
    // Allows instant, zero-latency filtering without hitting the database again
    setActiveCategory: (category) => {
        set({ activeCategory: category });
    },

    // FEATURE 5: Derived State Selector for the UI
    getFilteredListings: () => {
        const { activeListings, activeCategory } = get();
        if (activeCategory === 'All') return activeListings;
        return activeListings.filter(listing => listing.sportCategory === activeCategory);
    }
}));