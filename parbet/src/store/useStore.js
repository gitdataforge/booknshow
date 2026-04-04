import { create } from 'zustand';
import { fetchRealUpcomingMatches } from '../services/oddsApi';
import { fetchUserCity } from '../services/locationApi';

export const useAppStore = create((set) => ({
    user: null, 
    balance: 0, 
    diamonds: 0,
    hasOnboarded: localStorage.getItem('parbet_onboarded') === 'true',
    isAuthenticated: false,
    isAuthModalOpen: false,
    
    // Real Data States
    liveMatches: [],
    isLoadingMatches: true,
    apiError: null,
    userCity: 'Loading...',

    setOnboarded: () => { 
        localStorage.setItem('parbet_onboarded', 'true'); 
        set({ hasOnboarded: true }); 
    },
    setAuth: (status) => set({ isAuthenticated: status }),
    setUser: (user) => set({ user }),
    setWallet: (balance, diamonds) => set({ balance, diamonds }),
    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),

    // Combined Async action for Location + Odds
    fetchLocationAndMatches: async () => {
        set({ isLoadingMatches: true, apiError: null });
        try {
            // Fetch IP location and API Matches in parallel
            const [city, matches] = await Promise.all([
                fetchUserCity(),
                fetchRealUpcomingMatches()
            ]);
            set({ userCity: city, liveMatches: matches, isLoadingMatches: false });
        } catch (error) {
            set({ apiError: error.message, isLoadingMatches: false, userCity: "Global" });
        }
    }
}));