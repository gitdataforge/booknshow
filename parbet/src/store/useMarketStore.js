import { create } from 'zustand';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * FEATURE 1: Global Read-Only State Manager & Normalization Adapter
 * Actively synchronizes the Buyer's frontend with the Seller's Firestore payloads.
 * Re-engineered to process complex sorting, filtering, and schema mapping securely in memory.
 * FEATURE 13: Strict Singleton Network Lock (Kills ERR_QUIC_PROTOCOL_ERROR infinite loops)
 */
export const useMarketStore = create((set, get) => ({
    activeListings: [],
    categories: ['All', 'Cricket', 'Football', 'Tennis', 'Esports', 'Other'],
    activeCategory: 'All',
    isLoading: true,
    error: null,
    
    // FEATURE 13: Singleton Lock States
    isListenerActive: false,
    unsubscribe: null,

    // FEATURE 2: Schema-Agnostic Real-Time Market Synchronization
    initMarketListener: () => {
        const state = get();
        
        // CRITICAL FIX: If listener is already running, block subsequent calls instantly
        if (state.isListenerActive) {
            return state.unsubscribe;
        }

        set({ isListenerActive: true, isLoading: true, error: null });
        
        try {
            // Simplified Query: Only fetch events that are marked active.
            // Complex date filtering and sorting are moved to memory to bypass index constraints.
            const marketQuery = query(
                collection(db, 'events'),
                where('status', '==', 'active')
            );

            // Establish the real-time WebSocket connection
            const unsubscribe = onSnapshot(marketQuery, 
                (snapshot) => {
                    const now = new Date().getTime();

                    // Process, normalize, filter, and sort data in memory
                    const listings = snapshot.docs.map(doc => {
                        const data = doc.data();
                        
                        // FEATURE 3: Universal Timestamp Normalization
                        // Maps either the old schema (eventTimestamp) or the seeded schema (commence_time)
                        const rawDate = data.commence_time || data.eventTimestamp || data.date || data.createdAt?.seconds * 1000 || new Date().toISOString();
                        const eventDateObj = new Date(rawDate);
                        const displayDateString = eventDateObj.toISOString();

                        // FEATURE 4: Title & Venue Normalization
                        // Maps flat seeded schema fields to the nested objects expected by EventCard/EventDetails
                        const normalizedTitle = data.title || data.eventName || 'Upcoming Event';
                        const normalizedVenue = data.venue || { 
                            name: data.loc || 'TBA Venue', 
                            city: data.city || 'TBA City' 
                        };
                        
                        // FEATURE 5: Dynamic TicketTiers Synthesis
                        // If 'ticketTiers' array is missing (seeded data), construct it mathematically from root fields
                        let normalizedTicketTiers = data.ticketTiers || [];
                        if (!data.ticketTiers && data.price) {
                            normalizedTicketTiers = [{
                                id: `tier-${doc.id}`,
                                name: data.section ? `${data.section} ${data.row ? `(Row ${data.row})` : ''}` : 'General Admission',
                                price: data.price,
                                quantity: data.quantity || 1,
                                color: '#458731' // Signature Parbet Green
                            }];
                        }

                        // FEATURE 6: Universal Minimum Price Calculator
                        // Scans the newly synthesized or existing ticket tiers to find the "Starting from" price
                        let minPrice = Infinity;
                        if (normalizedTicketTiers.length > 0) {
                            normalizedTicketTiers.forEach(tier => {
                                if (tier.quantity > 0 && tier.price < minPrice) {
                                    minPrice = tier.price;
                                }
                            });
                        } else if (data.price && typeof data.price === 'number') {
                            minPrice = data.price;
                        }
                        
                        return {
                            id: doc.id,
                            ...data,
                            // Inject normalized schema overrides for the UI components
                            title: normalizedTitle,
                            date: displayDateString,
                            venue: normalizedVenue,
                            ticketTiers: normalizedTicketTiers,
                            // Inject normalized tracking fields
                            normalizedDate: eventDateObj.getTime(),
                            displayDate: displayDateString,
                            startingPrice: minPrice === Infinity ? null : minPrice 
                        };
                    })
                    // FEATURE 7: In-Memory Expiration Filter (Strips past events)
                    .filter(listing => listing.normalizedDate >= now)
                    // FEATURE 8: In-Memory Chronological Sorter (Nearest upcoming events first)
                    .sort((a, b) => a.normalizedDate - b.normalizedDate);

                    // Update global state instantly
                    set({ activeListings: listings, isLoading: false, error: null });
                    console.log(`[Parbet Market Sync] Successfully loaded and mapped ${listings.length} active global listings.`);
                },
                (error) => {
                    console.error("[Parbet Market Sync] Listener failed:", error);
                    set({ 
                        error: "Market synchronization interrupted. Please check your connection.", 
                        isLoading: false,
                        isListenerActive: false // Release lock on error
                    });
                }
            );

            // Store the active subscription to prevent duplicates
            set({ unsubscribe });
            
            // Return the cleanup function to prevent memory leaks when unmounting
            return unsubscribe;
        } catch (err) {
            console.error("[Parbet Market Sync] Critical initialization failure:", err);
            set({ 
                error: "Failed to initialize global market feed. Ensure database index exists.", 
                isLoading: false,
                isListenerActive: false // Release lock on error
            });
        }
    },

    // FEATURE 9: Category Filtering Engine (Client-Side)
    // Allows instant, zero-latency filtering without hitting the database again
    setActiveCategory: (category) => {
        set({ activeCategory: category });
    },

    // FEATURE 10: Derived State Selector for the UI
    getFilteredListings: () => {
        const { activeListings, activeCategory } = get();
        if (activeCategory === 'All') return activeListings;
        // Fallback mapping: If the event doesn't explicitly have sportCategory, map IPL events to Cricket automatically
        return activeListings.filter(listing => {
            const cat = listing.sportCategory || (listing.league === 'Indian Premier League' ? 'Cricket' : 'Other');
            return cat === activeCategory;
        });
    }
}));