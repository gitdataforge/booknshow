import { create } from 'zustand';
export const useAppStore = create((set) => ({
    user: null, balance: 0, diamonds: 0,
    hasOnboarded: localStorage.getItem('parbet_onboarded') === 'true',
    isAuthenticated: false,
    setOnboarded: () => { localStorage.setItem('parbet_onboarded', 'true'); set({ hasOnboarded: true }); },
    setAuth: (status) => set({ isAuthenticated: status }),
    setUser: (user) => set({ user }),
    setWallet: (balance, diamonds) => set({ balance, diamonds }),
}));