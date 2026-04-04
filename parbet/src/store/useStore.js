import { create } from 'zustand';
import { fetchRealUpcomingMatches } from '../services/oddsApi';

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

    setOnboarded: () => { 
        localStorage.setItem('parbet_onboarded', 'true'); 
        set({ hasOnboarded: true }); 
    },
    setAuth: (status) => set({ isAuthenticated: status }),
    setUser: (user) => set({ user }),
    setWallet: (balance, diamonds) => set({ balance, diamonds }),
    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),

    // Async action to trigger real-time fetch
    fetchLiveMatches: async () => {
        set({ isLoadingMatches: true, apiError: null });
        try {
            const matches = await fetchRealUpcomingMatches();
            set({ liveMatches: matches, isLoadingMatches: false });
        } catch (error) {
            set({ apiError: error.message, isLoadingMatches: false });
        }
    }
}));