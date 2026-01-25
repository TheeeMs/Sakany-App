import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@onboarding_complete';

interface AppState {
    showOnboarding: boolean;
    isLoading: boolean;
    setShowOnboarding: (show: boolean) => void;
    checkOnboardingStatus: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
    resetOnboarding: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
    showOnboarding: false,
    isLoading: true,

    setShowOnboarding: (show) => set({ showOnboarding: show }),

    checkOnboardingStatus: async () => {
        try {
            const hasCompleted = await AsyncStorage.getItem(ONBOARDING_KEY);
            set({
                showOnboarding: hasCompleted !== 'true',
                isLoading: false
            });
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            set({ showOnboarding: true, isLoading: false });
        }
    },

    completeOnboarding: async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            set({ showOnboarding: false });
        } catch (error) {
            console.error('Error completing onboarding:', error);
        }
    },

    resetOnboarding: async () => {
        try {
            await AsyncStorage.removeItem(ONBOARDING_KEY);
            set({ showOnboarding: true });
        } catch (error) {
            console.error('Error resetting onboarding:', error);
        }
    },
}));
