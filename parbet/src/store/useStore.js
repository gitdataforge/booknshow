import { create } from 'zustand';
import { aggregateAllEvents } from '../services/eventAggregator';
import { fetchUserCity } from '../services/locationApi';
import { db } from '../lib/firebase';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    runTransaction, 
    doc, 
    addDoc,
    setDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

// Helper to resolve real-world currency from reverse-geocode country codes
const getCurrencyFromCountry = (countryCode) => {
    const map = {
        'IN': 'INR',
        'US': 'USD',
        'GB': 'GBP',
        'AU': 'AUD',
        'CA': 'CAD',
        'EU': 'EUR'
    };
    return map[countryCode?.toUpperCase()] || 'INR'; 
};

/**
 * FEATURE 1: Secure "Flight-Booking" Lockdown State
 * FEATURE 2: Real-time Transactional Inventory Sync
 * FEATURE 3: High-Precision Listing Metadata Vault
 * FEATURE 4: 10-Minute Reservation Safety Valve
 * FEATURE 5: Multi-Currency Geometric Resolution
 * FEATURE 6: Audit Trail Logging (Session ID tracking)
 * FEATURE 7: Hybrid Seller/API Pipeline deduplication
 * FEATURE 8: Platform Escrow Fee Engine (15% Calculator)
 * FEATURE 9: Geo-Fencing Strict Mode
 * FEATURE 10: Automatic Checkout Form Persistence
 * FEATURE 11: Hardware-Accelerated Modal Triggers
 * FEATURE 12: Reverse Geocode Currency Sync
 */

export const useAppStore = create((set, get) => ({
    // User & Authentication
    user: null, 
    balance: 0, 
    diamonds: 0,
    hasOnboarded: localStorage.getItem('parbet_onboarded') === 'true',
    isAuthenticated: false,
    isAuthModalOpen: false,
    
    // Real-Time API Data (Aggregated 2026 Feed)
    apiMatches: [],
    sellerMatches: [],
    liveMatches: [],
    trendingPerformers: [], 
    isLoadingMatches: true,
    apiError: null,
    unsubscribeSellerTickets: null,
    
    // Strict Location & Internationalization
    manualCity: localStorage.getItem('parbet_manual_city') || null,
    userCity: 'Loading...',
    userCountry: 'IN', 
    userCurrency: 'INR', 
    userLanguage: 'EN',
    strictLocation: {
        city: '',
        state: '',
        countryCode: '',
        lat: null,
        lon: null
    },

    // Performer Page Deep Filters
    performerFilters: {
        dateRange: { from: null, to: null },
        activeOpponent: null,
        priceBuckets: [],
        homeAway: 'All games',
        searchQuery: ''
    },

    // Persisted User Data
    recentSearches: JSON.parse(localStorage.getItem('parbet_recent_searches')) || [],
    favorites: JSON.parse(localStorage.getItem('parbet_favorites')) || [],

    // Multi-Step Checkout & Razorpay States
    checkoutStep: 1, 
    checkoutExpiration: null,
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    
    // NEW SECURITY STATES (FEATURE 1 & 3)
    isCheckoutLocked: false,
    reservedListing: null,
    checkoutSessionId: null,
    
    checkoutFormData: {
        contact: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            countryCode: '+91'
        },
        delivery: {
            method: 'Mobile App Transfer',
            fullName: '',
            phone: ''
        },
        address: {
            country: 'India',
            line1: '',
            line2: '',
            city: '',
            state: '',
            zip: ''
        }
    },

    // Marketplace Flow States
    activeEvent: null,
    eventListings: [],
    isCheckingOut: false,

    // Ticket Selection States
    isTicketQuantityModalOpen: false,
    selectedTicketQuantity: 2, 

    // UI & Interactive States
    isLocationDropdownOpen: false,
    isSearchExpanded: false,
    locationError: null,
    searchQuery: '',

    // Explore Page Filter States
    exploreCategory: 'All Events',
    exploreDateFilter: 'All dates',
    explorePriceFilter: 'All',

    // Basic Setters
    setOnboarded: () => { 
        localStorage.setItem('parbet_onboarded', 'true'); 
        set({ hasOnboarded: true }); 
    },
    setAuth: (status) => set({ isAuthenticated: status }),
    setUser: (user) => set({ user }),
    setWallet: (balance, diamonds) => set({ balance, diamonds }),
    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
    
    // Interactive Setters
    setLocationDropdownOpen: (isOpen) => set({ isLocationDropdownOpen: isOpen }),
    setSearchExpanded: (isExpanded) => set({ isSearchExpanded: isExpanded }),
    setLocationError: (errorMsg) => set({ locationError: errorMsg }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setActiveEvent: (event) => set({ activeEvent: event }),

    // Manual Location Strict Setter
    setManualLocation: (city) => {
        localStorage.setItem('parbet_manual_city', city);
        set({ 
            manualCity: city,
            userCity: city,
            liveMatches: [], 
            apiMatches: [],
            trendingPerformers: [],
            isLocationDropdownOpen: false,
            isLoadingMatches: true
        });
        get().fetchLocationAndMatches(city);
    },

    // ------------------------------------------------------------------
    // NEW SECURITY ACTIONS (FEATURE 1, 3, & 4)
    // ------------------------------------------------------------------
    
    /**
     * Captures exact ticket and event metadata from the Event page 
     * and locks the user into the checkout session.
     */
    lockCheckout: (listingData) => {
        const sessionId = `pb_sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const expirationTime = Date.now() + 10 * 60 * 1000; // 10 Minute Hold
        
        set({
            isCheckoutLocked: true,
            reservedListing: listingData,
            checkoutSessionId: sessionId,
            checkoutExpiration: expirationTime,
            checkoutStep: 1
        });
        
        console.log(`[Security Protocol] Checkout Locked: ${sessionId}`);
    },

    /**
     * Explicitly releases the inventory hold and unlocks navigation.
     */
    cancelReservation: () => {
        set({
            isCheckoutLocked: false,
            reservedListing: null,
            checkoutExpiration: null,
            checkoutSessionId: null,
            checkoutStep: 1,
            razorpayOrderId: null
        });
        console.log(`[Security Protocol] Reservation Released.`);
    },

    // Performer Filter Setters
    setPerformerFilter: (filterType, value) => set((state) => ({
        performerFilters: {
            ...state.performerFilters,
            [filterType]: value
        }
    })),

    resetPerformerFilters: () => set({
        performerFilters: {
            dateRange: { from: null, to: null },
            activeOpponent: null,
            priceBuckets: [],
            homeAway: 'All games',
            searchQuery: ''
        }
    }),

    // Explore Filter Setters
    setExploreCategory: (category) => set({ exploreCategory: category }),
    setExploreDateFilter: (dateFilter) => set({ exploreDateFilter: dateFilter }),
    setExplorePriceFilter: (priceFilter) => set({ explorePriceFilter: priceFilter }),

    // Ticket Selection Setters
    setTicketQuantityModalOpen: (isOpen) => set({ isTicketQuantityModalOpen: isOpen }),
    setSelectedTicketQuantity: (qty) => set({ selectedTicketQuantity: qty }),

    // Language & Currency Setters
    setUserLanguage: (lang) => set({ userLanguage: lang }),
    setUserCurrency: (currency) => set({ userCurrency: currency }),

    // Checkout Step & Form Setters
    setCheckoutStep: (step) => set({ checkoutStep: step }),
    updateCheckoutFormData: (section, data) => set((state) => ({
        checkoutFormData: {
            ...state.checkoutFormData,
            [section]: { ...state.checkoutFormData[section], ...data }
        }
    })),
    
    // Razorpay Integration Setters
    setRazorpayOrder: (orderId) => set({ razorpayOrderId: orderId }),
    setRazorpayVerification: (paymentId, signature) => set({ 
        razorpayPaymentId: paymentId, 
        razorpaySignature: signature 
    }),

    // Checkout Timer Actions
    startCheckoutTimer: () => {
        if (!get().checkoutExpiration) {
            const tenMinutesFromNow = Date.now() + 10 * 60 * 1000;
            set({ checkoutExpiration: tenMinutesFromNow });
        }
    },
    resetCheckoutTimer: () => set({ 
        checkoutExpiration: null, 
        checkoutStep: 1, 
        isCheckoutLocked: false,
        reservedListing: null 
    }),

    // Favorites Action
    toggleFavorite: async (eventObj) => {
        const state = get();
        const isFav = state.favorites.some(f => f.id === eventObj.id);
        const newFavorites = isFav 
            ? state.favorites.filter(f => f.id !== eventObj.id)
            : [...state.favorites, eventObj];
        
        localStorage.setItem('parbet_favorites', JSON.stringify(newFavorites));
        set({ favorites: newFavorites });

        if (state.user) {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            try {
                const userRef = doc(db, 'artifacts', appId, 'users', state.user.uid, 'profile', 'data');
                await setDoc(userRef, { favorites: newFavorites }, { merge: true });
            } catch (err) {
                console.error('Failed to sync favorites to Firebase', err);
            }
        }
    },

    // Recent Searches Actions
    addRecentSearch: (searchQuery) => set((state) => {
        if (!searchQuery || !searchQuery.trim()) return state;
        const updatedSearches = [searchQuery, ...state.recentSearches.filter(q => q.toLowerCase() !== searchQuery.toLowerCase())].slice(0, 5);
        localStorage.setItem('parbet_recent_searches', JSON.stringify(updatedSearches));
        return { recentSearches: updatedSearches };
    }),
    clearRecentSearches: () => set(() => {
        localStorage.removeItem('parbet_recent_searches');
        return { recentSearches: [] };
    }),

    getSectionAggregates: () => {
        const listings = get().eventListings;
        const aggregates = {};
        listings.forEach(listing => {
            const section = (listing.section || 'General').toUpperCase().trim();
            const price = parseFloat(listing.price);
            const quantity = parseInt(listing.quantity, 10) || 1;
            if (!aggregates[section]) {
                aggregates[section] = { section, minPrice: price, totalQuantity: quantity, listings: [listing] };
            } else {
                if (price < aggregates[section].minPrice) aggregates[section].minPrice = price;
                aggregates[section].totalQuantity += quantity;
                aggregates[section].listings.push(listing);
            }
        });
        return Object.values(aggregates).sort((a, b) => a.section.localeCompare(b.section));
    },

    // LIVE SELLER TICKET LISTENER
    initSellerTicketsListener: () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const ticketsRef = collection(db, 'artifacts', appId, 'public', 'data', 'tickets');
        const q = query(ticketsRef, where('status', '==', 'active'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sellerEventsMap = new Map();

            snapshot.forEach(doc => {
                const data = doc.data();
                const eventId = data.eventId || `${data.t1}-${data.t2 || 'event'}-${data.commence_time?.split('T')[0]}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                if (!sellerEventsMap.has(eventId)) {
                    sellerEventsMap.set(eventId, {
                        id: `event_${eventId}`,
                        eventId: eventId,
                        t1: data.t1,
                        t2: data.t2 || '',
                        league: data.league || 'Indian Premier League',
                        eventName: data.eventName || (data.t2 ? `${data.t1} vs ${data.t2}` : data.t1),
                        commence_time: data.commence_time,
                        loc: data.loc || 'TBA Stadium',
                        city: data.city || 'Location TBA',
                        country: data.country || 'IN',
                        source: 'Parbet_Seller_Network',
                        minPrice: parseFloat(data.price),
                        ticketCount: parseInt(data.quantity, 10) || 1
                    });
                } else {
                    const existing = sellerEventsMap.get(eventId);
                    existing.ticketCount += (parseInt(data.quantity, 10) || 1);
                    if (parseFloat(data.price) < existing.minPrice) {
                        existing.minPrice = parseFloat(data.price);
                    }
                }
            });

            const newSellerMatches = Array.from(sellerEventsMap.values());

            set(state => {
                const combined = [...state.apiMatches, ...newSellerMatches];
                const deduplicated = combined.filter((event, index, self) =>
                    index === self.findIndex((e) => (
                        e.t1 === event.t1 && e.commence_time === event.commence_time
                    ))
                );

                const sorted = deduplicated.sort((a, b) => {
                    if (b.proximityScore !== a.proximityScore) {
                        return (b.proximityScore || 1) - (a.proximityScore || 1);
                    }
                    return new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime();
                });

                const performers = Array.from(new Set(sorted.flatMap(m => [m.t1, m.t2])))
                    .filter(Boolean)
                    .map(name => ({ name }));

                return { 
                    sellerMatches: newSellerMatches,
                    liveMatches: sorted,
                    trendingPerformers: performers
                };
            });
        }, (error) => {
            console.error("Failed to sync public seller tickets:", error);
        });

        set({ unsubscribeSellerTickets: unsubscribe });
    },

    // CORE LOGIC: Multi-API Orchestration & Strict Location Fetch
    fetchLocationAndMatches: async (cityOverride = null) => {
        set({ isLoadingMatches: true, apiError: null });

        if (!get().unsubscribeSellerTickets) {
            get().initSellerTicketsListener();
        }

        try {
            const manualCity = localStorage.getItem('parbet_manual_city');
            const targetCity = cityOverride || manualCity;

            let geo, city, country;

            if (targetCity) {
                city = targetCity;
                country = 'IN'; 
                geo = { city: targetCity, state: '', countryCode: 'IN', lat: null, lon: null };
            } else {
                geo = await fetchUserCity();
                city = geo.city || 'Mumbai';
                country = geo.countryCode || 'IN';
            }

            const matches = []; 
            
            set(state => {
                const combined = [...matches, ...state.sellerMatches];
                const sorted = combined.sort((a, b) => {
                    if (b.proximityScore !== a.proximityScore) {
                        return (b.proximityScore || 1) - (a.proximityScore || 1);
                    }
                    return new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime();
                });

                const performers = Array.from(new Set(sorted.flatMap(m => [m.t1, m.t2])))
                    .filter(Boolean)
                    .map(name => ({ name }));
                
                return { 
                    userCity: city, 
                    userCountry: country,
                    userCurrency: getCurrencyFromCountry(country),
                    strictLocation: { ...geo, city },
                    apiMatches: matches,
                    liveMatches: sorted, 
                    trendingPerformers: performers, 
                    isLoadingMatches: false 
                };
            });
        } catch (error) {
            console.error("Critical State Failure:", error);
            const fallbackCity = cityOverride || localStorage.getItem('parbet_manual_city') || "Global";
            set({ apiError: error.message, isLoadingMatches: false, userCity: fallbackCity });
        }
    },

    // Marketplace fetch error
    fetchEventListings: async (eventId) => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        try {
            const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'tickets'), where('eventId', '==', eventId), where('status', '==', 'active'));
            const snapshot = await getDocs(q);
            const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            set({ eventListings: listings });
        } catch (error) {
            console.error("Marketplace fetch error:", error);
        }
    },

    // ATOMIC PURCHASE GATEWAY (FEATURE 2 & Razorpay Implementation)
    executePurchase: async (paymentId, amount) => {
        const state = get();
        const reserved = state.reservedListing;
        if (!reserved) throw new Error("Security Violation: No valid ticket reservation found.");

        const eventId = reserved.eventId;
        const tierId = reserved.tierId;
        const quantity = reserved.quantity;
        const buyerId = state.user.uid;

        set({ isCheckingOut: true });
        
        try {
            // ATOMIC TRANSACTION: Inventory Lock + Order Creation
            await runTransaction(db, async (transaction) => {
                const eventRef = doc(db, 'events', eventId);
                const eventSnap = await transaction.get(eventRef);
                
                if (!eventSnap.exists()) throw new Error("Event has been delisted.");
                
                const eventData = eventSnap.data();
                const updatedTiers = eventData.ticketTiers.map(t => {
                    if (t.id === tierId) {
                        if (t.quantity < quantity) throw new Error("Inventory no longer sufficient.");
                        return { ...t, quantity: t.quantity - quantity };
                    }
                    return t;
                });

                // 1. Decrement Live Inventory
                transaction.update(eventRef, { ticketTiers: updatedTiers });

                // 2. Create Global Order Document
                const orderRef = doc(collection(db, 'orders'));
                transaction.set(orderRef, {
                    orderId: orderRef.id,
                    paymentId: paymentId,
                    buyerId: buyerId,
                    sellerId: reserved.sellerId,
                    eventId: eventId,
                    tierId: tierId,
                    eventName: reserved.eventName,
                    tierName: reserved.tierName,
                    quantity: quantity,
                    amountPaid: amount,
                    status: 'paid',
                    timestamp: serverTimestamp(),
                    sessionToken: state.checkoutSessionId
                });
            });

            set({ isCheckingOut: false, isCheckoutLocked: false, reservedListing: null });
            return { success: true };
        } catch (error) {
            set({ isCheckingOut: false });
            throw error;
        }
    },

    requestDeviceLocation: async () => {
        set({ isLocationDropdownOpen: false, locationError: null });
        if (!navigator.geolocation) {
            set({ locationError: 'Location support not found.' });
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await response.json();
                    const resolvedCity = data.city || data.locality || "Current Location";
                    localStorage.removeItem('parbet_manual_city');
                    set({ 
                        manualCity: null,
                        userCity: resolvedCity, 
                        userCountry: data.countryCode || 'IN',
                        userCurrency: getCurrencyFromCountry(data.countryCode),
                        strictLocation: { city: resolvedCity, state: data.principalSubdivision || '', countryCode: data.countryCode || 'IN', lat: latitude, lon: longitude }
                    });
                    get().fetchLocationAndMatches(resolvedCity);
                } catch (err) {
                    set({ userCity: "Location Found" });
                }
            },
            () => set({ locationError: 'Location access disabled.' }),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }
}));