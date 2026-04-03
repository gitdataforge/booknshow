import { create } from 'zustand';
export const useAppStore = create((set) => ({
    user: null, balance: 0, diamonds: 0, matches: [],
    hasOnboarded: localStorage.getItem('parbet_onboarded') === 'true',
    setOnboarded: () => {
        localStorage.setItem('parbet_onboarded', 'true');
        set({ hasOnboarded: true });
    },
    setUser: (user) => set({ user }),
    setWallet: (balance, diamonds) => set({ balance, diamonds }),
}));